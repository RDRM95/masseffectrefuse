import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Opening} from './Opening';
import {PreparedGalaxy} from './PreparedGalaxy';
import {Catalyst} from './Catalyst';
import {FinalHarvest} from './FinalHarvest';
import {CinematicText, MainTitle} from '../effects/TextCards';
import {Fade} from '../effects/Grade';
import {fadeInOut, kf} from '../animation/anim';
import {FPS} from '../timeline/chapters';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * TRAILER (66 s). Excerpts lifted directly from the chapter compositions by
 * mounting them at negative offsets, so picture, music and sound stay in sync
 * with the film itself.
 */
interface Excerpt {
  Comp: React.FC;
  /** chapter seconds to start from */
  from: number;
  /** length in seconds */
  len: number;
  /** trailer start time */
  at: number;
}

const EXCERPTS: Excerpt[] = [
  {Comp: Opening, from: 42, len: 12, at: 2.5}, // Earth and the Home Fleet
  {Comp: PreparedGalaxy, from: 15, len: 9, at: 14.5}, // Reaper beam, cruiser lost
  {Comp: PreparedGalaxy, from: 34, len: 8, at: 23.5}, // hyper-mass accelerator kill
  {Comp: Catalyst, from: 78.5, len: 7, at: 31.5}, // "That ends now." / "I choose us."
  {Comp: FinalHarvest, from: 36, len: 7, at: 38.5}, // the firing plan
  {Comp: FinalHarvest, from: 60.5, len: 9, at: 45.5}, // Harbinger
];

export const TRAILER_SECONDS = 66;

export const Trailer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <CinematicText text="For millions of years, every cycle ended the same way." from={s(0.3)} to={s(3.2)} size={38} tracking={3} fade={20} />
      {EXCERPTS.map((e, i) => (
        <Sequence key={i} from={s(e.at) - s(e.from)} durationInFrames={s(e.from + e.len)} layout="none">
          <AbsoluteFill style={{opacity: fadeInOut(frame, s(e.at), s(e.at + 0.5), s(e.at + e.len - 0.5), s(e.at + e.len))}}>
            <e.Comp />
          </AbsoluteFill>
        </Sequence>
      ))}
      <CinematicText text="This time, the galaxy was ready." from={s(54.8)} to={s(58.2)} size={44} tracking={6} fade={18} />
      <Sequence from={s(58.5)} durationInFrames={s(7.5)} layout="none">
        <MainTitle from={0} to={s(7.5)} showTagline showFan />
      </Sequence>
      <Fade opacity={kf(frame, [s(65.2), s(66)], [0, 1])} />
    </AbsoluteFill>
  );
};
