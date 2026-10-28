import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ChapterCard, CinematicText, LocationCaption} from '../effects/TextCards';
import {Grade, Fade, Flash} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Planet} from '../environments/Planet';
import {Camera, At, Parallax} from '../camera/Camera';
import {AllianceDreadnought, AllianceCruiser, AllianceFrigate, DefencePlatform} from '../spacecraft/Alliance';
import {TurianDreadnought, TurianCruiser} from '../spacecraft/Turian';
import {Reaper, ReaperBeam, reaperAperture} from '../spacecraft/Reaper';
import {Fighter} from '../spacecraft/Allies';
import {Explosion, HeavySlug, HullFire, ShieldImpact, Slug} from '../effects/Weapons';
import {HudBar, HudFrame, HudReadout, Reticle} from '../effects/Hud';
import {Subtitles, Cue} from '../subtitles/Subtitles';
import {Music, Sfx} from '../audio/Music';
import {fadeInOut, kf, lin, rr, flicker, shake, progress, pulse} from '../animation/anim';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * CHAPTER ONE — THE PREPARED GALAXY (84 s)
 *
 * 0:00 Chapter card
 * 0:04 Earth orbit: Home Fleet and defence platforms. Reapers descend.
 * 0:10 Hackett's orders. A Sovereign-class advances and fires; a cruiser dies.
 * 0:22 Dreadnoughts answer. Barrier impacts. The platform locks a solution.
 * 0:38 Hyper-mass accelerator fires. The Reaper breaks apart.
 * 0:48 Palaven. The Hierarchy holds its own line.
 * 1:06 Two homeworlds, two independent stands.
 */

export const CUES_CH1: Cue[] = [
  {start: 10.5, end: 14.5, speaker: 'HACKETT', text: 'All ships, this is Hackett. Hold formation. Let them come to us.', radio: true},
  {start: 14.8, end: 17.5, speaker: 'HACKETT', text: 'Platforms, you have weapons release on my mark.', radio: true},
  {start: 20.2, end: 22.6, speaker: 'ALLIANCE CONTROL', text: 'Cruiser Shasta is gone. Lead capital is still coming.', radio: true},
  {start: 23.0, end: 26.0, speaker: 'HACKETT', text: 'Second Division, concentrated fire. Same section. Make it count.', radio: true},
  {start: 29.0, end: 31.8, speaker: 'ALLIANCE CONTROL', text: 'Impacts on target. Barriers degrading. Platform Four has a solution.', radio: true},
  {start: 34.0, end: 36.0, speaker: 'HACKETT', text: 'Platform Four. Mark.', radio: true},
  {start: 43.0, end: 46.5, speaker: 'HACKETT', text: 'Good kill. Reform on the platforms. This is not over.', radio: true},
  {start: 54.0, end: 57.5, speaker: 'TURIAN COMMAND', text: 'All groups, hold the line. Nothing reaches the surface.', radio: true},
  {start: 60.0, end: 63.0, speaker: 'TURIAN COMMAND', text: 'Concentrate on the lead capital. Every gun.', radio: true},
  {start: 67.5, end: 70.0, speaker: 'TURIAN COMMAND', text: 'Target destroyed. Hold position. Rotate the damaged groups out.', radio: true},
];

// ---------- Earth battle ----------

const EarthBattle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS; // seconds into this scene (scene starts at 4 s of chapter)

  // Camera: wide hold, then push toward the lead Reaper, then toward the platform, then wide for the kill.
  const cam = {
    x: kf(frame, [0, s(6), s(12), s(18), s(26), s(32), s(34), s(44)], [960, 960, 1150, 1150, 700, 700, 1000, 960]),
    y: kf(frame, [0, s(6), s(12), s(18), s(26), s(32), s(34), s(44)], [540, 540, 430, 430, 560, 560, 480, 540]),
    zoom: kf(frame, [0, s(6), s(12), s(18), s(26), s(32), s(34), s(44)], [1.0, 1.04, 1.35, 1.4, 1.5, 1.55, 1.0, 1.06]),
  };
  const shk = shake(frame, frame > s(17.5) && frame < s(19) ? 10 : frame > s(35.6) && frame < s(37.5) ? 14 : frame > s(33.4) && frame < s(34.4) ? 6 : 0, 2);

  // Reapers descend from upper-left toward the fleet.
  const reaperDrop = lin(frame, [s(1), s(14)], [0, 1]);
  const leadX = 400 + reaperDrop * 500;
  const leadY = -200 + reaperDrop * 520;
  const leadFiring = fadeInOut(frame, s(13.5), s(14.2), s(15.5), s(16.5));
  const beamT = fadeInOut(frame, s(13.8), s(14.1), s(15.4), s(16));
  const cruiserDeath = progress(frame, s(15.3), s(18.3));

  // Dreadnought fire from 18 s: volleys every 1.5 s
  const volleys = [18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32];
  // Barrier readout and the platform lock
  const barrier = kf(frame, [s(18), s(24), s(30), s(33)], [1, 0.7, 0.35, 0.15]);
  const lockP = kf(frame, [s(25), s(30)], [0, 1]);
  const charge = kf(frame, [s(30), s(34)], [0, 1]);
  const fireT = progress(frame, s(34.2), s(35.6));
  const hitT = progress(frame, s(35.6), s(40));
  const breakT = progress(frame, s(36.5), s(44));
  const dead = frame > s(36);

  const ships: React.ReactNode[] = [];
  const rows: Array<{count: number; x0: number; y0: number; dx: number; dy: number; scale: number; kind: 'd' | 'c' | 'f'}> = [
    {count: 4, x0: 1200, y0: 640, dx: 170, dy: 30, scale: 0.3, kind: 'd'},
    {count: 6, x0: 1050, y0: 760, dx: 120, dy: 18, scale: 0.18, kind: 'c'},
    {count: 5, x0: 1350, y0: 840, dx: 90, dy: 12, scale: 0.12, kind: 'd'},
    {count: 8, x0: 900, y0: 900, dx: 70, dy: 8, scale: 0.08, kind: 'c'},
    {count: 7, x0: 1150, y0: 560, dx: 60, dy: 8, scale: 0.07, kind: 'f'},
  ];
  rows.forEach((r, ri) =>
    [...Array(r.count)].forEach((_, i) => {
      const x = r.x0 + i * r.dx + rr(`e${ri}${i}`, -15, 15) - t * 2;
      const y = r.y0 + i * r.dy + rr(`ey${ri}${i}`, -8, 8);
      const firing = volleys.some((v) => Math.abs(t - (v + rr(`vd${ri}${i}`, 0, 0.3))) < 0.12) && ri < 3 ? 1 : 0;
      ships.push(
        <At key={`${ri}-${i}`} x={x} y={y}>
          {r.kind === 'd' ? <AllianceDreadnought scale={r.scale} thrust={flicker(frame, i, 0.2) * 0.6} lightFromLeft muzzle={firing} /> : r.kind === 'c' ? <AllianceCruiser scale={r.scale} thrust={0.6} lightFromLeft muzzle={firing} /> : <AllianceFrigate scale={r.scale} thrust={0.6} lightFromLeft />}
        </At>,
      );
    }),
  );

  // Doomed cruiser, nearer the camera on the left of the formation
  const cruiserPos = {x: 880, y: 560};

  return (
    <AbsoluteFill>
      <Sfx file="reaper-horn.mp3" volume={0.8} />
      <Sequence from={s(13.6)} layout="none">
        <Sfx file="beam.mp3" volume={0.9} />
      </Sequence>
      <Sequence from={s(15.3)} layout="none">
        <Sfx file="explosion-large.mp3" volume={0.9} />
      </Sequence>
      {volleys.map((v) => (
        <Sequence key={v} from={s(v)} layout="none">
          <Sfx file="ma-shot.mp3" volume={0.5} />
        </Sequence>
      ))}
      {volleys.map((v) => (
        <Sequence key={`si${v}`} from={s(v + 0.7)} layout="none">
          <Sfx file="shield-impact.mp3" volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={s(30.2)} layout="none">
        <Sfx file="hma-charge.mp3" volume={0.9} />
      </Sequence>
      <Sequence from={s(34.2)} layout="none">
        <Sfx file="hma-shot.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(35.6)} layout="none">
        <Sfx file="explosion-large.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(37.5)} layout="none">
        <Sfx file="hull-breach.mp3" volume={0.8} />
      </Sequence>
      <Sequence from={s(39)} layout="none">
        <Sfx file="explosion-large.mp3" volume={0.7} />
      </Sequence>

      <div style={{position: 'absolute', inset: 0, transform: `translate(${shk.x}px, ${shk.y}px) rotate(${shk.r}deg)`}}>
        <Camera cam={cam}>
          <Parallax cam={cam} factor={0.12}>
            <Starfield seed="earth-battle" brightness={0.85} nebula="blue" />
          </Parallax>
          <Parallax cam={cam} factor={0.3}>
            <At x={1700} y={1500}>
              <Planet kind="earth" radius={1000} rotation={30 + t * 0.01} tilt={12} sunAngle={200} litFraction={0.4} cloudOffset={t * 0.04} />
            </At>
          </Parallax>

          {/* Defence platforms */}
          <At x={420} y={700}>
            <DefencePlatform scale={0.32} charge={charge} muzzle={fadeInOut(frame, s(34.2), s(34.3), s(34.6), s(35.4))} />
          </At>
          <At x={1500} y={330}>
            <DefencePlatform scale={0.16} />
          </At>

          {ships}

          {/* Fighter squadrons sweeping */}
          {[...Array(10)].map((_, i) => (
            <At key={`fi${i}`} x={((rr(`fx${i}`, 0, 2200) - t * rr(`fs${i}`, 60, 120)) % 2400 + 2400) % 2400 - 200} y={rr(`fy${i}`, 350, 950)}>
              <Fighter scale={rr(`fsc${i}`, 0.3, 0.6)} opacity={0.85} />
            </At>
          ))}

          {/* Doomed cruiser */}
          {cruiserDeath < 1 ? (
            <At x={cruiserPos.x} y={cruiserPos.y} opacity={1 - Math.max(0, (cruiserDeath - 0.5) * 2)}>
              <AllianceCruiser scale={0.34} thrust={0.6} lightFromLeft damage={cruiserDeath * 2} />
            </At>
          ) : null}

          {/* Escort Reapers (destroyers) descending */}
          {[0, 1, 2].map((i) => (
            <At key={`rd${i}`} x={100 + i * 260 + reaperDrop * 300} y={-500 + reaperDrop * 520 + i * 80} rotate={-25} opacity={Math.min(1, reaperDrop * 3)}>
              <Reaper variant="destroyer" scale={0.22} limbPhase={t * 0.6 + i} />
            </At>
          ))}
          {[0, 1].map((i) => (
            <At key={`rc${i}`} x={-100 + i * 900 + reaperDrop * 200} y={-900 + reaperDrop * 650 + i * 60} rotate={-30} opacity={Math.min(1, reaperDrop * 3)}>
              <Reaper variant="sovereign" scale={0.28} limbPhase={t * 0.5 + i * 2} />
            </At>
          ))}

          {/* Lead Sovereign-class Reaper */}
          <At x={leadX} y={leadY} rotate={-32 + breakT * 25} opacity={1 - Math.max(0, (breakT - 0.7) / 0.3)}>
            <Reaper variant="sovereign" scale={0.62} firing={leadFiring} limbPhase={t * 0.7} damage={hitT} glow={dead ? Math.max(0, 1 - breakT * 2) : 1} />
          </At>
          {/* Beam from the Reaper's aperture (low on body, rotated) to the cruiser */}
          <ReaperBeam x0={reaperAperture(leadX, leadY, -32, 0.62).x} y0={reaperAperture(leadX, leadY, -32, 0.62).y} x1={cruiserPos.x} y1={cruiserPos.y} intensity={beamT} />

          {/* Cruiser destruction */}
          <Explosion x={cruiserPos.x} y={cruiserPos.y} t={cruiserDeath} size={1.6} seed="cru" />
          {cruiserDeath > 0.1 && cruiserDeath < 0.9 ? <HullFire x={cruiserPos.x - 40} y={cruiserPos.y} frame={frame} size={0.8} /> : null}

          {/* Dreadnought volleys: slugs arcing in toward the Reaper and barrier impacts */}
          {volleys.map((v, vi) =>
            [...Array(6)].map((_, k) => {
              const d = rr(`vd${vi}${k}`, 0, 0.35);
              const st = progress(frame, s(v + d), s(v + d + 0.75));
              const fromX = 1150 + k * 120 + rr(`sx${vi}${k}`, -40, 40);
              const fromY = 620 + k * 40 + rr(`sy${vi}${k}`, -40, 40);
              const tx = leadX + rr(`tx${vi}${k}`, -60, 60);
              const ty = leadY + rr(`ty${vi}${k}`, -120, 80);
              return (
                <React.Fragment key={`${vi}-${k}`}>
                  <Slug x0={fromX} y0={fromY} x1={tx} y1={ty} t={st} size={1.1} />
                  <ShieldImpact x={tx} y={ty} t={progress(frame, s(v + d + 0.72), s(v + d + 1.25))} size={1.2} color={barrier > 0.3 ? '#6fc3ff' : '#ffb067'} />
                </React.Fragment>
              );
            }),
          )}

          {/* Hyper-mass accelerator shot */}
          <HeavySlug x0={640} y0={700} x1={leadX + 20} y1={leadY - 40} t={fireT} />
          <Explosion x={leadX + 20} y={leadY - 40} t={hitT} size={2.2} seed="hma" debris={40} hue="blue" />
          <Explosion x={leadX - 80} y={leadY + 160} t={progress(frame, s(37.6), s(41))} size={2.2} seed="hma2" />
          <Explosion x={leadX + 60} y={leadY + 300} t={progress(frame, s(39), s(43))} size={2.6} seed="hma3" />
          <Explosion x={leadX} y={leadY} t={progress(frame, s(41), s(45.5))} size={2.8} seed="hma4" debris={50} />
        </Camera>
      </div>

      {/* Weapon flash */}
      <Flash opacity={fadeInOut(frame, s(34.2), s(34.3), s(34.4), s(34.9)) * 0.6} color="#dff3ff" />
      <Flash opacity={fadeInOut(frame, s(35.6), s(35.7), s(35.9), s(36.8)) * 0.9} color="#fff3d6" />

      {/* Tactical interface */}
      <HudFrame from={s(6)} to={s(12.5)} label="SOL DEFENCE NETWORK — HOME FLEET">
        <HudReadout x={0} y={40} lines={['HOSTILE CONTACTS: 6 CAPITAL / 11 DESTROYER', 'HOME FLEET: 2ND, 3RD, 5TH DIVISIONS ON STATION', 'ORBITAL PLATFORMS: 14 ACTIVE', 'WEAPONS: HOLD']} />
        <HudReadout x={0} y={40} align="right" lines={['2186.05.14', 'EARTH ORBIT', 'ALERT CONDITION ONE']} color="#ff8a1f" />
      </HudFrame>
      <HudFrame from={s(24)} to={s(36)} label="PLATFORM FOUR — HYPER-MASS ACCELERATOR">
        <HudBar x={0} y={40} value={barrier} label="TARGET BARRIER" color={barrier > 0.3 ? '#6fc3ff' : '#ff8a1f'} />
        <HudBar x={0} y={110} value={charge} label="ACCELERATOR CHARGE" color="#ff8a1f" />
        <HudReadout x={0} y={40} align="right" lines={['RANGE: 7,400 KM', 'PROJECTILE: 2,100 T HADES', 'VELOCITY: 1.2% C', lockP >= 1 ? 'FIRE CONTROL: SOLUTION LOCKED' : 'FIRE CONTROL: TRACKING']} color="#ff8a1f" />
      </HudFrame>
      {frame > s(24) && frame < s(35) ? <Reticle x={960 + (leadX - cam.x) * cam.zoom} y={540 + (leadY - cam.y) * cam.zoom} progress={lockP} size={180} label="CAPITAL — SOVEREIGN CLASS" /> : null}
    </AbsoluteFill>
  );
};

// ---------- Palaven ----------

const PalavenBattle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {
    x: kf(frame, [0, s(8), s(14), s(20)], [980, 1020, 900, 960]),
    y: kf(frame, [0, s(8), s(14), s(20)], [560, 540, 520, 540]),
    zoom: kf(frame, [0, s(8), s(14), s(20)], [1.0, 1.12, 1.25, 1.05]),
  };
  const shk = shake(frame, frame > s(15.8) && frame < s(17.2) ? 10 : 0, 5);
  const volleys = [3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5, 15];
  const capX = 560;
  const capY = 240;
  const destroyerDeath = progress(frame, s(8.5), s(12));
  const cruiserDeath = progress(frame, s(5.5), s(8.5));
  const capHit = progress(frame, s(15.8), s(21));
  const capBreak = progress(frame, s(16.5), s(23));
  return (
    <AbsoluteFill>
      <Sequence from={s(0.3)} layout="none">
        <Sfx file="reaper-horn.mp3" volume={0.6} />
      </Sequence>
      {volleys.map((v) => (
        <Sequence key={v} from={s(v)} layout="none">
          <Sfx file="ma-shot.mp3" volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={s(5.4)} layout="none">
        <Sfx file="explosion-large.mp3" volume={0.8} />
      </Sequence>
      <Sequence from={s(8.6)} layout="none">
        <Sfx file="explosion-large.mp3" volume={0.8} />
      </Sequence>
      <Sequence from={s(15.8)} layout="none">
        <Sfx file="explosion-large.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(18)} layout="none">
        <Sfx file="hull-breach.mp3" volume={0.8} />
      </Sequence>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${shk.x}px, ${shk.y}px)`}}>
        <Camera cam={cam}>
          <Parallax cam={cam} factor={0.12}>
            <Starfield seed="palaven" brightness={0.8} nebula="amber" />
          </Parallax>
          <Parallax cam={cam} factor={0.3}>
            <At x={300} y={1450}>
              <Planet kind="palaven" radius={950} rotation={t * 0.6} sunAngle={330} litFraction={0.45} seed={4} />
            </At>
          </Parallax>
          {/* Turian line: a disciplined wall of dreadnoughts and cruisers, facing left toward the Reapers */}
          {[...Array(4)].map((_, i) => (
            <At key={`td${i}`} x={1250 + i * 150 - t * 3} y={520 + i * 95}>
              <TurianDreadnought scale={0.26 - i * 0.03} flip muzzle={volleys.some((v) => Math.abs(t - v - i * 0.08) < 0.12) ? 1 : 0} />
            </At>
          ))}
          {[...Array(7)].map((_, i) => (
            <At key={`tc${i}`} x={1100 + i * 110 - t * 3} y={760 + i * 28 + rr(`tcy${i}`, -20, 20)}>
              <TurianCruiser scale={0.16 - i * 0.012} flip muzzle={volleys.some((v) => Math.abs(t - v - 0.2 - i * 0.05) < 0.1) ? 1 : 0} />
            </At>
          ))}
          {[...Array(6)].map((_, i) => (
            <At key={`tc2${i}`} x={1500 + i * 70 - t * 3} y={400 + i * 22}>
              <TurianCruiser scale={0.09} flip />
            </At>
          ))}
          {/* Lost cruiser */}
          {cruiserDeath < 1 ? (
            <At x={1000} y={660} opacity={1 - Math.max(0, (cruiserDeath - 0.5) * 2)}>
              <TurianCruiser scale={0.2} flip damage={cruiserDeath * 2} />
            </At>
          ) : null}
          {/* Reapers attacking from the left */}
          {destroyerDeath < 1 ? (
            <At x={300} y={620} rotate={70} opacity={1 - Math.max(0, (destroyerDeath - 0.6) / 0.4)}>
              <Reaper variant="destroyer" scale={0.3} limbPhase={t} firing={fadeInOut(frame, s(4.6), s(5), s(5.6), s(6))} damage={destroyerDeath * 1.5} />
            </At>
          ) : null}
          <At x={150} y={880} rotate={60}>
            <Reaper variant="destroyer" scale={0.22} limbPhase={t + 2} />
          </At>
          <At x={capX} y={capY} rotate={60 - capBreak * 20} opacity={1 - Math.max(0, (capBreak - 0.7) / 0.3)}>
            <Reaper variant="sovereign" scale={0.5} limbPhase={t * 0.7} firing={fadeInOut(frame, s(12.5), s(13), s(13.8), s(14.3))} damage={capHit} glow={1 - capBreak} />
          </At>
          <ReaperBeam x0={reaperAperture(300, 620, 70, 0.3, 'destroyer').x} y0={reaperAperture(300, 620, 70, 0.3, 'destroyer').y} x1={1000} y1={660} intensity={fadeInOut(frame, s(4.8), s(5), s(5.6), s(6))} />
          <ReaperBeam x0={reaperAperture(capX, capY, 60, 0.5).x} y0={reaperAperture(capX, capY, 60, 0.5).y} x1={1420} y1={640} intensity={fadeInOut(frame, s(12.8), s(13), s(13.8), s(14.3))} />
          <ShieldImpact x={1420} y={640} t={progress(frame, s(13), s(14.6))} size={1.6} color="#ffb347" />
          {/* Turian volleys (amber tracers) */}
          {volleys.map((v, vi) =>
            [...Array(7)].map((_, k) => {
              const d = rr(`pd${vi}${k}`, 0, 0.3);
              const st = progress(frame, s(v + d), s(v + d + 0.7));
              const fromX = 1250 + k * 90;
              const fromY = 540 + k * 50;
              const target = v < 8 ? {x: 300 + rr(`px${vi}${k}`, -50, 50), y: 620 + rr(`py${vi}${k}`, -80, 80)} : {x: capX + rr(`px${vi}${k}`, -80, 80), y: capY + rr(`py${vi}${k}`, -150, 150)};
              return (
                <React.Fragment key={`${vi}-${k}`}>
                  <Slug x0={fromX} y0={fromY} x1={target.x} y1={target.y} t={st} color="#ffd9a0" size={1} />
                  <ShieldImpact x={target.x} y={target.y} t={progress(frame, s(v + d + 0.68), s(v + d + 1.15))} size={1.1} color={v < 12 ? '#6fc3ff' : '#ffb067'} />
                </React.Fragment>
              );
            }),
          )}
          <Explosion x={1000} y={660} t={cruiserDeath} size={1.4} seed="tcru" />
          <Explosion x={300} y={620} t={destroyerDeath} size={2} seed="tdes" debris={30} />
          <Explosion x={capX + 40} y={capY + 20} t={capHit} size={2.2} seed="tcap" debris={40} />
          <Explosion x={capX - 60} y={capY + 200} t={progress(frame, s(18), s(22))} size={2.4} seed="tcap2" />
          <Explosion x={capX} y={capY} t={progress(frame, s(20), s(24.5))} size={2.6} seed="tcap3" debris={50} />
        </Camera>
      </div>
      <Flash opacity={fadeInOut(frame, s(15.8), s(15.9), s(16.1), s(16.9)) * 0.7} color="#ffe9c4" />
      <HudFrame from={s(1)} to={s(7)} label="HIERARCHY DEFENCE COMMAND — TREBIA" color="#ffb347">
        <HudReadout x={0} y={40} lines={['HOSTILE CONTACTS: 4 CAPITAL / 9 DESTROYER', 'FIRST AND THIRD FLEETS ON STATION', 'ORBITAL BATTERIES: ONLINE', 'ENGAGING']} color="#ffb347" />
        <HudReadout x={0} y={40} align="right" lines={['PALAVEN', 'MENAE RELAY: SECURED', 'CIVILIAN EVACUATION: COMPLETE']} color="#ffb347" />
      </HudFrame>
    </AbsoluteFill>
  );
};

// ---------- Chapter ----------

export const PreparedGalaxy: React.FC = () => {
  const frame = useCurrentFrame();
  const earthFade = fadeInOut(frame, s(4), s(5.5), s(47), s(48.5));
  const palavenFade = fadeInOut(frame, s(49), s(50.5), s(75), s(77));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="prepared-galaxy.mp3" />
      <ChapterCard number={1} title="The Prepared Galaxy" from={s(0.3)} to={s(4.2)} />

      <Sequence from={s(4)} durationInFrames={s(45)} layout="none">
        <AbsoluteFill style={{opacity: earthFade}}>
          <EarthBattle />
        </AbsoluteFill>
      </Sequence>
      <LocationCaption text="EARTH ORBIT" sub="SOL SYSTEM — THE HOME FLEET" from={s(5.5)} to={s(11)} />

      <Sequence from={s(49)} durationInFrames={s(28)} layout="none">
        <AbsoluteFill style={{opacity: palavenFade}}>
          <PalavenBattle />
        </AbsoluteFill>
      </Sequence>
      <LocationCaption text="PALAVEN" sub="TREBIA SYSTEM — TURIAN HIERARCHY" from={s(50.5)} to={s(56)} color="#ffb347" />

      {/* Coda: two stands, two homeworlds */}
      <CinematicText text="Earth held." from={s(77.5)} to={s(80.5)} size={40} tracking={6} />
      <CinematicText text="Palaven held." from={s(80)} to={s(83)} size={40} tracking={6} y="58%" />

      <Subtitles cues={CUES_CH1} />
      <Grade vignette={0.8} grain={0.07} />
      <Fade opacity={kf(frame, [s(83), s(84)], [0, 1])} />
    </AbsoluteFill>
  );
};
