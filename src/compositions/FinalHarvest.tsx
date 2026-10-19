import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ChapterCard, LocationCaption} from '../effects/TextCards';
import {Grade, Fade, Flash} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Camera, At, Parallax} from '../camera/Camera';
import {AllianceDreadnought, AllianceCruiser, AllianceFrigate, DefencePlatform} from '../spacecraft/Alliance';
import {TurianDreadnought, TurianCruiser} from '../spacecraft/Turian';
import {AsariCruiser, CerberusCruiser, GethDreadnought, QuarianCruiser, Fighter} from '../spacecraft/Allies';
import {Reaper, ReaperBeam, reaperAperture} from '../spacecraft/Reaper';
import {Explosion, HeavySlug, HullFire, ShieldImpact, Slug} from '../effects/Weapons';
import {HudBar, HudFrame, HudReadout, Reticle} from '../effects/Hud';
import {Subtitles, Cue} from '../subtitles/Subtitles';
import {Music, Sfx} from '../audio/Music';
import {fadeInOut, kf, rr, flicker, progress, shake, noise1} from '../animation/anim';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * CHAPTER FIVE — THE FINAL HARVEST (84 s)
 * The allied grand fleet meets the last Reaper concentration. Harbinger is
 * isolated, its barriers are brought down by coordinated fire, and a
 * hyper-mass accelerator round destroys it. A conventional military kill.
 */

export const CUES_CH5: Cue[] = [
  {start: 4.5, end: 8, speaker: 'HACKETT', text: 'All fleets, this is Hackett. Everything we have is here. Execute the plan.', radio: true},
  {start: 10, end: 13, speaker: 'VICTUS', text: 'Hierarchy fleets in position. We hold the right. Spirits watch over all of us.', radio: true},
  {start: 17, end: 19.5, speaker: 'FLEET', text: "Harbinger's firing. Cruiser Kyoto is gone.", radio: true},
  {start: 20, end: 23, speaker: 'HACKETT', text: "Keep the line. Don't give it a clean shot at the dreadnoughts.", radio: true},
  {start: 27, end: 30, speaker: 'VICTUS', text: "Indomitable is hit. She's still firing.", radio: true},
  {start: 33, end: 36.5, speaker: 'EDI', text: 'Escort formation is collapsing. Harbinger is drawing clear of the group.', radio: true},
  {start: 38, end: 41.5, speaker: 'SHEPARD', text: "That's the opening. Everything on Harbinger. Same section, on the count.", radio: true},
  {start: 49, end: 51.5, speaker: 'FLEET', text: 'Barriers at sixty percent. Solution holding.', radio: true},
  {start: 55, end: 58, speaker: 'HACKETT', text: 'Thanix batteries, sustain. Platform Kilimanjaro, you have the solution.', radio: true},
  {start: 60, end: 62.2, speaker: 'FLEET', text: 'Barrier failure confirmed. Kilimanjaro, you are clear.', radio: true},
  {start: 75, end: 77, speaker: 'FLEET', text: 'Harbinger is down.', radio: true},
  {start: 79, end: 82, speaker: 'HACKETT', text: 'Confirmed. All groups, remaining targets. Finish it.', radio: true},
];

const Assembly: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: kf(frame, [0, s(5.5)], [700, 1200]), y: 540, zoom: kf(frame, [0, s(5.5)], [1.0, 1.08])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="assembly" brightness={0.85} nebula="blue" />
      </Parallax>
      {/* rows of the grand fleet, all facing right */}
      {[...Array(5)].map((_, i) => (
        <At key={`ad${i}`} x={200 + i * 300} y={300 + i * 30}>
          <AllianceDreadnought scale={0.22} thrust={0.5} lightFromLeft />
        </At>
      ))}
      {[...Array(6)].map((_, i) => (
        <At key={`ac${i}`} x={100 + i * 260} y={440 + (i % 2) * 30}>
          <AllianceCruiser scale={0.15} thrust={0.5} lightFromLeft />
        </At>
      ))}
      {[...Array(4)].map((_, i) => (
        <At key={`td${i}`} x={300 + i * 360} y={560}>
          <TurianDreadnought scale={0.2} thrust={0.5} />
        </At>
      ))}
      {[...Array(5)].map((_, i) => (
        <At key={`tc${i}`} x={150 + i * 300} y={650}>
          <TurianCruiser scale={0.13} thrust={0.5} />
        </At>
      ))}
      {[...Array(3)].map((_, i) => (
        <At key={`as${i}`} x={400 + i * 500} y={740}>
          <AsariCruiser scale={0.16} thrust={0.5} />
        </At>
      ))}
      <At x={700} y={840}>
        <GethDreadnought scale={0.16} thrust={0.5} />
      </At>
      <At x={1300} y={850}>
        <QuarianCruiser scale={0.15} thrust={0.5} />
      </At>
      {[...Array(3)].map((_, i) => (
        <At key={`cb${i}`} x={250 + i * 450} y={920}>
          <CerberusCruiser scale={0.15} thrust={0.5} />
        </At>
      ))}
      <At x={1550} y={250}>
        <DefencePlatform scale={0.18} />
      </At>
      {[...Array(14)].map((_, i) => (
        <At key={`f${i}`} x={((rr(`fx${i}`, 0, 2000) + t * 60) % 2100) - 100} y={rr(`fy${i}`, 250, 950)}>
          <Fighter scale={0.4} />
        </At>
      ))}
    </Camera>
  );
};

const Approach: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = {x: 960, y: 540, zoom: kf(frame, [0, s(5)], [1.0, 1.12])};
  return (
    <Camera cam={cam}>
      <Parallax cam={cam} factor={0.1}>
        <Starfield seed="approach" brightness={0.7} nebula="red" />
      </Parallax>
      {[...Array(22)].map((_, i) => {
        const d = rr(`ad${i}`, 0.2, 1);
        return (
          <At key={i} x={1100 + (rr(`ax${i}`, -1, 1) * 800) / (0.5 + d) - t * 14 * (1.2 - d)} y={540 + (rr(`ay${i}`, -1, 1) * 420) / (0.5 + d)} rotate={-90 + rr(`ar${i}`, -8, 8)} opacity={0.6 + 0.4 * (1 - d)}>
            <Reaper variant={i % 3 === 0 ? 'destroyer' : 'sovereign'} scale={0.08 + (1 - d) * 0.32} limbPhase={t * 0.6 + i} />
          </At>
        );
      })}
      <At x={1150 - t * 10} y={560} rotate={-90}>
        <Reaper variant="harbinger" scale={0.6} limbPhase={t * 0.5} />
      </At>
    </Camera>
  );
};

/** The battle proper: one continuous world, camera-driven. Scene-local seconds start at chapter 14 s. */
const Battle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const KILL = 64 - 14; // chapter 64 s → scene 50 s
  const FIRE = KILL - 1.0;

  // camera plan (scene seconds)
  const cam = {
    x: kf(frame, [0, s(10), s(20), s(26), s(34), s(44), s(KILL + 2), s(KILL + 6), s(KILL + 10), s(70)], [900, 1300, 1500, 1200, 1700, 1500, 1900, 1900, 1700, 1500]),
    y: kf(frame, [0, s(10), s(20), s(26), s(34), s(44), s(KILL + 2), s(KILL + 6), s(70)], [540, 560, 520, 540, 500, 520, 520, 520, 540]),
    zoom: kf(frame, [0, s(10), s(20), s(26), s(34), s(44), s(KILL - 4), s(KILL + 1), s(KILL + 6), s(KILL + 10), s(70)], [1.0, 1.08, 1.15, 1.05, 1.1, 1.15, 1.2, 1.25, 1.15, 1.0, 0.95]),
  };
  const bigShake = frame > s(KILL) && frame < s(KILL + 1.5) ? 18 : frame > s(FIRE) && frame < s(FIRE + 0.5) ? 7 : frame > s(KILL + 7) && frame < s(KILL + 9) ? 12 : 0;
  const shk = shake(frame, bigShake + (t < KILL ? 2 : 0), 7);

  // --- Harbinger state ---
  const hbX = kf(frame, [0, s(20), s(34), s(44)], [2300, 2200, 2000, 1900]);
  const hbY = 520;
  const hbRot = -80;
  const hbScale = 0.9;
  const barrier = kf(frame, [s(34), s(40), s(46), s(48)], [1, 0.75, 0.3, 0.05]);
  const hit = progress(frame, s(KILL), s(KILL + 4));
  const fracture = kf(frame, [s(KILL + 0.3), s(KILL + 4)], [0, 1]);
  const hbGlow = kf(frame, [s(KILL + 0.5), s(KILL + 3.5)], [1, 0]);
  const collapse = progress(frame, s(KILL + 7), s(KILL + 10));
  const hbOpacity = 1 - Math.max(0, (collapse - 0.5) * 2);
  const harbingerFiring = (at: number) => fadeInOut(frame, s(at), s(at + 0.3), s(at + 1.6), s(at + 2.2));
  const hbBeams: Array<{at: number; x: number; y: number}> = [
    {at: 3, x: 700, y: 620},
    {at: 12, x: 500, y: 300},
    {at: 24, x: 760, y: 740},
    {at: 37, x: 400, y: 500},
    {at: 44, x: 600, y: 380},
  ];
  const ap = reaperAperture(hbX, hbY, hbRot, hbScale, 'harbinger');

  // --- escorts (die one by one) ---
  const escorts: Array<{x: number; y: number; rot: number; variant: 'sovereign' | 'destroyer'; dies: number; scale: number}> = [
    {x: 1500, y: 260, rot: -70, variant: 'sovereign', dies: 8, scale: 0.42},
    {x: 1650, y: 820, rot: -100, variant: 'sovereign', dies: 16, scale: 0.4},
    {x: 1400, y: 560, rot: -85, variant: 'destroyer', dies: 11, scale: 0.3},
    {x: 1900, y: 200, rot: -75, variant: 'destroyer', dies: 21, scale: 0.28},
    {x: 2000, y: 880, rot: -95, variant: 'sovereign', dies: 26, scale: 0.38},
    {x: 1750, y: 420, rot: -80, variant: 'destroyer', dies: 30, scale: 0.26},
    {x: 2300, y: 250, rot: -70, variant: 'sovereign', dies: 999, scale: 0.3},
    {x: 2400, y: 860, rot: -100, variant: 'sovereign', dies: 999, scale: 0.3},
  ];

  // --- allied line ---
  const allied: Array<{kind: 'ad' | 'ac' | 'af' | 'td' | 'tc' | 'as' | 'ge' | 'ce' | 'qu'; x: number; y: number; scale: number; dies?: number; damaged?: number}> = [
    {kind: 'ad', x: 520, y: 300, scale: 0.26},
    {kind: 'ad', x: 380, y: 480, scale: 0.26},
    {kind: 'ad', x: 560, y: 660, scale: 0.26},
    {kind: 'ad', x: 300, y: 840, scale: 0.24},
    {kind: 'ac', x: 700, y: 620, scale: 0.16, dies: 3.6},
    {kind: 'ac', x: 760, y: 400, scale: 0.16},
    {kind: 'ac', x: 820, y: 760, scale: 0.15},
    {kind: 'ac', x: 640, y: 900, scale: 0.15},
    {kind: 'af', x: 860, y: 520, scale: 0.12, dies: 20.3},
    {kind: 'td', x: 500, y: 180, scale: 0.22, damaged: 12.6},
    {kind: 'td', x: 440, y: 980, scale: 0.22},
    {kind: 'tc', x: 760, y: 240, scale: 0.13},
    {kind: 'tc', x: 740, y: 900, scale: 0.13},
    {kind: 'as', x: 650, y: 140, scale: 0.16},
    {kind: 'ge', x: 300, y: 620, scale: 0.17},
    {kind: 'ce', x: 820, y: 320, scale: 0.15, dies: 27.3},
    {kind: 'ce', x: 880, y: 840, scale: 0.15},
    {kind: 'qu', x: 200, y: 360, scale: 0.15},
  ];
  const volleyTimes = [1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5, 15, 16.5, 18, 19.5, 21, 22.5, 24, 25.5, 27, 28.5, 30, 31.5, 33];
  const planVolleys = [36, 39, 42, 45];
  const thanix = [38, 43];
  const isFiring = (v: number) => Math.abs(t - v) < 0.12;
  const shipFiring = allied.some(() => true) ? volleyTimes.concat(planVolleys).some(isFiring) : false;

  const renderAllied = (a: (typeof allied)[number], i: number) => {
    const dead = a.dies !== undefined ? progress(frame, s(a.dies), s(a.dies + 3)) : 0;
    if (dead >= 1) return null;
    const dmg = a.damaged !== undefined && t > a.damaged ? Math.min(1, (t - a.damaged) / 2) * 0.8 : dead * 2;
    const muzzle = shipFiring && (a.kind === 'ad' || a.kind === 'td' || a.kind === 'ac' || a.kind === 'as' || a.kind === 'ge' || a.kind === 'ce') ? 1 : 0;
    const th = flicker(frame, i, 0.2) * 0.6;
    const props = {scale: a.scale, thrust: th, muzzle, damage: dmg, lightFromLeft: true};
    return (
      <At key={`al${i}`} x={a.x} y={a.y} opacity={1 - Math.max(0, (dead - 0.5) * 2)}>
        {a.kind === 'ad' ? <AllianceDreadnought {...props} /> : a.kind === 'ac' ? <AllianceCruiser {...props} /> : a.kind === 'af' ? <AllianceFrigate {...props} /> : a.kind === 'td' ? <TurianDreadnought {...props} /> : a.kind === 'tc' ? <TurianCruiser {...props} /> : a.kind === 'as' ? <AsariCruiser {...props} /> : a.kind === 'ge' ? <GethDreadnought {...props} /> : a.kind === 'ce' ? <CerberusCruiser {...props} /> : <QuarianCruiser {...props} />}
      </At>
    );
  };

  // target for a volley: an escort that is still alive at that time, else Harbinger
  const targetFor = (v: number, k: number) => {
    if (v >= 34) return {x: hbX + rr(`tx${v}${k}`, -40, 40), y: hbY + rr(`ty${v}${k}`, -60, 60)};
    const alive = escorts.filter((e) => e.dies > v + 1);
    const e = alive[(k + Math.floor(v)) % Math.max(1, alive.length)] ?? escorts[6];
    return {x: e.x + rr(`tx${v}${k}`, -50, 50), y: e.y + rr(`ty${v}${k}`, -70, 70)};
  };

  return (
    <AbsoluteFill>
      {/* sound design */}
      {volleyTimes.concat(planVolleys).map((v) => (
        <Sequence key={`sv${v}`} from={s(v)} layout="none">
          <Sfx file="ma-shot.mp3" volume={0.45} />
        </Sequence>
      ))}
      {hbBeams.map((b) => (
        <Sequence key={`sb${b.at}`} from={s(b.at)} layout="none">
          <Sfx file="beam.mp3" volume={0.8} />
        </Sequence>
      ))}
      {escorts.filter((e) => e.dies < 100).map((e) => (
        <Sequence key={`se${e.dies}`} from={s(e.dies + 0.4)} layout="none">
          <Sfx file="explosion-large.mp3" volume={0.7} />
        </Sequence>
      ))}
      {allied.filter((a) => a.dies !== undefined).map((a) => (
        <Sequence key={`sa${a.dies}`} from={s(a.dies!)} layout="none">
          <Sfx file="explosion-large.mp3" volume={0.6} />
        </Sequence>
      ))}
      {thanix.map((v) => (
        <Sequence key={`st${v}`} from={s(v)} layout="none">
          <Sfx file="beam.mp3" volume={0.5} />
        </Sequence>
      ))}
      <Sequence from={s(FIRE - 3.5)} layout="none">
        <Sfx file="hma-charge.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(FIRE)} layout="none">
        <Sfx file="hma-shot.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(KILL)} layout="none">
        <Sfx file="explosion-large.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(KILL + 1.5)} layout="none">
        <Sfx file="hull-breach.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(KILL + 4)} layout="none">
        <Sfx file="hull-breach.mp3" volume={0.7} />
      </Sequence>
      <Sequence from={s(KILL + 7.2)} layout="none">
        <Sfx file="explosion-large.mp3" volume={1} />
      </Sequence>
      <Sequence from={s(67)} layout="none">
        <Sfx file="explosion-small.mp3" volume={0.4} />
      </Sequence>
      <Sequence from={s(69)} layout="none">
        <Sfx file="explosion-small.mp3" volume={0.4} />
      </Sequence>

      <div style={{position: 'absolute', inset: 0, transform: `translate(${shk.x}px, ${shk.y}px) rotate(${shk.r}deg)`}}>
        <Camera cam={cam}>
          <Parallax cam={cam} factor={0.12}>
            <Starfield seed="harvest" brightness={0.8} nebula="red" />
          </Parallax>

          {/* allied line */}
          {allied.map(renderAllied)}
          {/* fighters and GARDIAN flashes */}
          {[...Array(16)].map((_, i) => (
            <At key={`f${i}`} x={((rr(`fx${i}`, 0, 1200) + t * rr(`fs${i}`, 80, 160)) % 1400) + 200} y={rr(`fy${i}`, 150, 1000)}>
              <Fighter scale={0.45} opacity={0.85} />
            </At>
          ))}
          {t < KILL
            ? [...Array(10)].map((_, i) => {
                const ph = (t * rr(`gp${i}`, 0.8, 1.6) + rr(`go${i}`, 0, 1)) % 1;
                return ph < 0.08 ? <div key={`g${i}`} style={{position: 'absolute', left: 900 + rr(`gx${i}`, 0, 500), top: 200 + rr(`gy${i}`, 0, 700), width: 6, height: 6, borderRadius: 3, background: '#dff3ff', boxShadow: '0 0 14px 4px rgba(159,212,255,0.8)'}} /> : null;
              })
            : null}

          {/* escorts */}
          {escorts.map((e, i) => {
            const d = progress(frame, s(e.dies), s(e.dies + 3.5));
            if (d >= 1) return null;
            return (
              <React.Fragment key={`e${i}`}>
                <At x={e.x} y={e.y} rotate={e.rot + d * 15} opacity={1 - Math.max(0, (d - 0.6) / 0.4)}>
                  <Reaper variant={e.variant} scale={e.scale} limbPhase={t * 0.6 + i} damage={d * 1.5} glow={1 - d} firing={i % 2 === 0 ? fadeInOut(frame, s(5 + i * 3), s(5.3 + i * 3), s(6.2 + i * 3), s(6.8 + i * 3)) : 0} />
                </At>
                <Explosion x={e.x} y={e.y} t={d} size={e.variant === 'sovereign' ? 2.2 : 1.6} seed={`esc${i}`} debris={34} />
                <Explosion x={e.x + 40} y={e.y + 120} t={progress(frame, s(e.dies + 1.2), s(e.dies + 4))} size={1.6} seed={`esc2${i}`} />
              </React.Fragment>
            );
          })}
          {/* escort beams at allied ships (short) */}
          {escorts.slice(0, 4).map((e, i) =>
            i % 2 === 0 ? (
              <ReaperBeam key={`eb${i}`} x0={reaperAperture(e.x, e.y, e.rot, e.scale, e.variant).x} y0={reaperAperture(e.x, e.y, e.rot, e.scale, e.variant).y} x1={[860, 820, 760, 640][i]} y1={[520, 320, 400, 900][i]} intensity={e.dies > 5 + i * 3 ? fadeInOut(frame, s(5 + i * 3), s(5.3 + i * 3), s(6.2 + i * 3), s(6.8 + i * 3)) : 0} width={10} />
            ) : null,
          )}

          {/* Harbinger */}
          <At x={hbX} y={hbY} rotate={hbRot + fracture * 6} opacity={hbOpacity}>
            <div style={{transform: `scale(${1 - collapse * 0.35}, ${1 - collapse * 0.6})`, transformOrigin: '0 0'}}>
              <Reaper variant="harbinger" scale={hbScale} limbPhase={t * 0.4} firing={t < KILL ? hbBeams.reduce((m, b) => Math.max(m, harbingerFiring(b.at)), 0) : 0} damage={Math.min(1, hit * 1.2 + (t > 34 ? (1 - barrier) * 0.35 : 0))} glow={t < KILL ? 1 : hbGlow} fracture={fracture} />
            </div>
          </At>
          {hbBeams.map((b) => (
            <ReaperBeam key={`hb${b.at}`} x0={ap.x} y0={ap.y} x1={b.x} y1={b.y} intensity={harbingerFiring(b.at)} width={18} />
          ))}
          {hbBeams.map((b) => (
            <Explosion key={`hbx${b.at}`} x={b.x} y={b.y} t={progress(frame, s(b.at + 0.4), s(b.at + 3))} size={1.4} seed={`hbx${b.at}`} />
          ))}
          {/* Turian dreadnought on fire */}
          {t > 12.6 && t < KILL + 12 ? <HullFire x={420} y={170} frame={frame} size={1.2} intensity={0.8} /> : null}

          {/* allied volleys */}
          {volleyTimes.concat(planVolleys).map((v, vi) =>
            [...Array(v >= 34 ? 10 : 6)].map((_, k) => {
              const d = rr(`vd${vi}${k}`, 0, 0.3);
              const from = allied[(k * 3 + vi) % allied.length];
              const tgt = targetFor(v, k);
              const st = progress(frame, s(v + d), s(v + d + 0.9));
              return (
                <React.Fragment key={`${vi}-${k}`}>
                  <Slug x0={from.x + 120} y0={from.y} x1={tgt.x} y1={tgt.y} t={st} size={1.1} color={from.kind === 'td' || from.kind === 'tc' ? '#ffd9a0' : from.kind === 'as' ? '#e3d4ff' : '#cfe9ff'} />
                  <ShieldImpact x={tgt.x} y={tgt.y} t={progress(frame, s(v + d + 0.88), s(v + d + 1.3))} size={0.9} color={v >= 34 && barrier < 0.3 ? '#ffb067' : '#6fc3ff'} />
                </React.Fragment>
              );
            }),
          )}
          {/* Thanix beams: sustained blue-white lances from the dreadnoughts onto the same section */}
          {thanix.map((v) =>
            [0, 1, 2].map((k) => (
              <ReaperBeam key={`th${v}${k}`} x0={allied[k].x + 130} y0={allied[k].y} x1={hbX + 10 + k * 6} y1={hbY - 20} intensity={fadeInOut(frame, s(v), s(v + 0.3), s(v + 2.2), s(v + 2.8))} color="#8fe8ff" width={7} />
            )),
          )}
          {thanix.map((v) => (
            <ShieldImpact key={`thi${v}`} x={hbX + 10} y={hbY - 20} t={progress(frame, s(v + 0.3), s(v + 2.8))} size={1.8} color={barrier < 0.3 ? '#ffb067' : '#8fe8ff'} />
          ))}

          {/* hyper-mass accelerator platform in the foreground left */}
          <At x={250} y={720}>
            <DefencePlatform scale={0.3} charge={kf(frame, [s(FIRE - 3.5), s(FIRE)], [0, 1])} muzzle={fadeInOut(frame, s(FIRE), s(FIRE + 0.1), s(FIRE + 0.4), s(FIRE + 1.2))} />
          </At>
          <HeavySlug x0={460} y0={720} x1={hbX + 10} y1={hbY - 20} t={progress(frame, s(FIRE), s(KILL))} />

          {/* the kill */}
          <Explosion x={hbX + 10} y={hbY - 20} t={hit} size={2.6} seed="kill1" debris={44} hue="blue" />
          <Explosion x={hbX - 60} y={hbY + 120} t={progress(frame, s(KILL + 1.2), s(KILL + 4.5))} size={2.0} seed="kill2" />
          <Explosion x={hbX + 80} y={hbY - 160} t={progress(frame, s(KILL + 2.2), s(KILL + 5.5))} size={1.8} seed="kill3" />
          <Explosion x={hbX - 20} y={hbY + 260} t={progress(frame, s(KILL + 3.5), s(KILL + 6.5))} size={1.6} seed="kill4" />
          <Explosion x={hbX} y={hbY} t={collapse} size={3.6} seed="collapse" debris={70} />
          <Explosion x={hbX + 120} y={hbY + 60} t={progress(frame, s(KILL + 8), s(KILL + 12))} size={2.2} seed="collapse2" />
          {/* drifting debris after the collapse */}
          {collapse > 0.3
            ? [...Array(30)].map((_, i) => {
                const a = rr(`da${i}`, 0, Math.PI * 2);
                const sp = rr(`ds${i}`, 20, 90);
                const dd = (t - (KILL + 7)) * sp;
                return <div key={`d${i}`} style={{position: 'absolute', left: hbX + Math.cos(a) * dd, top: hbY + Math.sin(a) * dd, width: rr(`dw${i}`, 6, 40), height: rr(`dh${i}`, 3, 10), background: '#1a1d26', transform: `rotate(${rr(`dr${i}`, 0, 360) + t * 20}deg)`, opacity: 0.9, boxShadow: i % 4 === 0 ? '0 0 8px #ff8a1f' : undefined}} />;
              })
            : null}
          {/* subsequent operations: distant kills */}
          {[67, 69].map((at, i) => (
            <Explosion key={`late${i}`} x={2300 + i * 150} y={[250, 860][i]} t={progress(frame, s(at - 14), s(at - 14 + 3))} size={1.4} seed={`late${i}`} />
          ))}
        </Camera>
      </div>

      <Flash opacity={fadeInOut(frame, s(FIRE), s(FIRE + 0.08), s(FIRE + 0.25), s(FIRE + 0.8)) * 0.7} color="#dff3ff" />
      <Flash opacity={fadeInOut(frame, s(KILL), s(KILL + 0.08), s(KILL + 0.25), s(KILL + 0.8)) * 0.7} color="#fff6e6" />
      <Flash opacity={fadeInOut(frame, s(KILL + 7.2), s(KILL + 7.3), s(KILL + 7.5), s(KILL + 8.0)) * 0.35} color="#ffe3c4" />

      {/* Firing plan interface */}
      <HudFrame from={s(34)} to={s(KILL - 0.2)} label="FIRING PLAN — HARBINGER — SECTION SEVEN" color="#ff8a1f">
        <HudBar x={0} y={40} value={barrier} label="HARBINGER BARRIER" color={barrier > 0.3 ? '#6fc3ff' : '#ff8a1f'} />
        <HudBar x={0} y={110} value={kf(frame, [s(FIRE - 3.5), s(FIRE)], [0, 1])} label="KILIMANJARO CHARGE" color="#ff8a1f" />
        <HudReadout x={0} y={40} align="right" lines={['PARTICIPATING: 2ND, 5TH FLEETS — HIERARCHY 1ST', 'THANIX BATTERIES: 6 SUSTAINING', 'PROJECTILE: 2,400 T HADES', `SOLUTION: ${barrier < 0.1 ? 'CLEAR TO FIRE' : 'HOLD — BARRIER UP'}`]} color="#ff8a1f" />
      </HudFrame>
      {t > 34 && t < KILL - 0.2 ? <Reticle x={960 + (hbX - cam.x) * cam.zoom} y={540 + (hbY - 20 - cam.y) * cam.zoom} progress={kf(frame, [s(34), s(37)], [0, 1])} size={200} label="HARBINGER" /> : null}
    </AbsoluteFill>
  );
};

export const FinalHarvest: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="final-harvest.mp3" />
      <ChapterCard number={5} title="The Final Harvest" from={s(0.3)} to={s(3.6)} />

      <Sequence from={s(3.5)} durationInFrames={s(5.6)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(3.5), s(4.5), s(8.4), s(9.1))}}>
          <Assembly />
        </AbsoluteFill>
      </Sequence>
      <LocationCaption text="ALLIED GRAND FLEET" sub="HADES NEXUS APPROACHES — THE LAST REAPER CONCENTRATION" from={s(4.5)} to={s(8.5)} />

      <Sequence from={s(9)} durationInFrames={s(5.2)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(9), s(9.7), s(13.4), s(14.2))}}>
          <Approach />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={s(14)} durationInFrames={s(70)} layout="none">
        <AbsoluteFill style={{opacity: fadeInOut(frame, s(14), s(15), s(82.5), s(84))}}>
          <Battle />
        </AbsoluteFill>
      </Sequence>

      <Subtitles cues={CUES_CH5} />
      <Grade vignette={0.8} grain={0.08} />
      <Fade opacity={kf(frame, [s(83), s(84)], [0, 1])} />
    </AbsoluteFill>
  );
};
