import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONTS} from '../theme';
import {fadeInOut, flicker, noise1} from '../animation/anim';

/**
 * Alliance-style tactical interface elements: thin blue/orange line work,
 * targeting reticles, data readouts. Deliberately sparse.
 */

export const HudFrame: React.FC<{from: number; to: number; color?: string; label?: string; children?: React.ReactNode}> = ({from, to, color = '#6fc3ff', label, children}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, from, from + 12, to - 12, to) * flicker(frame, 3, 0.08);
  if (o <= 0) return null;
  const corner = (style: React.CSSProperties) => (
    <div style={{position: 'absolute', width: 40, height: 40, borderColor: color, borderStyle: 'solid', borderWidth: 0, ...style}} />
  );
  return (
    <div style={{position: 'absolute', inset: 70, opacity: o, pointerEvents: 'none', fontFamily: FONTS.ui}}>
      {corner({left: 0, top: 0, borderTopWidth: 2, borderLeftWidth: 2})}
      {corner({right: 0, top: 0, borderTopWidth: 2, borderRightWidth: 2})}
      {corner({left: 0, bottom: 0, borderBottomWidth: 2, borderLeftWidth: 2})}
      {corner({right: 0, bottom: 0, borderBottomWidth: 2, borderRightWidth: 2})}
      {label ? (
        <div style={{position: 'absolute', left: 60, top: -4, color, fontSize: 20, letterSpacing: 6, fontWeight: 500}}>{label}</div>
      ) : null}
      {children}
    </div>
  );
};

export const HudReadout: React.FC<{x: number; y: number; lines: string[]; color?: string; align?: 'left' | 'right'}> = ({x, y, lines, color = '#6fc3ff', align = 'left'}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: align === 'left' ? x : undefined, right: align === 'right' ? x : undefined, top: y, color, fontFamily: FONTS.ui, fontSize: 19, letterSpacing: 3, lineHeight: 1.7, textAlign: align, textShadow: `0 0 8px ${color}66`}}>
      {lines.map((l, i) => (
        <div key={i} style={{opacity: i === lines.length - 1 ? 0.7 + 0.3 * (0.5 + 0.5 * noise1(frame * 0.6, i)) : 0.9}}>
          {l}
        </div>
      ))}
    </div>
  );
};

/** Targeting reticle locking onto a screen position. progress 0..1 (closing), locked when >= 1. */
export const Reticle: React.FC<{x: number; y: number; progress: number; size?: number; color?: string; label?: string}> = ({x, y, progress, size = 160, color = '#ff8a1f', label}) => {
  const frame = useCurrentFrame();
  if (progress <= 0) return null;
  const r = size * (1.6 - 0.6 * Math.min(1, progress));
  const locked = progress >= 1;
  const c = locked ? color : '#6fc3ff';
  const o = locked ? 0.85 + 0.15 * Math.sin(frame * 0.5) : 0.8;
  return (
    <svg width={r * 2.4} height={r * 2.4} viewBox={`${-r * 1.2} ${-r * 1.2} ${r * 2.4} ${r * 2.4}`} style={{position: 'absolute', left: x - r * 1.2, top: y - r * 1.2, opacity: o, overflow: 'visible', pointerEvents: 'none'}}>
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a + (locked ? 0 : frame * 1.5)})`}>
          <path d={`M${-r} ${-r} L${-r + r * 0.45} ${-r} M${-r} ${-r} L${-r} ${-r + r * 0.45}`} stroke={c} strokeWidth="2.5" fill="none" />
        </g>
      ))}
      <circle r={r * 0.08} fill="none" stroke={c} strokeWidth="1.5" />
      <path d={`M${-r * 0.2} 0 L${-r * 0.08} 0 M${r * 0.08} 0 L${r * 0.2} 0 M0 ${-r * 0.2} L0 ${-r * 0.08} M0 ${r * 0.08} L0 ${r * 0.2}`} stroke={c} strokeWidth="1.5" />
      {label ? (
        <text x={r * 1.05} y={-r * 0.95} fill={c} fontFamily="'Jura', sans-serif" fontSize={size * 0.13} letterSpacing="3">
          {label}
        </text>
      ) : null}
      {locked ? (
        <text x={r * 1.05} y={-r * 0.95 + size * 0.17} fill={c} fontFamily="'Jura', sans-serif" fontSize={size * 0.11} letterSpacing="3">
          SOLUTION LOCKED
        </text>
      ) : null}
    </svg>
  );
};

/** Thin progress bar with label (charge indicators, barrier integrity). */
export const HudBar: React.FC<{x: number; y: number; w?: number; value: number; label: string; color?: string}> = ({x, y, w = 320, value, label, color = '#6fc3ff'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: FONTS.ui, color, fontSize: 17, letterSpacing: 4}}>
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
      <span>{label}</span>
      <span>{Math.round(Math.max(0, Math.min(1, value)) * 100)}%</span>
    </div>
    <div style={{height: 6, background: `${color}33`, border: `1px solid ${color}88`}}>
      <div style={{height: '100%', width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color, boxShadow: `0 0 10px ${color}`}} />
    </div>
  </div>
);
