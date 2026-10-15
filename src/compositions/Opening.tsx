import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {CinematicText, MainTitle} from '../effects/TextCards';
import {Grade, Fade} from '../effects/Grade';
import {Starfield} from '../environments/Starfield';
import {Planet} from '../environments/Planet';
import {Camera, At, Parallax} from '../camera/Camera';
import {AllianceDreadnought, AllianceCruiser, AllianceFrigate} from '../spacecraft/Alliance';
import {Fighter} from '../spacecraft/Allies';
import {Music} from '../audio/Music';
import {fadeInOut, kf, lin, rr, flicker} from '../animation/anim';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * PROLOGUE — THE CYCLE (78 s)
 *
 * 0:00  Black. Music.
 * 0:03  "For millions of years..."            white text on black, slow fades
 * 0:27  "The Reapers."                         silence
 * 0:30  "In 2186, the machines returned."
 * 0:36  "But this time, the galaxy was ready."
 * 0:42  Earth from orbit. A dreadnought crosses close to camera; two more follow.
 * 0:52  The Home Fleet is revealed in echelon over the terminator.
 * 0:58  Title.
 * 1:12  In the far distance, points of red light appear. Cut to black.
 */

const TEXT_LINES: Array<{text: string; from: number; to: number; size?: number}> = [
  {text: 'For millions of years, the civilisations\nof the Milky Way had risen and fallen.', from: s(3), to: s(9.5)},
  {text: 'Each believed itself the master\nof its own destiny.', from: s(10.5), to: s(15.5)},
  {text: 'Each encountered the same ancient enemy.', from: s(16.5), to: s(21.5)},
  {text: 'The Reapers.', from: s(23), to: s(27.5), size: 56},
  {text: 'In 2186, the machines returned.', from: s(30), to: s(35)},
  {text: 'But this time, the galaxy was ready.', from: s(36.5), to: s(41.5)},
];

const FLEET_START = s(42);

/** Static echelon of the Home Fleet, placed in world space around Earth. */
const Fleet: React.FC<{frame: number}> = ({frame}) => {
  const ships: React.ReactNode[] = [];
  const t = frame - FLEET_START;
  // Three echelons receding toward Earth's limb. Each ship drifts slowly left.
  const rows: Array<{count: number; x0: number; y0: number; dx: number; dy: number; scale: number; kind: 'd' | 'c' | 'f'}> = [
    {count: 5, x0: 1180, y0: 300, dx: 150, dy: 46, scale: 0.26, kind: 'd'},
    {count: 7, x0: 1000, y0: 420, dx: 118, dy: 30, scale: 0.17, kind: 'c'},
    {count: 6, x0: 1320, y0: 520, dx: 96, dy: 22, scale: 0.12, kind: 'd'},
    {count: 9, x0: 900, y0: 560, dx: 80, dy: 14, scale: 0.09, kind: 'c'},
    {count: 8, x0: 1250, y0: 640, dx: 60, dy: 10, scale: 0.07, kind: 'f'},
    {count: 10, x0: 820, y0: 690, dx: 52, dy: 7, scale: 0.05, kind: 'c'},
  ];
  rows.forEach((r, ri) => {
    for (let i = 0; i < r.count; i++) {
      const drift = -t * (0.08 + r.scale * 0.5);
      const x = r.x0 + i * r.dx + drift + rr(`fx${ri}${i}`, -20, 20);
      const y = r.y0 + i * r.dy + rr(`fy${ri}${i}`, -12, 12);
      const th = flicker(frame, ri * 10 + i, 0.2) * 0.7;
      ships.push(
        <At key={`${ri}-${i}`} x={x} y={y} scale={1}>
          {r.kind === 'd' ? <AllianceDreadnought scale={r.scale} thrust={th} lightFromLeft /> : r.kind === 'c' ? <AllianceCruiser scale={r.scale} thrust={th} lightFromLeft /> : <AllianceFrigate scale={r.scale} thrust={th} lightFromLeft />}
        </At>,
      );
    }
  });
  // fighter screen
  for (let i = 0; i < 14; i++) {
    const sp = rr(`fsp${i}`, 1.5, 3.5);
    const x = ((rr(`fx${i}`, 0, 2400) - t * sp) % 2600 + 2600) % 2600 - 300;
    const y = rr(`fyy${i}`, 200, 760);
    ships.push(
      <At key={`f${i}`} x={x} y={y}>
        <Fighter scale={rr(`fsc${i}`, 0.35, 0.7)} opacity={0.8} />
      </At>,
    );
  }
  return <>{ships}</>;
};

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const inFleet = frame >= FLEET_START;
  const tf = frame - FLEET_START;

  // Camera: slow push-in that gently drifts toward Earth over the fleet reveal.
  const cam = {
    x: kf(tf, [0, s(16), s(30)], [930, 980, 1010]),
    y: kf(tf, [0, s(16), s(30)], [520, 540, 530]),
    zoom: kf(tf, [0, s(10), s(16), s(30)], [1.0, 1.02, 1.0, 1.06]),
  };

  // Hero dreadnoughts crossing close to camera.
  const heroX1 = lin(tf, [s(1.5), s(9)], [3400, -1600]);
  const heroX2 = lin(tf, [s(5), s(15)], [3000, -1200]);
  const heroX3 = lin(tf, [s(8.5), s(20)], [2900, -900]);

  // Fade from black into the Earth shot, and out at the end.
  const earthFade = fadeInOut(frame, FLEET_START - s(1.2), FLEET_START + s(1.5), s(76.2), s(78));
  // Distant red lights (Reaper arrival) in the final seconds
  const redT = kf(frame, [s(72), s(76)], [0, 1]);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Music file="opening.mp3" />
      {/* Prologue text on black */}
      {!inFleet || frame < FLEET_START + s(1) ? (
        <>
          {TEXT_LINES.map((l) => (
            <CinematicText key={l.text} text={l.text} from={l.from} to={l.to} size={l.size ?? 42} tracking={l.size ? 10 : 3} weight={300} fade={40} />
          ))}
          {/* faint red breath behind "The Reapers." */}
          <AbsoluteFill
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(120,15,10,0.35), rgba(0,0,0,0) 60%)',
              opacity: fadeInOut(frame, s(23.5), s(26), s(27), s(28.5)),
            }}
          />
        </>
      ) : null}

      {/* Earth and the Home Fleet */}
      {inFleet ? (
        <AbsoluteFill style={{opacity: earthFade}}>
          <Camera cam={cam}>
            <Parallax cam={cam} factor={0.15}>
              <Starfield seed="opening" driftX={-tf * 0.02} brightness={0.9} nebula="blue" />
              {/* distant Reaper lights */}
              {redT > 0
                ? [...Array(26)].map((_, i) => {
                    const x = 120 + rr(`rl${i}`, 0, 820);
                    const y = 120 + rr(`rly${i}`, 0, 420);
                    const o = redT * fadeInOut(frame, s(72) + rr(`rlo${i}`, 0, 70), s(72) + rr(`rlo${i}`, 0, 70) + 25, s(90), s(91)) * flicker(frame, i, 0.4);
                    return <div key={i} style={{position: 'absolute', left: x, top: y, width: 4, height: 4, borderRadius: 2, background: '#ff4a2a', boxShadow: '0 0 10px 2px rgba(255,42,26,0.7)', opacity: o}} />;
                  })
                : null}
            </Parallax>
            <Parallax cam={cam} factor={0.35}>
              <At x={1560} y={1180}>
                <Planet kind="earth" radius={780} rotation={-20 + tf * 0.012} tilt={18} sunAngle={215} litFraction={0.3} cloudOffset={tf * 0.05} />
              </At>
            </Parallax>
            {/* The fleet */}
            <Fleet frame={frame} />
            {/* Hero crossings, nearest last */}
            <At x={heroX3} y={720}>
              <AllianceCruiser scale={0.62} thrust={0.75} lightFromLeft />
            </At>
            <At x={heroX2} y={220}>
              <AllianceDreadnought scale={0.95} thrust={0.8} lightFromLeft />
            </At>
            <At x={heroX1} y={560}>
              <AllianceDreadnought scale={1.9} thrust={0.85} lightFromLeft />
            </At>
          </Camera>
          {/* sun glare from the left */}
          <AbsoluteFill style={{background: 'linear-gradient(100deg, rgba(255,240,220,0.14) 0%, rgba(255,240,220,0) 35%)', mixBlendMode: 'screen'}} />
        </AbsoluteFill>
      ) : null}

      {/* Title */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0) 100%)', opacity: fadeInOut(frame, s(58), s(60), s(72), s(74))}} />
      <Sequence from={s(58)} durationInFrames={s(16)} layout="none">
        <MainTitle from={0} to={s(16)} showTagline showFan />
      </Sequence>

      <Grade vignette={inFleet ? 0.8 : 0.3} grain={inFleet ? 0.07 : 0.04} tintOpacity={inFleet ? 0.1 : 0} />
      <Fade opacity={kf(frame, [s(76.8), s(78)], [0, 1])} color="#000" />
    </AbsoluteFill>
  );
};
