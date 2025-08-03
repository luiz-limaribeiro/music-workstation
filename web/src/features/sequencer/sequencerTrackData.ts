import { newStep, type Step } from "./step";

export type SequencerTrack = {
  id: number;
  name: string;
  velocity: number;
  muted: boolean;
  pattern: Step[];
  play: (time: number, stepVelocity: number, stepRepeatValue: number) => void;
};

let currentId = 0

export function newSequencerTrackData(name: string, play: (time: number) => void): SequencerTrack {
  currentId += 1

  return {
    id: currentId,
    name: name,
    velocity: 1,
    muted: false,
    pattern: Array(16).fill(newStep()),
    play: play
  }
}