import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {noise1} from '../animation/anim';

/**
 * Final colour grade applied over every scene: vignette, subtle chromatic
 * lift in the shadows, film grain and an optional letterbox. Keeps the
 * production visually consistent across chapters.
 */
export const Grade: React.FC<{
  vignette?: number;
  grain?: number;
  tint?: string;
  tintOpacity?: number;
  letterbox?: number;
}> = ({vignette = 0.75, grain = 0.06, tint = '#0b1a33', tintOpacity = 0.12, letterbox = 0}) => {
  const frame = useCurrentFrame();
  const g = 0.5 + 0.5 * noise1(frame * 3.3, 42);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: tint, opacity: tintOpacity, mixBlendMode: 'screen'}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette * 0.55}) 85%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: grain * (0.8 + 0.4 * g),
          mixBlendMode: 'overlay',
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27240%27 height=%27240%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/><feColorMatrix type=%27saturate%27 values=%270%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/></svg>")',
          backgroundSize: '240px 240px',
          backgroundPosition: `${(frame * 37) % 240}px ${(frame * 53) % 240}px`,
        }}
      />
      {letterbox > 0 ? (
        <>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: letterbox, background: '#000'}} />
          <div style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: letterbox, background: '#000'}} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/** Full-screen fade from/to black. */
export const Fade: React.FC<{opacity: number; color?: string}> = ({opacity, color = '#000'}) => (
  <AbsoluteFill style={{background: color, opacity, pointerEvents: 'none'}} />
);

/** Soft light flash (explosions, weapon discharge). */
export const Flash: React.FC<{opacity: number; color?: string}> = ({opacity, color = '#fff'}) =>
  opacity <= 0 ? null : <AbsoluteFill style={{background: color, opacity, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
