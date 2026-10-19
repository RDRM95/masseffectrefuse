import React, {useId} from 'react';
import {noise1} from '../animation/anim';

/**
 * Character staging. Faces are never shown: every figure is a carefully lit
 * silhouette with subtle life (breathing, weight shifts, head turns), which
 * keeps the characters recognisable through costume and proportion without
 * attempting lip-sync or detailed facial animation.
 *
 * Figures are drawn in a 400 x 900 local box with the feet at y = 900.
 */

interface FigProps {
  frame: number;
  scale?: number;
  /** Rim light colour (from behind) and key light colour (from the front/side). */
  rim?: string;
  key?: string;
  opacity?: number;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Head turn in degrees (small). */
  headTurn?: number;
}

const breath = (frame: number, seed = 0) => 1 + 0.006 * Math.sin(frame / 22 + seed) + 0.002 * noise1(frame * 0.3, seed);

/** Commander Shepard, seen from behind in N7 armour. The red/white N7 stripe runs down the right arm. */
export const ShepardBack: React.FC<FigProps> = ({frame, scale = 1, rim = '#bfe9ff', key = '#2b4b66', opacity = 1, flip = false, headTurn = 0}) => {
  const id = useId().replace(/:/g, '');
  const b = breath(frame, 1);
  const sway = noise1(frame * 0.08, 3) * 4;
  return (
    <svg width={400 * scale} height={900 * scale} viewBox="0 0 400 900" style={{position: 'absolute', left: -200 * scale, top: -900 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-armour`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#05070a" />
          <stop offset="55%" stopColor="#0b1119" />
          <stop offset="100%" stopColor={key} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rim} stopOpacity="0" />
          <stop offset="80%" stopColor={rim} stopOpacity="0" />
          <stop offset="100%" stopColor={rim} stopOpacity="0.9" />
        </linearGradient>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g transform={`translate(${200 + sway} 900) scale(${flip ? -1 : 1} 1) scale(${b} ${b}) translate(-200 -900)`}>
        {/* legs */}
        <path d="M150 560 L140 760 L132 880 L112 890 L118 900 L172 900 L178 890 L168 760 L178 560 Z" fill={`url(#${id}-armour)`} />
        <path d="M222 560 L232 760 L240 880 L260 890 L254 900 L200 900 L194 890 L204 760 L214 560 Z" fill={`url(#${id}-armour)`} />
        {/* knee plates */}
        <path d="M138 700 L172 700 L170 740 L140 740 Z" fill="#0f1620" stroke={rim} strokeWidth="0.6" strokeOpacity="0.35" />
        <path d="M228 700 L262 700 L260 740 L230 740 Z" fill="#0f1620" stroke={rim} strokeWidth="0.6" strokeOpacity="0.35" />
        {/* torso with back plates */}
        <path d="M118 300 C110 360 108 440 120 560 L280 560 C292 440 290 360 282 300 L250 270 L150 270 Z" fill={`url(#${id}-armour)`} />
        <path d="M150 300 L250 300 L246 380 L154 380 Z" fill="#0d141d" stroke={rim} strokeWidth="0.8" strokeOpacity="0.4" />
        <path d="M156 395 L244 395 L240 470 L160 470 Z" fill="#0d141d" stroke={rim} strokeWidth="0.8" strokeOpacity="0.3" />
        <path d="M160 485 L240 485 L236 545 L164 545 Z" fill="#0d141d" stroke={rim} strokeWidth="0.8" strokeOpacity="0.25" />
        {/* shoulders & arms */}
        <path d="M100 290 C80 300 70 330 72 380 L80 520 L104 520 L108 380 L124 300 Z" fill={`url(#${id}-armour)`} />
        <path d="M300 290 C320 300 330 330 328 380 L320 520 L296 520 L292 380 L276 300 Z" fill={`url(#${id}-armour)`} />
        <path d="M80 270 C100 250 130 248 150 262 L132 300 L96 306 Z" fill="#0f1620" />
        <path d="M320 270 C300 250 270 248 250 262 L268 300 L304 306 Z" fill="#0f1620" />
        {/* N7 stripe on the right arm (viewer's right when seen from behind, Shepard's right) */}
        <path d="M300 310 L314 312 L312 500 L300 500 Z" fill="#d9e4f2" opacity="0.9" />
        <path d="M312 312 L322 316 L320 500 L312 500 Z" fill="#d61f26" opacity="0.95" />
        {/* hands */}
        <path d="M78 520 L104 520 L102 560 L80 560 Z" fill="#070a0f" />
        <path d="M296 520 L322 520 L320 560 L298 560 Z" fill="#070a0f" />
        {/* neck & head (short hair) */}
        <path d="M184 262 L216 262 L214 240 L186 240 Z" fill="#070a0f" />
        <g transform={`rotate(${headTurn} 200 200)`}>
          <path d="M160 200 C160 150 175 128 200 126 C225 128 240 150 240 200 C240 230 222 248 200 248 C178 248 160 230 160 200 Z" fill="#06080c" />
          <path d="M162 190 C165 150 180 134 200 132 C220 134 236 150 238 190" fill="none" stroke={rim} strokeWidth="2.2" strokeOpacity="0.6" filter={`url(#${id}-soft)`} />
        </g>
        {/* rim light along the right edge of the body */}
        <path d="M282 300 C290 360 292 440 280 560" fill="none" stroke={rim} strokeWidth="2.5" strokeOpacity="0.7" filter={`url(#${id}-soft)`} />
        <path d="M328 380 L320 520" fill="none" stroke={rim} strokeWidth="2" strokeOpacity="0.6" filter={`url(#${id}-soft)`} />
        <path d="M232 560 L240 880" fill="none" stroke={rim} strokeWidth="1.8" strokeOpacity="0.45" filter={`url(#${id}-soft)`} />
        <path d="M118 300 C110 360 108 440 120 560" fill="none" stroke={rim} strokeWidth="1" strokeOpacity="0.25" />
      </g>
    </svg>
  );
};

/** The Catalyst: a luminous child-like figure of light, hovering. */
export const CatalystFigure: React.FC<{frame: number; scale?: number; opacity?: number; intensity?: number}> = ({frame, scale = 1, opacity = 1, intensity = 1}) => {
  const id = useId().replace(/:/g, '');
  const hover = Math.sin(frame / 30) * 6;
  const flick = 0.85 + 0.15 * (0.5 + 0.5 * noise1(frame * 1.1, 7));
  const g = intensity * flick;
  return (
    <svg width={400 * scale} height={900 * scale} viewBox="0 0 400 900" style={{position: 'absolute', left: -200 * scale, top: -900 * scale, overflow: 'visible', opacity}}>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#eaf9ff" stopOpacity={0.9 * g} />
          <stop offset="40%" stopColor="#9adcff" stopOpacity={0.35 * g} />
          <stop offset="100%" stopColor="#9adcff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95 * g} />
          <stop offset="60%" stopColor="#c8f0ff" stopOpacity={0.8 * g} />
          <stop offset="100%" stopColor="#9adcff" stopOpacity={0.15 * g} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}-blur2`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <g transform={`translate(0 ${hover + 120})`}>
        <ellipse cx={200} cy={520} rx={220} ry={330} fill={`url(#${id}-glow)`} />
        {/* small figure: head, shoulders, body tapering into light */}
        <g filter={`url(#${id}-blur2)`}>
          <circle cx={200} cy={330} r={38} fill={`url(#${id}-body)`} />
          <path d="M150 380 C150 365 250 365 250 380 L262 560 C262 620 240 700 200 740 C160 700 138 620 138 560 Z" fill={`url(#${id}-body)`} />
          <path d="M150 395 L120 520 L136 528 L160 420 Z" fill={`url(#${id}-body)`} opacity="0.8" />
          <path d="M250 395 L280 520 L264 528 L240 420 Z" fill={`url(#${id}-body)`} opacity="0.8" />
        </g>
        <g filter={`url(#${id}-blur)`} opacity={0.7}>
          <circle cx={200} cy={330} r={46} fill="#dff6ff" opacity={0.5 * g} />
          <path d="M150 380 C150 365 250 365 250 380 L262 560 C262 620 240 700 200 760 C160 700 138 620 138 560 Z" fill="#c8f0ff" opacity={0.45 * g} />
        </g>
        {/* drifting motes */}
        {[...Array(12)].map((_, i) => {
          const ph = frame * 0.02 + i * 1.3;
          const x = 200 + Math.sin(ph) * (60 + i * 8);
          const y = 300 + ((frame * (0.6 + i * 0.1) + i * 50) % 500);
          return <circle key={i} cx={x} cy={760 - (y - 300)} r={1.5 + (i % 3)} fill="#eaf9ff" opacity={0.4 * g * (0.5 + 0.5 * Math.sin(ph * 2))} />;
        })}
      </g>
    </svg>
  );
};

/** Admiral Hackett, in profile, standing at a holographic display. Alliance officer's uniform. */
export const HackettProfile: React.FC<FigProps> = ({frame, scale = 1, rim = '#6fc3ff', key = '#1a2a3d', opacity = 1, flip = false, headTurn = 0}) => {
  const id = useId().replace(/:/g, '');
  const b = breath(frame, 5);
  return (
    <svg width={400 * scale} height={900 * scale} viewBox="0 0 400 900" style={{position: 'absolute', left: -200 * scale, top: -900 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-uni`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={key} stopOpacity="0.95" />
          <stop offset="40%" stopColor="#0b1119" />
          <stop offset="100%" stopColor="#05070a" />
        </linearGradient>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g transform={`translate(200 900) scale(${flip ? -1 : 1} 1) scale(${b} ${b}) translate(-200 -900)`}>
        {/* legs (profile) */}
        <path d="M160 560 L150 900 L205 900 L212 560 Z" fill={`url(#${id}-uni)`} />
        <path d="M215 560 L225 900 L270 900 L262 560 Z" fill="#070a0f" />
        {/* torso in profile, slight forward lean (looking down at the display) */}
        <path d="M150 300 C135 380 140 470 150 560 L268 560 C280 470 282 380 262 300 L240 270 L170 270 Z" fill={`url(#${id}-uni)`} />
        {/* collar and rank insignia */}
        <path d="M172 272 L240 272 L236 300 L176 300 Z" fill="#0f1620" />
        <rect x={168} y={320} width={26} height={6} fill="#d8c27a" opacity="0.8" />
        <rect x={168} y={330} width={26} height={6} fill="#d8c27a" opacity="0.8" />
        {/* arm resting on the display rail */}
        <path d="M150 300 C120 330 110 400 120 470 L170 480 L172 440 L160 380 L172 310 Z" fill="#070a0f" />
        <path d="M120 470 L170 480 L176 500 L124 496 Z" fill="#070a0f" />
        {/* neck & head in profile with short hair and beard line */}
        <path d="M190 262 L228 262 L226 236 L192 236 Z" fill="#070a0f" />
        <g transform={`rotate(${headTurn} 205 200)`}>
          <path d="M168 196 C168 150 184 126 210 124 C236 124 250 146 250 190 C250 214 246 230 232 242 C222 250 196 252 184 240 C172 228 168 214 168 196 Z" fill="#06080c" />
          {/* profile line: brow, nose, beard */}
          <path d="M248 176 C254 186 256 196 250 206 C246 214 248 222 244 230 C238 240 228 246 218 248" fill="none" stroke={rim} strokeWidth="2.2" strokeOpacity="0.75" filter={`url(#${id}-soft)`} />
          <path d="M176 150 C190 130 220 126 244 142" fill="none" stroke={rim} strokeWidth="1.6" strokeOpacity="0.4" filter={`url(#${id}-soft)`} />
        </g>
        <path d="M150 300 C135 380 140 470 150 560" fill="none" stroke={rim} strokeWidth="2" strokeOpacity="0.55" filter={`url(#${id}-soft)`} />
      </g>
    </svg>
  );
};

/** Shepard in profile (for the bridge scene opposite Hackett). */
export const ShepardProfile: React.FC<FigProps> = ({frame, scale = 1, rim = '#6fc3ff', key = '#1a2a3d', opacity = 1, flip = false, headTurn = 0}) => {
  const id = useId().replace(/:/g, '');
  const b = breath(frame, 2);
  return (
    <svg width={400 * scale} height={900 * scale} viewBox="0 0 400 900" style={{position: 'absolute', left: -200 * scale, top: -900 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-arm`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={key} stopOpacity="0.95" />
          <stop offset="45%" stopColor="#0b1119" />
          <stop offset="100%" stopColor="#05070a" />
        </linearGradient>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g transform={`translate(200 900) scale(${flip ? -1 : 1} 1) scale(${b} ${b}) translate(-200 -900)`}>
        <path d="M158 560 L148 900 L206 900 L214 560 Z" fill={`url(#${id}-arm)`} />
        <path d="M216 560 L226 900 L274 900 L266 560 Z" fill="#070a0f" />
        <path d="M150 300 C134 380 140 470 150 560 L272 560 C286 470 288 380 266 300 L242 268 L170 268 Z" fill={`url(#${id}-arm)`} />
        {/* chest plate and N7 mark */}
        <path d="M160 310 L250 310 L246 420 L164 420 Z" fill="#0d141d" stroke={rim} strokeWidth="0.8" strokeOpacity="0.4" />
        <path d="M180 330 L200 330 L196 360 L176 360 Z" fill="#d9e4f2" opacity="0.6" />
        <path d="M200 330 L210 330 L206 360 L196 360 Z" fill="#d61f26" opacity="0.8" />
        {/* arm with N7 stripe */}
        <path d="M150 300 C124 330 112 400 118 480 L160 486 L166 440 L156 380 L170 312 Z" fill="#070a0f" />
        <path d="M128 330 L138 330 L126 470 L116 470 Z" fill="#d9e4f2" opacity="0.7" />
        <path d="M138 330 L146 332 L134 470 L126 470 Z" fill="#d61f26" opacity="0.85" />
        <path d="M190 262 L228 262 L226 236 L192 236 Z" fill="#070a0f" />
        <g transform={`rotate(${headTurn} 205 200)`}>
          <path d="M168 196 C168 148 186 124 212 124 C238 124 252 146 250 190 C250 214 244 232 230 244 C218 252 194 252 182 240 C172 228 168 214 168 196 Z" fill="#06080c" />
          <path d="M248 172 C255 184 256 196 250 206 C247 214 248 224 244 232 C238 242 226 248 216 248" fill="none" stroke={rim} strokeWidth="2.2" strokeOpacity="0.75" filter={`url(#${id}-soft)`} />
        </g>
        <path d="M150 300 C134 380 140 470 150 560" fill="none" stroke={rim} strokeWidth="2" strokeOpacity="0.55" filter={`url(#${id}-soft)`} />
      </g>
    </svg>
  );
};

/**
 * Crew silhouettes for the epilogue. Each species is identified by its
 * iconic head shape: turian fringe and mandibles (Garrus), asari crest
 * (Liara), quarian hood and visor (Tali), Joker's cap, EDI's sleek platform.
 */
export const CrewFigure: React.FC<FigProps & {who: 'garrus' | 'liara' | 'tali' | 'joker' | 'edi' | 'wrex' | 'eve' | 'anderson'}> = ({who, frame, scale = 1, rim = '#ffd9a0', key = '#2a2a33', opacity = 1, flip = false}) => {
  const id = useId().replace(/:/g, '');
  const b = breath(frame, who.length);
  const head: Record<string, React.ReactNode> = {
    garrus: (
      <g>
        <path d="M166 200 C166 150 184 128 208 128 C232 128 246 150 246 196 L250 236 L236 254 L210 262 L184 250 L170 230 Z" fill="#06080c" />
        {/* fringe */}
        <path d="M232 150 L270 120 L262 150 L286 140 L270 168 L292 168 L268 186" fill="#06080c" />
        <path d="M232 150 L270 120 L262 150 L286 140 L270 168 L292 168 L268 186" fill="none" stroke={rim} strokeWidth="1.4" strokeOpacity="0.6" />
        {/* mandibles */}
        <path d="M184 236 L170 262 L190 256 Z" fill="#06080c" />
        <path d="M236 236 L250 262 L230 256 Z" fill="#06080c" />
        {/* visor glow */}
        <path d="M238 184 L252 182 L252 194 L238 196 Z" fill="#6fc3ff" opacity="0.85" />
      </g>
    ),
    liara: (
      <g>
        <path d="M168 200 C168 150 184 126 206 126 C230 126 246 148 246 194 C246 220 240 240 226 250 C214 258 192 256 180 244 C172 232 168 216 168 200 Z" fill="#06080c" />
        {/* crest */}
        <path d="M184 130 C196 110 220 108 236 120 C252 134 262 150 258 170 C246 160 236 156 230 150 L224 126 L212 140 L200 124 L192 142 L184 130 Z" fill="#06080c" />
        <path d="M184 130 C196 110 220 108 236 120 C252 134 262 150 258 170" fill="none" stroke={rim} strokeWidth="1.4" strokeOpacity="0.6" />
      </g>
    ),
    tali: (
      <g>
        {/* hood */}
        <path d="M150 200 C150 140 176 116 206 116 C236 116 262 140 262 200 L266 260 L146 260 Z" fill="#06080c" />
        {/* visor */}
        <path d="M176 176 C176 150 190 140 206 140 C222 140 236 150 236 176 L236 214 C236 232 224 242 206 242 C188 242 176 232 176 214 Z" fill="#2a1f45" />
        <path d="M184 170 C190 156 222 156 228 170 L228 212 C222 226 190 226 184 212 Z" fill="#b48cff" opacity="0.35" />
        <circle cx={198} cy={186} r={4} fill="#eaf0ff" opacity="0.85" />
        <circle cx={216} cy={186} r={4} fill="#eaf0ff" opacity="0.85" />
      </g>
    ),
    joker: (
      <g>
        <path d="M170 200 C170 160 184 136 206 136 C228 136 244 158 244 198 C244 224 238 242 224 250 C212 258 194 256 182 244 C174 232 170 216 170 200 Z" fill="#06080c" />
        {/* cap with brim */}
        <path d="M162 160 C166 130 190 118 212 120 C236 122 250 138 250 160 L268 164 L262 174 L160 170 Z" fill="#06080c" />
        <path d="M162 160 C166 130 190 118 212 120 C236 122 250 138 250 160 L268 164" fill="none" stroke={rim} strokeWidth="1.4" strokeOpacity="0.6" />
      </g>
    ),
    edi: (
      <g>
        <path d="M170 196 C170 150 186 128 208 128 C230 128 246 148 246 192 C246 218 240 238 226 248 C214 256 192 256 182 244 C174 232 170 214 170 196 Z" fill="#101418" />
        <path d="M172 180 C180 150 236 150 244 180" fill="none" stroke="#9fd4ff" strokeWidth="1.6" strokeOpacity="0.7" />
        <path d="M184 226 L232 226" stroke="#9fd4ff" strokeWidth="1.2" strokeOpacity="0.5" />
      </g>
    ),
    wrex: (
      <g>
        {/* krogan: wide head, heavy crest plate, hump */}
        <path d="M140 220 C140 160 170 126 210 126 C254 126 284 162 284 214 L288 260 L136 262 Z" fill="#06080c" />
        <path d="M150 160 C176 118 250 118 278 160 L270 176 C250 150 180 150 160 176 Z" fill="#06080c" />
        <path d="M150 160 C176 118 250 118 278 160" fill="none" stroke={rim} strokeWidth="1.6" strokeOpacity="0.6" />
        <circle cx={168} cy={210} r={5} fill="#ff6b3d" opacity="0.8" />
        <circle cx={256} cy={210} r={5} fill="#ff6b3d" opacity="0.8" />
      </g>
    ),
    eve: (
      <g>
        {/* krogan head beneath a draped hood and veil */}
        <path d="M130 240 C130 160 170 120 210 120 C250 120 290 160 290 240 L300 262 L120 262 Z" fill="#06080c" />
        <path d="M150 170 C180 130 240 130 270 170" fill="none" stroke={rim} strokeWidth="1.6" strokeOpacity="0.6" />
        <path d="M160 214 L260 214 L256 236 L164 236 Z" fill="#1a1420" />
        <circle cx={182} cy={200} r={4} fill="#ffb067" opacity="0.8" />
        <circle cx={238} cy={200} r={4} fill="#ffb067" opacity="0.8" />
      </g>
    ),
    anderson: (
      <g>
        <path d="M170 198 C170 152 186 128 208 128 C230 128 246 148 246 192 C246 218 240 238 226 248 C214 256 192 256 182 244 C174 232 170 214 170 198 Z" fill="#06080c" />
        <path d="M176 148 C190 132 226 132 242 150" fill="none" stroke={rim} strokeWidth="1.4" strokeOpacity="0.5" />
      </g>
    ),
  };
  const broad = who === 'wrex' || who === 'eve' || who === 'garrus';
  return (
    <svg width={400 * scale} height={900 * scale} viewBox="0 0 400 900" style={{position: 'absolute', left: -200 * scale, top: -900 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#05070a" />
          <stop offset="60%" stopColor="#0b1119" />
          <stop offset="100%" stopColor={key} stopOpacity="0.95" />
        </linearGradient>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g transform={`translate(200 900) scale(${flip ? -1 : 1} 1) scale(${b} ${b}) translate(-200 -900)`}>
        <path d={broad ? 'M136 560 L128 900 L196 900 L202 560 Z' : 'M156 560 L148 900 L206 900 L212 560 Z'} fill={`url(#${id}-b)`} />
        <path d={broad ? 'M214 560 L222 900 L292 900 L286 560 Z' : 'M216 560 L226 900 L272 900 L266 560 Z'} fill="#070a0f" />
        <path d={broad ? 'M112 300 C96 380 100 470 112 560 L306 560 C318 470 322 380 304 300 L262 262 L156 262 Z' : 'M140 300 C128 380 132 470 142 560 L276 560 C286 470 290 380 272 300 L240 266 L172 266 Z'} fill={`url(#${id}-b)`} />
        {who === 'tali' ? <path d="M156 300 C150 380 150 470 158 560 L262 560 C268 470 268 380 262 300 Z" fill="#1c1430" opacity="0.8" /> : null}
        {who === 'garrus' ? <path d="M150 300 L268 300 L262 420 L156 420 Z" fill="#0d141d" stroke="#6fc3ff" strokeWidth="0.8" strokeOpacity="0.35" /> : null}
        <path d={broad ? 'M112 300 C90 330 80 400 90 480 L136 486 L140 440 L128 380 L140 312 Z' : 'M140 300 C116 330 106 400 112 480 L154 486 L158 440 L148 380 L160 312 Z'} fill="#070a0f" />
        <path d="M190 262 L228 262 L226 240 L192 240 Z" fill="#070a0f" />
        {head[who]}
        <path d={broad ? 'M304 300 C322 380 318 470 306 560' : 'M272 300 C290 380 286 470 276 560'} fill="none" stroke={rim} strokeWidth="2" strokeOpacity="0.55" filter={`url(#${id}-soft)`} />
      </g>
    </svg>
  );
};


/**
 * A seated figure from behind in a high-backed chair, facing a window: the
 * Illusive Man's signature staging. The ember of a cigarette glows at the
 * right hand; holographic panels hover to one side.
 */
export const SeatedFigure: React.FC<{frame: number; scale?: number; opacity?: number; rim?: string}> = ({frame, scale = 1, opacity = 1, rim = '#6fc3ff'}) => {
  const id = useId().replace(/:/g, '');
  const b = breath(frame, 11);
  const ember = 0.5 + 0.5 * Math.sin(frame / 18);
  const handLift = Math.max(0, Math.sin(frame / 90)) * 10;
  return (
    <svg width={600 * scale} height={700 * scale} viewBox="0 0 600 700" style={{position: 'absolute', left: -300 * scale, top: -700 * scale, overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id={`${id}-chair`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#05070a" />
          <stop offset="50%" stopColor="#0d141c" />
          <stop offset="100%" stopColor="#05070a" />
        </linearGradient>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <radialGradient id={`${id}-ember`}>
          <stop offset="0%" stopColor="#ffd9a0" />
          <stop offset="40%" stopColor="#ff8a1f" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* chair */}
      <path d="M150 700 L150 300 C150 240 200 220 300 220 C400 220 450 240 450 300 L450 700 Z" fill={`url(#${id}-chair)`} />
      <path d="M150 300 C150 240 200 220 300 220 C400 220 450 240 450 300" fill="none" stroke={rim} strokeWidth="2" strokeOpacity="0.5" filter={`url(#${id}-soft)`} />
      <path d="M110 420 L150 420 L150 700 L110 700 Z" fill="#05070a" />
      <path d="M450 420 L490 420 L490 700 L450 700 Z" fill="#05070a" />
      {/* head and shoulders above the chair back */}
      <g transform={`translate(300 230) scale(${b} ${b}) translate(-300 -230)`}>
        <path d="M230 240 C230 200 260 150 300 150 C340 150 370 200 370 240 L390 260 L210 260 Z" fill="#06080c" />
        <path d="M262 200 C262 160 280 136 300 134 C320 136 338 160 338 200 C338 222 324 236 300 238 C276 236 262 222 262 200 Z" fill="#06080c" />
        <path d="M265 190 C270 158 284 142 300 140 C316 142 330 158 335 190" fill="none" stroke={rim} strokeWidth="2" strokeOpacity="0.55" filter={`url(#${id}-soft)`} />
      </g>
      {/* right arm resting on the chair arm, cigarette */}
      <path d={`M450 ${440 - handLift} L500 ${430 - handLift} L520 ${452 - handLift} L470 ${470 - handLift} Z`} fill="#06080c" />
      <circle cx={520} cy={436 - handLift} r={10} fill={`url(#${id}-ember)`} opacity={0.4 + 0.6 * ember} />
      <circle cx={520} cy={436 - handLift} r={2.4} fill="#ffe3b0" opacity={0.5 + 0.5 * ember} />
      {/* smoke */}
      {[...Array(4)].map((_, i) => (
        <circle key={i} cx={522 + Math.sin(frame / 25 + i) * 8} cy={420 - handLift - i * 26 - (frame % 90) * 0.3} r={6 + i * 4} fill="#8fa3b8" opacity={0.06 * (1 - i / 4)} filter={`url(#${id}-soft)`} />
      ))}
    </svg>
  );
};
