import type { Step } from "./step";

export type Track = {
  id: number;
  name: string;
  velocity: number;
  pattern: Step[];
  muted: boolean;
  play: (time: number, velocity: number) => void;
};

let currentId = 0

export function newTrackData(name: string, play: (time: number, velocity: number) => void): Track {
  currentId += 1

  return {
    id: currentId,
    name: name,
    velocity: 1,
    pattern: Array(16).fill({ active: false, velocity: 1.0 }),
    muted: false,
    play: play
  }
}