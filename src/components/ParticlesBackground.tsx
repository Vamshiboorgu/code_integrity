import React, { useEffect, useRef, useState } from 'react';
import { Terminal, ShieldCheck, FileText, Code2, Bug, CheckCircle2, FileSearch, GitBranch } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  icon: React.ElementType;
  color: string;
  opacity: number;
  rotation: number;
  vRotation: number;
}

const ICONS = [
  { icon: Terminal, color: '#3B82F6' }, // Dev
  { icon: Code2, color: '#60A5FA' }, // Dev
  { icon: GitBranch, color: '#93C5FD' }, // Dev
  { icon: ShieldCheck, color: '#F59E0B' }, // QA
  { icon: Bug, color: '#FCD34D' }, // QA
  { icon: CheckCircle2, color: '#10B981' }, // QA
  { icon: FileText, color: '#7C5CFF' }, // BA
  { icon: FileSearch, color: '#A78BFA' }, // BA
];

export const ParticlesBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();
  const [initialized, setInitialized] = useState(false);

  // Initialize particles once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const particleCount = Math.min(8, Math.floor((w * h) / 150000)); // Very minimal amount of particles
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const iconData = ICONS[Math.floor(Math.random() * ICONS.length)];

        // Start from either the left 15% or right 15% of the screen
        const isLeft = Math.random() > 0.5;
        const startX = isLeft
          ? (Math.random() * 0.15 * w)
          : (w - Math.random() * 0.15 * w);

        newParticles.push({
          id: i,
          x: startX,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 17 + 17, // 20 to 40px (larger icons)
          icon: iconData.icon,
          color: iconData.color,
          opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
          rotation: Math.random() * 360,
          vRotation: (Math.random() - 0.5) * 0.5,
        });
      }
      particlesRef.current = newParticles;
      setInitialized(true);
    };

    initParticles();

    // Re-init on significant resize
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(initParticles, 300);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    const updateParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        // Bounce off edges smoothly
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;
      });

      // Force a DOM update via ref instead of state to avoid React overhead on 60fps
      if (containerRef.current) {
        const children = containerRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i] as HTMLElement;
          const p = particlesRef.current[i];
          if (p) {
            el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
          }
        }
      }

      requestRef.current = requestAnimationFrame(updateParticles);
    };

    requestRef.current = requestAnimationFrame(updateParticles);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0 // Keep it strictly in the background
      }}
    >
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        {initialized && particlesRef.current.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: p.opacity,
                color: p.color,
                willChange: 'transform',
                transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 0 8px currentColor)'
              }}
            >
              <Icon size={p.size} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
