import type { ClipData } from "./clipData";

let nextId = 0;

export type TrackData = {
  id: number;
  name: string;
  panning: number;
  velocity: number;
  muted: boolean;
  solo: boolean;
  clips: ClipData[];
};

export function newTrackData(name: string) {
  nextId += 1;

  return {
    id: nextId,
    name,
    panning: 0,
    velocity: 1,
    muted: false,
    solo: false,
    clips: [],
  };
}
