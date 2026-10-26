import os
import glob
import subprocess
import shutil
import numpy as np
from PIL import Image

FFMPEG = r'.\node_modules\ffmpeg-static\ffmpeg.exe'
PUBLIC_DIR = r'c:\Users\frank\OneDrive\Desktop\Qolab\public'
SCRATCH_LOOP = r'c:\Users\frank\OneDrive\Desktop\Qolab\scratch_looped'
os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(SCRATCH_LOOP, exist_ok=True)

# 1. Collect all frames extracted from hero.mp4 starting at 0.05s
files = sorted(glob.glob('scratch_frames/all_*.png'))
print(f"Loaded {len(files)} source frames.", flush=True)

W_CROP = 478
H_CROP = 478
X_START = (848 - W_CROP) // 2 # 185
X_END = X_START + W_CROP       # 663

# Build radial fade grid
Y, X = np.ogrid[:H_CROP, :W_CROP]
cy, cx = H_CROP / 2.0, W_CROP / 2.0
dist = np.sqrt((X - cx)**2 + (Y - cy)**2)
r_norm = dist / (W_CROP / 2.0)
radial_fade = np.clip((0.95 - r_norm) / (0.95 - 0.76), 0.0, 1.0)[:, :, None]

raw_rgba_frames = []
raw_rgb_frames = []

pedestal = 0.072 # ~18/255 ambient dark pedestal

print("Processing frames (cropping, background removal, alpha generation)...", flush=True)
for idx, f in enumerate(files):
    im = Image.open(f)
    crop = im.crop((X_START, 0, X_END, H_CROP))
    arr = np.array(crop).astype(np.float32) / 255.0
    
    # Background subtraction and edge radial zeroing
    cleaned = np.maximum(0.0, (arr - pedestal) / (1.0 - pedestal))
    cleaned = cleaned * radial_fade
    
    # Slight vibrancy enhancement on emerald green liquid
    cleaned[:, :, 1] = np.clip(cleaned[:, :, 1] * 1.08, 0.0, 1.0)
    
    # Compute luma and alpha
    luma = 0.299 * cleaned[:, :, 0] + 0.587 * cleaned[:, :, 1] + 0.114 * cleaned[:, :, 2]
    alpha = np.clip(np.maximum(cleaned[:, :, 1] * 1.6, luma) * 3.2, 0.0, 1.0)
    
    rgba = np.dstack([cleaned * 255.0, alpha * 255.0]).astype(np.float32)
    rgb = (cleaned * 255.0).astype(np.float32)
    
    raw_rgba_frames.append(rgba)
    raw_rgb_frames.append(rgb)

N = len(raw_rgba_frames)
K = 24 # 1.0 second crossfade at 24 fps
M = N - K
print(f"Creating seamless loop over {M} frames (~{M/24:.2f}s) with {K}-frame smooth crossfade...", flush=True)

# Clean scratch loop dir
for old_f in glob.glob(os.path.join(SCRATCH_LOOP, '*.png')):
    os.remove(old_f)

for i in range(M):
    if i < K:
        w = float(i) / float(K)
        w_smooth = w * w * (3.0 - 2.0 * w)
        frame_rgba = w_smooth * raw_rgba_frames[i] + (1.0 - w_smooth) * raw_rgba_frames[M + i]
    else:
        frame_rgba = raw_rgba_frames[i]
        
    out_arr = np.clip(frame_rgba, 0, 255).astype(np.uint8)
    out_im = Image.fromarray(out_arr, 'RGBA')
    out_im.save(os.path.join(SCRATCH_LOOP, f'frame_{i:04d}.png'))

print("Saved all looped RGBA PNG frames to disk.", flush=True)

# Save poster frame
poster_im = Image.open(os.path.join(SCRATCH_LOOP, 'frame_0000.png'))
poster_path = os.path.join(PUBLIC_DIR, 'hero-cube-poster.webp')
poster_im.save(poster_path, 'WEBP', quality=95)
print(f"Saved poster to {poster_path}", flush=True)

# Output video paths
webm_path = os.path.join(PUBLIC_DIR, 'hero-cube.webm')
mp4_path = os.path.join(PUBLIC_DIR, 'hero-cube.mp4')

print(f"Encoding transparent VP9 WebM to {webm_path}...", flush=True)
subprocess.run([
    FFMPEG, '-y',
    '-framerate', '24',
    '-i', os.path.join(SCRATCH_LOOP, 'frame_%04d.png'),
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuva420p',
    '-b:v', '2000k',
    '-crf', '22',
    '-auto-alt-ref', '0',
    '-an',
    webm_path
], check=True)
print(f"WebM done: {os.path.getsize(webm_path)} bytes", flush=True)

print(f"Encoding optimized H.264 MP4 to {mp4_path}...", flush=True)
subprocess.run([
    FFMPEG, '-y',
    '-framerate', '24',
    '-i', os.path.join(SCRATCH_LOOP, 'frame_%04d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'slow',
    '-movflags', '+faststart',
    '-an',
    mp4_path
], check=True)
print(f"MP4 done: {os.path.getsize(mp4_path)} bytes", flush=True)

print("All hero videos processed and exported successfully!", flush=True)
