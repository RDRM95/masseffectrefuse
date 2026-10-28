import React, {useId} from 'react';
import {random} from 'remotion';
import {FONTS} from '../theme';
import {noise1} from '../animation/anim';

/**
 * Animated galactic military map. A top-down spiral galaxy of points, the
 * relay web, allied (blue) and Reaper-controlled (red) zones. `progress`
 * 0..1 contracts the red zones and expands allied control as the war turns.
 */

interface Zone {
  x: number;
  y: number;
  r: number;
  /** progress at which this zone is liberated (zone shrinks to 0 by then). */
  fallsAt: number;
  label?: string;
}

const REAPER_ZONES: Zone[] = [
  {x: 980, y: 520, r: 190, fallsAt: 0.75, label: 'INNER COUNCIL SPACE'},
  {x: 1250, y: 420, r: 150, fallsAt: 0.55, label: 'ATTICAN TRAVERSE'},
  {x: 700, y: 400, r: 140, fallsAt: 0.5, label: 'TERMINUS APPROACHES'},
  {x: 1180, y: 700, r: 120, fallsAt: 0.9, label: 'HADES NEXUS'},
  {x: 760, y: 680, r: 110, fallsAt: 0.65},
  {x: 1400, y: 600, r: 90, fallsAt: 0.4},
  {x: 560, y: 560, r: 80, fallsAt: 0.35},
  {x: 1050, y: 300, r: 90, fallsAt: 0.45},
];

const HOMEWORLDS: Array<{x: number; y: number; name: string; color: string}> = [
  {x: 1120, y: 470, name: 'SOL', color: '#6fc3ff'},
  {x: 940, y: 620, name: 'TREBIA — PALAVEN', color: '#ffb347'},
  {x: 1010, y: 560, name: 'WIDOW — CITADEL', color: '#dfe6ee'},
  {x: 840, y: 470, name: 'PARNITHA — THESSIA', color: '#b48cff'},
  {x: 1300, y: 560, name: 'ARALAKH — TUCHANKA', color: '#ff9e6b'},
  {x: 1240, y: 360, name: 'TIKKUN — RANNOCH', color: '#d9b3ff'},
  {x: 660, y: 520, name: 'PRANAS — SUR\'KESH', color: '#c3ffb3'},
];

export const GalaxyMap: React.FC<{frame: number; progress: number; showLabels?: boolean}> = ({frame, progress, showLabels = true}) => {
  const id = useId().replace(/:/g, '');
  // star points along four spiral arms
  const stars: Array<{x: number; y: number; r: number; o: number}> = [];
  for (let i = 0; i < 1400; i++) {
    const arm = i % 4;
    const t = random(`gm-t${i}`);
    const ang = t * 4.2 + arm * (Math.PI / 2) + random(`gm-a${i}`) * 0.45;
    const rad = 60 + t * 520 + random(`gm-r${i}`) * 60;
    stars.push({x: 960 + Math.cos(ang) * rad, y: 540 + Math.sin(ang) * rad * 0.62, r: 0.6 + random(`gm-s${i}`) * 1.3, o: 0.25 + random(`gm-o${i}`) * 0.6});
  }
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <radialGradient id={`${id}-core`}>
          <stop offset="0%" stopColor="#ffe7c2" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#8fb6e0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-red`}>
          <stop offset="0%" stopColor="#ff3b2a" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#b3150c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7a0f0a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-blue`}>
          <stop offset="0%" stopColor="#4fa8ff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width="1920" height="1080" fill="#02040a" />
      {/* grid */}
      {[...Array(13)].map((_, i) => (
        <line key={`v${i}`} x1={160 + i * 133} y1={60} x2={160 + i * 133} y2={1020} stroke="#0f2238" strokeWidth="1" />
      ))}
      {[...Array(9)].map((_, i) => (
        <line key={`h${i}`} x1={160} y1={60 + i * 120} x2={1760} y2={60 + i * 120} stroke="#0f2238" strokeWidth="1" />
      ))}
      <ellipse cx={960} cy={540} rx={620} ry={390} fill={`url(#${id}-core)`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#bfd6ee" opacity={s.o} />
      ))}
      {/* allied control (expands) */}
      <ellipse cx={1060} cy={540} rx={200 + progress * 460} ry={120 + progress * 300} fill={`url(#${id}-blue)`} filter={`url(#${id}-blur)`} />
      {/* relay web */}
      {HOMEWORLDS.map((h, i) =>
        HOMEWORLDS.slice(i + 1).map((k, j) => (
          <line key={`${i}-${j}`} x1={h.x} y1={h.y} x2={k.x} y2={k.y} stroke="#4fa8ff" strokeWidth="1" opacity={0.12 + progress * 0.18} />
        )),
      )}
      {/* Reaper zones */}
      {REAPER_ZONES.map((z, i) => {
        const shrink = Math.max(0, 1 - progress / z.fallsAt);
        const r = z.r * shrink * (1 + 0.04 * noise1(frame * 0.05, i));
        if (r <= 1) return null;
        return (
          <g key={i}>
            <circle cx={z.x} cy={z.y} r={r * 1.1} fill={`url(#${id}-red)`} filter={`url(#${id}-blur)`} />
            <circle cx={z.x} cy={z.y} r={r} fill="none" stroke="#ff3b2a" strokeWidth="1.2" strokeDasharray="6 5" opacity={0.6 + 0.3 * pulse} />
            {showLabels && z.label && shrink > 0.4 ? (
              <text x={z.x} y={z.y - r - 10} fill="#ff6b57" fontFamily={FONTS.ui} fontSize="15" letterSpacing="4" textAnchor="middle" opacity={0.85 * shrink}>
                {z.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {/* homeworld markers */}
      {HOMEWORLDS.map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy={h.y} r={9 + 3 * pulse} fill="none" stroke={h.color} strokeWidth="1.2" opacity="0.8" />
          <circle cx={h.x} cy={h.y} r={3.2} fill={h.color} />
          {showLabels ? (
            <text x={h.x + 16} y={h.y + 5} fill={h.color} fontFamily={FONTS.ui} fontSize="16" letterSpacing="3" opacity="0.9">
              {h.name}
            </text>
          ) : null}
        </g>
      ))}
      {/* allied fleet markers advancing outward */}
      {[...Array(18)].map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const d = 140 + progress * 420 + 30 * Math.sin(frame * 0.05 + i);
        const x = 1060 + Math.cos(a) * d;
        const y = 540 + Math.sin(a) * d * 0.6;
        return <polygon key={i} points={`${x},${y - 6} ${x + 5},${y + 4} ${x - 5},${y + 4}`} fill="#9fd4ff" opacity={0.6 + 0.3 * Math.sin(frame * 0.1 + i)} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />;
      })}
    </svg>
  );
};
