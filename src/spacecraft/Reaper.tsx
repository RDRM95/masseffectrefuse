import React, {useId} from 'react';
import {alongCurve, path, Pt, taperedCurve} from './svgUtil';

/**
 * Reaper capital ships. Drawn vertically: the mantle (head) at the top, the
 * weapon aperture low on the body and six swept mechanical limbs trailing
 * downward. Local space is ~1000 units tall. Red illumination; Harbinger uses
 * amber-gold with a broader body and four eye apertures.
 *
 * Rotate the component to point the head in the direction of travel.
 */

interface ReaperProps {
  scale?: number;
  variant?: 'sovereign' | 'harbinger' | 'destroyer';
  /** Beam weapon intensity 0..1 (glow at the aperture). */
  firing?: number;
  /** 0..1 structural damage: dimmed lights, breaches, fire. */
  damage?: number;
  /** Limb articulation phase (radians) for subtle motion. */
  limbPhase?: number;
  opacity?: number;
  /** Eye glow brightness 0..1 */
  glow?: number;
}

const BODY_DARK = '#07080c';
const BODY_MID = '#15171f';
const BODY_LIGHT = '#2b2f3b';
const BODY_EDGE = '#3d4250';

export const Reaper: React.FC<ReaperProps> = ({scale = 1, variant = 'sovereign', firing = 0, damage = 0, limbPhase = 0, opacity = 1, glow = 1}) => {
  const id = useId().replace(/:/g, '');
  const isH = variant === 'harbinger';
  const isD = variant === 'destroyer';
  const accent = isH ? '#ffb01f' : '#ff2a1a';
  const accentDeep = isH ? '#9a5a00' : '#7a0f0a';
  const live = Math.max(0, glow * (1 - damage * 0.8));
  const bw = isH ? 1.25 : 1; // body width factor

  // Mantle (head) and body outline
  const body: Pt[] = isD
    ? [[0, -420], [60, -380], [90, -300], [95, -160], [80, -40], [60, 40], [30, 90], [0, 100], [-30, 90], [-60, 40], [-80, -40], [-95, -160], [-90, -300], [-60, -380]]
    : [
        [0, -500], [50 * bw, -480], [95 * bw, -430], [120 * bw, -340], [128 * bw, -220], [122 * bw, -90], [110 * bw, 10], [92 * bw, 90], [70 * bw, 140], [40 * bw, 165], [0, 172],
        [-40 * bw, 165], [-70 * bw, 140], [-92 * bw, 90], [-110 * bw, 10], [-122 * bw, -90], [-128 * bw, -220], [-120 * bw, -340], [-95 * bw, -430], [-50 * bw, -480],
      ];

  // Limbs: [start, control, end, w0, w1]
  const limbs: Array<[Pt, Pt, Pt, number, number]> = isD
    ? [
        [[-55, 40], [-110, 240], [-70, 470], 30, 8],
        [[55, 40], [110, 240], [70, 470], 30, 8],
        [[-25, 70], [-40, 280], [-15, 520], 24, 6],
        [[25, 70], [40, 280], [15, 520], 24, 6],
      ]
    : [
        [[-110 * bw, 20], [-250 * bw, 220], [-200 * bw, 520], 44, 10],
        [[110 * bw, 20], [250 * bw, 220], [200 * bw, 520], 44, 10],
        [[-85 * bw, 100], [-150 * bw, 330], [-110 * bw, 600], 40, 9],
        [[85 * bw, 100], [150 * bw, 330], [110 * bw, 600], 40, 9],
        [[-35 * bw, 150], [-45 * bw, 380], [-30 * bw, 640], 36, 8],
        [[35 * bw, 150], [45 * bw, 380], [30 * bw, 640], 36, 8],
      ];

  const sway = (i: number) => Math.sin(limbPhase + i * 1.7) * 6;
  const h = isD ? 1000 : 1300;
  const w = isD ? 500 : 800;

  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`${-w / 2} ${-h / 2 - 50} ${w} ${h}`}
      style={{position: 'absolute', left: (-w / 2) * scale, top: (-h / 2 - 50) * scale, overflow: 'visible', opacity}}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={BODY_DARK} />
          <stop offset="35%" stopColor={BODY_MID} />
          <stop offset="55%" stopColor={BODY_LIGHT} />
          <stop offset="75%" stopColor={BODY_MID} />
          <stop offset="100%" stopColor={BODY_DARK} />
        </linearGradient>
        <linearGradient id={`${id}-limb`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={BODY_DARK} />
          <stop offset="50%" stopColor={BODY_LIGHT} />
          <stop offset="100%" stopColor={BODY_DARK} />
        </linearGradient>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0%" stopColor="#fff6f0" />
          <stop offset="25%" stopColor={accent} />
          <stop offset="60%" stopColor={accentDeep} stopOpacity="0.7" />
          <stop offset="100%" stopColor={accentDeep} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-aura`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-fire`}>
          <stop offset="0%" stopColor="#fff1cc" />
          <stop offset="35%" stopColor="#ff8a1f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7a2a00" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ambient red aura around the hull */}
      <ellipse cx={0} cy={-100} rx={isD ? 220 : 380 * bw} ry={isD ? 400 : 620} fill={`url(#${id}-aura)`} opacity={0.5 * live + firing * 0.5} />

      {/* limbs (back pair first for depth) */}
      {limbs.map(([p0, c, p1, w0, w1], i) => {
        const cc: Pt = [c[0] + sway(i), c[1]];
        const joints = alongCurve(p0, cc, p1, 5);
        return (
          <g key={i}>
            <path d={taperedCurve(p0, cc, p1, w0, w1)} fill={`url(#${id}-limb)`} stroke={BODY_EDGE} strokeWidth="1.4" strokeLinejoin="round" />
            {joints.map(([jx, jy], k) => (
              <g key={k}>
                <circle cx={jx} cy={jy} r={(w0 * (1 - k / 7)) / 2 + 1} fill="none" stroke="#0a0b10" strokeWidth="2" />
                <circle cx={jx} cy={jy} r={2.2} fill={accent} opacity={live * 0.9} />
              </g>
            ))}
            <circle cx={p1[0]} cy={p1[1]} r={3.5} fill={accent} opacity={live} />
          </g>
        );
      })}

      {/* body */}
      <path d={path(body)} fill={`url(#${id}-body)`} stroke={BODY_EDGE} strokeWidth="1.8" strokeLinejoin="round" />
      {/* layered armour plates */}
      {(isD ? [-380, -300, -220, -140, -60, 20] : [-440, -380, -310, -240, -170, -100, -30, 40, 110]).map((y, i) => {
        const t = (y + (isD ? 420 : 500)) / (isD ? 520 : 672);
        const halfW = (isD ? 92 : 126 * bw) * Math.sin(Math.min(Math.PI, t * Math.PI * 0.95 + 0.25));
        return (
          <g key={i}>
            <path d={`M${-halfW} ${y} Q0 ${y + 18} ${halfW} ${y}`} fill="none" stroke="#06070a" strokeWidth="3" />
            <path d={`M${-halfW * 0.9} ${y + 4} Q0 ${y + 20} ${halfW * 0.9} ${y + 4}`} fill="none" stroke={BODY_EDGE} strokeWidth="0.8" opacity="0.7" />
            <path d={`M${-halfW * 0.7} ${y + 9} Q0 ${y + 22} ${halfW * 0.7} ${y + 9}`} fill="none" stroke={accent} strokeWidth="1" opacity={0.35 * live} />
          </g>
        );
      })}
      {/* central spine seam */}
      <path d={`M0 ${isD ? -400 : -480} L0 ${isD ? 80 : 150}`} stroke="#06070a" strokeWidth="4" />
      <path d={`M0 ${isD ? -400 : -480} L0 ${isD ? 80 : 150}`} stroke={accent} strokeWidth="1.2" opacity={0.5 * live} />

      {/* eyes / weapon apertures */}
      {isH ? (
        <g>
          {[[-48, -300], [48, -300], [-70, -200], [70, -200]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={34} fill={`url(#${id}-eye)`} opacity={live} />
              <circle cx={x} cy={y} r={9} fill="#fff8e6" opacity={live} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <circle cx={0} cy={isD ? -40 : -60} r={isD ? 36 : 44} fill={`url(#${id}-eye)`} opacity={live} />
          <circle cx={0} cy={isD ? -40 : -60} r={isD ? 8 : 11} fill="#fff3ee" opacity={live} />
        </g>
      )}
      {/* main weapon aperture low on the body */}
      <circle cx={0} cy={isD ? 60 : 110} r={isD ? 44 : 62} fill={`url(#${id}-eye)`} opacity={live * (0.5 + firing * 0.5)} />
      <circle cx={0} cy={isD ? 60 : 110} r={(isD ? 10 : 14) * (1 + firing * 1.5)} fill="#fffaf5" opacity={live * (0.6 + firing * 0.4)} />
      {firing > 0 ? <circle cx={0} cy={isD ? 60 : 110} r={120 * firing + 40} fill={`url(#${id}-eye)`} opacity={firing * 0.8} filter={`url(#${id}-glow)`} /> : null}

      {/* damage */}
      {damage > 0 ? (
        <g opacity={Math.min(1, damage * 1.3)}>
          <circle cx={-60 * bw} cy={-250} r={70 * damage + 20} fill={`url(#${id}-fire)`} />
          <circle cx={50 * bw} cy={-20} r={60 * damage + 20} fill={`url(#${id}-fire)`} />
          <circle cx={-20 * bw} cy={-420} r={40 * damage + 10} fill={`url(#${id}-fire)`} />
          <path d={`M-30 -300 L10 -240 L-15 -180 L30 -120`} stroke="#ffb067" strokeWidth={3 * damage} fill="none" opacity="0.9" />
        </g>
      ) : null}
    </svg>
  );
};

/** Reaper beam: a devastating red directed-energy lance from (x0,y0) to (x1,y1), in world px. */
export const ReaperBeam: React.FC<{x0: number; y0: number; x1: number; y1: number; intensity: number; color?: string; width?: number}> = ({x0, y0, x1, y1, intensity, color = '#ff2a1a', width = 14}) => {
  if (intensity <= 0) return null;
  const id = useId().replace(/:/g, '');
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const w = width * intensity;
  return (
    <svg width={len + 400} height={w * 12 + 200} viewBox={`-200 ${-(w * 6 + 100)} ${len + 400} ${w * 12 + 200}`} style={{position: 'absolute', left: x0 - 200, top: y0 - (w * 6 + 100), transform: `rotate(${ang}deg)`, transformOrigin: `200px ${w * 6 + 100}px`, overflow: 'visible', pointerEvents: 'none'}}>
      <defs>
        <linearGradient id={`${id}-core`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffd9d0" stopOpacity="0.95" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation={w * 1.6} />
        </filter>
      </defs>
      <rect x={0} y={-w * 3} width={len} height={w * 6} fill={color} opacity={0.55 * intensity} filter={`url(#${id}-blur)`} />
      <rect x={0} y={-w * 1.1} width={len} height={w * 2.2} fill={color} opacity={0.9 * intensity} />
      <rect x={0} y={-w * 0.45} width={len} height={w * 0.9} fill={`url(#${id}-core)`} />
      <circle cx={0} cy={0} r={w * 4} fill={color} opacity={0.6 * intensity} filter={`url(#${id}-blur)`} />
      <circle cx={len} cy={0} r={w * 5} fill="#fff" opacity={0.6 * intensity} filter={`url(#${id}-blur)`} />
    </svg>
  );
};
