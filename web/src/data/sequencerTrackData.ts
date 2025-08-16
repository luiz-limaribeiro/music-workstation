export type SequencerTrack = {
  id: number;
  name: string;
  velocity: number;
  muted: boolean;
  player: (time: number, stepVelocity: number, stepRepeatValue: number) => void;
};

let nextId = 0

export function newSequencerTrackData(name: string, play: (time: number) => void): SequencerTrack {
  return {
    id: nextId++,
    name,
    velocity: 1,
    muted: false,
    player: play,
  }
}