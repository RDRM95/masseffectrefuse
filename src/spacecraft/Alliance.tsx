import React, {useId} from 'react';
import {path, pts, Pt} from './svgUtil';
import {COLORS} from '../theme';

/**
 * Systems Alliance warships. Side profile, nose pointing +x, drawn in a local
 * space where the dreadnought is ~1000 units long. Scale with the `scale` prop.
 *
 * Design language: long faceted hull, raised angular bridge superstructure in
 * the aft third, spinal mass accelerator running the full length, stacked
 * rectangular thruster housings with blue drive glow, GARDIAN turret blisters,
 * white/blue running lights.
 */

const HULL_DARK = '#1c2430';
const HULL_MID = '#3a4756';
const HULL_LIGHT = '#6d7c90';
const HULL_PANEL = '#4b5a6c';
const STRIPE = '#d9e4f2';

interface ShipProps {
  scale?: number;
  /** Engine glow 0..1 */
  thrust?: number;
  /** Lighting from above-right (default) or flipped */
  lightFromLeft?: boolean;
  opacity?: number;
  /** Mirror horizontally (nose to -x). */
  flip?: boolean;
  /** Firing flash intensity 0..1 at the muzzle. */
  muzzle?: number;
  damage?: number;
}

const Engines: React.FC<{x: number; ys: number[]; w: number; h: number; thrust: number; id: string}> = ({x, ys, w, h, thrust, id}) => (
  <g>
    {ys.map((y, i) => (
      <g key={i}>
        <rect x={x - w} y={y - h / 2} width={w} height={h} fill="#0e141c" stroke="#55657a" strokeWidth="1.2" />
        <rect x={x - w + 3} y={y - h / 2 + 3} width={w - 6} height={h - 6} fill={`url(#${id}-nozzle)`} opacity={0.35 + thrust * 0.65} />
        {/* drive plume */}
        <ellipse cx={x - w - 20 * thrust - 10} cy={y} rx={60 * thrust + 14} ry={h * 0.42} fill={`url(#${id}-plume)`} opacity={0.4 + 0.6 * thrust} />
      </g>
    ))}
  </g>
);

const Defs: React.FC<{id: string; lightFromLeft: boolean}> = ({id, lightFromLeft}) => (
  <defs>
    <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={HULL_LIGHT} />
      <stop offset="40%" stopColor={HULL_MID} />
      <stop offset="100%" stopColor={HULL_DARK} />
    </linearGradient>
    <linearGradient id={`${id}-hullx`} x1={lightFromLeft ? '1' : '0'} y1="0" x2={lightFromLeft ? '0' : '1'} y2="0">
      <stop offset="0%" stopColor={HULL_DARK} />
      <stop offset="100%" stopColor={HULL_PANEL} />
    </linearGradient>
    <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#8f9fb4" />
      <stop offset="100%" stopColor={HULL_PANEL} />
    </linearGradient>
    <radialGradient id={`${id}-nozzle`}>
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="35%" stopColor="#9fd4ff" />
      <stop offset="100%" stopColor="#2a7fd8" />
    </radialGradient>
    <radialGradient id={`${id}-plume`}>
      <stop offset="0%" stopColor="#cfeaff" stopOpacity="0.9" />
      <stop offset="30%" stopColor="#5fb3ff" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${id}-muzzle`}>
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="40%" stopColor="#bfe3ff" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#4fa8ff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${id}-fire`}>
      <stop offset="0%" stopColor="#fff2cc" />
      <stop offset="40%" stopColor="#ff8a1f" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#7a2a00" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Turret: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-7} y={-5} width={14} height={6} fill="#5d6c80" stroke="#1a222c" strokeWidth="0.8" />
    <rect x={-2} y={-9} width={10} height={2.4} fill="#7d8ca0" />
  </g>
);

const Light: React.FC<{x: number; y: number; c?: string; r?: number}> = ({x, y, c = '#dff3ff', r = 1.6}) => (
  <>
    <circle cx={x} cy={y} r={r * 3} fill={c} opacity="0.18" />
    <circle cx={x} cy={y} r={r} fill={c} />
  </>
);

export const AllianceDreadnought: React.FC<ShipProps> = ({scale = 1, thrust = 0.8, lightFromLeft = false, opacity = 1, flip = false, muzzle = 0, damage = 0}) => {
  const id = useId().replace(/:/g, '');
  // Hammerhead bow, narrow neck, long faceted body, flared stern.
  const hull: Pt[] = [
    [500, -26], [486, -54], [430, -60], [392, -38], [300, -40], [-60, -44], [-330, -48], [-430, -58], [-500, -68],
    [-500, 68], [-430, 56], [-330, 48], [-60, 46], [300, 42], [392, 38], [430, 60], [486, 52], [500, 26],
  ];
  const bowFace: Pt[] = [[500, -26], [500, 26], [486, 52], [470, 30], [470, -30], [486, -54]];
  const spine: Pt[] = [[496, -12], [440, -40], [300, -46], [-60, -50], [-330, -54], [-420, -62], [-420, -48], [-330, -44], [-60, -40], [300, -36], [440, -30], [496, -2]];
  const hangar: Pt[] = [[-310, 20], [-120, 20], [-120, 34], [-310, 34]];
  const bridge: Pt[] = [[-140, -46], [-120, -96], [-70, -124], [40, -126], [90, -98], [120, -46]];
  const bridge2: Pt[] = [[-60, -124], [-40, -150], [20, -152], [40, -124]];
  const forwardFin: Pt[] = [[210, -40], [230, -72], [300, -74], [330, -40]];
  const keel: Pt[] = [[-230, 46], [-200, 92], [140, 100], [230, 46]];
  const keel2: Pt[] = [[-120, 100], [-100, 122], [60, 124], [90, 100]];
  const sideStripe: Pt[] = [[-380, -8], [430, -6], [430, 0], [-380, 2]];

  return (
    <svg width={1100 * scale} height={360 * scale} viewBox="-560 -180 1100 360" style={{position: 'absolute', left: -550 * scale, top: -180 * scale, overflow: 'visible', opacity}}>
      <Defs id={id} lightFromLeft={lightFromLeft} />
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        {/* engines sit behind the hull */}
        <Engines id={id} x={-500} ys={[-40, 0, 40]} w={28} h={30} thrust={thrust} />
        <Engines id={id} x={-494} ys={[-70, 70]} w={16} h={14} thrust={thrust * 0.7} />
        {/* keel */}
        <polygon points={pts(keel)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.5" />
        <polygon points={pts(keel2)} fill={HULL_DARK} stroke="#0d1218" strokeWidth="1.2" />
        {/* main hull */}
        <polygon points={pts(hull)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points={pts(bowFace)} fill={`url(#${id}-hullx)`} stroke="#0d1218" strokeWidth="1.2" />
        <circle cx={492} cy={0} r={7} fill="#05080c" stroke="#55657a" strokeWidth="1.2" />
        <polygon points={pts(hangar)} fill="#0e141c" stroke="#55657a" strokeWidth="0.8" />
        {[...Array(8)].map((_, i) => (
          <rect key={`hb${i}`} x={-300 + i * 24} y={23} width={10} height={8} fill="#9fe0ff" opacity="0.35" />
        ))}
        <path d={path([[392, -38], [392, 38]], false)} stroke="#121922" strokeWidth="1.4" />
        <path d={path([[-470, -40], [-440, -40], [-440, 40], [-470, 40]], false)} stroke="#121922" strokeWidth="1" fill="none" />
        {/* antenna masts */}
        <path d={path([[-20, -152], [-20, -176]], false)} stroke="#9fb0c4" strokeWidth="1.5" />
        <path d={path([[-90, -124], [-90, -140]], false)} stroke="#9fb0c4" strokeWidth="1.2" />
        {/* panel facets */}
        <path d={path([[-430, -56], [-430, 54]], false)} stroke="#121922" strokeWidth="1.4" />
        <path d={path([[-330, -48], [-330, 48]], false)} stroke="#121922" strokeWidth="1.2" />
        <path d={path([[-60, -44], [-60, 46]], false)} stroke="#121922" strokeWidth="1.2" />
        <path d={path([[300, -40], [300, 44]], false)} stroke="#121922" strokeWidth="1.2" />
        <path d={path([[430, -34], [430, 36]], false)} stroke="#121922" strokeWidth="1.2" />
        {[-400, -300, -200, -100, 0, 100, 200].map((x) => (
          <rect key={x} x={x} y={14} width={60} height={14} fill={HULL_PANEL} opacity="0.55" stroke="#121922" strokeWidth="0.6" />
        ))}
        {/* hull stripe (Alliance livery) */}
        <polygon points={pts(sideStripe)} fill={STRIPE} opacity="0.75" />
        <rect x={-300} y={-30} width={120} height={8} fill={COLORS.allianceBlueDim} opacity="0.8" />
        <rect x={60} y={-30} width={220} height={8} fill={COLORS.allianceBlueDim} opacity="0.8" />
        {/* spinal mass accelerator ridge */}
        <polygon points={pts(spine)} fill={`url(#${id}-top)`} stroke="#0d1218" strokeWidth="1" />
        {/* bridge superstructure */}
        <polygon points={pts(bridge)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.5" />
        <polygon points={pts(bridge2)} fill={HULL_MID} stroke="#0d1218" strokeWidth="1.2" />
        <rect x={-50} y={-110} width={90} height={5} fill="#9fe0ff" opacity="0.7" />
        <polygon points={pts(forwardFin)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.2" />
        {/* GARDIAN turrets */}
        <Turret x={-250} y={-48} />
        <Turret x={-160} y={-48} />
        <Turret x={160} y={-42} />
        <Turret x={350} y={-40} s={0.8} />
        <Turret x={-150} y={92} s={0.9} />
        <Turret x={60} y={96} s={0.9} />
        {/* running lights */}
        {[-470, -380, -250, -120, 20, 160, 300, 420].map((x) => (
          <Light key={x} x={x} y={-2} c="#dff3ff" r={1.4} />
        ))}
        <Light x={495} y={0} c="#ff6b57" r={1.8} />
        <Light x={-10} y={-150} c="#9fe0ff" r={1.8} />
        <Light x={-60} y={126} c="#ff6b57" r={1.3} />
        {/* muzzle */}
        {muzzle > 0 ? <circle cx={520} cy={0} r={60 * muzzle + 10} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
        {damage > 0 ? (
          <g opacity={damage}>
            <circle cx={-200} cy={-10} r={70} fill={`url(#${id}-fire)`} />
            <circle cx={120} cy={40} r={50} fill={`url(#${id}-fire)`} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};

export const AllianceCruiser: React.FC<ShipProps> = ({scale = 1, thrust = 0.8, lightFromLeft = false, opacity = 1, flip = false, muzzle = 0, damage = 0}) => {
  const id = useId().replace(/:/g, '');
  const hull: Pt[] = [
    [300, -3], [286, -16], [240, -24], [120, -28], [-170, -30], [-270, -36], [-300, -40], [-300, 32], [-270, 34], [-170, 30], [120, 28], [240, 24], [286, 14], [300, 3],
  ];
  const bridge: Pt[] = [[-90, -30], [-70, -64], [-10, -72], [40, -62], [60, -30]];
  const spine: Pt[] = [[290, -8], [240, -26], [-170, -34], [-260, -40], [-260, -30], [-170, -26], [240, -20]];
  const keel: Pt[] = [[-150, 30], [-120, 56], [90, 58], [140, 30]];
  return (
    <svg width={700 * scale} height={220 * scale} viewBox="-350 -110 700 220" style={{position: 'absolute', left: -350 * scale, top: -110 * scale, overflow: 'visible', opacity}}>
      <Defs id={id} lightFromLeft={lightFromLeft} />
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <Engines id={id} x={-300} ys={[-18, 14]} w={20} h={22} thrust={thrust} />
        <polygon points={pts(keel)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.3" />
        <polygon points={pts(hull)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.6" strokeLinejoin="round" />
        {[-270, -170, 120, 240].map((x) => (
          <path key={x} d={path([[x, -30], [x, 30]], false)} stroke="#121922" strokeWidth="1.1" />
        ))}
        <rect x={-200} y={-4} width={430} height={5} fill={STRIPE} opacity="0.7" />
        <rect x={-120} y={-18} width={160} height={6} fill={COLORS.allianceBlueDim} opacity="0.8" />
        <polygon points={pts(spine)} fill={`url(#${id}-top)`} stroke="#0d1218" strokeWidth="0.9" />
        <polygon points={pts(bridge)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.3" />
        <rect x={-50} y={-56} width={60} height={3.5} fill="#9fe0ff" opacity="0.7" />
        <Turret x={-200} y={-32} s={0.8} />
        <Turret x={150} y={-28} s={0.8} />
        <Turret x={0} y={56} s={0.7} />
        {[-240, -120, 20, 160, 260].map((x) => (
          <Light key={x} x={x} y={0} r={1.2} />
        ))}
        <Light x={296} y={0} c="#ff6b57" r={1.4} />
        {muzzle > 0 ? <circle cx={314} cy={0} r={40 * muzzle + 8} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
        {damage > 0 ? <circle cx={-60} cy={0} r={60} fill={`url(#${id}-fire)`} opacity={damage} /> : null}
      </g>
    </svg>
  );
};

export const AllianceFrigate: React.FC<ShipProps> = ({scale = 1, thrust = 0.8, lightFromLeft = false, opacity = 1, flip = false}) => {
  const id = useId().replace(/:/g, '');
  const hull: Pt[] = [[160, 0], [140, -10], [60, -16], [-120, -18], [-160, -24], [-160, 18], [-120, 16], [60, 14], [140, 9]];
  const fin: Pt[] = [[-60, -18], [-50, -40], [-10, -42], [10, -18]];
  return (
    <svg width={400 * scale} height={140 * scale} viewBox="-200 -70 400 140" style={{position: 'absolute', left: -200 * scale, top: -70 * scale, overflow: 'visible', opacity}}>
      <Defs id={id} lightFromLeft={lightFromLeft} />
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <Engines id={id} x={-160} ys={[0]} w={14} h={18} thrust={thrust} />
        <polygon points={pts(hull)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.3" />
        <polygon points={pts(fin)} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1" />
        <rect x={-110} y={-2} width={230} height={3} fill={STRIPE} opacity="0.7" />
        <Light x={156} y={0} c="#ff6b57" r={1.2} />
        <Light x={-30} y={-42} c="#9fe0ff" r={1.2} />
      </g>
    </svg>
  );
};

/**
 * Orbital defence platform mounting a hyper-mass accelerator: a kilometre-long
 * barrel wrapped in cooling fins and accelerator coils, with a station module
 * amidships and radiator panels. Barrel points +x.
 */
export const DefencePlatform: React.FC<{scale?: number; charge?: number; muzzle?: number; opacity?: number}> = ({scale = 1, charge = 0, muzzle = 0, opacity = 1}) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={1400 * scale} height={400 * scale} viewBox="-700 -200 1400 400" style={{position: 'absolute', left: -700 * scale, top: -200 * scale, overflow: 'visible', opacity}}>
      <Defs id={id} lightFromLeft={false} />
      <defs>
        <linearGradient id={`${id}-barrel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c8ba0" />
          <stop offset="50%" stopColor="#3c4958" />
          <stop offset="100%" stopColor="#151c25" />
        </linearGradient>
      </defs>
      {/* radiator panels */}
      <rect x={-520} y={-150} width={260} height={28} fill="#1a2634" stroke="#0d1218" strokeWidth="1" />
      <rect x={-520} y={122} width={260} height={28} fill="#1a2634" stroke="#0d1218" strokeWidth="1" />
      {[...Array(12)].map((_, i) => (
        <g key={i}>
          <rect x={-515 + i * 21} y={-148} width={3} height={24} fill="#ff8a1f" opacity={0.25 + 0.5 * charge} />
          <rect x={-515 + i * 21} y={124} width={3} height={24} fill="#ff8a1f" opacity={0.25 + 0.5 * charge} />
        </g>
      ))}
      <rect x={-400} y={-122} width={24} height={244} fill="#2a3644" stroke="#0d1218" />
      {/* station module */}
      <polygon points={pts([[-560, -70], [-520, -110], [-240, -110], [-200, -70], [-200, 70], [-240, 110], [-520, 110], [-560, 70]])} fill={`url(#${id}-hull)`} stroke="#0d1218" strokeWidth="1.6" />
      <rect x={-500} y={-20} width={240} height={6} fill={STRIPE} opacity="0.7" />
      <rect x={-480} y={-60} width={60} height={10} fill="#9fe0ff" opacity="0.6" />
      <rect x={-380} y={-60} width={60} height={10} fill="#9fe0ff" opacity="0.6" />
      {/* barrel */}
      <rect x={-220} y={-34} width={900} height={68} fill={`url(#${id}-barrel)`} stroke="#0d1218" strokeWidth="1.6" />
      {[...Array(16)].map((_, i) => (
        <g key={i}>
          <rect x={-200 + i * 54} y={-46} width={14} height={92} fill="#26313f" stroke="#0d1218" strokeWidth="1" />
          <rect x={-196 + i * 54} y={-42} width={6} height={84} fill="#4fa8ff" opacity={0.15 + 0.85 * charge * Math.max(0, 1 - Math.abs(i / 16 - charge) * 3)} />
        </g>
      ))}
      <rect x={680} y={-40} width={30} height={80} fill="#2a3644" stroke="#0d1218" strokeWidth="1.4" />
      {/* charge glow at muzzle */}
      {charge > 0 ? <circle cx={700} cy={0} r={20 + 30 * charge} fill={`url(#${id}-muzzle)`} opacity={charge * 0.8} /> : null}
      {muzzle > 0 ? <circle cx={720} cy={0} r={120 * muzzle + 20} fill={`url(#${id}-muzzle)`} opacity={muzzle} /> : null}
    </svg>
  );
};
