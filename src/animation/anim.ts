import {Easing, interpolate, random} from 'remotion';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Linear 0..1 progress between two frames, clamped. */
export const progress = (frame: number, from: number, to: number): number =>
  clamp01((frame - from) / Math.max(1, to - from));

export const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const cinematic = Easing.bezier(0.33, 0.0, 0.2, 1);

/** Fade in over [a,b], hold, fade out over [c,d]. */
export const fadeInOut = (frame: number, a: number, b: number, c: number, d: number): number => {
  if (frame <= a) return 0;
  if (frame >= d) return 0;
  if (frame < b) return (frame - a) / Math.max(1, b - a);
  if (frame > c) return 1 - (frame - c) / Math.max(1, d - c);
  return 1;
};

/** Keyframed interpolation with a cinematic ease and clamped extrapolation. */
export const kf = (
  frame: number,
  frames: number[],
  values: number[],
  easing: (t: number) => number = cinematic,
): number =>
  interpolate(frame, frames, values, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Linear keyframes (no easing). */
export const lin = (frame: number, frames: number[], values: number[]): number =>
  interpolate(frame, frames, values, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Deterministic pseudo-random in [0,1). */
export const rnd = (seed: string | number): number => random(seed);

/** Deterministic random in [min,max). */
export const rr = (seed: string | number, min: number, max: number): number => min + random(seed) * (max - min);

/** Smooth, deterministic 1D noise (sum of sines) in [-1,1]. */
export const noise1 = (t: number, seed = 0): number => {
  const s = seed * 17.17;
  return (
    (Math.sin(t * 1.0 + s) * 0.5 +
      Math.sin(t * 2.3 + s * 1.3 + 1.7) * 0.25 +
      Math.sin(t * 5.1 + s * 0.7 + 3.1) * 0.125 +
      Math.sin(t * 11.7 + s * 2.1 + 0.4) * 0.0625) /
    0.9375
  );
};

/** Camera shake vector for a given frame and intensity (px). */
export const shake = (frame: number, intensity: number, seed = 1): {x: number; y: number; r: number} => ({
  x: noise1(frame * 0.9, seed) * intensity,
  y: noise1(frame * 1.1, seed + 5) * intensity,
  r: noise1(frame * 0.5, seed + 9) * intensity * 0.02,
});

/** Flicker between 0.85..1 used for engines and holograms. */
export const flicker = (frame: number, seed = 0, amount = 0.15): number =>
  1 - amount * (0.5 + 0.5 * noise1(frame * 2.7, seed));

/** Pulse 0..1 with period in frames. */
export const pulse = (frame: number, period: number, phase = 0): number =>
  0.5 + 0.5 * Math.sin(((frame + phase) / period) * Math.PI * 2);
