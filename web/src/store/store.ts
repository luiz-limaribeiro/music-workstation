import { create } from "zustand";
import { createSequencerSlice, type SequencerSlice } from "./sequencerSlice";
import { createPlaybackEngineSlice, type PlaybackSlice } from "./playbackEngineSlice";

export type AppState = SequencerSlice & PlaybackSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createSequencerSlice(...a),
  ...createPlaybackEngineSlice(...a),
}));
