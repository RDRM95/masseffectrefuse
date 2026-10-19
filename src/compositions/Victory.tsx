import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ChapterCard, LocationCaption} from '../effects/TextCards';
import {Grade, Fade, Flash} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Planet} from '../environments/Planet';
import {FlagBridge} from '../environments/Interiors';
import {Camera, At, Parallax} from '../camera/Camera';
import {AllianceDreadnought, AllianceCruiser} from '../spacecraft/Alliance';
import {TurianCruiser} from '../spacecraft/Turian';
import {Reaper} from '../spacecraft/Reaper';
import {Explosion, ShieldImpact, Slug} from '../effects/Weapons';
import {HudFrame, HudReadout} from '../effects/Hud';
import {HackettProfile, CrewFigure} from '../characters/Silhouettes';
import {Subtitles, Cue} from '../subtitles/Subtitles';
import {Music, Sfx} from '../audio/Music';
import {fadeInOut, kf, rr, progress} from '../animation/anim';
import {FONTS} from '../theme';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * CHAPTER SIX — VICTORY (42 s)
 * The last Reaper capital ship. Confirmation across every allied network.
 * Hackett tells the fleet, and then puts them back to work.
 */

export const CUES_CH6: Cue[] = [
  {start: 9, end: 11.2, speaker: 'FLEET', text: 'Target destroyed. Flag, that was the last one on the board.', radio: true},
  {start: 16, end: 18.2, speaker: 'FLEET', text: "All networks confirm. There's nothing left out there.", radio: true},
  {start: 20, end: 22.2, speaker: 'HACKETT', text: 'All stations, this is Admiral Hackett.', radio: true},
  {start: 24, end: 26.6, speaker: 'HACKETT', text: 'Reaper command capability has been eliminated.', radio: true},
  {start: 27, end: 29.8, speaker: 'HACKETT', text: 'The remaining hostile formations have been destroyed.', radio: true},
  {start: 32, end: 33.8, speaker: 'HACKETT', text: 'The war is over.', radio: true},
  {start: 38.4, end: 40, speaker: 'HACKETT', text: 'There are still people out there.', radio: true},
  {start: 40.3, end: 41.9, speaker: 'HACKETT', text: 'Begin recovery operations.', radio: true},
];

const LastReaper: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(8)], [1000, 1100]), y: 520, zoom: kf(frame, [0, s(8)], [1.0, 1.12])};
  const kill = progress(frame, s(5), s(8));
  const volleys = [1.5, 3, 4.2];
  return (
    <>
      {volleys.map((v) => (
        <Sequence key={v} from={s(v)} layout="none">
          <Sfx file="ma-shot.mp3" volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={s(5)} layout="none">
        <Sfx file="explosion-large.mp3" volume={0.9} />
      </Sequence>
      <Camera cam={cam}>
        <Parallax cam={cam} factor={0.1}>
          <Starfield seed="last" brightness={0.7} nebula="violet" />
        </Parallax>
        <Parallax cam={cam} factor={0.3}>
          <At x={1600} y={1400}>
            <Planet kind="generic" radius={900} rotation={t} sunAngle={160} litFraction={0.3} seed={14} />
          </At>
        </Parallax>
        <At x={300} y={400}>
          <AllianceDreadnought scale={0.24} lightFromLeft muzzle={volleys.some((v) => Math.abs(t - v) < 0.12) ? 1 : 0} />
        </At>
        <At x={260} y={640}>
          <AllianceCruiser scale={0.16} lightFromLeft muzzle={volleys.some((v) => Math.abs(t - v - 0.1) < 0.12) ? 1 : 0} />
        </At>
        <At x={420} y={800}>
          <TurianCruiser scale={0.14} muzzle={volleys.some((v) => Math.abs(t - v - 0.2) < 0.12) ? 1 : 0} />
        </At>
        {kill < 0.9 ? (
          <At x={1350} y={480} rotate={-100 + kill * 20} opacity={1 - Math.max(0, (kill - 0.6) / 0.4)}>
            <Reaper variant="sovereign" scale={0.5} limbPhase={t * 0.5} damage={0.4 + kill} glow={0.6 - kill * 0.6} />
          </At>
        ) : null}
        {volleys.map((v, vi) =>
          [...Array(6)].map((_, k) => {
            const d = rr(`ld${vi}${k}`, 0, 0.3);
            const tx = 1350 + rr(`lx${vi}${k}`, -40, 40);
            const ty = 480 + rr(`ly${vi}${k}`, -100, 100);
            return (
              <React.Fragment key={`${vi}-${k}`}>
                <Slug x0={[420, 380, 540][k % 3]} y0={[400, 640, 800][k % 3]} x1={tx} y1={ty} t={progress(frame, s(v + d), s(v + d + 0.8))} color={k % 3 === 2 ? '#ffd9a0' : '#cfe9ff'} />
                <ShieldImpact x={tx} y={ty} t={progress(frame, s(v + d + 0.78), s(v + d + 1.2))} size={0.9} color="#ffb067" />
              </React.Fragment>
            );
          }),
        )}
        <Explosion x={1350} y={480} t={kill} size={2.4} seed="lastreaper" debris={40} />
        <Explosion x={1300} y={640} t={progress(frame, s(6.2), s(9))} size={1.8} seed="lastreaper2" />
      </Camera>
      <Flash opacity={fadeInOut(frame, s(5), s(5.1), s(5.3), s(6)) * 0.6} color="#fff3d6" />
    </>
  );
};

const Confirmation: React.FC = () => {
  const frame = useCurrentFrame();
  const lines: Array<[number, string, string]> = [
    [0.8, 'ALLIANCE FIFTH FLEET', 'NO CONTACTS'],
    [1.8, 'HIERARCHY DEFENCE COMMAND', 'NO CONTACTS'],
    [2.8, 'GETH CONSENSUS', 'NO REAPER SIGNALS DETECTED'],
    [3.8, 'SPECIAL TASKS GROUP', 'NO COMMAND TRAFFIC'],
    [4.8, 'ASARI REPUBLICS / QUARIAN FLEET / CERBERUS', 'CONFIRMED'],
    [5.6, 'OPERATIONAL REAPER FORMATIONS', 'NONE'],
    [6.0, 'ACTIVE REAPER COMMAND STRUCTURE', 'NONE'],
  ];
  return (
    <AbsoluteFill style={{background: '#02050a'}}>
      <Sfx file="bridge-ambience.mp3" volume={0.5} />
      {lines.map(([at, k, v], i) => (
        <Sequence key={i} from={s(at)} layout="none">
          <Sfx file="ui-beep.mp3" volume={0.35} />
        </Sequence>
      ))}
      <HudFrame from={0} to={s(7.5)} label="ALLIED JOINT COMMAND — CONFIRMATION REQUESTED">
        <div style={{position: 'absolute', left: 0, top: 80, fontFamily: FONTS.ui, fontSize: 26, letterSpacing: 5, color: '#dfe6ee', lineHeight: 2.2}}>
          {lines.map(([at, k, v], i) => {
            const o = fadeInOut(frame, s(at), s(at + 0.25), s(8), s(9));
            return (
              <div key={i} style={{opacity: o, display: 'flex', gap: 40}}>
                <span style={{color: '#6fc3ff', width: 760}}>{k}</span>
                <span style={{color: i >= 5 ? '#ff8a1f' : '#9dffb0'}}>{v}</span>
              </div>
            );
          })}
        </div>
        <HudReadout x={0} y={40} align="right" lines={['2188.02.09', 'HADES NEXUS', `QUERIES ANSWERED: ${Math.min(7, Math.floor(frame / FPS + 0.2))} / 7`]} color="#ff8a1f" />
      </HudFrame>
    </AbsoluteFill>
  );
};

const HackettAlone: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS; // scene starts at chapter 18 s
  const cam = {x: kf(frame, [0, s(16)], [820, 760]), y: kf(frame, [0, s(16)], [620, 600]), zoom: kf(frame, [0, s(16)], [1.15, 1.32])};
  return (
    <AbsoluteFill>
      <Sfx file="bridge-ambience.mp3" volume={0.4} />
      <Camera cam={cam}>
        <FlagBridge frame={frame}>
          <At x={700} y={1030}>
            <HackettProfile frame={frame} scale={0.92} rim="#6fc3ff" headTurn={t > 12 ? -5 : t > 4 ? 3 : 0} />
          </At>
        </FlagBridge>
      </Camera>
    </AbsoluteFill>
  );
};

const Crews: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: 960, y: 620, zoom: kf(frame, [0, s(4)], [1.1, 1.18])};
  return (
    <AbsoluteFill>
      <Camera cam={cam}>
        <FlagBridge frame={frame}>
          <At x={480} y={1040}>
            <CrewFigure who="anderson" frame={frame} scale={0.8} rim="#6fc3ff" headTurn={kf(frame, [0, s(2.5)], [0, 14])} />
          </At>
          <At x={960} y={1060}>
            <CrewFigure who="anderson" frame={frame} scale={0.86} rim="#6fc3ff" flip headTurn={kf(frame, [s(1), s(3)], [0, -10])} />
          </At>
          <At x={1420} y={1040}>
            <CrewFigure who="anderson" frame={frame} scale={0.8} rim="#6fc3ff" headTurn={kf(frame, [s(0.5), s(2.5)], [0, 8])} />
          </At>
        </FlagBridge>
      </Camera>
      {/* a soft warm shift as the announcement lands */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 70%, rgba(255,200,140,0.08), rgba(0,0,0,0) 70%)', opacity: kf(frame, [0, s(4)], [0, 1])}} />
      <div style={{position: 'absolute', left: 96, bottom: 110, fontFamily: FONTS.ui, fontSize: 20, letterSpacing: 6, color: '#8fb6e0', opacity: fadeInOut(frame, s(0.5), s(1.2), s(3.6), s(4.2))}}>
        {`FIFTH FLEET — COMBAT INFORMATION CENTRE — ${Math.floor(t)}S AFTER THE ANNOUNCEMENT`}
      </div>
    </AbsoluteFill>
  );
};

export const Victory: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="victory.mp3" />
      <ChapterCard number={6} title="Victory" from={s(0.3)} to={s(3.2)} />

      <Sequence from={s(3)} durationInFrames={s(8.5)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(3), s(4), s(10.8), s(11.5))}}>
          <LastReaper />
        </AbsoluteFill>
      </Sequence>
      <LocationCaption text="HADES NEXUS" sub="THE LAST REAPER CAPITAL SHIP" from={s(4)} to={s(9)} />

      <Sequence from={s(11.5)} durationInFrames={s(7)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(11.5), s(12), s(17.8), s(18.5))}}>
          <Confirmation />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={s(18.5)} durationInFrames={s(15.8)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(18.5), s(19.5), s(33.6), s(34.3))}}>
          <HackettAlone />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={s(34.3)} durationInFrames={s(4.2)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(34.3), s(34.9), s(37.9), s(38.5))}}>
          <Crews />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={s(38.3)} durationInFrames={s(3.7)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(38.3), s(38.9), s(41.3), s(42))}}>
          <HackettAlone />
        </AbsoluteFill>
      </Sequence>

      <Subtitles cues={CUES_CH6} />
      <Grade vignette={0.85} grain={0.07} />
      <Fade opacity={kf(frame, [s(41.2), s(42)], [0, 1])} />
    </AbsoluteFill>
  );
};
