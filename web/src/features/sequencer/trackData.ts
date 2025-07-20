export type TrackData = {
  id: number;
  name: string;
  velocity: number;
  pattern: number[];
  muted: boolean;
  play: (time: number, velocity: number) => void;
};

let currentId = 0

export function newTrackData(name: string, play: (time: number, velocity: number) => void): TrackData {
  currentId += 1

  return {
    id: currentId,
    name: name,
    velocity: 1,
    pattern: Array(16).fill(0),
    muted: false,
    play: play
  }
}