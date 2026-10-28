import React, {useId} from 'react';
import {pts, Pt} from './svgUtil';

/**
 * Normandy SR-2 (Alliance livery). Top-down view, nose pointing +x, ~800 units
 * long. The silhouette prioritises the recognisable features: needle nose,
 * widening fuselage, large swept wings with twin engine pods, raised dorsal
 * spine and blue drive glow. Apply a CSS rotateX for a 3/4 perspective.
 */
export const Normandy: React.FC<{scale?: number; thrust?: number; opacity?: number; stealth?: boolean}> = ({scale = 1, thrust = 0.8, opacity = 1, stealth = false}) => {
  const id = useId().replace(/:/g, '');
  const fuselage: Pt[] = [
    [400, 0], [360, -10], [280, -22], [180, -34], [60, -44], [-80, -50], [-240, -46], [-330, -34], [-380, -20], [-400, 0],
    [-380, 20], [-330, 34], [-240, 46], [-80, 50], [60, 44], [180, 34], [280, 22], [360, 10],
  ];
  const wingR: Pt[] = [[40, 36], [-40, 60], [-220, 170], [-330, 240], [-370, 236], [-330, 180], [-250, 110], [-180, 60], [-120, 48]];
  const wingL: Pt[] = wingR.map(([x, y]) => [x, -y]);
  const podR: Pt[] = [[-200, 160], [-230, 150], [-360, 150], [-390, 165], [-390, 215], [-360, 230], [-230, 230], [-200, 220]];
  const podL: Pt[] = podR.map(([x, y]) => [x, -y]);
  const spine: Pt[] = [[300, -8], [120, -16], [-120, -18], [-300, -14], [-300, 14], [-120, 18], [120, 16], [300, 8]];
  const cockpit: Pt[] = [[330, -6], [300, -12], [240, -14], [240, 14], [300, 12], [330, 6]];
  const tailFin: Pt[] = [[-220, -8], [-340, -12], [-390, -8], [-390, 8], [-340, 12], [-220, 8]];
  const white = stealth ? '#8c96a3' : '#e9edf2';
  const grey = stealth ? '#5a6472' : '#b7c0cc';
  return (
    <svg width={900 * scale} height={560 * scale} viewBox="-450 -280 900 560" style={{position: 'absolute', left: -450 * scale, top: -280 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={grey} />
          <stop offset="50%" stopColor={white} />
          <stop offset="100%" stopColor={grey} />
        </linearGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={white} />
          <stop offset="100%" stopColor={grey} />
        </linearGradient>
        <radialGradient id={`${id}-plume`}>
          <stop offset="0%" stopColor="#dff1ff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#5fb3ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1e5fa8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* engine plumes */}
      {[podR, podL].map((p, i) => (
        <ellipse key={i} cx={-430 - 40 * thrust} cy={p === podR ? 190 : -190} rx={80 * thrust + 20} ry={28} fill={`url(#${id}-plume)`} opacity={0.5 + 0.5 * thrust} />
      ))}
      <ellipse cx={-430 - 30 * thrust} cy={0} rx={60 * thrust + 14} ry={18} fill={`url(#${id}-plume)`} opacity={0.5 + 0.5 * thrust} />
      {/* wings */}
      <polygon points={pts(wingR)} fill={`url(#${id}-wing)`} stroke="#2b3340" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={pts(wingL)} fill={`url(#${id}-wing)`} stroke="#2b3340" strokeWidth="1.6" strokeLinejoin="round" />
      {/* blue stripes on wings */}
      <polygon points={pts([[-120, 70], [-280, 170], [-300, 160], [-150, 62]])} fill="#2f6fc4" opacity="0.9" />
      <polygon points={pts([[-120, -70], [-280, -170], [-300, -160], [-150, -62]])} fill="#2f6fc4" opacity="0.9" />
      {/* engine pods */}
      <polygon points={pts(podR)} fill={`url(#${id}-hull)`} stroke="#2b3340" strokeWidth="1.6" />
      <polygon points={pts(podL)} fill={`url(#${id}-hull)`} stroke="#2b3340" strokeWidth="1.6" />
      <rect x={-392} y={172} width={8} height={36} fill="#9fe0ff" opacity={0.5 + 0.5 * thrust} />
      <rect x={-392} y={-208} width={8} height={36} fill="#9fe0ff" opacity={0.5 + 0.5 * thrust} />
      <rect x={-300} y={180} width={60} height={4} fill="#1a2230" opacity="0.7" />
      <rect x={-300} y={-184} width={60} height={4} fill="#1a2230" opacity="0.7" />
      {/* fuselage */}
      <polygon points={pts(fuselage)} fill={`url(#${id}-hull)`} stroke="#2b3340" strokeWidth="1.8" strokeLinejoin="round" />
      {/* dark panel bands */}
      <polygon points={pts([[200, -30], [60, -40], [60, -28], [200, -20]])} fill="#1f2733" opacity="0.85" />
      <polygon points={pts([[200, 30], [60, 40], [60, 28], [200, 20]])} fill="#1f2733" opacity="0.85" />
      <polygon points={pts([[-80, -48], [-240, -44], [-240, -36], [-80, -40]])} fill="#2f6fc4" opacity="0.9" />
      <polygon points={pts([[-80, 48], [-240, 44], [-240, 36], [-80, 40]])} fill="#2f6fc4" opacity="0.9" />
      {/* dorsal spine */}
      <polygon points={pts(spine)} fill={grey} stroke="#2b3340" strokeWidth="1.1" />
      <polygon points={pts(tailFin)} fill="#1f2733" stroke="#2b3340" strokeWidth="1" />
      {/* cockpit */}
      <polygon points={pts(cockpit)} fill="#1a2a3f" stroke="#2b3340" strokeWidth="1" />
      <rect x={250} y={-6} width={70} height={12} fill="#6fc3ff" opacity="0.35" />
      {/* markings */}
      <text x={-20} y={-24} fontFamily="'Jura', sans-serif" fontSize="22" fontWeight="700" fill="#1f2733" letterSpacing="2" opacity="0.9">
        SR2
      </text>
      <text x={-20} y={38} fontFamily="'Jura', sans-serif" fontSize="22" fontWeight="700" fill="#1f2733" letterSpacing="2" opacity="0.9" transform="scale(1 -1) translate(0 0)" style={{transformBox: 'fill-box', transformOrigin: 'center'}}>
        SR2
      </text>
      {/* running lights */}
      <circle cx={396} cy={0} r={2.2} fill="#ff6b57" />
      <circle cx={-360} cy={236} r={2.4} fill="#7cff9a" />
      <circle cx={-360} cy={-236} r={2.4} fill="#ff6b57" />
      <circle cx={-395} cy={0} r={2} fill="#dff3ff" />
    </svg>
  );
};
