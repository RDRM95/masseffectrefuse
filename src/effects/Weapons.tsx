import React, {useId} from 'react';
import {random} from 'remotion';
import {clamp01} from '../animation/anim';

/**
 * Weapon and destruction effects in world pixels.
 */

/** A mass accelerator round: bright elongated slug with a fading tracer. */
export const Slug: React.FC<{x0: number; y0: number; x1: number; y1: number; t: number; color?: string; size?: number}> = ({x0, y0, x1, y1, t, color = '#cfe9ff', size = 1}) => {
  if (t <= 0 || t >= 1) return null;
  const x = x0 + (x1 - x0) * t;
  const y = y0 + (y1 - y0) * t;
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const tail = 90 * size;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${ang}deg)`, transformOrigin: '0 0'}}>
      <div
        style={{
          position: 'absolute',
          left: -tail,
          top: -1.6 * size,
          width: tail,
          height: 3.2 * size,
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${color} 70%, #ffffff 100%)`,
          boxShadow: `0 0 ${8 * size}px ${color}`,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

/** Kinetic barrier impact: a hexagonal blue flare that blooms and fades. */
export const ShieldImpact: React.FC<{x: number; y: number; t: number; size?: number; color?: string}> = ({x, y, t, size = 1, color = '#6fc3ff'}) => {
  if (t <= 0 || t >= 1) return null;
  const r = (26 + 60 * t) * size;
  const o = (1 - t) * 0.75;
  return (
    <svg width={r * 2.6} height={r * 2.6} viewBox={`${-r * 1.3} ${-r * 1.3} ${r * 2.6} ${r * 2.6}`} style={{position: 'absolute', left: x - r * 1.3, top: y - r * 1.3, overflow: 'visible'}}>
      <defs>
        <radialGradient id={`si-${Math.round(x)}-${Math.round(y)}`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity={o} />
          <stop offset="35%" stopColor={color} stopOpacity={o * 0.7} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={r} fill={`url(#si-${Math.round(x)}-${Math.round(y)})`} />
      {[0, 1, 2].map((k) => {
        const rr = r * (0.55 + k * 0.22);
        const hex = [...Array(6)].map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + k * 0.3;
          return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
        });
        return <polygon key={k} points={hex.join(' ')} fill="none" stroke={color} strokeWidth={1.5 * size} opacity={o * (0.6 - k * 0.15)} />;
      })}
    </svg>
  );
};

/**
 * Explosion with flash, fireball, shockwave ring and debris sparks.
 * t in 0..1 drives the full lifecycle.
 */
export const Explosion: React.FC<{x: number; y: number; t: number; size?: number; seed?: string; debris?: number; hue?: 'orange' | 'blue' | 'red'}> = ({x, y, t, size = 1, seed = 'ex', debris = 18, hue = 'orange'}) => {
  if (t <= 0 || t >= 1) return null;
  const id = useId().replace(/:/g, '');
  const flash = Math.max(0, 1 - t * 6);
  const fire = Math.sin(Math.min(1, t * 1.15) * Math.PI);
  const r = (24 + 110 * Math.pow(t, 0.5)) * size;
  const ring = clamp01((t - 0.05) / 0.9);
  const hot = Math.max(0, 1 - t * 2.2);
  const core = hue === 'blue' ? '#dff3ff' : hue === 'red' ? '#ffd0c0' : '#fff3d6';
  const mid = hue === 'blue' ? '#6fc3ff' : hue === 'red' ? '#ff4a2a' : '#ff9a2a';
  const outer = hue === 'blue' ? '#1e5fa8' : hue === 'red' ? '#7a0f0a' : '#6b2200';
  return (
    <svg width={r * 6} height={r * 6} viewBox={`${-r * 3} ${-r * 3} ${r * 6} ${r * 6}`} style={{position: 'absolute', left: x - r * 3, top: y - r * 3, overflow: 'visible', pointerEvents: 'none'}}>
      <defs>
        <radialGradient id={`${id}-fb`}>
          <stop offset="0%" stopColor={core} stopOpacity={fire} />
          <stop offset="30%" stopColor={mid} stopOpacity={fire * 0.9} />
          <stop offset="70%" stopColor={outer} stopOpacity={fire * 0.5} />
          <stop offset="100%" stopColor={outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-fl`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity={flash} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={r * 0.08} />
        </filter>
      </defs>
      {flash > 0 ? <circle r={r * 2.8} fill={`url(#${id}-fl)`} /> : null}
      <circle r={r} fill={`url(#${id}-fb)`} filter={`url(#${id}-blur)`} />
      {/* white-hot core */}
      <circle r={r * 0.32 * (0.4 + hot)} fill="#ffffff" opacity={hot * 0.95} filter={`url(#${id}-blur)`} />
      {/* dark smoke lobes late in the life */}
      {t > 0.35
        ? [...Array(5)].map((_, i) => {
            const a = random(`${seed}-sa${i}`) * Math.PI * 2;
            const d = r * (0.2 + random(`${seed}-sd${i}`) * 0.6);
            return <circle key={`s${i}`} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={r * (0.3 + random(`${seed}-sr${i}`) * 0.35)} fill="#1a0f08" opacity={(t - 0.35) * 0.9 * (1 - t)} filter={`url(#${id}-blur)`} />;
          })
        : null}
      {/* smoky lumps */}
      {[...Array(7)].map((_, i) => {
        const a = random(`${seed}-a${i}`) * Math.PI * 2;
        const d = r * (0.3 + random(`${seed}-d${i}`) * 0.5) * (0.6 + t);
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={r * (0.25 + random(`${seed}-r${i}`) * 0.3)} fill={mid} opacity={fire * 0.45} filter={`url(#${id}-blur)`} />;
      })}
      {/* shockwave */}
      <circle r={r * 0.9 + ring * r * 0.9} fill="none" stroke={core} strokeWidth={Math.max(0.5, 3 * (1 - ring)) * size} opacity={(1 - ring) * 0.45} />
      {/* debris sparks */}
      {[...Array(debris)].map((_, i) => {
        const a = random(`${seed}-s${i}`) * Math.PI * 2;
        const sp = (120 + random(`${seed}-v${i}`) * 260) * size;
        const dd = sp * Math.pow(t, 0.7);
        const px = Math.cos(a) * dd;
        const py = Math.sin(a) * dd;
        const l = 10 + random(`${seed}-l${i}`) * 22;
        return <line key={i} x1={px} y1={py} x2={px - Math.cos(a) * l} y2={py - Math.sin(a) * l} stroke={i % 3 === 0 ? '#ffffff' : '#ffb067'} strokeWidth={1.4 * size} opacity={(1 - t) * 0.9} />;
      })}
    </svg>
  );
};

/** Lingering fire & smoke on a damaged hull. */
export const HullFire: React.FC<{x: number; y: number; size?: number; intensity?: number; frame: number; seed?: string}> = ({x, y, size = 1, intensity = 1, frame, seed = 'hf'}) => {
  const id = useId().replace(/:/g, '');
  const r = 50 * size;
  return (
    <svg width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`} style={{position: 'absolute', left: x - r * 2, top: y - r * 2, overflow: 'visible', pointerEvents: 'none'}}>
      <defs>
        <radialGradient id={`${id}-f`}>
          <stop offset="0%" stopColor="#fff1cc" stopOpacity={0.9 * intensity} />
          <stop offset="40%" stopColor="#ff8a1f" stopOpacity={0.6 * intensity} />
          <stop offset="100%" stopColor="#6b2200" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-b`}>
          <feGaussianBlur stdDeviation={r * 0.12} />
        </filter>
      </defs>
      {[...Array(4)].map((_, i) => {
        const ph = frame * 0.12 + random(`${seed}${i}`) * 10;
        return <circle key={i} cx={Math.sin(ph) * r * 0.3} cy={Math.cos(ph * 1.3) * r * 0.3 - i * r * 0.1} r={r * (0.6 + 0.2 * Math.sin(ph * 2))} fill={`url(#${id}-f)`} filter={`url(#${id}-b)`} />;
      })}
    </svg>
  );
};

/** Hyper-mass accelerator projectile: a heavy, incandescent slug with a long plasma wake. */
export const HeavySlug: React.FC<{x0: number; y0: number; x1: number; y1: number; t: number}> = ({x0, y0, x1, y1, t}) => {
  if (t <= 0 || t >= 1) return null;
  const x = x0 + (x1 - x0) * t;
  const y = y0 + (y1 - y0) * t;
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${ang}deg)`, transformOrigin: '0 0'}}>
      <div style={{position: 'absolute', left: -520, top: -10, width: 520, height: 20, background: 'linear-gradient(90deg, rgba(79,168,255,0) 0%, rgba(79,168,255,0.35) 50%, rgba(207,233,255,0.9) 100%)', filter: 'blur(4px)', borderRadius: 10}} />
      <div style={{position: 'absolute', left: -60, top: -4, width: 70, height: 8, background: 'linear-gradient(90deg, rgba(255,255,255,0.2), #ffffff)', boxShadow: '0 0 24px #bfe3ff, 0 0 60px #4fa8ff', borderRadius: 4}} />
    </div>
  );
};
