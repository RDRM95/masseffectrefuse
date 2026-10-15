import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONTS} from '../theme';
import {FPS} from '../timeline/chapters';
import {noise1} from '../animation/anim';

/**
 * Subtitle cue: start/end in seconds relative to the chapter. Speaker is shown
 * as a small label above the line in the speaker's colour. `radio` applies a
 * comm-channel treatment (bracketed, monospace-ish spacing, soft flicker).
 */
export interface Cue {
  start: number;
  end: number;
  speaker?: string;
  text: string;
  radio?: boolean;
  /** Position: default bottom; 'center' for Catalyst chamber. */
  position?: 'bottom' | 'center' | 'top';
}

export const SPEAKER_COLORS: Record<string, string> = {
  SHEPARD: '#9fd4ff',
  HACKETT: '#8fb6e0',
  ANDERSON: '#b6c9dd',
  CATALYST: '#c8f0ff',
  HARBINGER: '#ffb01f',
  GARRUS: '#8fc0ff',
  LIARA: '#b48cff',
  TALI: '#d9b3ff',
  JOKER: '#aab3bf',
  EDI: '#8fe8ff',
  'ILLUSIVE MAN': '#ff9b2b',
  WREX: '#ff9e6b',
  'TURIAN COMMAND': '#ffb347',
  'ALLIANCE CONTROL': '#6fc3ff',
  'CERBERUS': '#ff9b2b',
  'FLEET': '#aab3bf',
  'REAPER': '#ff2a1a',
  'VICTUS': '#ffb347',
  'SALARIAN INTEL': '#c3ffb3',
};

export const Subtitles: React.FC<{cues: Cue[]; offsetSeconds?: number}> = ({cues, offsetSeconds = 0}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS + offsetSeconds;
  const active = cues.filter((c) => t >= c.start && t < c.end);
  if (active.length === 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {active.map((c, i) => {
        const fadeIn = Math.min(1, (t - c.start) / 0.18);
        const fadeOut = Math.min(1, (c.end - t) / 0.18);
        const o = Math.max(0, Math.min(fadeIn, fadeOut));
        const flick = c.radio ? 0.92 + 0.08 * noise1(frame * 1.7, i) : 1;
        const color = c.speaker ? SPEAKER_COLORS[c.speaker] ?? '#dfe6ee' : '#dfe6ee';
        const top = c.position === 'center' ? '46%' : c.position === 'top' ? '10%' : undefined;
        const bottom = c.position === 'center' || c.position === 'top' ? undefined : 84;
        return (
          <div
            key={`${c.start}-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top,
              bottom,
              textAlign: 'center',
              opacity: o * flick,
              maxWidth: 1280,
              fontFamily: FONTS.subtitle,
            }}
          >
            {c.speaker ? (
              <div style={{fontFamily: FONTS.ui, fontSize: 22, letterSpacing: 6, color, opacity: 0.9, marginBottom: 6, fontWeight: 500}}>
                {c.radio ? `◢ ${c.speaker} ◣` : c.speaker}
              </div>
            ) : null}
            <div
              style={{
                fontSize: 40,
                fontWeight: 500,
                lineHeight: 1.25,
                color: '#f4f6f8',
                textShadow: '0 2px 2px rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
                letterSpacing: c.radio ? 1.5 : 0.5,
                padding: '4px 18px',
                background: 'rgba(0,0,0,0.28)',
                borderRadius: 2,
              }}
            >
              {c.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Export cues to WebVTT for the web player. */
export const toVtt = (cues: Cue[], offsetSeconds = 0): string => {
  const ts = (s: number) => {
    const total = s + offsetSeconds;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toFixed(3).padStart(6, '0')}`;
  };
  const lines = ['WEBVTT', ''];
  cues.forEach((c, i) => {
    lines.push(String(i + 1));
    lines.push(`${ts(c.start)} --> ${ts(c.end)}`);
    lines.push(c.speaker ? `<v ${c.speaker}>${c.text}` : c.text);
    lines.push('');
  });
  return lines.join('\n');
};
