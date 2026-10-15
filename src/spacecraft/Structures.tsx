import React, {useId} from 'react';
import {pts, Pt} from './svgUtil';

/**
 * Large structures: the mass relay, the Citadel (open, viewed down its axis)
 * and the Crucible. Scaled in local units; use `scale` to size in px.
 */

export const MassRelay: React.FC<{scale?: number; spin?: number; opacity?: number; glow?: number}> = ({scale = 1, spin = 0, opacity = 1, glow = 1}) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={1400 * scale} height={700 * scale} viewBox="-700 -350 1400 700" style={{position: 'absolute', left: -700 * scale, top: -350 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a97aa" />
          <stop offset="50%" stopColor="#3e4858" />
          <stop offset="100%" stopColor="#141a22" />
        </linearGradient>
        <radialGradient id={`${id}-core`}>
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#bfe9ff" />
          <stop offset="55%" stopColor="#3a9bff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* glow */}
      <circle cx={-60} cy={0} r={260 * glow + 60} fill={`url(#${id}-core)`} opacity={0.35 * glow} />
      {/* prongs */}
      <path d="M-120 -90 C 80 -260, 420 -300, 680 -170 L 660 -120 C 420 -230, 120 -200, -60 -60 Z" fill={`url(#${id}-metal)`} stroke="#0d1218" strokeWidth="2" />
      <path d="M-120 90 C 80 260, 420 300, 680 170 L 660 120 C 420 230, 120 200, -60 60 Z" fill={`url(#${id}-metal)`} stroke="#0d1218" strokeWidth="2" />
      {[0.15, 0.35, 0.55, 0.75, 0.92].map((t, i) => (
        <g key={i}>
          <rect x={-100 + t * 760} y={-250 + Math.pow(1 - t, 1.3) * 160 - 10} width={10} height={26} fill="#1b222c" transform={`rotate(${-18 + t * 30} ${-100 + t * 760} ${-250 + Math.pow(1 - t, 1.3) * 160})`} />
          <rect x={-100 + t * 760} y={250 - Math.pow(1 - t, 1.3) * 160 - 16} width={10} height={26} fill="#1b222c" transform={`rotate(${18 - t * 30} ${-100 + t * 760} ${250 - Math.pow(1 - t, 1.3) * 160})`} />
        </g>
      ))}
      {/* blue conduit lines on prongs */}
      <path d="M-90 -70 C 100 -210, 400 -250, 650 -140" fill="none" stroke="#6fc3ff" strokeWidth="3" opacity={0.7 * glow} />
      <path d="M-90 70 C 100 210, 400 250, 650 140" fill="none" stroke="#6fc3ff" strokeWidth="3" opacity={0.7 * glow} />
      {/* housing */}
      <polygon points={pts([[-160, -110], [-60, -130], [20, -90], [20, 90], [-60, 130], [-160, 110], [-260, 60], [-260, -60]])} fill={`url(#${id}-metal)`} stroke="#0d1218" strokeWidth="2" />
      <polygon points={pts([[-420, -40], [-260, -60], [-260, 60], [-420, 40], [-560, 20], [-560, -20]])} fill={`url(#${id}-metal)`} stroke="#0d1218" strokeWidth="2" />
      {/* core gyroscope */}
      <g transform={`translate(-70 0)`}>
        <circle r={70} fill={`url(#${id}-core)`} />
        {[0, 60, 120].map((a, i) => (
          <ellipse key={i} rx={110} ry={30} fill="none" stroke="#9fd4ff" strokeWidth="5" opacity={0.85} transform={`rotate(${a + spin * (i % 2 === 0 ? 1 : -1.3)})`} />
        ))}
        <circle r={34} fill="#ffffff" opacity={0.9} />
      </g>
    </svg>
  );
};

/**
 * The Citadel seen along its axis with the five Wards open: a central
 * Presidium ring and five long arms. Rotation animates the whole station.
 */
export const Citadel: React.FC<{scale?: number; rotation?: number; opacity?: number; withCrucible?: boolean}> = ({scale = 1, rotation = 0, opacity = 1, withCrucible = false}) => {
  const id = useId().replace(/:/g, '');
  const arm: Pt[] = [[-70, -80], [70, -80], [95, -520], [40, -640], [-40, -640], [-95, -520]];
  return (
    <svg width={1400 * scale} height={1400 * scale} viewBox="-700 -700 1400 1400" style={{position: 'absolute', left: -700 * scale, top: -700 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-arm`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b4656" />
          <stop offset="50%" stopColor="#8d9cb0" />
          <stop offset="100%" stopColor="#2a3340" />
        </linearGradient>
        <radialGradient id={`${id}-ring`}>
          <stop offset="70%" stopColor="#2a3340" />
          <stop offset="86%" stopColor="#9fb0c4" />
          <stop offset="100%" stopColor="#3b4656" />
        </radialGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#dff3ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4fa8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`rotate(${rotation})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <polygon points={pts(arm)} fill={`url(#${id}-arm)`} stroke="#0d1218" strokeWidth="2" />
            {[...Array(14)].map((_, i) => (
              <rect key={i} x={-52 + (i % 2) * 60} y={-600 + i * 36} width={44} height={6} fill="#ffe3b0" opacity={0.35 + 0.4 * ((i * 7) % 3 === 0 ? 1 : 0.3)} />
            ))}
            <rect x={-6} y={-620} width={12} height={520} fill="#1a2230" opacity="0.7" />
          </g>
        ))}
        <circle r={160} fill={`url(#${id}-ring)`} stroke="#0d1218" strokeWidth="2" />
        <circle r={112} fill="#0b1018" stroke="#5f6f84" strokeWidth="3" />
        <circle r={100} fill="none" stroke="#9fd4ff" strokeWidth="2" opacity="0.6" />
        {[...Array(24)].map((_, i) => (
          <rect key={i} x={-3} y={-150} width={6} height={10} fill="#ffe3b0" opacity="0.8" transform={`rotate(${i * 15})`} />
        ))}
        <circle r={40} fill={`url(#${id}-glow)`} opacity="0.7" />
      </g>
      {withCrucible ? (
        <g>
          <polygon points={pts([[-30, 0], [30, 0], [60, 400], [90, 520], [0, 560], [-90, 520], [-60, 400]])} fill="#4a5668" stroke="#0d1218" strokeWidth="2" opacity="0.98" />
          <polygon points={pts([[-16, 120], [16, 120], [16, 480], [-16, 480]])} fill="#8fe8ff" opacity="0.55" />
          {[160, 220, 280, 340, 400, 460].map((y) => (
            <rect key={y} x={-44 - (y - 160) * 0.06} y={y} width={88 + (y - 160) * 0.12} height={10} fill="#2a3340" stroke="#0d1218" />
          ))}
        </g>
      ) : null}
    </svg>
  );
};

/**
 * The Crucible on its own, side view: long articulated spine culminating in a
 * flared bell that docks with the Citadel. Nose (docking end) points +x.
 */
export const Crucible: React.FC<{scale?: number; opacity?: number; charge?: number}> = ({scale = 1, opacity = 1, charge = 0.35}) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={1400 * scale} height={600 * scale} viewBox="-700 -300 1400 600" style={{position: 'absolute', left: -700 * scale, top: -300 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9aa8bb" />
          <stop offset="50%" stopColor="#4a5668" />
          <stop offset="100%" stopColor="#1a222c" />
        </linearGradient>
      </defs>
      {/* spine */}
      <rect x={-680} y={-40} width={900} height={80} fill={`url(#${id}-metal)`} stroke="#0d1218" strokeWidth="2" />
      <rect x={-680} y={-10} width={900} height={20} fill="#8fe8ff" opacity={0.15 + charge * 0.6} />
      {[...Array(11)].map((_, i) => (
        <g key={i}>
          <rect x={-640 + i * 84} y={-90} width={40} height={180} fill="#2a3340" stroke="#0d1218" strokeWidth="1.5" />
          <rect x={-634 + i * 84} y={-84} width={28} height={168} fill="none" stroke="#6fc3ff" strokeWidth="1.5" opacity={0.25 + charge * 0.5} />
        </g>
      ))}
      {/* bell */}
      <polygon points={pts([[220, -60], [420, -180], [620, -260], [680, -220], [620, -100], [600, 0], [620, 100], [680, 220], [620, 260], [420, 180], [220, 60]])} fill={`url(#${id}-metal)`} stroke="#0d1218" strokeWidth="2" />
      <polygon points={pts([[260, -40], [560, -170], [560, 170], [260, 40]])} fill="#0b1018" opacity="0.9" />
      <ellipse cx={560} cy={0} rx={30} ry={170} fill="#8fe8ff" opacity={0.2 + charge * 0.5} />
      {[...Array(9)].map((_, i) => (
        <rect key={i} x={300 + i * 32} y={-150 - i * 10} width={6} height={300 + i * 20} fill="#4a5668" stroke="#0d1218" strokeWidth="1" />
      ))}
    </svg>
  );
};
