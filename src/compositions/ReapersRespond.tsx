import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ChapterCard} from '../effects/TextCards';
import {Grade, Fade} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Camera, At, Parallax} from '../camera/Camera';
import {Reaper} from '../spacecraft/Reaper';
import {Subtitles, Cue} from '../subtitles/Subtitles';
import {Music, Sfx} from '../audio/Music';
import {fadeInOut, kf, rr, noise1} from '../animation/anim';
import {FONTS} from '../theme';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * CHAPTER FOUR — THE REAPERS RESPOND (36 s)
 * Inside the Reaper intelligence network. Harbinger assesses the war.
 */

export const CUES_CH4: Cue[] = [
  {start: 8, end: 11, speaker: 'HARBINGER', text: 'This cycle deviates from every projection.'},
  {start: 12, end: 15.5, speaker: 'HARBINGER', text: 'Their homeworlds stand. Their yards outproduce our losses. They have learned where we break.'},
  {start: 17, end: 20, speaker: 'HARBINGER', text: 'Dispersal invites destruction in detail. We will not disperse.'},
  {start: 21, end: 24.5, speaker: 'HARBINGER', text: 'All formations will converge. I will assume direct control.'},
  {start: 26, end: 29, speaker: 'HARBINGER', text: 'One harvest. One field. Nothing will be held back.'},
];

const DATA_LINES: Array<[number, string]> = [
  [3, 'HARVEST PROJECTION — REVISED'],
  [4.2, 'ORGANIC INDUSTRIAL OUTPUT: EXCEEDS MODEL BY 340%'],
  [5.4, 'HOMEWORLDS NEUTRALISED: 0 OF 7'],
  [6.6, 'CAPITAL UNITS LOST: 74 — NOT REPLACEABLE'],
  [7.8, 'ALLIED CAPITAL CONSTRUCTION: ONGOING'],
  [15.8, 'DOCTRINE: DISPERSED HARVEST — FAILED'],
  [20.3, 'DIRECTIVE: CONVERGE ALL FORMATIONS'],
  [24.8, 'DIRECTIVE: DIRECT CONTROL — HARBINGER'],
];

const Interior: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // the camera drifts across the surface of an enormous Reaper hull, extreme close-up
  const cam = {x: kf(frame, [0, s(30)], [900, 1100]), y: kf(frame, [0, s(30)], [400, 620]), zoom: kf(frame, [0, s(30)], [1.0, 1.25])};
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.2);
  return (
    <AbsoluteFill style={{background: '#030204'}}>
      <Sfx file="reaper-interior.mp3" volume={0.7} />
      <Camera cam={cam}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(70,8,6,0.5), rgba(0,0,0,0) 65%)'}} />
        {/* layered massive structures */}
        <At x={960} y={520} rotate={-18}>
          <Reaper variant="harbinger" scale={2.6} glow={0.5 + 0.5 * pulse} limbPhase={t * 0.2} />
        </At>
        <At x={300} y={1100} rotate={40} opacity={0.5}>
          <Reaper variant="sovereign" scale={1.4} glow={0.4} limbPhase={t * 0.25} />
        </At>
        {/* synthetic data streams: vertical columns of red glyph-like marks */}
        {[...Array(9)].map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 120 + i * 210, top: 0, width: 2, height: 1080, background: 'linear-gradient(180deg, rgba(255,42,26,0) 0%, rgba(255,42,26,0.35) 50%, rgba(255,42,26,0) 100%)', opacity: 0.5 + 0.5 * noise1(t * 2 + i, i)}} />
        ))}
      </Camera>
      {/* data readout in Reaper style */}
      <div style={{position: 'absolute', left: 120, top: 120, fontFamily: FONTS.ui, color: '#ff3b2a', fontSize: 22, letterSpacing: 5, lineHeight: 2, textShadow: '0 0 12px rgba(255,42,26,0.6)'}}>
        {DATA_LINES.map(([at, text], i) => {
          const o = fadeInOut(frame, s(at), s(at + 0.3), s(31), s(33));
          const glitch = noise1(frame * 3, i) > 0.75 ? 1 : 0;
          return (
            <div key={i} style={{opacity: o * (glitch ? 0.4 : 1), transform: `translateX(${glitch ? rr(`g${i}${frame}`, -4, 4) : 0}px)`}}>
              {'▸ '}
              {text}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', right: 120, top: 120, fontFamily: FONTS.ui, color: '#ffb01f', fontSize: 20, letterSpacing: 6, opacity: fadeInOut(frame, s(2), s(3), s(31), s(33)) * (0.7 + 0.3 * pulse), textAlign: 'right', lineHeight: 2}}>
        <div>NETWORK: HARBINGER</div>
        <div>UNITS LINKED: {Math.max(0, 412 - Math.round(t * 0.5))}</div>
        <div>CYCLE 2186 — ASSESSMENT</div>
      </div>
    </AbsoluteFill>
  );
};

const Convergence: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: 960, y: 540, zoom: kf(frame, [0, s(6)], [1.0, 1.2])};
  return (
    <AbsoluteFill>
      <Sfx file="reaper-horn.mp3" volume={0.9} />
      <Camera cam={cam}>
        <Parallax cam={cam} factor={0.1}>
          <Starfield seed="converge" brightness={0.7} nebula="red" />
        </Parallax>
        {/* a wall of Reapers moving toward the camera */}
        {[...Array(40)].map((_, i) => {
          const d = rr(`cd${i}`, 0.15, 1);
          const x = 960 + (rr(`cx${i}`, -1, 1) * 900) / (0.4 + d) + t * 10 * (1 - d);
          const y = 540 + (rr(`cy${i}`, -1, 1) * 500) / (0.4 + d);
          const sc = (0.06 + (1 - d) * 0.5) * (1 + t * 0.08);
          return (
            <At key={i} x={x} y={y} rotate={rr(`cr${i}`, -30, 30)} opacity={0.5 + 0.5 * (1 - d)}>
              <Reaper variant={i === 0 ? 'harbinger' : i % 4 === 0 ? 'destroyer' : 'sovereign'} scale={i === 0 ? 0.8 : sc} limbPhase={t * 0.6 + i} glow={0.9} />
            </At>
          );
        })}
      </Camera>
    </AbsoluteFill>
  );
};

export const ReapersRespond: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="reapers-respond.mp3" />
      <ChapterCard number={4} title="The Reapers Respond" from={s(0.3)} to={s(3)} />
      <Sequence from={s(2.5)} durationInFrames={s(30)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(2.5), s(4), s(30.5), s(31.5))}}>
          <Interior />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={s(30.5)} durationInFrames={s(6)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(30.5), s(31.2), s(35.4), s(36))}}>
          <Convergence />
        </AbsoluteFill>
      </Sequence>
      <Subtitles cues={CUES_CH4} />
      <Grade vignette={0.9} grain={0.09} tint="#3a0a08" tintOpacity={0.12} />
      <Fade opacity={kf(frame, [s(35.4), s(36)], [0, 1])} />
    </AbsoluteFill>
  );
};
