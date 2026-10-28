import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ChapterCard, ClosingLine, LocationCaption, MainTitle} from '../effects/TextCards';
import {Grade, Fade} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Planet} from '../environments/Planet';
import {Camera, At, Parallax} from '../camera/Camera';
import {AllianceDreadnought, AllianceCruiser} from '../spacecraft/Alliance';
import {TurianCruiser, TurianDreadnought} from '../spacecraft/Turian';
import {AsariCruiser, GethDreadnought, QuarianCruiser} from '../spacecraft/Allies';
import {Citadel} from '../spacecraft/Structures';
import {Normandy} from '../spacecraft/Normandy';
import {CrewFigure, SeatedFigure, ShepardBack, ShepardProfile} from '../characters/Silhouettes';
import {Subtitles, Cue} from '../subtitles/Subtitles';
import {Music, Sfx} from '../audio/Music';
import {fadeInOut, kf, rr, noise1} from '../animation/anim';
import {FONTS} from '../theme';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * CHAPTER SEVEN — THE FUTURE (84 s)
 * Reconstruction across the homeworlds, the Illusive Man watching, the
 * Normandy crew, and Shepard looking out over Earth.
 */

export const CUES_CH7: Cue[] = [
  {start: 20.5, end: 24, speaker: 'WREX', text: 'Took the galaxy long enough to work it out. The krogan were worth keeping.'},
  {start: 36.5, end: 41, speaker: 'ILLUSIVE MAN', text: "Humanity sits at the head of the table now. Whatever they say about how we got here, they'll say it from behind our ships."},
  {start: 43, end: 46.5, speaker: 'GARRUS', text: 'So. No beam, no last-second miracle. Just a lot of very large guns.'},
  {start: 47, end: 48.6, speaker: 'SHEPARD', text: 'You sound disappointed.'},
  {start: 49, end: 51.5, speaker: 'GARRUS', text: "I calibrated half of them. I'm taking the credit."},
  {start: 52.3, end: 55, speaker: 'TALI', text: "Keelah. We're alive. We're actually alive."},
  {start: 55.4, end: 58, speaker: 'LIARA', text: 'I keep waiting for someone to give the next order.'},
  {start: 58.4, end: 60, speaker: 'SHEPARD', text: 'No more orders tonight.'},
  {start: 60.4, end: 61.6, speaker: 'JOKER', text: 'So... shore leave?'},
  {start: 61.9, end: 64, speaker: 'EDI', text: 'I believe that is the appropriate response, Jeff.'},
];

const Shot: React.FC<{from: number; to: number; children: React.ReactNode; fade?: number}> = ({from, to, children, fade = 0.9}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, s(from), s(from + fade), s(to - fade), s(to));
  if (o <= 0) return null;
  return (
    <Sequence from={s(from)} durationInFrames={s(to - from)} layout="none">
      <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>
    </Sequence>
  );
};

const Civilian: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <At x={x} y={y}>
    <div style={{width: 26 * scale, height: 8 * scale, background: 'linear-gradient(90deg, #cfd6df, #8a95a3)', borderRadius: 3, boxShadow: '0 0 6px rgba(223,243,255,0.7)'}} />
    <div style={{position: 'absolute', left: -8 * scale, top: 2 * scale, width: 8 * scale, height: 4 * scale, background: '#9fd4ff', opacity: 0.8}} />
  </At>
);

const EarthRebuild: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(6)], [900, 1000]), y: 540, zoom: kf(frame, [0, s(6)], [1.0, 1.08])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="earth-rebuild" brightness={0.85} nebula="blue" />
      </Parallax>
      <Parallax cam={cam} factor={0.3}>
        <At x={1500} y={1250}>
          <Planet kind="earth" radius={820} rotation={-40 + t * 0.02} sunAngle={210} litFraction={0.5} damage={0.12} />
        </At>
      </Parallax>
      {/* orbital yards */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${260 + k * 520} ${220 + k * 120}) scale(0.5)`}>
            {[...Array(10)].map((_, i) => (
              <g key={i}>
                <rect x={i * 80} y={0} width={5} height={300} fill="#2a3644" />
                <line x1={i * 80} y1={0} x2={i * 80 + 80} y2={300} stroke="#1f2a36" strokeWidth="2" />
              </g>
            ))}
            <rect x={-20} y={-30} width={860} height={30} fill="#1f2a36" />
            <rect x={-20} y={300} width={860} height={30} fill="#1f2a36" />
            {[...Array(12)].map((_, i) => (
              <rect key={`l${i}`} x={i * 70} y={-22} width={24} height={6} fill="#ff8a1f" opacity={0.5 + 0.4 * Math.sin(frame * 0.2 + i + k)} />
            ))}
          </g>
        ))}
      </svg>
      <At x={470} y={300}>
        <AllianceCruiser scale={0.2} thrust={0} lightFromLeft />
      </At>
      <At x={990} y={420}>
        <AllianceDreadnought scale={0.22} thrust={0} lightFromLeft />
      </At>
      {[...Array(10)].map((_, i) => (
        <Civilian key={i} x={((rr(`cx${i}`, 0, 1800) + t * rr(`cs${i}`, 20, 60)) % 1900)} y={rr(`cy${i}`, 200, 950)} scale={rr(`csc${i}`, 0.6, 1.2)} />
      ))}
    </Camera>
  );
};

const PlanetShot: React.FC<{kind: 'palaven' | 'thessia' | 'rannoch'; seed: number; children?: React.ReactNode; nebula?: 'amber' | 'violet' | 'blue'}> = ({kind, seed, children, nebula = 'blue'}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(6)], [940, 1000]), y: 540, zoom: kf(frame, [0, s(6)], [1.0, 1.06])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed={`${kind}-future`} brightness={0.8} nebula={nebula} />
      </Parallax>
      <Parallax cam={cam} factor={0.3}>
        <At x={1400} y={1250}>
          <Planet kind={kind} radius={820} rotation={t} sunAngle={200} litFraction={0.5} seed={seed} />
        </At>
      </Parallax>
      {children}
    </Camera>
  );
};

const Tuchanka: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sun = kf(frame, [0, s(6)], [0, 1]);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #120a06 0%, #3a1a0c 45%, #b35a1f 72%, #ffb067 100%)'}}>
      {/* sun rising over the horizon */}
      <div style={{position: 'absolute', left: 1180, top: 700 - sun * 120, width: 260, height: 260, borderRadius: 130, background: 'radial-gradient(circle, #fff1cc 0%, #ffc26b 45%, rgba(255,160,80,0) 72%)', filter: 'blur(2px)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(60,20,8,0.5) 100%)'}} />
      {/* ruined skyline and the new city cranes */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        {[...Array(18)].map((_, i) => (
          <rect key={i} x={i * 110 + rr(`bx${i}`, -20, 20)} y={720 - rr(`bh${i}`, 20, 140)} width={rr(`bw${i}`, 30, 80)} height={400} fill="#1a0e08" />
        ))}
        {[...Array(5)].map((_, i) => (
          <g key={`c${i}`}>
            <rect x={300 + i * 330} y={520} width={6} height={260} fill="#120a06" />
            <rect x={300 + i * 330} y={520} width={160} height={5} fill="#120a06" />
            <circle cx={300 + i * 330 + 150} cy={525} r={3} fill="#ffb067" opacity={0.5 + 0.5 * Math.sin(frame * 0.2 + i)} />
          </g>
        ))}
        {/* foreground ridge */}
        <path d="M0 1080 L0 820 Q300 760 600 800 T1200 790 T1920 830 L1920 1080 Z" fill="#0b0604" />
      </svg>
      {/* Wrex and Eve on the ridge, backlit by the sunrise */}
      <At x={760} y={818}>
        <CrewFigure who="wrex" frame={frame} scale={0.42} rim="#ffb067" key="#3a1a0c" headTurn={kf(frame, [s(1), s(3)], [0, 10])} />
      </At>
      <At x={900} y={822}>
        <CrewFigure who="eve" frame={frame} scale={0.38} rim="#ffb067" key="#3a1a0c" flip headTurn={kf(frame, [s(2), s(4)], [0, -8])} />
      </At>
      {/* dust in the air */}
      {[...Array(24)].map((_, i) => (
        <div key={i} style={{position: 'absolute', left: rr(`dx${i}`, 0, 1920) + Math.sin(t + i) * 20, top: rr(`dy${i}`, 500, 900) - t * rr(`dv${i}`, 4, 12), width: 3, height: 3, borderRadius: 2, background: '#ffd9a0', opacity: 0.3 + 0.3 * noise1(t * 2, i)}} />
      ))}
    </AbsoluteFill>
  );
};

const CitadelShot: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: 960, y: 540, zoom: kf(frame, [0, s(5)], [1.0, 1.1])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="citadel-future" brightness={0.85} nebula="violet" />
      </Parallax>
      <At x={1150} y={520}>
        <div style={{transform: 'perspective(2400px) rotateX(50deg) rotateZ(-15deg)', transformOrigin: '0 0'}}>
          <Citadel scale={0.7} rotation={t * 1.2} />
        </div>
      </At>
      {[...Array(14)].map((_, i) => (
        <Civilian key={i} x={((rr(`vx${i}`, 0, 1800) + t * rr(`vs${i}`, 30, 80)) % 1900)} y={rr(`vy${i}`, 150, 950)} scale={rr(`vsc${i}`, 0.5, 1)} />
      ))}
      <At x={400} y={300}>
        <AsariCruiser scale={0.18} thrust={0.4} />
      </At>
      <At x={500} y={800}>
        <TurianCruiser scale={0.16} thrust={0.4} />
      </At>
    </Camera>
  );
};

const IllusiveMan: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: 960, y: 560, zoom: kf(frame, [0, s(7)], [1.0, 1.1])};
  return (
    <AbsoluteFill style={{background: '#02040a'}}>
      <Sfx file="bridge-ambience.mp3" volume={0.25} />
      <Camera cam={cam}>
        {/* the window: Earth, the fleet, the yards */}
        <AbsoluteFill style={{overflow: 'hidden'}}>
          <Starfield seed="tim" brightness={0.7} nebula="blue" />
          <At x={1300} y={1250}>
            <Planet kind="earth" radius={760} rotation={10 + t * 0.02} sunAngle={200} litFraction={0.5} damage={0.1} />
          </At>
          {[...Array(4)].map((_, i) => (
            <At key={i} x={600 + i * 300 - t * 10} y={300 + i * 60}>
              <AllianceDreadnought scale={0.12} thrust={0.4} lightFromLeft />
            </At>
          ))}
        </AbsoluteFill>
        {/* a dark floor and the figure in silhouette against the window */}
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,4,10,0) 60%, rgba(2,4,10,0.95) 78%, #02040a 100%)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(2,4,10,0.9) 0%, rgba(2,4,10,0) 20%, rgba(2,4,10,0) 80%, rgba(2,4,10,0.9) 100%)'}} />
        <At x={820} y={1040}>
          <SeatedFigure frame={frame} scale={1.0} rim="#6fc3ff" />
        </At>
        {/* holographic panels at the right hand */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 1180 + i * 150, top: 560 + i * 24, width: 130, height: 80, border: '1px solid rgba(255,138,31,0.5)', background: 'rgba(255,138,31,0.06)', transform: `perspective(800px) rotateY(-30deg)`, opacity: 0.6 + 0.3 * Math.sin(t * 2 + i)}}>
            <div style={{margin: 8, height: 4, width: 70 + 30 * Math.sin(t + i), background: '#ff8a1f', opacity: 0.8}} />
            <div style={{margin: 8, height: 4, width: 50, background: '#6fc3ff', opacity: 0.6}} />
            <div style={{margin: 8, height: 4, width: 90, background: '#ff8a1f', opacity: 0.4}} />
          </div>
        ))}
      </Camera>
    </AbsoluteFill>
  );
};

const CrewReunion: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS; // scene starts at chapter 42 s
  const ct = t + 42;
  const speaking = (name: string) => CUES_CH7.some((c) => c.speaker === name && ct >= c.start - 0.3 && ct < c.end);
  const cam = {x: kf(frame, [0, s(21)], [900, 1000]), y: 600, zoom: kf(frame, [0, s(21)], [1.0, 1.1])};
  const turn = (name: string, dir: number) => (speaking(name) ? dir * 8 : 0);
  return (
    <AbsoluteFill style={{background: '#02040a'}}>
      <Sfx file="bridge-ambience.mp3" volume={0.3} />
      <Camera cam={cam}>
        {/* observation deck window with Earth */}
        <AbsoluteFill style={{overflow: 'hidden'}}>
          <Starfield seed="deck" brightness={0.8} nebula="blue" />
          <At x={1500} y={1300}>
            <Planet kind="earth" radius={820} rotation={30 + t * 0.02} sunAngle={200} litFraction={0.5} damage={0.1} />
          </At>
        </AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={0} y={0} width={1920} height={110} fill="#05080c" />
          <rect x={0} y={760} width={1920} height={320} fill="#05080c" />
          <line x1={0} y1={760} x2={1920} y2={760} stroke="#1a2430" strokeWidth="2" />
          {[...Array(5)].map((_, i) => (
            <rect key={i} x={i * 480} y={110} width={6} height={650} fill="#0e1620" />
          ))}
          <rect x={0} y={110} width={160} height={650} fill="#05080c" />
          <rect x={1760} y={110} width={160} height={650} fill="#05080c" />
          {[...Array(6)].map((_, i) => (
            <circle key={`l${i}`} cx={200 + i * 300} cy={790} r={3} fill="#9fd4ff" opacity={0.5 + 0.3 * Math.sin(frame * 0.1 + i)} />
          ))}
        </svg>
        {/* the crew, left to right: Joker, EDI, Tali, Shepard (profile, facing the others), Garrus, Liara */}
        <At x={420} y={1000}>
          <CrewFigure who="joker" frame={frame} scale={0.74} rim="#9fd4ff" headTurn={turn('JOKER', 1)} />
        </At>
        <At x={580} y={1010}>
          <CrewFigure who="edi" frame={frame} scale={0.78} rim="#8fe8ff" headTurn={turn('EDI', 1)} />
        </At>
        <At x={760} y={1010}>
          <CrewFigure who="tali" frame={frame} scale={0.76} rim="#d9b3ff" headTurn={turn('TALI', 1)} />
        </At>
        <At x={1000} y={1020}>
          <ShepardProfile frame={frame} scale={0.82} rim="#9fd4ff" flip headTurn={speaking('SHEPARD') ? -6 : 0} />
        </At>
        <At x={1260} y={1012}>
          <CrewFigure who="garrus" frame={frame} scale={0.84} rim="#8fc0ff" flip headTurn={turn('GARRUS', -1)} />
        </At>
        <At x={1470} y={1008}>
          <CrewFigure who="liara" frame={frame} scale={0.76} rim="#b48cff" flip headTurn={turn('LIARA', -1)} />
        </At>
        <At x={1300} y={320} rotate={-10}>
          <div style={{transform: 'perspective(1800px) rotateX(60deg)', transformOrigin: '0 0', opacity: 0.0}}>
            <Normandy scale={0.2} />
          </div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

const FinalShot: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(6), s(12)], [900, 960, 960]), y: kf(frame, [0, s(6), s(12)], [600, 560, 540]), zoom: kf(frame, [0, s(6), s(12)], [1.2, 1.0, 0.8])};
  const shepardFade = kf(frame, [s(4.5), s(7)], [1, 0]);
  return (
    <AbsoluteFill style={{background: '#02040a'}}>
      <Camera cam={cam}>
        <Parallax cam={cam} factor={0.1}>
          <Starfield seed="final" brightness={0.9} nebula="blue" />
        </Parallax>
        <At x={1150} y={1250}>
          <Planet kind="earth" radius={900} rotation={-10 + t * 0.03} sunAngle={215} litFraction={0.5} damage={0.1} />
        </At>
        {/* yards and traffic */}
        {[...Array(5)].map((_, i) => (
          <At key={i} x={300 + i * 350 - t * 12} y={260 + i * 50}>
            <AllianceCruiser scale={0.14} thrust={0.5} lightFromLeft />
          </At>
        ))}
        {[...Array(12)].map((_, i) => (
          <Civilian key={i} x={((rr(`zx${i}`, 0, 1800) + t * rr(`zs${i}`, 20, 60)) % 1900)} y={rr(`zy${i}`, 200, 900)} scale={rr(`zsc${i}`, 0.5, 1)} />
        ))}
        <At x={1300} y={700} rotate={-20}>
          <div style={{transform: 'perspective(1800px) rotateX(58deg)', transformOrigin: '0 0'}}>
            <Normandy scale={0.26} thrust={0.6} />
          </div>
        </At>
        {/* viewport frame and Shepard from behind, fading as the camera withdraws into space */}
        <AbsoluteFill style={{opacity: shepardFade}}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
            <rect x={0} y={0} width={1920} height={100} fill="#05080c" />
            <rect x={0} y={880} width={1920} height={200} fill="#05080c" />
            <rect x={0} y={100} width={120} height={780} fill="#05080c" />
            <rect x={1800} y={100} width={120} height={780} fill="#05080c" />
          </svg>
          <At x={700} y={1090}>
            <ShepardBack frame={frame} scale={0.95} rim="#bfe9ff" headTurn={kf(frame, [s(2), s(5)], [0, 6])} />
          </At>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

export const Future: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="future.mp3" />
      <ChapterCard number={7} title="The Future" from={s(0.3)} to={s(3.2)} />

      <Shot from={3} to={9}>
        <EarthRebuild />
      </Shot>
      <LocationCaption text="EARTH" sub="RECONSTRUCTION — ARCTURUS AND LUNA YARDS OPERATING" from={s(3.8)} to={s(8.5)} />

      <Shot from={9} to={14}>
        <PlanetShot kind="palaven" seed={4} nebula="amber">
          {[0, 1, 2].map((i) => (
            <At key={i} x={300 + i * 330} y={300 + i * 90}>
              <TurianDreadnought scale={0.18} thrust={0.3} />
            </At>
          ))}
        </PlanetShot>
      </Shot>
      <LocationCaption text="PALAVEN" sub="THE HIERARCHY REBUILDS" from={s(9.7)} to={s(13.6)} color="#ffb347" />

      <Shot from={14} to={19}>
        <PlanetShot kind="thessia" seed={3} nebula="violet">
          {[0, 1].map((i) => (
            <At key={i} x={350 + i * 400} y={340 + i * 160}>
              <AsariCruiser scale={0.2} thrust={0.3} />
            </At>
          ))}
        </PlanetShot>
      </Shot>
      <LocationCaption text="THESSIA" sub="THE REPUBLICS RECOVER" from={s(14.7)} to={s(18.6)} color="#b48cff" />

      <Shot from={19} to={25}>
        <Tuchanka />
      </Shot>
      <LocationCaption text="TUCHANKA" sub="WREX AND EVE — A NEW KROGAN FUTURE" from={s(19.7)} to={s(24.5)} color="#ff9e6b" />

      <Shot from={25} to={30}>
        <PlanetShot kind="rannoch" seed={5} nebula="amber">
          <At x={420} y={380}>
            <GethDreadnought scale={0.2} thrust={0.3} />
          </At>
          <At x={520} y={620}>
            <QuarianCruiser scale={0.2} thrust={0.3} />
          </At>
        </PlanetShot>
      </Shot>
      <LocationCaption text="RANNOCH" sub="GETH AND QUARIANS — HOME" from={s(25.7)} to={s(29.6)} color="#d9b3ff" />

      <Shot from={30} to={35}>
        <CitadelShot />
      </Shot>
      <LocationCaption text="THE CITADEL" sub="THE COUNCIL CONVENES" from={s(30.7)} to={s(34.6)} />

      <Shot from={35} to={42}>
        <IllusiveMan />
      </Shot>
      <LocationCaption text="CERBERUS" sub="UNDISCLOSED LOCATION" from={s(35.7)} to={s(40)} color="#ff9b2b" />

      <Shot from={42} to={64.5}>
        <CrewReunion />
      </Shot>
      <LocationCaption text="NORMANDY SR-2" sub="OBSERVATION DECK — EARTH ORBIT" from={s(42.7)} to={s(47)} />

      <Shot from={64.5} to={77} fade={1.2}>
        <FinalShot />
      </Shot>

      <ClosingLine text="THE CYCLE WAS BROKEN." from={s(72)} to={s(75.5)} size={44} />
      <ClosingLine text="THE FUTURE WAS NOT GIVEN." from={s(75.5)} to={s(79)} size={44} />
      <ClosingLine text="IT WAS WON." from={s(79)} to={s(82.5)} size={52} />

      <Sequence from={s(80.5)} durationInFrames={s(3.5)} layout="none">
        <MainTitle from={0} to={s(3.5)} showTagline />
      </Sequence>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center', fontFamily: FONTS.ui, fontSize: 16, letterSpacing: 4, color: '#5d6b7a', opacity: fadeInOut(frame, s(81.5), s(82.5), s(83.5), s(84))}}>
        AN UNOFFICIAL FAN PRODUCTION. MASS EFFECT IS A TRADEMARK OF ELECTRONIC ARTS / BIOWARE. ALL ART, WRITING AND MUSIC HERE ARE ORIGINAL.
      </div>

      <Subtitles cues={CUES_CH7} />
      <Grade vignette={0.8} grain={0.06} />
      <Fade opacity={kf(frame, [s(83.4), s(84)], [0, 1])} />
    </AbsoluteFill>
  );
};
