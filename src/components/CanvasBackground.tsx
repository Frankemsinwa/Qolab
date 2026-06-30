/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface CanvasBackgroundProps {
  mode: 'fluid' | 'strings' | 'gravity';
  darkMode: boolean;
  intensity: number; // 0..1 multiplier for interactive speed/count
}

export default function CanvasBackground({ mode, darkMode, intensity = 0.5 }: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000, isDown: false, vx: 0, vy: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set pixel ratio for high-DPI retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;

    // Theme colors
    const colors = {
      dark: {
        bg: '#070708',
        particle: 'rgba(255, 255, 255, ',
        accent: 'rgba(225, 29, 72, ', // Rose
        accentSecondary: 'rgba(139, 92, 246, ', // Violet
        line: 'rgba(255, 255, 255, 0.04)',
      },
      light: {
        bg: '#fbfbfd',
        particle: 'rgba(7, 7, 8, ',
        accent: 'rgba(225, 29, 72, ', // Rose
        accentSecondary: 'rgba(16, 185, 129, ', // Lime
        line: 'rgba(7, 7, 8, 0.03)',
      },
    };

    const activeTheme = darkMode ? colors.dark : colors.light;

    // --- PHYSICS STRUCTURES ---

    // MODE 1: FLUID CORE PARTICLES
    const particleCount = Math.floor((dimensions.width * dimensions.height) / 9000) * (0.5 + intensity);
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      hueShift: number;
    }
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.4 + 0.1,
        baseAlpha: Math.random() * 0.3 + 0.15,
        hueShift: Math.random(),
      });
    }

    // MODE 2: STRING RESONANCE (Physical elastic strings)
    const stringCount = 12;
    interface StringNode {
      x: number;
      y: number;
      vy: number;
      baseY: number;
    }
    interface PhysicsString {
      nodes: StringNode[];
      controlY: number;
      amplitude: number;
      frequency: number;
      targetY: number;
      color: string;
    }
    const strings: PhysicsString[] = [];
    const nodeCount = 30; // segment density

    for (let s = 0; s < stringCount; s++) {
      const targetY = (dimensions.height / (stringCount + 1)) * (s + 1);
      const nodes: StringNode[] = [];
      for (let n = 0; n < nodeCount; n++) {
        const x = (dimensions.width / (nodeCount - 1)) * n;
        nodes.push({
          x,
          y: targetY,
          vy: 0,
          baseY: targetY,
        });
      }
      strings.push({
        nodes,
        controlY: targetY,
        amplitude: 0,
        frequency: 0.02 + s * 0.005,
        targetY,
        color: s % 3 === 0 ? activeTheme.accent : s % 3 === 1 ? activeTheme.accentSecondary : activeTheme.particle,
      });
    }

    // MODE 3: GRAVITY VORTICES SPARKS
    const sparkCount = Math.floor((dimensions.width * dimensions.height) / 4000) * (0.5 + intensity);
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      orbitSpeed: number;
      distance: number;
      angle: number;
    }
    const sparks: Spark[] = [];
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.6 ? activeTheme.accent : activeTheme.accentSecondary,
        orbitSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        distance: Math.random() * 200 + 40,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // --- MAIN ANIMATION LOOP ---
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const mouse = mouseRef.current;

      // Smooth mouse coordinates dampening
      mouse.vx = mouse.x - mouse.px;
      mouse.vy = mouse.y - mouse.py;
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      if (mode === 'fluid') {
        // --- RENDERING MODE 1: FLUID PARTICLES CORE ---
        // Draw subtle structural grid in background
        ctx.strokeStyle = activeTheme.line;
        ctx.lineWidth = 1;
        const gridSize = 100;
        for (let x = 0; x < dimensions.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, dimensions.height);
          ctx.stroke();
        }
        for (let y = 0; y < dimensions.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(dimensions.width, y);
          ctx.stroke();
        }

        // Update and draw particles
        particles.forEach((p) => {
          // Physics: Brown motion + slow drift
          p.x += p.vx;
          p.y += p.vy;

          // Wrap boundaries safely
          if (p.x < 0) p.x = dimensions.width;
          if (p.x > dimensions.width) p.x = 0;
          if (p.y < 0) p.y = dimensions.height;
          if (p.y > dimensions.height) p.y = 0;

          // Interactivity: Cursor magnetism
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 220;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 1.2 * (intensity + 0.5);
            // If dragging, push away, else gently pull
            if (mouse.isDown) {
              p.x -= (dx / dist) * force * 3;
              p.y -= (dy / dist) * force * 3;
              p.alpha = Math.min(1, p.alpha + 0.1);
            } else {
              p.x += (dx / dist) * force * 0.4;
              p.y += (dy / dist) * force * 0.4;
              p.alpha = Math.min(0.8, p.alpha + 0.05);
            }
          } else {
            // Recede to base alpha
            p.alpha += (p.baseAlpha - p.alpha) * 0.03;
          }

          // Draw particle
          ctx.fillStyle = p.hueShift > 0.85 
            ? `${activeTheme.accent}${p.alpha})`
            : `${activeTheme.particle}${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw connective constellation mesh lines
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            const connectionThreshold = 110;

            if (dist < connectionThreshold) {
              const alpha = (1 - dist / connectionThreshold) * 0.15 * Math.min(p1.alpha, p2.alpha);
              ctx.strokeStyle = `${activeTheme.particle}${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

      } else if (mode === 'strings') {
        // --- RENDERING MODE 2: RESONATING PHYSICAL STRINGS ---
        strings.forEach((str) => {
          // Pluck action logic
          str.nodes.forEach((node, idx) => {
            // Natural wave oscillation
            const offset = Math.sin(frame * str.frequency + idx * 0.15) * 1.8;
            node.y = node.baseY + offset;

            // Plucking physics from cursor
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.hypot(dx, dy);
            const pluckDist = 65;

            if (dist < pluckDist) {
              const hoverPower = (1 - dist / pluckDist);
              // Calculate cross-interaction velocity
              const pluckingForce = Math.min(15, Math.abs(mouse.vy) * 0.2 + Math.abs(mouse.vx) * 0.2);
              const direction = mouse.vy > 0 ? 1 : -1;

              node.vy = direction * pluckingForce * hoverPower * (intensity + 0.5);
            }

            // Spring physics update
            const k = 0.08; // tension stiffness
            const d = 0.94; // damping
            const springForce = -k * (node.y - node.baseY);
            node.vy += springForce;
            node.vy *= d;
            node.y += node.vy;

            // Constrain nodes slightly at edge endpoints so they are pinned
            if (idx === 0 || idx === nodeCount - 1) {
              node.y = node.baseY;
              node.vy = 0;
            }
          });

          // Draw the physical string as a Bezier curve path
          ctx.beginPath();
          ctx.moveTo(str.nodes[0].x, str.nodes[0].y);
          
          for (let i = 1; i < nodeCount - 2; i++) {
            const xc = (str.nodes[i].x + str.nodes[i + 1].x) / 2;
            const yc = (str.nodes[i].y + str.nodes[i + 1].y) / 2;
            ctx.quadraticCurveTo(str.nodes[i].x, str.nodes[i].y, xc, yc);
          }
          
          ctx.quadraticCurveTo(
            str.nodes[nodeCount - 2].x,
            str.nodes[nodeCount - 2].y,
            str.nodes[nodeCount - 1].x,
            str.nodes[nodeCount - 1].y
          );

          ctx.strokeStyle = str.color + '0.18)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Draw nodes under cursor interactions
          str.nodes.forEach((node) => {
            const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
            if (dist < 40) {
              ctx.fillStyle = str.color + '0.8)';
              ctx.beginPath();
              ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        });

      } else if (mode === 'gravity') {
        // --- RENDERING MODE 3: GRAVITY VORTICES ORBITING ---
        // Center gravity well coordinates (snaps to mouse or floats)
        let gX = dimensions.width / 2;
        let gY = dimensions.height / 2;

        if (mouse.x > -100 && mouse.x < dimensions.width + 100) {
          gX = mouse.x;
          gY = mouse.y;
        } else {
          // Abstract floating sine orbit
          gX = dimensions.width / 2 + Math.sin(frame * 0.005) * (dimensions.width * 0.2);
          gY = dimensions.height / 2 + Math.cos(frame * 0.007) * (dimensions.height * 0.2);
        }

        // Draw central elegant gravity core
        const coreGradient = ctx.createRadialGradient(gX, gY, 1, gX, gY, 120);
        coreGradient.addColorStop(0, `${activeTheme.accent}0.1)`);
        coreGradient.addColorStop(0.3, `${activeTheme.accentSecondary}0.03)`);
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(gX, gY, 120, 0, Math.PI * 2);
        ctx.fill();

        // Particle updates
        sparks.forEach((s) => {
          // Increment base angle
          s.angle += s.orbitSpeed * (1 + intensity);

          // Orbit mathematics with slight spring drift
          const targetX = gX + Math.cos(s.angle) * s.distance;
          const targetY = gY + Math.sin(s.angle) * s.distance;

          s.vx += (targetX - s.x) * 0.005;
          s.vy += (targetY - s.y) * 0.005;

          // Air friction dampening
          s.vx *= 0.95;
          s.vy *= 0.95;

          s.x += s.vx;
          s.y += s.vy;

          // Drag effect
          if (mouse.isDown) {
            s.distance += (Math.random() - 0.5) * 8;
            s.angle += 0.05;
          }

          // Draw spark
          ctx.fillStyle = s.color + '0.5)';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, dimensions, darkMode, intensity]);

  // Handle pointer listeners safely
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
  };

  const handlePointerDown = () => {
    mouseRef.current.isDown = true;
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  const handlePointerLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
    mouseRef.current.isDown = false;
  };

  return (
    <div
      ref={containerRef}
      id="canvas-stage-wrapper"
      className="absolute inset-0 w-full h-full pointer-events-auto"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        id="canvas-interactive-physics"
        className="block w-full h-full"
      />
    </div>
  );
}
