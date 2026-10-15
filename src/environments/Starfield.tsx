import React, {useMemo} from 'react';
import {random} from 'remotion';
import {WIDTH, HEIGHT} from '../timeline/chapters';

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  c: string;
}

const STAR_COLORS = ['#ffffff', '#dfe9ff', '#ffe9d6', '#c9d8ff', '#ffffff', '#ffffff', '#fff4e6'];

const makeStars = (seed: string, count: number, w: number, h: number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const k = `${seed}-${i}`;
    const mag = random(`${k}-m`);
    stars.push({
      x: random(`${k}-x`) * w,
      y: random(`${k}-y`) * h,
      r: mag > 0.985 ? 1.6 + random(`${k}-r`) * 1.2 : mag > 0.9 ? 0.9 + random(`${k}-r`) * 0.6 : 0.35 + random(`${k}-r`) * 0.5,
      a: mag > 0.9 ? 0.8 + random(`${k}-a`) * 0.2 : 0.25 + random(`${k}-a`) * 0.55,
      c: STAR_COLORS[Math.floor(random(`${k}-c`) * STAR_COLORS.length)],
    });
  }
  return stars;
};

/**
 * Deterministic starfield rendered once to an offscreen canvas and reused as
 * a background image. Two depth layers drift at different rates for parallax.
 */
const useStarImage = (seed: string, count: number, w: number, h: number): string =>
  useMemo(() => {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const stars = makeStars(seed, count, w, h);
    for (const s of stars) {
      ctx.globalAlpha = s.a;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1.5) {
        // bright stars get a faint glow and a thin cross flare
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        g.addColorStop(0, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return canvas.toDataURL('image/png');
  }, [seed, count, w, h]);

export const Starfield: React.FC<{
  seed?: string;
  /** Horizontal drift in px (applied to the far layer; near layer drifts 2.2x). */
  driftX?: number;
  driftY?: number;
  /** Overall brightness 0..1 */
  brightness?: number;
  density?: number;
  nebula?: 'none' | 'blue' | 'red' | 'violet' | 'amber';
}> = ({seed = 'stars', driftX = 0, driftY = 0, brightness = 1, density = 1, nebula = 'blue'}) => {
  const W = WIDTH * 1.6;
  const H = HEIGHT * 1.6;
  const far = useStarImage(`${seed}-far`, Math.round(1600 * density), W, H);
  const near = useStarImage(`${seed}-near`, Math.round(260 * density), W, H);
  const nebulaGrad =
    nebula === 'none'
      ? 'none'
      : nebula === 'red'
        ? 'radial-gradient(ellipse 60% 45% at 70% 60%, rgba(120,20,25,0.35), rgba(0,0,0,0) 70%), radial-gradient(ellipse 50% 35% at 20% 30%, rgba(60,15,40,0.3), rgba(0,0,0,0) 70%)'
        : nebula === 'violet'
          ? 'radial-gradient(ellipse 60% 45% at 65% 40%, rgba(70,40,120,0.35), rgba(0,0,0,0) 70%), radial-gradient(ellipse 50% 35% at 25% 70%, rgba(30,40,110,0.3), rgba(0,0,0,0) 70%)'
          : nebula === 'amber'
            ? 'radial-gradient(ellipse 60% 45% at 60% 55%, rgba(110,60,20,0.3), rgba(0,0,0,0) 70%), radial-gradient(ellipse 50% 35% at 25% 30%, rgba(60,30,30,0.3), rgba(0,0,0,0) 70%)'
            : 'radial-gradient(ellipse 60% 45% at 30% 40%, rgba(20,50,110,0.35), rgba(0,0,0,0) 70%), radial-gradient(ellipse 50% 35% at 75% 70%, rgba(40,20,80,0.3), rgba(0,0,0,0) 70%)';
  const base: React.CSSProperties = {
    position: 'absolute',
    left: -(W - WIDTH) / 2,
    top: -(H - HEIGHT) / 2,
    width: W,
    height: H,
    backgroundRepeat: 'no-repeat',
  };
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(180deg, #01030a 0%, #03060f 50%, #02040b 100%)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: nebulaGrad, opacity: brightness}} />
      <div style={{...base, backgroundImage: `url(${far})`, opacity: brightness, transform: `translate(${driftX}px, ${driftY}px)`}} />
      <div style={{...base, backgroundImage: `url(${near})`, opacity: brightness, transform: `translate(${driftX * 2.2}px, ${driftY * 2.2}px)`}} />
    </div>
  );
};
