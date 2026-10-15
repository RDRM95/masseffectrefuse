import React from 'react';
import {Audio, getInputProps, staticFile} from 'remotion';

interface Props {
  /** File name under public/audio/music or public/audio/sfx. */
  file: string;
  kind?: 'music' | 'sfx';
  volume?: number | ((f: number) => number);
  startFrom?: number;
}

/**
 * Audio wrapper. Pass `--props='{"noAudio":true}'` to render silent (used by
 * frame-capture QA before the soundtrack has been generated).
 */
export const Music: React.FC<Props> = ({file, kind = 'music', volume = 1, startFrom}) => {
  const props = getInputProps() as {noAudio?: boolean};
  if (props?.noAudio) return null;
  return <Audio src={staticFile(`audio/${kind}/${file}`)} volume={volume} startFrom={startFrom} />;
};

export const Sfx: React.FC<Omit<Props, 'kind'>> = (p) => <Music {...p} kind="sfx" />;
