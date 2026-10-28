import React, {useId} from 'react';
import {path, pts, Pt} from './svgUtil';

/**
 * Turian Hierarchy warships. Side profile, nose +x. Angular predatory
 * geometry: a long blade-like prow, broad swept fins raking downward and aft,
 * a dorsal ridge and twin stern drives. Blue-grey armour with amber lights.
 */

const HULL_DARK = '#1a222c';
const HULL_MID = '#3b4a5a';
const HULL_LIGHT = '#7f91a6';
const AMBER = '#ffb347';

const Defs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={HULL_LIGHT} />
      <stop offset="45%" stopColor={HULL_MID} />
      <stop offset="100%" stopColor={HULL_DARK} />
    </linearGradient>
    <linearGradient id={`${id}-fin`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={HULL_MID} />
      <stop offset="100%" stopColor={HULL_DARK} />
    </linearGradient>
    <radialGradient id={`${id}-plume`}>
      <stop offset="0%" stopColor="#e8f4ff" stopOpacity="0.95" />
      <stop offset="35%" stopColor="#7cc4ff" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${id}-muzzle`}>
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="40%" stopColor="#ffe3b0" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${id}-fire`}>
      <stop offset="0%" stopColor="#fff2cc" />
      <stop offset="40%" stopColor="#ff8a1f" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#7a2a00" stopOpacity="0" />
    </radialGradient>
  </defs>
);

interface Props {
  scale?: number;
  thrust?: number;
  opacity?: number;
  flip?: boolean;
  muzzle?: number;
  damage?: number;
}

export const TurianDreadnought: React.FC<Props> = ({scale = 1, thrust = 0.8, opacity = 1, flip = false, muzzle = 0, damage = 0}) => {
  const id = useId().replace(/:/g, '');
  const hull: Pt[] = [[520, 0], [470, -14], [360, -30], [160, -44], [-120, -52], [-380, -50], [-470, -58], [-500, -36], [-500, 30], [-470, 50], [-380, 44], [-120, 48], [160, 40], [360, 28], [470, 12]];
  const ventralFin: Pt[] = [[-60, 46], [-200, 120], [-380, 210], [-450, 230], [-440, 190], [-330, 110], [-220, 60], [-180, 46]];
  const ventralFin2: Pt[] = [[120, 40], [60, 90], [-80, 140], [-120, 142], [-90, 100], [20, 60], [60, 40]];
  const dorsalFin: Pt[] = [[-120, -52], [-220, -120], [-380, -170], [-430, -176], [-410, -140], [-320, -96], [-250, -60], [-220, -52]];
  const prowBlades: Pt[] = [[380, -26], [440, -60], [500, -70], [470, -40], [420, -24]];
  const prowBladesB: Pt[] = [[380, 24], [440, 58], [500, 68], [470, 38], [420, 22]];
  return (
    <svg width={1150 * scale} height={520 * scale} viewBox="-575 -260 1150 520" style={{position: 'absolute', left: -575 * scale, top: -260 * scale, overflow: 'visible', opacity}}>
      <Defs id={id} />
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        {[-18, 16].map((y) => (
          <ellipse key={y} cx={-520 - 30 * thrust} cy={y} rx={70 * thrust + 16} ry={12} fill={`url(#${id}-plume)`} opacity={0.5 + 0.5 * thrust} />
        ))}
        <polygon points={pts(ventralFin)} fill={`url(#${id}-fin)`} stroke="#0d1218" strokeWidth="1.6" strokeLinejoin="round" />
        <polygon points={pts(dorsalFin)} fill={`url(#${id}-fin)`} stroke="#0d1218" strokeWidth="1.6" strokeLinejoin="round" />
        <polygon points={pts(ventralFin2)} fill={`url(#${id}-fin)`} stroke="#0d1218" strokeWidth="1.3" strokeLinejoin="round" />
        <polygon points={pts(hull)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points={pts(prowBlades)} fill={HULL_MID} stroke="#0d1218" strokeWidth="1.2" />
        <polygon points={pts(prowBladesB)} fill={HULL_DARK} stroke="#0d1218" strokeWidth="1.2" />
        {/* facets */}
        {[-380, -120, 160, 360].map((x) => (
          <path key={x} d={path([[x, -50], [x, 46]], false)} stroke="#0d1218" strokeWidth="1.2" />
        ))}
        <path d={path([[-470, -58], [470, -14]], false)} stroke={HULL_LIGHT} strokeWidth="1" opacity="0.6" />
        {/* amber lights */}
        {[-440, -330, -200, -40, 100, 260, 400].map((x) => (
          <g key={x}>
            <rect x={x} y={-6} width={26} height={3} fill={AMBER} opacity="0.85" />
            <rect x={x} y={-6} width={26} height={3} fill={AMBER} opacity="0.3" transform="scale(1 3)" />
          </g>
        ))}
        <rect x={-300} y={-30} width={120} height={5} fill={AMBER} opacity="0.5" />
        <circle cx={515} cy={0} r={2.2} fill={AMBER} />
        <circle cx={-440} cy={226} r={2.2} fill="#7cff9a" />
        <circle cx={-420} cy={-172} r={2.2} fill="#ff6b57" />
        {muzzle > 0 ? <circle cx={540} cy={0} r={60 * muzzle + 10} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
        {damage > 0 ? (
          <g opacity={damage}>
            <circle cx={-250} cy={0} r={80} fill={`url(#${id}-fire)`} />
            <circle cx={200} cy={-20} r={50} fill={`url(#${id}-fire)`} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};

export const TurianCruiser: React.FC<Props> = ({scale = 1, thrust = 0.8, opacity = 1, flip = false, muzzle = 0, damage = 0}) => {
  const id = useId().replace(/:/g, '');
  const hull: Pt[] = [[320, 0], [280, -10], [180, -22], [-60, -30], [-240, -30], [-300, -36], [-300, 26], [-240, 28], [-60, 30], [180, 24], [280, 10]];
  const fin: Pt[] = [[-40, 28], [-160, 90], [-270, 130], [-260, 100], [-180, 60], [-120, 30]];
  const dfin: Pt[] = [[-80, -30], [-180, -80], [-260, -100], [-240, -70], [-170, -42]];
  return (
    <svg width={700 * scale} height={320 * scale} viewBox="-350 -160 700 320" style={{position: 'absolute', left: -350 * scale, top: -160 * scale, overflow: 'visible', opacity}}>
      <Defs id={id} />
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <ellipse cx={-320 - 20 * thrust} cy={0} rx={50 * thrust + 12} ry={10} fill={`url(#${id}-plume)`} opacity={0.5 + 0.5 * thrust} />
        <polygon points={pts(fin)} fill={`url(#${id}-fin)`} stroke="#0d1218" strokeWidth="1.3" />
        <polygon points={pts(dfin)} fill={`url(#${id}-fin)`} stroke="#0d1218" strokeWidth="1.3" />
        <polygon points={pts(hull)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.6" strokeLinejoin="round" />
        {[-240, -60, 180].map((x) => (
          <path key={x} d={path([[x, -30], [x, 28]], false)} stroke="#0d1218" strokeWidth="1" />
        ))}
        {[-260, -160, -20, 120, 230].map((x) => (
          <rect key={x} x={x} y={-4} width={18} height={2.5} fill={AMBER} opacity="0.85" />
        ))}
        <circle cx={316} cy={0} r={1.8} fill={AMBER} />
        {muzzle > 0 ? <circle cx={334} cy={0} r={40 * muzzle + 8} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
        {damage > 0 ? <circle cx={-60} cy={0} r={60} fill={`url(#${id}-fire)`} opacity={damage} /> : null}
      </g>
    </svg>
  );
};
