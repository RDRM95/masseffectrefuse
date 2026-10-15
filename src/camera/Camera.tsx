import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WIDTH, HEIGHT} from '../timeline/chapters';

export interface CameraState {
  /** World-space point the camera is looking at (px, 1920x1080 world). */
  x: number;
  y: number;
  /** Zoom factor: 1 = full frame, 2 = twice as close. */
  zoom: number;
  /** Roll in degrees. */
  roll?: number;
}

/**
 * A 2.5D camera. Children are laid out in a 1920x1080 "world"; the camera
 * translates and scales the world so that (x, y) sits at the frame centre.
 * Layers can be given a parallax factor through <Parallax>.
 */
export const Camera: React.FC<{cam: CameraState; children: React.ReactNode}> = ({cam, children}) => {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const transform = `translate(${cx}px, ${cy}px) rotate(${cam.roll ?? 0}deg) scale(${cam.zoom}) translate(${-cam.x}px, ${-cam.y}px)`;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: WIDTH, height: HEIGHT, transform, transformOrigin: '0 0'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Parallax layer: moves against the camera at a reduced rate so distant layers
 * (stars, planets) drift less than the foreground.
 */
export const Parallax: React.FC<{cam: CameraState; factor: number; children: React.ReactNode}> = ({
  cam,
  factor,
  children,
}) => {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  // Counter-translate by (1 - factor) of the camera offset so the net motion is factor * camera motion.
  const dx = (cam.x - cx) * (1 - factor);
  const dy = (cam.y - cy) * (1 - factor);
  const dz = 1 + (cam.zoom - 1) * (1 - factor);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        transform: `translate(${dx}px, ${dy}px) scale(${1 / dz})`,
        transformOrigin: `${cam.x}px ${cam.y}px`,
      }}
    >
      {children}
    </div>
  );
};

/** Place a child at world coordinates with optional scale and rotation. */
export const At: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
  z?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, scale = 1, rotate = 0, opacity = 1, z, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
      transformOrigin: '0 0',
      opacity,
      zIndex: z,
      ...style,
    }}
  >
    {children}
  </div>
);
