import {
  newSequencerTrackData,
  type SequencerTrack,
} from "../sequencer/sequencerTrackData";
import { drums } from "../sequencer/synthPresets";

export type ClipData = {
  id: number;
  startStep: number; // 0 for bar 1, 16 for bar 2
  length: number; // in steps
  sequencerTracks: SequencerTrack[];
};

let nextId = 0

export function newClipData(startStep: number, length: number) {
  nextId += 1

  return {
    id: nextId, 
    startStep,
    length,
    sequencerTracks: [
      newSequencerTrackData("kick", drums.kick),
      newSequencerTrackData("snare", drums.snare),
      newSequencerTrackData("hihat", drums.hihat),
    ],
  };
}
