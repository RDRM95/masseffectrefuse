import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONTS} from '../theme';
import {fadeInOut} from '../animation/anim';

/**
 * Restrained cinematic typography. White text on black, gentle fades, no
 * motion gimmicks. Timings are in frames relative to the enclosing sequence.
 */
export const CinematicText: React.FC<{
  text: string;
  from: number;
  to: number;
  fade?: number;
  size?: number;
  tracking?: number;
  color?: string;
  font?: string;
  weight?: number;
  y?: string;
  maxWidth?: number;
  drift?: number;
}> = ({text, from, to, fade = 36, size = 44, tracking = 2, color = '#e9edf2', font = FONTS.display, weight = 300, y = '50%', maxWidth = 1300, drift = 0}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, from, from + fade, to - fade, to);
  if (o <= 0) return null;
  const p = (frame - from) / Math.max(1, to - from);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: y,
          transform: `translateY(-50%) translateY(${(p - 0.5) * drift}px)`,
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          letterSpacing: tracking,
          color,
          opacity: o,
          textAlign: 'center',
          lineHeight: 1.45,
          maxWidth,
          padding: '0 40px',
          whiteSpace: 'pre-line',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** The main title: MASS EFFECT / REFUSE / THE ENDING WE EARNED. */
export const MainTitle: React.FC<{from: number; to: number; showTagline?: boolean; showFan?: boolean}> = ({from, to, showTagline = true, showFan = false}) => {
  const frame = useCurrentFrame();
  const o1 = fadeInOut(frame, from, from + 50, to - 40, to);
  const o2 = fadeInOut(frame, from + 30, from + 80, to - 40, to);
  const o3 = fadeInOut(frame, from + 70, from + 120, to - 40, to);
  const o4 = fadeInOut(frame, from + 110, from + 160, to - 40, to);
  const spread = 1 + Math.max(0, 1 - (frame - from) / 120) * 0.08;
  if (o1 <= 0) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', pointerEvents: 'none'}}>
      <div style={{textAlign: 'center', transform: 'translateY(-20px)'}}>
        <div style={{fontFamily: FONTS.title, fontSize: 64, letterSpacing: 26 * spread, color: '#f2f4f7', opacity: o1, textShadow: '0 0 40px rgba(111,195,255,0.35)'}}>
          MASS EFFECT
        </div>
        <div style={{fontFamily: FONTS.title, fontSize: 150, letterSpacing: 40 * spread, color: '#ffffff', opacity: o2, marginTop: 10, lineHeight: 1, textShadow: '0 0 60px rgba(111,195,255,0.45), 0 0 2px #fff'}}>
          REFUSE
        </div>
        <div style={{width: 760, height: 1, background: 'linear-gradient(90deg, rgba(111,195,255,0) 0%, rgba(111,195,255,0.9) 50%, rgba(111,195,255,0) 100%)', margin: '30px auto 24px', opacity: o3}} />
        {showTagline ? (
          <div style={{fontFamily: FONTS.display, fontWeight: 300, fontSize: 34, letterSpacing: 14, color: '#bfd6ee', opacity: o3}}>THE ENDING WE EARNED</div>
        ) : null}
        {showFan ? (
          <div style={{fontFamily: FONTS.ui, fontWeight: 400, fontSize: 18, letterSpacing: 5, color: '#7b8898', opacity: o4, marginTop: 36}}>
            AN UNOFFICIAL FAN PRODUCTION · ORIGINAL ART, WRITING AND MUSIC
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Chapter card: thin rule, numeral, title. */
export const ChapterCard: React.FC<{number: number; title: string; from: number; to: number}> = ({number, title, from, to}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, from, from + 30, to - 30, to);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', pointerEvents: 'none'}}>
      <div style={{textAlign: 'center', opacity: o}}>
        <div style={{fontFamily: FONTS.ui, fontSize: 24, letterSpacing: 10, color: '#6fc3ff', fontWeight: 500}}>CHAPTER {['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'][number] ?? number}</div>
        <div style={{width: 120, height: 1, background: '#6fc3ff', margin: '18px auto', opacity: 0.6}} />
        <div style={{fontFamily: FONTS.title, fontSize: 54, letterSpacing: 12, color: '#f2f4f7'}}>{title.toUpperCase()}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Lower-left location caption with a technical rule, e.g. "EARTH ORBIT — SOL SYSTEM". */
export const LocationCaption: React.FC<{text: string; sub?: string; from: number; to: number; color?: string}> = ({text, sub, from, to, color = '#6fc3ff'}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, from, from + 18, to - 18, to);
  if (o <= 0) return null;
  const w = Math.min(1, (frame - from) / 30);
  return (
    <div style={{position: 'absolute', left: 96, bottom: 110, opacity: o, pointerEvents: 'none'}}>
      <div style={{width: 420 * w, height: 2, background: color, marginBottom: 12, boxShadow: `0 0 12px ${color}`}} />
      <div style={{fontFamily: FONTS.ui, fontSize: 30, letterSpacing: 8, color: '#f2f4f7', fontWeight: 500}}>{text}</div>
      {sub ? <div style={{fontFamily: FONTS.ui, fontSize: 20, letterSpacing: 5, color, marginTop: 6, opacity: 0.9}}>{sub}</div> : null}
    </div>
  );
};

/** Closing text lines, centre frame. */
export const ClosingLine: React.FC<{text: string; from: number; to: number; size?: number}> = ({text, from, to, size = 46}) => (
  <CinematicText text={text} from={from} to={to} fade={40} size={size} tracking={12} font={FONTS.title} weight={400} color="#f2f4f7" />
);
