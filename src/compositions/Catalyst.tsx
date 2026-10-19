import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ChapterCard, CinematicText, LocationCaption} from '../effects/TextCards';
import {Grade, Fade} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Planet} from '../environments/Planet';
import {CatalystChamber, FlagBridge} from '../environments/Interiors';
import {Camera, At, Parallax} from '../camera/Camera';
import {Citadel} from '../spacecraft/Structures';
import {Normandy} from '../spacecraft/Normandy';
import {AllianceDreadnought, AllianceCruiser} from '../spacecraft/Alliance';
import {ShepardBack, CatalystFigure, HackettProfile, ShepardProfile} from '../characters/Silhouettes';
import {Subtitles, Cue} from '../subtitles/Subtitles';
import {Music, Sfx} from '../audio/Music';
import {fadeInOut, kf, rr, flicker, noise1} from '../animation/anim';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * CHAPTER TWO — THE CATALYST (112 s)
 *
 * 0:04 The Citadel, Wards open, the Crucible docked. Earth burns below.
 * 0:12 The chamber. Shepard, wounded, walks the last metres to the dais.
 * 0:15 The Catalyst appears and lays out Destroy, Control, Synthesis.
 * 0:40 The argument. Shepard refuses.
 * 1:24 Silence. The Crucible stays dark.
 * 1:30 Extraction: the Normandy at the Citadel.
 * 1:38 The flag bridge. Hackett and Shepard.
 */

export const CUES_CH2: Cue[] = [
  {start: 15.5, end: 19, speaker: 'CATALYST', text: 'You have reached the Crucible. Few cycles ever do.', position: 'bottom'},
  {start: 19.5, end: 21.5, speaker: 'SHEPARD', text: "Then I won't waste it. What are you?"},
  {start: 22, end: 25.5, speaker: 'CATALYST', text: 'The intelligence that directs the Reapers. I preserve order between organic and synthetic life.'},
  {start: 26, end: 29.5, speaker: 'CATALYST', text: 'You may destroy them. Every synthetic dies with them, including the ones you call crew.'},
  {start: 30, end: 33.5, speaker: 'CATALYST', text: 'You may control them. Your mind replaces mine. You would not remain yourself.'},
  {start: 34.5, end: 39, speaker: 'CATALYST', text: 'Or synthesis. Organic and synthetic made one, whether they consent or not.'},
  {start: 40.5, end: 43.5, speaker: 'CATALYST', text: 'The conflict will continue. Your resistance cannot change that.'},
  {start: 44, end: 46, speaker: 'SHEPARD', text: "We've already changed it."},
  {start: 47, end: 49.5, speaker: 'CATALYST', text: 'Your forces have suffered substantial losses.'},
  {start: 50, end: 51.5, speaker: 'SHEPARD', text: 'So have yours.'},
  {start: 53, end: 55.5, speaker: 'CATALYST', text: 'Your military advantage is temporary.'},
  {start: 56, end: 58.5, speaker: 'SHEPARD', text: "That's what you keep telling yourself."},
  {start: 60, end: 64, speaker: 'SHEPARD', text: "We know how to fight you now. We've got the fleets, the shipyards, the resources."},
  {start: 65, end: 67, speaker: 'SHEPARD', text: "And we're not fighting alone."},
  {start: 68.5, end: 71.5, speaker: 'CATALYST', text: 'The alternatives I have presented would end the conflict.'},
  {start: 72, end: 73.5, speaker: 'SHEPARD', text: 'On your terms.'},
  {start: 75, end: 78, speaker: 'SHEPARD', text: "You've been deciding our future for millions of years."},
  {start: 78.5, end: 80, speaker: 'SHEPARD', text: 'That ends now.'},
  {start: 81, end: 82.5, speaker: 'CATALYST', text: 'You choose refusal.'},
  {start: 83, end: 84.6, speaker: 'SHEPARD', text: 'I choose us.'},
  {start: 90.3, end: 93.1, speaker: 'HACKETT', text: 'Normandy, this is Hackett. The Crucible is dark. Get our people out of there.', radio: true},
  {start: 93.3, end: 95.5, speaker: 'JOKER', text: "Already on approach. EDI's got two life signs at the beam site.", radio: true},
  {start: 95.8, end: 97.8, speaker: 'EDI', text: 'Commander Shepard and Admiral Anderson. Both alive.', radio: true},
  {start: 100, end: 101.2, speaker: 'HACKETT', text: 'The Crucible?'},
  {start: 101.6, end: 102.8, speaker: 'SHEPARD', text: 'Not firing.'},
  {start: 103.2, end: 104.2, speaker: 'HACKETT', text: 'Understood.'},
  {start: 105.6, end: 107.2, speaker: 'SHEPARD', text: 'We can still win this.'},
  {start: 107.6, end: 108.5, speaker: 'HACKETT', text: 'I know.'},
  {start: 109.6, end: 111.4, speaker: 'HACKETT', text: "Let's get back to work."},
];

const CitadelExterior: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = {x: kf(frame, [0, s(8)], [1000, 1060]), y: kf(frame, [0, s(8)], [560, 520]), zoom: kf(frame, [0, s(8)], [1.0, 1.18])};
  return (
    <AbsoluteFill>
      <Camera cam={cam}>
        <Parallax cam={cam} factor={0.1}>
          <Starfield seed="citadel" brightness={0.8} nebula="violet" />
        </Parallax>
        <Parallax cam={cam} factor={0.3}>
          <At x={400} y={1500}>
            <Planet kind="earth" radius={900} rotation={60} sunAngle={330} litFraction={0.4} damage={0.6} />
          </At>
        </Parallax>
        {/* battle flashes around the station */}
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{position: 'absolute', left: rr(`cx${i}`, 300, 1700), top: rr(`cy${i}`, 100, 900), width: 3, height: 3, borderRadius: 2, background: i % 3 === 0 ? '#ff4a2a' : '#bfe3ff', boxShadow: i % 3 === 0 ? '0 0 8px 2px rgba(255,42,26,0.6)' : '0 0 6px 1px rgba(159,212,255,0.5)', opacity: 0.3 + 0.7 * (0.5 + 0.5 * noise1(frame * rr(`cf${i}`, 0.3, 1.5), i))}} />
        ))}
        <At x={1250} y={520}>
          <div style={{transform: 'perspective(2400px) rotateX(48deg) rotateZ(-20deg)', transformOrigin: '0 0'}}>
            <Citadel scale={0.62} rotation={frame * 0.02} withCrucible />
          </div>
        </At>
        {[...Array(5)].map((_, i) => (
          <At key={i} x={500 + i * 120 + frame * 0.2} y={760 + i * 30}>
            <AllianceCruiser scale={0.09} thrust={0.6} />
          </At>
        ))}
      </Camera>
    </AbsoluteFill>
  );
};

const Chamber: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS; // scene-local seconds; scene starts at chapter 12 s → chapter time = t + 12
  const ct = t + 12;
  // Shepard walks up the walkway for the first 6 seconds, then stands.
  const walk = kf(frame, [0, s(6)], [0, 1]);
  const shepY = 1230 - walk * 190; // feet position (lower-left foreground, over the shoulder)
  const shepX = 560 + walk * 60;
  const shepScale = 1.0 - walk * 0.18;
  const limp = walk < 1 ? Math.abs(Math.sin(t * 4.2)) * 6 : 0;
  const catalystIn = kf(frame, [s(3), s(6)], [0, 1]);
  const catalystOut = ct >= 84.6 ? kf(frame, [s(84.6 - 12), s(88 - 12)], [1, 0]) : 1;
  const destroy = fadeInOut(frame, s(26 - 12), s(27 - 12), s(29.5 - 12), s(31 - 12));
  const control = fadeInOut(frame, s(30 - 12), s(31 - 12), s(33.5 - 12), s(35 - 12));
  const synthesis = fadeInOut(frame, s(34.5 - 12), s(35.5 - 12), s(39 - 12), s(40.5 - 12));
  const dimAfter = ct >= 84.6 ? kf(frame, [s(84.6 - 12), s(89 - 12)], [1, 0.25]) : 1;

  // Camera language: wide for Shepard's approach, closer on the Catalyst for its lines, settle between.
  const catalystLine = CUES_CH2.some((c) => c.speaker === 'CATALYST' && ct >= c.start - 0.4 && ct < c.end);
  const shepardLine = CUES_CH2.some((c) => c.speaker === 'SHEPARD' && ct >= c.start - 0.4 && ct < c.end);
  const targetZoom = ct < 20 ? 1.0 : catalystLine ? 1.3 : shepardLine ? 1.14 : 1.06;
  const targetY = ct < 20 ? 600 : catalystLine ? 540 : shepardLine ? 620 : 580;
  const targetX = ct < 20 ? 960 : catalystLine ? 1010 : shepardLine ? 820 : 940;
  const zoom = targetZoom + 0.015 * Math.sin(t * 0.3);
  const cam = {x: targetX + 6 * noise1(t * 0.2, 1), y: targetY + 4 * noise1(t * 0.25, 2), zoom};
  const finalPush = ct >= 78 && ct < 86 ? kf(frame, [s(78 - 12), s(86 - 12)], [0, 0.18]) : 0;

  return (
    <AbsoluteFill>
      <Sfx file="bridge-ambience.mp3" volume={0.25} />
      <Camera cam={{...cam, zoom: cam.zoom + finalPush}}>
        <CatalystChamber frame={frame} control={control} destroy={destroy} synthesis={synthesis} light={dimAfter} />
        {/* Catalyst on the dais */}
        <At x={1010} y={690}>
          <CatalystFigure frame={frame} scale={0.5} opacity={catalystIn * catalystOut} intensity={0.75 + 0.25 * (control + destroy + synthesis)} />
        </At>
        {/* Shepard, from behind, walking in */}
        <At x={shepX + Math.sin(t * 2.1) * limp * 0.3} y={shepY + limp}>
          <ShepardBack frame={frame} scale={shepScale} rim="#bfe9ff" headTurn={ct > 26 && ct < 29.5 ? 10 : ct > 30 && ct < 33.5 ? -10 : 0} />
        </At>
      </Camera>
      {/* floor glow reflection beneath Shepard */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 30% 12% at 32% 98%, rgba(154,220,255,0.12), rgba(0,0,0,0) 100%)', opacity: dimAfter}} />
    </AbsoluteFill>
  );
};

const Extraction: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = {x: kf(frame, [0, s(8)], [900, 1000]), y: 540, zoom: kf(frame, [0, s(8)], [1.0, 1.1])};
  const nx = kf(frame, [0, s(8)], [-300, 1150]);
  const ny = kf(frame, [0, s(8)], [780, 600]);
  return (
    <AbsoluteFill>
      <Sfx file="engine-rumble.mp3" volume={0.3} />
      <Camera cam={cam}>
        <Parallax cam={cam} factor={0.1}>
          <Starfield seed="extraction" brightness={0.8} nebula="violet" />
        </Parallax>
        <Parallax cam={cam} factor={0.3}>
          <At x={1600} y={1500}>
            <Planet kind="earth" radius={900} rotation={80} sunAngle={200} litFraction={0.4} damage={0.5} />
          </At>
        </Parallax>
        <At x={1300} y={300}>
          <div style={{transform: 'perspective(2400px) rotateX(55deg) rotateZ(-30deg)', transformOrigin: '0 0'}}>
            <Citadel scale={0.9} rotation={frame * 0.02 + 40} withCrucible />
          </div>
        </At>
        {[...Array(3)].map((_, i) => (
          <At key={i} x={300 + i * 420} y={240 + i * 60}>
            <AllianceDreadnought scale={0.14} thrust={0.5} lightFromLeft />
          </At>
        ))}
        <At x={nx} y={ny} rotate={-12}>
          <div style={{transform: 'perspective(1800px) rotateX(58deg)', transformOrigin: '0 0'}}>
            <Normandy scale={0.5} thrust={0.9} />
          </div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

const Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const ct = frame / FPS + 98;
  const cam = {x: 960, y: kf(frame, [0, s(14)], [600, 580]), zoom: kf(frame, [0, s(14)], [1.0, 1.1])};
  return (
    <AbsoluteFill>
      <Sfx file="bridge-ambience.mp3" volume={0.5} />
      <Camera cam={cam}>
        <FlagBridge frame={frame}>
          <At x={640} y={1020}>
            <HackettProfile frame={frame} scale={0.88} rim="#6fc3ff" headTurn={ct > 105 ? -6 : 0} />
          </At>
          <At x={1300} y={1030}>
            <ShepardProfile frame={frame} scale={0.88} rim="#6fc3ff" flip headTurn={ct > 101 && ct < 103 ? -4 : 0} />
          </At>
        </FlagBridge>
      </Camera>
    </AbsoluteFill>
  );
};

export const Catalyst: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="catalyst.mp3" />
      <ChapterCard number={2} title="The Catalyst" from={s(0.3)} to={s(4.2)} />

      <Sequence from={s(4)} durationInFrames={s(8.5)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(4), s(5.5), s(11.2), s(12.4))}}>
          <CitadelExterior />
        </AbsoluteFill>
      </Sequence>
      <LocationCaption text="THE CITADEL" sub="THE CRUCIBLE DOCKED — EARTH ORBIT" from={s(5.5)} to={s(11)} />

      <Sequence from={s(12)} durationInFrames={s(78)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(12), s(13.5), s(88.5), s(90))}}>
          <Chamber />
        </AbsoluteFill>
      </Sequence>
      <CinematicText text="The Crucible did not fire." from={s(86.5)} to={s(90)} size={40} tracking={6} weight={300} />

      <Sequence from={s(90)} durationInFrames={s(8.5)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(90), s(91), s(97.5), s(98.5))}}>
          <Extraction />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={s(98)} durationInFrames={s(14)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(98), s(99.2), s(110.8), s(112))}}>
          <Bridge />
        </AbsoluteFill>
      </Sequence>
      <LocationCaption text="SSV ORIZABA" sub="FIFTH FLEET FLAG BRIDGE — SIX HOURS LATER" from={s(99)} to={s(104)} />

      <Subtitles cues={CUES_CH2} />
      <Grade vignette={0.85} grain={0.07} tint="#0b1a33" tintOpacity={0.1} />
      <Fade opacity={kf(frame, [s(111), s(112)], [0, 1])} />
    </AbsoluteFill>
  );
};
