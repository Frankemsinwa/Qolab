import { useEffect, useRef, useCallback, useState, type MutableRefObject } from 'react';

const TOTAL_FRAMES = 151;
const FRAME_PATH = '/src/assets/sequence/';

interface SilhouetteSequenceProps {
  progressRef: MutableRefObject<number>;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function SilhouetteSequence({ progressRef }: SilhouetteSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobile = useIsMobile();

  const preloadFrame = useCallback((index: number) => {
    if (loadedRef.current.has(index) || index < 0 || index >= TOTAL_FRAMES) return;
    const img = new Image();
    const num = String(index + 1).padStart(5, '0');
    img.src = `${FRAME_PATH}${num}.png`;
    img.onload = () => {
      loadedRef.current.add(index);
      imagesRef.current[index] = img;
      if (index === Math.floor(currentFrameRef.current)) {
        drawFrame(index);
      }
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;
    let drawW: number, drawH: number, offsetX: number, offsetY: number;

    if (imgAspect > canvasAspect) {
      drawH = displayHeight * 1.05;
      drawW = drawH * imgAspect;
      offsetX = (displayWidth - drawW) / 2;
      offsetY = (displayHeight - drawH) / 2;
    } else {
      drawW = displayWidth * 1.05;
      drawH = drawW / imgAspect;
      offsetX = (displayWidth - drawW) / 2;
      offsetY = (displayHeight - drawH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Desktop: scroll-driven animation
  const animate = useCallback(() => {
    if (isMobile) return;
    const targetFrame = progressRef.current * (TOTAL_FRAMES - 1);
    const diff = targetFrame - currentFrameRef.current;

    if (Math.abs(diff) < 0.3) {
      currentFrameRef.current = targetFrame;
    } else {
      currentFrameRef.current += diff * 0.1;
    }

    const frame = Math.round(currentFrameRef.current);
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frame));
    drawFrame(clamped);

    for (let i = -2; i <= 2; i++) {
      preloadFrame(clamped + i);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [drawFrame, preloadFrame, progressRef, isMobile]);

  useEffect(() => {
    // Preload first 40 frames always
    for (let i = 0; i < Math.min(40, TOTAL_FRAMES); i++) {
      preloadFrame(i);
    }

    if (isMobile) {
      // Mobile: show static frame 0, no scroll animation
      const waitForFrame = () => {
        if (imagesRef.current[0]) {
          drawFrame(0);
        } else {
          requestAnimationFrame(waitForFrame);
        }
      };
      waitForFrame();
      return () => cancelAnimationFrame(rafRef.current);
    }

    // Desktop: start scroll-driven animation loop
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [preloadFrame, animate, drawFrame, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const frame = Math.round(currentFrameRef.current);
      drawFrame(Math.max(0, Math.min(TOTAL_FRAMES - 1, frame)));
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawFrame]);

  // Mobile: subtle breathing/pulse CSS animation instead of scroll
  if (isMobile) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            animation: 'silhouettePulse 4s ease-in-out infinite',
            maskImage: 'radial-gradient(ellipse 65% 80% at 50% 45%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 80% at 50% 45%, black 40%, transparent 100%)',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ imageRendering: 'auto', objectFit: 'contain' }}
          />
        </div>
      </div>
    );
  }

  // Desktop: scroll-driven canvas
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          imageRendering: 'auto',
          objectFit: 'contain',
          maskImage: 'radial-gradient(ellipse 70% 85% at 50% 45%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 85% at 50% 45%, black 50%, transparent 100%)',
        }}
      />
    </div>
  );
}
