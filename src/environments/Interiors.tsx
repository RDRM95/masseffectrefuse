import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {noise1, rr} from '../animation/anim';
import {Starfield} from './Starfield';
import {Planet} from './Planet';
import {FONTS} from '../theme';

/**
 * The Catalyst chamber at the summit of the Citadel. A dark platform with a
 * long walkway toward a circular dais; beyond it, open space and Earth under
 * siege. Three paths of light answer the three choices: blue (control) rising
 * to the left, red (destroy) rising to the right, and a pale green column of
 * synthesis at the centre.
 */
export const CatalystChamber: React.FC<{
  frame: number;
  control?: number;
  destroy?: number;
  synthesis?: number;
  /** General chamber light 0..1 */
  light?: number;
}> = ({frame, control = 0, destroy = 0, synthesis = 0, light = 1}) => {
  const id = useId().replace(/:/g, '');
  const hum = 0.9 + 0.1 * noise1(frame * 0.4, 9);
  return (
    <AbsoluteFill style={{background: '#02040a', overflow: 'hidden'}}>
      {/* Space beyond the chamber: Earth and the battle */}
      <div style={{position: 'absolute', inset: 0, opacity: 0.9}}>
        <Starfield seed="catalyst" brightness={0.6} nebula="violet" />
        <div style={{position: 'absolute', left: 1500, top: 980}}>
          <Planet kind="earth" radius={620} rotation={70 + frame * 0.01} sunAngle={160} litFraction={0.45} damage={0.5} />
        </div>
        {/* distant fleet and Reaper flashes */}
        {[...Array(40)].map((_, i) => {
          const x = rr(`bx${i}`, 200, 1800);
          const y = rr(`by${i}`, 60, 420);
          const red = i % 3 === 0;
          const o = 0.3 + 0.7 * (0.5 + 0.5 * noise1(frame * rr(`bf${i}`, 0.2, 1.4), i));
          return <div key={i} style={{position: 'absolute', left: x, top: y, width: red ? 3 : 2, height: red ? 3 : 2, borderRadius: 2, background: red ? '#ff4a2a' : '#bfe3ff', boxShadow: red ? '0 0 8px 2px rgba(255,42,26,0.6)' : '0 0 6px 1px rgba(159,212,255,0.5)', opacity: o}} />;
        })}
      </div>

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d141c" />
            <stop offset="100%" stopColor="#030508" />
          </linearGradient>
          <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#05080c" />
            <stop offset="50%" stopColor="#0f1720" />
            <stop offset="100%" stopColor="#05080c" />
          </linearGradient>
          <radialGradient id={`${id}-blue`}>
            <stop offset="0%" stopColor="#6fc3ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-red`}>
            <stop offset="0%" stopColor="#ff5a3a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7a0f0a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-green`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfffd6" stopOpacity="0" />
            <stop offset="40%" stopColor="#8fffb8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8fffb8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-light`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9adcff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9adcff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        {/* Structural pillars framing the view */}
        <polygon points="0,0 260,0 200,1080 0,1080" fill={`url(#${id}-wall)`} />
        <polygon points="1920,0 1660,0 1720,1080 1920,1080" fill={`url(#${id}-wall)`} />
        <polygon points="260,0 1660,0 1600,90 320,90" fill="#05080c" />
        {/* side ramps rising from the dais: left (control) and right (destroy) */}
        <polygon points="600,660 700,700 420,330 340,300" fill="#0b1119" stroke="#1d2a36" strokeWidth="1.5" />
        <polygon points="1320,660 1220,700 1500,330 1580,300" fill="#0b1119" stroke="#1d2a36" strokeWidth="1.5" />
        <polygon points="340,300 420,330 400,250 330,230" fill="#080d13" stroke="#1d2a36" strokeWidth="1.2" />
        <polygon points="1580,300 1500,330 1520,250 1590,230" fill="#080d13" stroke="#1d2a36" strokeWidth="1.2" />
        <line x1={600} y1={660} x2={340} y2={300} stroke="#6fc3ff" strokeWidth="1.2" opacity={0.25 + control * 0.6} />
        <line x1={1320} y1={660} x2={1580} y2={300} stroke="#ff5a3a" strokeWidth="1.2" opacity={0.25 + destroy * 0.6} />
        {[...Array(6)].map((_, i) => {
          const t = i / 5;
          return (
            <g key={`rl${i}`}>
              <circle cx={650 - t * 290} cy={680 - t * 380} r={2.2} fill="#6fc3ff" opacity={(0.3 + control * 0.7) * light} />
              <circle cx={1270 + t * 290} cy={680 - t * 380} r={2.2} fill="#ff5a3a" opacity={(0.3 + destroy * 0.7) * light} />
            </g>
          );
        })}
        {/* railings on the ramps */}
        <line x1={590} y1={640} x2={330} y2={282} stroke="#2a3a4c" strokeWidth="1.5" />
        <line x1={1330} y1={640} x2={1590} y2={282} stroke="#2a3a4c" strokeWidth="1.5" />
        {/* dais */}
        <ellipse cx={960} cy={690} rx={420} ry={110} fill="#0a1017" stroke="#1d2a36" strokeWidth="2" />
        <ellipse cx={960} cy={690} rx={320} ry={82} fill="none" stroke="#2a3a4c" strokeWidth="1.5" opacity="0.8" />
        <ellipse cx={960} cy={690} rx={180} ry={46} fill="none" stroke="#9adcff" strokeWidth="1.2" opacity={0.25 * hum * light} />
        {/* walkway toward camera (perspective) */}
        <polygon points="860,740 1060,740 1360,1080 560,1080" fill={`url(#${id}-floor)`} stroke="#1d2a36" strokeWidth="1.5" />
        {[...Array(9)].map((_, i) => {
          const t = i / 8;
          const y = 760 + t * t * 320;
          const hw = 100 + t * t * 300;
          return <line key={i} x1={960 - hw} y1={y} x2={960 + hw} y2={y} stroke="#1a2430" strokeWidth="1" opacity="0.8" />;
        })}
        {/* edge guide lights on the walkway */}
        {[...Array(9)].map((_, i) => {
          const t = i / 8;
          const y = 760 + t * t * 320;
          const hw = 100 + t * t * 300;
          const o = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.08 - i * 0.7))) * light;
          return (
            <g key={i}>
              <circle cx={960 - hw + 6} cy={y} r={2 + t * 2} fill="#9adcff" opacity={o} />
              <circle cx={960 + hw - 6} cy={y} r={2 + t * 2} fill="#9adcff" opacity={o} />
            </g>
          );
        })}
        {/* ambient chamber light from above */}
        <rect x={260} y={0} width={1400} height={700} fill={`url(#${id}-light)`} opacity={light * hum} />
        {/* The three paths of light */}
        {control > 0 ? <ellipse cx={420} cy={560} rx={260} ry={200} fill={`url(#${id}-blue)`} opacity={control * hum} filter={`url(#${id}-blur)`} /> : null}
        {destroy > 0 ? <ellipse cx={1500} cy={560} rx={260} ry={200} fill={`url(#${id}-red)`} opacity={destroy * hum} filter={`url(#${id}-blur)`} /> : null}
        {synthesis > 0 ? (
          <g opacity={synthesis * hum}>
            <rect x={930} y={60} width={60} height={640} fill={`url(#${id}-green)`} filter={`url(#${id}-blur)`} />
            <rect x={952} y={100} width={16} height={580} fill="#dfffe9" opacity="0.6" />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Flag bridge of an Alliance dreadnought: a dark command deck with a large
 * holographic strategic display and viewport onto the fleet.
 */
export const FlagBridge: React.FC<{frame: number; children?: React.ReactNode}> = ({frame, children}) => {
  const id = useId().replace(/:/g, '');
  const hum = 0.9 + 0.1 * noise1(frame * 0.5, 4);
  return (
    <AbsoluteFill style={{background: '#02040a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 300, top: 120, width: 1320, height: 420, overflow: 'hidden', opacity: 0.95}}>
        <div style={{position: 'absolute', left: -300, top: -120, width: 1920, height: 1080}}>
          <Starfield seed="bridge" brightness={0.9} nebula="blue" />
          <div style={{position: 'absolute', left: 1250, top: 760}}>
            <Planet kind="earth" radius={520} rotation={100 + frame * 0.01} sunAngle={200} litFraction={0.45} damage={0.35} />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 420 + i * 230 - frame * 0.15, top: 300 + i * 40, width: 110, height: 14, background: 'linear-gradient(90deg, #4fa8ff 0%, #2a3644 15%, #3a4756 100%)', opacity: 0.8, borderRadius: 2}} />
          ))}
        </div>
      </div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id={`${id}-deck`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c131b" />
            <stop offset="100%" stopColor="#030508" />
          </linearGradient>
          <radialGradient id={`${id}-holo`}>
            <stop offset="0%" stopColor="#6fc3ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* viewport frame */}
        <rect x={0} y={0} width={1920} height={120} fill="#05080c" />
        <polygon points="0,120 300,120 300,540 0,540" fill="#070b10" />
        <polygon points="1620,120 1920,120 1920,540 1620,540" fill="#070b10" />
        {[...Array(6)].map((_, i) => (
          <rect key={i} x={300 + i * 264} y={120} width={3} height={420} fill="#0e1620" />
        ))}
        {/* deck */}
        <polygon points="0,540 1920,540 1920,1080 0,1080" fill={`url(#${id}-deck)`} />
        <line x1={0} y1={540} x2={1920} y2={540} stroke="#1a2430" strokeWidth="2" />
        {/* holographic strategy table */}
        <ellipse cx={960} cy={900} rx={520} ry={70} fill="#0a1017" stroke="#1d2a36" strokeWidth="2" />
        <ellipse cx={960} cy={880} rx={520} ry={120} fill={`url(#${id}-holo)`} opacity={hum} />
        {/* holographic galaxy: faint spiral of points and the relay web */}
        {[...Array(140)].map((_, i) => {
          const a = i * 0.34;
          const r = 20 + i * 3.4;
          const x = 960 + Math.cos(a + frame * 0.002) * r;
          const y = 860 + Math.sin(a + frame * 0.002) * r * 0.28 - i * 0.2;
          return <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 2 : 1.2} fill={i % 11 === 0 ? '#ff8a1f' : '#9fd4ff'} opacity={0.6 * hum} />;
        })}
        {[...Array(8)].map((_, i) => (
          <line key={`l${i}`} x1={960 + Math.cos(i) * 300} y1={860 + Math.sin(i) * 80} x2={960 + Math.cos(i + 2) * 420} y2={860 + Math.sin(i + 2) * 110} stroke="#6fc3ff" strokeWidth="1" opacity={0.25 * hum} />
        ))}
        {/* console readouts */}
        {[...Array(5)].map((_, i) => (
          <g key={`c${i}`} opacity={0.5 + 0.2 * Math.sin(frame * 0.1 + i)}>
            <rect x={120 + i * 360} y={620} width={200} height={70} fill="#070b10" stroke="#1e5fa8" strokeWidth="1" />
            <rect x={130 + i * 360} y={632} width={120 + 40 * Math.sin(frame * 0.05 + i)} height={6} fill="#4fa8ff" opacity="0.7" />
            <rect x={130 + i * 360} y={648} width={90 + 30 * Math.sin(frame * 0.07 + i * 2)} height={6} fill="#ff8a1f" opacity="0.6" />
            <rect x={130 + i * 360} y={664} width={150} height={4} fill="#6fc3ff" opacity="0.3" />
          </g>
        ))}
        <text x={1200} y={580} fill="#6fc3ff" fontFamily={FONTS.ui} fontSize="18" letterSpacing="5" opacity="0.7">
          FLAG BRIDGE — FIFTH FLEET
        </text>
      </svg>
      {children}
    </AbsoluteFill>
  );
};
