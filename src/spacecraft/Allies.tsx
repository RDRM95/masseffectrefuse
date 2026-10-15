import React, {useId} from 'react';
import {path, pts, Pt, taperedCurve} from './svgUtil';

/**
 * Allied warships of the other factions. Side profile, nose +x.
 * - Cerberus Black Fleet cruiser: white hull, orange/black accents, swept dorsal fin.
 * - Geth dreadnought: curved insectoid hull with forward mandibles and a pale eye aperture.
 * - Quarian liveship / heavy cruiser: bulbous ribbed hull, violet-grey.
 * - Asari cruiser: elegant curved blades, violet-blue, white lights.
 */

interface Props {
  scale?: number;
  thrust?: number;
  opacity?: number;
  flip?: boolean;
  muzzle?: number;
  damage?: number;
}

const Plume: React.FC<{id: string; x: number; y: number; thrust: number; color?: string; rx?: number; ry?: number}> = ({id, x, y, thrust, rx = 60, ry = 12}) => (
  <ellipse cx={x - 20 * thrust} cy={y} rx={rx * thrust + 12} ry={ry} fill={`url(#${id}-plume)`} opacity={0.5 + 0.5 * thrust} />
);

const CommonDefs: React.FC<{id: string; plume?: string; muzzle?: string}> = ({id, plume = '#5fb3ff', muzzle = '#bfe3ff'}) => (
  <defs>
    <radialGradient id={`${id}-plume`}>
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
      <stop offset="35%" stopColor={plume} stopOpacity="0.6" />
      <stop offset="100%" stopColor={plume} stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${id}-muzzle`}>
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="40%" stopColor={muzzle} stopOpacity="0.8" />
      <stop offset="100%" stopColor={muzzle} stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${id}-fire`}>
      <stop offset="0%" stopColor="#fff2cc" />
      <stop offset="40%" stopColor="#ff8a1f" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#7a2a00" stopOpacity="0" />
    </radialGradient>
  </defs>
);

export const CerberusCruiser: React.FC<Props> = ({scale = 1, thrust = 0.8, opacity = 1, flip = false, muzzle = 0, damage = 0}) => {
  const id = useId().replace(/:/g, '');
  const hull: Pt[] = [[340, 0], [310, -12], [220, -24], [60, -32], [-160, -34], [-280, -30], [-320, -22], [-320, 22], [-280, 30], [-160, 34], [60, 32], [220, 24], [310, 12]];
  const fin: Pt[] = [[-40, -32], [-80, -80], [-200, -120], [-260, -122], [-230, -90], [-160, -60], [-130, -32]];
  const lowerFin: Pt[] = [[-60, 32], [-120, 70], [-240, 90], [-230, 66], [-160, 48], [-130, 32]];
  return (
    <svg width={760 * scale} height={320 * scale} viewBox="-380 -160 760 320" style={{position: 'absolute', left: -380 * scale, top: -160 * scale, overflow: 'visible', opacity}}>
      <CommonDefs id={id} plume="#7cc4ff" muzzle="#ffd9b0" />
      <defs>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3f5f8" />
          <stop offset="55%" stopColor="#cfd6df" />
          <stop offset="100%" stopColor="#6b7684" />
        </linearGradient>
      </defs>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <Plume id={id} x={-330} y={-8} thrust={thrust} rx={50} ry={9} />
        <Plume id={id} x={-330} y={10} thrust={thrust} rx={50} ry={9} />
        <polygon points={pts(fin)} fill={`url(#${id}-hull)`} stroke="#2a2f36" strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points={pts(lowerFin)} fill={`url(#${id}-hull)`} stroke="#2a2f36" strokeWidth="1.3" strokeLinejoin="round" />
        <polygon points={pts(hull)} fill={`url(#${id}-hull)`} stroke="#2a2f36" strokeWidth="1.6" strokeLinejoin="round" />
        {/* black and orange livery */}
        <polygon points={pts([[220, -24], [60, -32], [60, -20], [220, -14]])} fill="#1b1f26" />
        <polygon points={pts([[-160, -2], [280, -2], [280, 4], [-160, 4]])} fill="#ff8a1f" opacity="0.95" />
        <polygon points={pts([[-250, -100], [-180, -70], [-200, -64], [-250, -92]])} fill="#ff8a1f" opacity="0.9" />
        <polygon points={pts([[-300, 14], [-200, 14], [-200, 24], [-300, 24]])} fill="#1b1f26" />
        {/* Cerberus emblem (abstracted hexagon) */}
        <polygon points={pts([[-40, -16], [-28, -22], [-16, -16], [-16, -4], [-28, 2], [-40, -4]])} fill="#ff8a1f" opacity="0.9" />
        {[-240, -120, 20, 160, 260].map((x) => (
          <rect key={x} x={x} y={12} width={16} height={2.5} fill="#ffd9b0" opacity="0.8" />
        ))}
        <circle cx={336} cy={0} r={1.8} fill="#ff6b57" />
        {muzzle > 0 ? <circle cx={354} cy={0} r={44 * muzzle + 8} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
        {damage > 0 ? <circle cx={-60} cy={0} r={60} fill={`url(#${id}-fire)`} opacity={damage} /> : null}
      </g>
    </svg>
  );
};

export const GethDreadnought: React.FC<Props> = ({scale = 1, thrust = 0.8, opacity = 1, flip = false, muzzle = 0}) => {
  const id = useId().replace(/:/g, '');
  const body = `M-420 -20 C-380 -110 -120 -140 120 -120 C260 -108 330 -70 360 -30 C370 -10 370 10 360 30 C330 70 260 108 120 120 C-120 140 -380 110 -420 20 Z`;
  return (
    <svg width={1000 * scale} height={440 * scale} viewBox="-500 -220 1000 440" style={{position: 'absolute', left: -500 * scale, top: -220 * scale, overflow: 'visible', opacity}}>
      <CommonDefs id={id} plume="#9fd4ff" muzzle="#dff6ff" />
      <defs>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9d3dd" />
          <stop offset="55%" stopColor="#7d8a98" />
          <stop offset="100%" stopColor="#2c333d" />
        </linearGradient>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#bfe9ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4fa8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <Plume id={id} x={-420} y={0} thrust={thrust} rx={70} ry={26} />
        {/* mandibles */}
        <path d={taperedCurve([280, -70], [420, -120], [500, -40], 30, 6)} fill={`url(#${id}-hull)`} stroke="#1a1f26" strokeWidth="1.4" />
        <path d={taperedCurve([280, 70], [420, 120], [500, 40], 30, 6)} fill={`url(#${id}-hull)`} stroke="#1a1f26" strokeWidth="1.4" />
        <path d={body} fill={`url(#${id}-hull)`} stroke="#1a1f26" strokeWidth="1.8" />
        {/* ribs */}
        {[-300, -200, -100, 0, 100, 200].map((x) => (
          <path key={x} d={`M${x} -112 Q${x + 20} 0 ${x} 112`} fill="none" stroke="#1a1f26" strokeWidth="1.2" opacity="0.7" />
        ))}
        {/* glowing seams */}
        <path d="M-380 -10 C-200 -60 100 -70 340 -20" fill="none" stroke="#bfe9ff" strokeWidth="2" opacity="0.6" />
        <path d="M-380 10 C-200 60 100 70 340 20" fill="none" stroke="#bfe9ff" strokeWidth="2" opacity="0.4" />
        {/* eye */}
        <circle cx={300} cy={0} r={46} fill={`url(#${id}-eye)`} />
        <circle cx={300} cy={0} r={14} fill="#ffffff" />
        {muzzle > 0 ? <circle cx={520} cy={0} r={60 * muzzle + 10} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
      </g>
    </svg>
  );
};

export const QuarianCruiser: React.FC<Props> = ({scale = 1, thrust = 0.8, opacity = 1, flip = false}) => {
  const id = useId().replace(/:/g, '');
  const body = `M-360 0 C-360 -80 -220 -120 -40 -124 C160 -126 330 -80 380 -10 C390 0 390 0 380 10 C330 80 160 126 -40 124 C-220 120 -360 80 -360 0 Z`;
  return (
    <svg width={900 * scale} height={360 * scale} viewBox="-450 -180 900 360" style={{position: 'absolute', left: -450 * scale, top: -180 * scale, overflow: 'visible', opacity}}>
      <CommonDefs id={id} plume="#c9b3ff" />
      <defs>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a8fb3" />
          <stop offset="50%" stopColor="#5a516e" />
          <stop offset="100%" stopColor="#241f30" />
        </linearGradient>
      </defs>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <Plume id={id} x={-360} y={-40} thrust={thrust} rx={50} ry={14} />
        <Plume id={id} x={-360} y={40} thrust={thrust} rx={50} ry={14} />
        <path d={body} fill={`url(#${id}-hull)`} stroke="#15111d" strokeWidth="1.8" />
        {[-280, -200, -120, -40, 40, 120, 200, 280].map((x) => (
          <path key={x} d={`M${x} -118 Q${x + 10} 0 ${x} 118`} fill="none" stroke="#15111d" strokeWidth="2.2" opacity="0.8" />
        ))}
        <path d="M-300 -30 L320 -24" stroke="#d7c8ff" strokeWidth="2" opacity="0.5" />
        {[-240, -160, -80, 0, 80, 160, 240].map((x) => (
          <circle key={x} cx={x} cy={40} r={2.6} fill="#e7dcff" opacity="0.85" />
        ))}
        <circle cx={384} cy={0} r={2} fill="#ff6b57" />
      </g>
    </svg>
  );
};

export const AsariCruiser: React.FC<Props> = ({scale = 1, thrust = 0.8, opacity = 1, flip = false, muzzle = 0}) => {
  const id = useId().replace(/:/g, '');
  const body = `M420 0 C380 -22 220 -40 40 -44 C-160 -46 -300 -34 -380 -14 C-400 -6 -400 6 -380 14 C-300 34 -160 46 40 44 C220 40 380 22 420 0 Z`;
  return (
    <svg width={960 * scale} height={360 * scale} viewBox="-480 -180 960 360" style={{position: 'absolute', left: -480 * scale, top: -180 * scale, overflow: 'visible', opacity}}>
      <CommonDefs id={id} plume="#b48cff" muzzle="#e3d4ff" />
      <defs>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a7b4e8" />
          <stop offset="50%" stopColor="#4a4f9a" />
          <stop offset="100%" stopColor="#1e1f4a" />
        </linearGradient>
      </defs>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <Plume id={id} x={-390} y={0} thrust={thrust} rx={60} ry={12} />
        {/* curved fins */}
        <path d={taperedCurve([-60, -36], [-200, -120], [-380, -150], 40, 6)} fill={`url(#${id}-hull)`} stroke="#141533" strokeWidth="1.4" />
        <path d={taperedCurve([-60, 36], [-200, 120], [-380, 150], 40, 6)} fill={`url(#${id}-hull)`} stroke="#141533" strokeWidth="1.4" />
        <path d={body} fill={`url(#${id}-hull)`} stroke="#141533" strokeWidth="1.8" />
        <path d="M-360 -6 C-100 -30 200 -30 400 -4" fill="none" stroke="#e3d4ff" strokeWidth="1.6" opacity="0.6" />
        {[-300, -200, -100, 0, 100, 200, 300].map((x) => (
          <circle key={x} cx={x} cy={14} r={2.4} fill="#ffffff" opacity="0.8" />
        ))}
        <circle cx={416} cy={0} r={2} fill="#ff6b57" />
        {muzzle > 0 ? <circle cx={436} cy={0} r={44 * muzzle + 8} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
      </g>
    </svg>
  );
};

/** Small fighter streak used in squadrons (Alliance F-61 Trident style). */
export const Fighter: React.FC<{scale?: number; color?: string; opacity?: number}> = ({scale = 1, color = '#9fd4ff', opacity = 1}) => (
  <svg width={60 * scale} height={24 * scale} viewBox="-30 -12 60 24" style={{position: 'absolute', left: -30 * scale, top: -12 * scale, overflow: 'visible', opacity}}>
    <polygon points={pts([[28, 0], [10, -4], [-20, -10], [-26, -2], [-26, 2], [-20, 10], [10, 4]])} fill="#6b7a8c" stroke="#111820" strokeWidth="0.8" />
    <ellipse cx={-34} cy={0} rx={12} ry={2.4} fill={color} opacity="0.8" />
    <path d={path([[-26, -1], [-20, 0], [-26, 1]], true)} fill={color} />
  </svg>
);
