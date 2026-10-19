import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ChapterCard, CinematicText, LocationCaption} from '../effects/TextCards';
import {Grade, Fade, Flash} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Planet} from '../environments/Planet';
import {GalaxyMap} from '../environments/GalaxyMap';
import {Camera, At, Parallax} from '../camera/Camera';
import {AllianceDreadnought, AllianceCruiser} from '../spacecraft/Alliance';
import {TurianDreadnought, TurianCruiser} from '../spacecraft/Turian';
import {AsariCruiser, CerberusCruiser, GethDreadnought, QuarianCruiser, Fighter} from '../spacecraft/Allies';
import {Reaper, reaperAperture, ReaperBeam} from '../spacecraft/Reaper';
import {Normandy} from '../spacecraft/Normandy';
import {MassRelay} from '../spacecraft/Structures';
import {Explosion, ShieldImpact, Slug} from '../effects/Weapons';
import {HudFrame, HudReadout, Reticle, HudBar} from '../effects/Hud';
import {Subtitles, Cue} from '../subtitles/Subtitles';
import {Music, Sfx} from '../audio/Music';
import {fadeInOut, kf, rr, flicker, progress, noise1} from '../animation/anim';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * CHAPTER THREE — THE LONG WAR (66 s)
 * A montage. The refusal was not the victory; this is the campaign.
 */

export const CUES_CH3: Cue[] = [
  {start: 17, end: 20.5, speaker: 'SALARIAN INTEL', text: 'Barrier emitters cycle every eleven seconds. Hit the same plate inside that window and it stays down.', radio: true},
  {start: 24, end: 27, speaker: 'FLEET', text: 'All groups, synchronise on the asari lead. Fire on her mark.', radio: true},
  {start: 35, end: 38, speaker: 'CERBERUS', text: 'Black Fleet, weapons free. Hit the staging area and fade before they can turn.', radio: true},
  {start: 41, end: 44.5, speaker: 'EDI', text: 'Fourteen capital signatures at the relay. They are holding position, Commander. They are not advancing.', radio: true},
  {start: 50, end: 54, speaker: 'HACKETT', text: "They're not replacing their losses. We are. Keep the pressure on every front.", radio: true},
  {start: 56, end: 59.5, speaker: 'SHEPARD', text: 'Hold the corridors open. Nobody fights alone out there.', radio: true},
];

/** Shot wrapper with its own fade. */
const Shot: React.FC<{from: number; to: number; children: React.ReactNode; fade?: number}> = ({from, to, children, fade = 0.8}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, s(from), s(from + fade), s(to - fade), s(to));
  if (o <= 0) return null;
  return (
    <Sequence from={s(from)} durationInFrames={s(to - from)} layout="none">
      <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>
    </Sequence>
  );
};

const Shipyard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(7)], [900, 1000]), y: 540, zoom: kf(frame, [0, s(7)], [1.0, 1.12])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="yard" brightness={0.7} nebula="blue" />
      </Parallax>
      <Parallax cam={cam} factor={0.3}>
        <At x={1500} y={1500}>
          <Planet kind="generic" radius={800} rotation={t} sunAngle={220} seed={9} />
        </At>
      </Parallax>
      {/* drydock lattice */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        {[...Array(14)].map((_, i) => (
          <g key={i}>
            <rect x={240 + i * 100} y={300} width={6} height={480} fill="#2a3644" />
            <rect x={240 + i * 100} y={300} width={100} height={5} fill="#3a4756" />
            <rect x={240 + i * 100} y={775} width={100} height={5} fill="#3a4756" />
            <line x1={240 + i * 100} y1={300} x2={340 + i * 100} y2={780} stroke="#1f2a36" strokeWidth="2" />
          </g>
        ))}
        <rect x={200} y={260} width={1480} height={40} fill="#1f2a36" stroke="#0d1218" />
        <rect x={200} y={780} width={1480} height={40} fill="#1f2a36" stroke="#0d1218" />
        {[...Array(20)].map((_, i) => (
          <rect key={`l${i}`} x={230 + i * 72} y={272} width={30} height={6} fill="#ff8a1f" opacity={0.5 + 0.4 * Math.sin(frame * 0.2 + i)} />
        ))}
      </svg>
      {/* dreadnought under construction: completed aft, exposed frame forward */}
      <At x={960} y={540}>
        <AllianceDreadnought scale={1.05} thrust={0} lightFromLeft />
      </At>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        {/* unfinished bow: cut away with ribs */}
        <rect x={1200} y={430} width={340} height={230} fill="#02040a" opacity="0.92" />
        {[...Array(7)].map((_, i) => (
          <path key={i} d={`M${1210 + i * 48} 470 Q${1230 + i * 48} 545 ${1210 + i * 48} 620`} fill="none" stroke="#5d6c80" strokeWidth="4" />
        ))}
        <line x1={1200} y1={545} x2={1540} y2={545} stroke="#5d6c80" strokeWidth="5" />
        {/* welding sparks */}
        {[...Array(5)].map((_, i) => {
          const on = noise1(frame * 0.9, i * 3) > 0.2;
          const x = 1220 + ((i * 97 + frame * 0.5) % 300);
          const y = 480 + ((i * 53) % 150);
          return on ? (
            <g key={`w${i}`}>
              <circle cx={x} cy={y} r={5} fill="#fff6e0" />
              <circle cx={x} cy={y} r={16} fill="#ffd27a" opacity="0.35" />
              {[...Array(5)].map((_, k) => (
                <line key={k} x1={x} y1={y} x2={x + rr(`sx${i}${k}${Math.floor(frame / 3)}`, -30, 30)} y2={y + rr(`sy${i}${k}${Math.floor(frame / 3)}`, 0, 40)} stroke="#ffb347" strokeWidth="1.2" opacity="0.8" />
              ))}
            </g>
          ) : null;
        })}
      </svg>
      {/* work shuttles */}
      {[...Array(4)].map((_, i) => (
        <At key={i} x={500 + ((frame * (0.8 + i * 0.3) + i * 300) % 1100)} y={380 + i * 90}>
          <div style={{width: 14, height: 6, background: '#9fb0c4', boxShadow: '0 0 6px #9fd4ff'}} />
        </At>
      ))}
    </Camera>
  );
};

const TurianLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(6)], [960, 1010]), y: 520, zoom: kf(frame, [0, s(6)], [1.0, 1.08])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="menae" brightness={0.75} nebula="amber" />
      </Parallax>
      <Parallax cam={cam} factor={0.3}>
        <At x={-200} y={1300}>
          <Planet kind="palaven" radius={1000} rotation={t} sunAngle={300} seed={4} />
        </At>
      </Parallax>
      {[...Array(5)].map((_, i) => (
        <At key={i} x={200 + i * 260 + t * 60} y={300 + i * 110}>
          <TurianDreadnought scale={0.3 - i * 0.03} thrust={0.9} />
        </At>
      ))}
      {[...Array(8)].map((_, i) => (
        <At key={`c${i}`} x={100 + i * 190 + t * 75} y={680 + (i % 3) * 60}>
          <TurianCruiser scale={0.16} thrust={0.9} />
        </At>
      ))}
    </Camera>
  );
};

const SalarianIntel: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = (frame * 6) % 1200;
  return (
    <AbsoluteFill style={{background: '#02070a'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(20,60,40,0.35), rgba(0,0,0,0) 70%)'}} />
      <At x={960} y={560}>
        <div style={{filter: 'grayscale(1) brightness(1.4)', opacity: 0.9}}>
          <Reaper scale={0.55} glow={0.6} />
        </div>
      </At>
      {/* scan line and highlighted plate */}
      <div style={{position: 'absolute', left: 560, top: 0, width: 800, height: 1080, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: scan - 600, width: 800, height: 3, background: '#9dffb0', boxShadow: '0 0 14px #9dffb0', opacity: 0.8}} />
      </div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M900 330 Q960 350 1020 330" fill="none" stroke="#9dffb0" strokeWidth="3" opacity={0.6 + 0.4 * Math.sin(frame * 0.3)} />
        <path d="M905 335 Q960 354 1015 335 L1010 345 Q960 362 910 345 Z" fill="#9dffb0" opacity={0.25 + 0.2 * Math.sin(frame * 0.3)} />
        <line x1={1020} y1={330} x2={1260} y2={240} stroke="#9dffb0" strokeWidth="1.2" />
        <line x1={1260} y1={240} x2={1500} y2={240} stroke="#9dffb0" strokeWidth="1.2" />
      </svg>
      <Reticle x={960} y={340} progress={kf(frame, [0, s(2)], [0, 1])} size={120} color="#9dffb0" label="BARRIER EMITTER — PLATE 7" />
      <HudFrame from={0} to={s(6)} label="SPECIAL TASKS GROUP — COMBAT DATA ANALYSIS" color="#9dffb0">
        <HudReadout x={0} y={40} lines={['SOURCE: ALLIED FIRE-CONTROL LOGS, 212 ENGAGEMENTS', 'BARRIER EMITTER CYCLE: 11.2 S', 'WINDOW FOR FOLLOW-UP HIT: 2.4 S', 'RECOMMENDATION: SYNCHRONISED VOLLEYS, SAME PLATE']} color="#9dffb0" />
        <HudReadout x={0} y={40} align="right" lines={['SUR\'KESH', 'CLASSIFIED — DALATRASS EYES ONLY', 'DISTRIBUTION: ALL ALLIED COMMANDS']} color="#9dffb0" />
        <HudBar x={0} y={1000 - 70 - 100} value={kf(frame, [0, s(5)], [0.2, 0.97])} label="MODEL CONFIDENCE" color="#9dffb0" />
      </HudFrame>
    </AbsoluteFill>
  );
};

const JointOps: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: 960, y: 540, zoom: kf(frame, [0, s(6)], [1.0, 1.1])};
  const volley = progress(frame, s(2.8), s(3.6));
  const kill = progress(frame, s(3.8), s(6));
  const rx = 1400;
  const ry = 420;
  return (
    <>
      <Sequence from={s(2.8)} layout="none">
        <Sfx file="ma-shot.mp3" volume={0.5} />
      </Sequence>
      <Sequence from={s(3.8)} layout="none">
        <Sfx file="explosion-large.mp3" volume={0.8} />
      </Sequence>
      <Camera cam={cam}>
        <Parallax cam={cam} factor={0.1}>
          <Starfield seed="joint" brightness={0.8} nebula="violet" />
        </Parallax>
        <At x={300} y={360}>
          <AsariCruiser scale={0.3} muzzle={volley > 0 && volley < 0.3 ? 1 : 0} />
        </At>
        <At x={240} y={560}>
          <AllianceCruiser scale={0.28} lightFromLeft muzzle={volley > 0 && volley < 0.3 ? 1 : 0} />
        </At>
        <At x={420} y={760}>
          <GethDreadnought scale={0.22} muzzle={volley > 0 && volley < 0.3 ? 1 : 0} />
        </At>
        <At x={160} y={880}>
          <QuarianCruiser scale={0.2} />
        </At>
        <At x={600} y={240}>
          <AllianceDreadnought scale={0.2} lightFromLeft muzzle={volley > 0 && volley < 0.3 ? 1 : 0} />
        </At>
        {[...Array(6)].map((_, i) => (
          <At key={i} x={700 + ((i * 160 + t * 220) % 900)} y={300 + i * 80}>
            <Fighter scale={0.6} />
          </At>
        ))}
        {kill < 0.8 ? (
          <At x={rx} y={ry} rotate={110} opacity={1 - Math.max(0, (kill - 0.5) * 2)}>
            <Reaper variant="destroyer" scale={0.42} limbPhase={t} damage={kill * 2} />
          </At>
        ) : null}
        {[0, 1, 2, 3, 4].map((k) => (
          <React.Fragment key={k}>
            <Slug x0={[300, 240, 420, 600, 320][k] + 150} y0={[360, 560, 760, 240, 470][k]} x1={rx + rr(`jx${k}`, -30, 30)} y1={ry + rr(`jy${k}`, -40, 40)} t={progress(frame, s(2.8 + k * 0.05), s(3.7 + k * 0.05))} color={k === 0 ? '#e3d4ff' : k === 2 ? '#dff6ff' : '#cfe9ff'} />
            <ShieldImpact x={rx + rr(`jx${k}`, -30, 30)} y={ry + rr(`jy${k}`, -40, 40)} t={progress(frame, s(3.7 + k * 0.05), s(4.2 + k * 0.05))} size={0.9} color="#ffb067" />
          </React.Fragment>
        ))}
        <Explosion x={rx} y={ry} t={kill} size={1.8} seed="joint" debris={30} />
      </Camera>
      <Flash opacity={fadeInOut(frame, s(3.8), s(3.9), s(4.0), s(4.5)) * 0.5} />
    </>
  );
};

const KroganLanding: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: 960, y: 540, zoom: kf(frame, [0, s(5)], [1.05, 1.0])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="krogan" brightness={0.6} nebula="amber" />
      </Parallax>
      <At x={960} y={1700}>
        <Planet kind="tuchanka" radius={1300} rotation={t * 0.5} sunAngle={250} seed={12} damage={0.4} />
      </At>
      {/* drop pods streaking down */}
      {[...Array(16)].map((_, i) => {
        const p = ((t * 0.35 + rr(`kp${i}`, 0, 1)) % 1);
        const x = 300 + rr(`kx${i}`, 0, 1300) + p * 120;
        const y = 150 + p * 500;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: 4, height: 70, background: 'linear-gradient(180deg, rgba(255,160,90,0) 0%, #ffb067 70%, #fff3d6 100%)', transform: 'rotate(-12deg)', opacity: 0.9, boxShadow: '0 0 8px #ff8a1f'}} />
        );
      })}
      {[...Array(3)].map((_, i) => (
        <At key={i} x={400 + i * 500} y={260 + i * 40}>
          <AllianceCruiser scale={0.16} lightFromLeft />
        </At>
      ))}
    </Camera>
  );
};

const CerberusRaid: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(6)], [900, 1000]), y: 540, zoom: 1.05};
  const hit = progress(frame, s(2.5), s(5.5));
  return (
    <>
      <Sequence from={s(1.8)} layout="none">
        <Sfx file="ma-shot.mp3" volume={0.5} />
      </Sequence>
      <Sequence from={s(2.5)} layout="none">
        <Sfx file="explosion-large.mp3" volume={0.7} />
      </Sequence>
      <Camera cam={cam}>
        <Parallax cam={cam} factor={0.1}>
          <Starfield seed="cerb" brightness={0.7} nebula="red" />
        </Parallax>
        {[0, 1, 2].map((i) => (
          <At key={i} x={-200 + i * 180 + t * 420} y={300 + i * 140} rotate={-8}>
            <CerberusCruiser scale={0.34 - i * 0.04} thrust={1} muzzle={fadeInOut(frame, s(1.8), s(1.9), s(2.1), s(2.4))} />
          </At>
        ))}
        <At x={1500} y={500} rotate={-100} opacity={1 - Math.max(0, (hit - 0.6) / 0.4)}>
          <Reaper variant="sovereign" scale={0.4} limbPhase={t} damage={hit * 1.4} glow={1 - hit} />
        </At>
        <At x={1750} y={760} rotate={-120}>
          <Reaper variant="destroyer" scale={0.25} limbPhase={t + 1} />
        </At>
        {[0, 1, 2, 3].map((k) => (
          <Slug key={k} x0={200 + k * 150} y0={320 + k * 100} x1={1480 + rr(`cx${k}`, -40, 40)} y1={520 + rr(`cy${k}`, -80, 80)} t={progress(frame, s(1.8 + k * 0.06), s(2.5 + k * 0.06))} color="#ffd9b0" />
        ))}
        <Explosion x={1480} y={480} t={hit} size={2.0} seed="cerb" debris={36} />
      </Camera>
      <Flash opacity={fadeInOut(frame, s(2.5), s(2.6), s(2.7), s(3.2)) * 0.5} />
    </>
  );
};

const NormandyRecon: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(6)], [1000, 940]), y: 540, zoom: kf(frame, [0, s(6)], [1.0, 1.15])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="recon" brightness={0.8} nebula="blue" />
        {[...Array(14)].map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 1300 + rr(`rx${i}`, 0, 500), top: 150 + rr(`ry${i}`, 0, 300), width: 4, height: 4, borderRadius: 2, background: '#ff4a2a', boxShadow: '0 0 10px 2px rgba(255,42,26,0.7)', opacity: 0.5 + 0.5 * noise1(frame * 0.4, i)}} />
        ))}
      </Parallax>
      <At x={450} y={620}>
        <MassRelay scale={0.5} spin={t * 40} />
      </At>
      <At x={kf(frame, [0, s(6)], [1500, 1000])} y={kf(frame, [0, s(6)], [820, 700])} rotate={-168}>
        <div style={{transform: 'perspective(1800px) rotateX(55deg)', transformOrigin: '0 0'}}>
          <Normandy scale={0.4} thrust={0.6} stealth />
        </div>
      </At>
    </Camera>
  );
};

const MapSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const p = kf(frame, [0, s(16)], [0.05, 0.92]);
  const month = Math.round(3 + p * 19);
  const losses = Math.round(4 + p * 70);
  return (
    <AbsoluteFill>
      <GalaxyMap frame={frame} progress={p} />
      <HudFrame from={0} to={s(17)} label="ALLIED JOINT COMMAND — STRATEGIC SITUATION" color="#6fc3ff">
        <HudReadout x={0} y={40} lines={[`MONTH ${month}`, `REAPER CAPITAL LOSSES (CONFIRMED): ${losses}`, `ALLIED DREADNOUGHTS COMMISSIONED: ${Math.round(p * 38)}`, `RELAY CORRIDORS REOPENED: ${Math.round(p * 23)}`]} />
        <HudReadout x={0} y={40} align="right" lines={['RED: REAPER-CONTROLLED SPACE', 'BLUE: ALLIED CONTROL', 'MARKERS: ALLIED FLEET GROUPS']} color="#aab3bf" />
      </HudFrame>
    </AbsoluteFill>
  );
};

export const LongWar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="long-war.mp3" />
      <ChapterCard number={3} title="The Long War" from={s(0.3)} to={s(3.6)} />
      <CinematicText text="The refusal was not the victory." from={s(3.6)} to={s(6.4)} size={38} tracking={5} />

      <Shot from={6.5} to={12.5}>
        <Shipyard />
      </Shot>
      <LocationCaption text="ARCTURUS SHIPYARDS" sub="MONTH THREE — SIXTH DREADNOUGHT OF THE YEAR" from={s(7.5)} to={s(12)} />

      <Shot from={12.5} to={17}>
        <TurianLaunch />
      </Shot>
      <LocationCaption text="MENAE DOCKS" sub="HIERARCHY FOURTH FLEET DEPLOYS" from={s(13.2)} to={s(16.6)} color="#ffb347" />

      <Shot from={17} to={22.5} fade={0.5}>
        <SalarianIntel />
      </Shot>

      <Shot from={22.5} to={28.5}>
        <JointOps />
      </Shot>
      <LocationCaption text="JOINT OPERATIONS" sub="ASARI, ALLIANCE, GETH AND QUARIAN ELEMENTS" from={s(23.2)} to={s(28)} color="#b48cff" />

      <Shot from={28.5} to={33.5}>
        <KroganLanding />
      </Shot>
      <LocationCaption text="KROGAN GROUND FORCES" sub="LIBERATION OF OCCUPIED WORLDS" from={s(29.2)} to={s(33)} color="#ff9e6b" />

      <Shot from={33.5} to={39.5}>
        <CerberusRaid />
      </Shot>
      <LocationCaption text="CERBERUS BLACK FLEET" sub="RAID ON A REAPER STAGING AREA" from={s(34.2)} to={s(39)} color="#ff9b2b" />

      <Shot from={39.5} to={46}>
        <NormandyRecon />
      </Shot>
      <LocationCaption text="NORMANDY SR-2" sub="RECONNAISSANCE — REAPER FORMATIONS ISOLATED" from={s(40.2)} to={s(45.5)} />

      <Shot from={46} to={64} fade={1}>
        <MapSequence />
      </Shot>

      <Subtitles cues={CUES_CH3} />
      <Grade vignette={0.8} grain={0.07} />
      <Fade opacity={kf(frame, [s(64.5), s(66)], [0, 1])} />
    </AbsoluteFill>
  );
};
