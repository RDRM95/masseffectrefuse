import React, {useId, useMemo} from 'react';

/**
 * 2.5D planets. Earth uses hand-authored, coarse continent polygons projected
 * orthographically so that the globe genuinely rotates and reads as Earth.
 * Other worlds use procedural terrain built from SVG turbulence.
 */

type LonLat = [number, number];

// Coarse continent outlines [lon, lat]. Deliberately simplified for a cinematic
// distance; accurate enough that the globe is immediately recognisable.
const CONTINENTS: LonLat[][] = [
  // North America
  [[-168, 66], [-160, 70], [-140, 70], [-125, 71], [-110, 73], [-95, 72], [-85, 70], [-78, 62], [-70, 60], [-62, 56], [-55, 52], [-60, 46], [-70, 44], [-75, 40], [-76, 35], [-81, 31], [-80, 26], [-83, 29], [-89, 30], [-97, 27], [-97, 22], [-90, 20], [-87, 15], [-83, 9], [-80, 8], [-85, 12], [-92, 15], [-105, 20], [-110, 24], [-115, 30], [-122, 37], [-125, 44], [-124, 48], [-130, 54], [-140, 60], [-152, 60], [-165, 62]],
  // Greenland
  [[-55, 60], [-45, 60], [-35, 66], [-22, 70], [-20, 78], [-32, 83], [-55, 82], [-68, 78], [-70, 72], [-60, 66]],
  // South America
  [[-80, 8], [-75, 11], [-68, 11], [-60, 8], [-52, 4], [-50, 0], [-45, -2], [-38, -5], [-35, -8], [-38, -14], [-40, -20], [-47, -25], [-52, -32], [-58, -38], [-64, -42], [-66, -48], [-70, -53], [-74, -50], [-73, -42], [-71, -34], [-70, -25], [-76, -14], [-81, -5], [-80, 0]],
  // Africa
  [[-17, 15], [-16, 21], [-10, 30], [-6, 35], [10, 37], [12, 33], [20, 32], [30, 31], [34, 28], [36, 22], [40, 15], [44, 11], [51, 12], [50, 5], [44, 0], [40, -5], [39, -12], [36, -20], [33, -27], [28, -33], [20, -35], [16, -29], [12, -18], [12, -8], [9, 0], [8, 4], [0, 6], [-8, 5], [-13, 8], [-17, 13]],
  // Europe
  [[-9, 37], [-9, 43], [-2, 44], [-5, 48], [-2, 49], [3, 51], [8, 54], [10, 57], [5, 59], [5, 62], [12, 65], [18, 69], [25, 71], [30, 70], [40, 67], [45, 68], [50, 68], [60, 70], [60, 60], [50, 55], [40, 50], [35, 45], [28, 41], [22, 37], [18, 40], [15, 38], [12, 44], [8, 44], [3, 43], [0, 42], [-2, 37]],
  // Asia
  [[60, 70], [70, 73], [90, 75], [110, 74], [130, 72], [150, 70], [170, 69], [180, 66], [180, 62], [165, 60], [160, 56], [155, 52], [142, 50], [135, 44], [130, 40], [126, 36], [122, 30], [118, 24], [110, 20], [108, 14], [105, 9], [103, 2], [100, 6], [98, 10], [97, 17], [92, 22], [88, 22], [80, 15], [78, 8], [73, 16], [70, 22], [66, 25], [60, 25], [57, 26], [52, 24], [48, 30], [42, 36], [36, 37], [30, 41], [40, 47], [48, 46], [55, 46], [55, 50], [60, 60]],
  // Australia
  [[114, -22], [118, -20], [125, -14], [132, -12], [137, -15], [142, -11], [146, -18], [150, -24], [153, -30], [150, -37], [141, -38], [135, -35], [128, -33], [118, -34], [115, -30]],
  // Antarctica (band)
  [[-180, -68], [-120, -73], [-60, -70], [0, -70], [60, -67], [120, -66], [180, -70], [180, -90], [-180, -90]],
  // Japan / Islands (as a small blob)
  [[130, 32], [135, 35], [140, 37], [142, 42], [140, 44], [138, 40], [133, 35]],
  // UK
  [[-5, 50], [1, 52], [-2, 56], [-5, 58], [-7, 55], [-5, 52]],
  // Madagascar
  [[44, -12], [50, -14], [49, -24], [45, -25], [43, -17]],
  // Indonesia / New Guinea (coarse)
  [[95, 5], [105, -3], [115, -8], [130, -8], [140, -4], [150, -6], [147, -10], [138, -8], [120, -10], [105, -7], [96, 0]],
];

const deg = Math.PI / 180;

const project = (lon: number, lat: number, lon0: number, tilt: number, R: number): {x: number; y: number; z: number} => {
  const la = lat * deg;
  const lo = (lon - lon0) * deg;
  // rotate around vertical axis then tilt around the x axis
  let x = Math.cos(la) * Math.sin(lo);
  let y = Math.sin(la);
  let z = Math.cos(la) * Math.cos(lo);
  const t = tilt * deg;
  const y2 = y * Math.cos(t) - z * Math.sin(t);
  const z2 = y * Math.sin(t) + z * Math.cos(t);
  y = y2;
  z = z2;
  return {x: x * R, y: -y * R, z};
};

const polyPath = (poly: LonLat[], lon0: number, tilt: number, R: number): string | null => {
  const pts = poly.map(([lon, lat]) => project(lon, lat, lon0, tilt, R));
  if (!pts.some((p) => p.z > 0.02)) return null;
  // snap hidden vertices to the limb so the shape clips cleanly at the horizon
  const d = pts
    .map((p, i) => {
      let {x, y} = p;
      if (p.z <= 0) {
        const l = Math.hypot(x, y) || 1;
        x = (x / l) * R * 1.001;
        y = (y / l) * R * 1.001;
      }
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  return d + ' Z';
};

export type PlanetKind = 'earth' | 'palaven' | 'thessia' | 'tuchanka' | 'rannoch' | 'generic';

interface Palette {
  ocean: string;
  oceanDeep: string;
  land: string;
  landDark: string;
  atmosphere: string;
  clouds: number;
  cities?: boolean;
  landFreq: number;
  landSeed: number;
  landThreshold: number;
}

const PALETTES: Record<PlanetKind, Palette> = {
  earth: {ocean: '#1d5a9e', oceanDeep: '#06203f', land: '#5f6e3d', landDark: '#33421f', atmosphere: '#6fb0ff', clouds: 0.7, cities: false, landFreq: 0, landSeed: 0, landThreshold: 0},
  palaven: {ocean: '#4f5d70', oceanDeep: '#232b38', land: '#b5a98c', landDark: '#7a6f5c', atmosphere: '#c7d4e8', clouds: 0.35, landFreq: 0.012, landSeed: 7, landThreshold: 0.5},
  thessia: {ocean: '#2b3a9a', oceanDeep: '#121a4a', land: '#6c6ab0', landDark: '#3b3a73', atmosphere: '#a7a2ff', clouds: 0.6, landFreq: 0.011, landSeed: 3, landThreshold: 0.56},
  tuchanka: {ocean: '#6b4a2b', oceanDeep: '#3a2614', land: '#b58a52', landDark: '#7d5a33', atmosphere: '#c99b63', clouds: 0.15, landFreq: 0.015, landSeed: 11, landThreshold: 0.35},
  rannoch: {ocean: '#8a5f3c', oceanDeep: '#4a2f1b', land: '#d6a96b', landDark: '#9a7245', atmosphere: '#ffd2a0', clouds: 0.2, landFreq: 0.013, landSeed: 5, landThreshold: 0.4},
  generic: {ocean: '#3b4a5c', oceanDeep: '#16202c', land: '#6f7f8f', landDark: '#45515e', atmosphere: '#9fb6cc', clouds: 0.4, landFreq: 0.012, landSeed: 2, landThreshold: 0.5},
};

export const Planet: React.FC<{
  kind: PlanetKind;
  /** Radius in px. */
  radius: number;
  /** Rotation in degrees (longitude facing camera). */
  rotation?: number;
  tilt?: number;
  /** Direction of the sun in degrees (0 = right, 90 = down, 180 = left). */
  sunAngle?: number;
  /** How far the terminator sits; 0.5 = half-lit. */
  litFraction?: number;
  cloudOffset?: number;
  /** Damage/burning overlay 0..1 (orange glows on the night side). */
  damage?: number;
  seed?: number;
}> = ({kind, radius, rotation = 0, tilt = 20, sunAngle = 200, litFraction = 0.5, cloudOffset = 0, damage = 0, seed = 1}) => {
  const id = useId().replace(/:/g, '');
  const p = PALETTES[kind];
  const R = radius;
  const size = R * 2.6;
  const sx = Math.cos(sunAngle * deg);
  const sy = Math.sin(sunAngle * deg);

  const continents = useMemo(() => {
    if (kind !== 'earth') return null;
    return CONTINENTS.map((poly) => polyPath(poly, rotation, tilt, R)).filter(Boolean) as string[];
  }, [kind, rotation, tilt, R]);

  // Lighting: a highlight offset toward the sun and a shadow offset away.
  const lightCx = 50 + sx * 38;
  const lightCy = 50 + sy * 38;
  const shadowCx = 50 - sx * (10 + litFraction * 60);
  const shadowCy = 50 - sy * (10 + litFraction * 60);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      style={{position: 'absolute', left: -size / 2, top: -size / 2, overflow: 'visible'}}
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle r={R} />
        </clipPath>
        <radialGradient id={`${id}-ocean`} cx={`${lightCx}%`} cy={`${lightCy}%`} r="75%">
          <stop offset="0%" stopColor={p.ocean} />
          <stop offset="70%" stopColor={p.oceanDeep} />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`} cx={`${shadowCx}%`} cy={`${shadowCy}%`} r="78%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.98" />
          <stop offset="48%" stopColor="#000" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="76%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-atmo`} cx="50%" cy="50%" r="50%">
          <stop offset="86%" stopColor={p.atmosphere} stopOpacity="0" />
          <stop offset="95%" stopColor={p.atmosphere} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.atmosphere} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-rim`} cx="50%" cy="50%" r="50%">
          <stop offset="90%" stopColor={p.atmosphere} stopOpacity="0" />
          <stop offset="99%" stopColor={p.atmosphere} stopOpacity="0.9" />
          <stop offset="100%" stopColor={p.atmosphere} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-spec`} cx={`${lightCx}%`} cy={`${lightCy}%`} r="40%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-terrain`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={p.landFreq} numOctaves="5" seed={p.landSeed + seed} result="n" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a" />
          <feComponentTransfer in="a" result="mask">
            <feFuncA type="table" tableValues={`0 0 ${p.landThreshold < 0.45 ? '0.2 1' : '0 1'} 1`} />
          </feComponentTransfer>
          <feFlood floodColor={p.land} result="col" />
          <feComposite in="col" in2="mask" operator="in" />
        </filter>
        <filter id={`${id}-clouds`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.016" numOctaves="5" seed={seed + 21} result="n" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -1.05" result="c" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id={`${id}-landblur`}>
          <feGaussianBlur stdDeviation={R * 0.004} />
        </filter>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation={R * 0.02} />
        </filter>
      </defs>

      {/* Atmosphere haze behind the planet */}
      <circle r={R * 1.12} fill={`url(#${id}-atmo)`} opacity="0.9" />

      <g clipPath={`url(#${id}-clip)`}>
        <circle r={R} fill={`url(#${id}-ocean)`} />
        {kind === 'earth' ? (
          <g filter={`url(#${id}-landblur)`}>
            {continents?.map((d, i) => (
              <path key={i} d={d} fill={p.land} stroke={p.landDark} strokeWidth={R * 0.006} strokeLinejoin="round" />
            ))}
          </g>
        ) : (
          <rect x={-R - rotation * 2} y={-R} width={R * 4} height={R * 2} filter={`url(#${id}-terrain)`} opacity="0.95" />
        )}
        {/* Clouds drift slowly */}
        {p.clouds > 0 ? (
          <rect x={-R * 2 - cloudOffset} y={-R} width={R * 6} height={R * 2} filter={`url(#${id}-clouds)`} opacity={p.clouds * 0.75} />
        ) : null}
        {/* Night-side city lights (Earth) */}
        {p.cities ? (
          <g opacity="0.9">
            {continents?.slice(0, 6).map((d, i) => (
              <path key={`c${i}`} d={d} fill="none" stroke="#ffcf7a" strokeWidth={R * 0.012} strokeDasharray={`${R * 0.01} ${R * 0.05}`} opacity="0.5" filter={`url(#${id}-landblur)`} />
            ))}
          </g>
        ) : null}
        {/* Damage glows */}
        {damage > 0 ? (
          <g opacity={damage} filter={`url(#${id}-soft)`}>
            {[...Array(9)].map((_, i) => {
              const a = (i * 137.5 * deg) % (Math.PI * 2);
              const r = R * (0.2 + ((i * 0.61) % 0.6));
              return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={R * (0.025 + (i % 3) * 0.012)} fill="#ff7a2a" />;
            })}
          </g>
        ) : null}
        <circle r={R} fill={`url(#${id}-spec)`} />
        <circle r={R} fill={`url(#${id}-shadow)`} />
      </g>
      {/* Thin bright limb */}
      <circle r={R * 1.01} fill={`url(#${id}-rim)`} />
    </svg>
  );
};
