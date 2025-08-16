import { create } from "zustand";
import { createPlaylistSlice, type PlaylistSlice } from "./playlistSlice";
import { createSequencerSlice, type SequencerSlice } from "./sequencerSlice";
import { createStepSlice, type StepSlice } from "./stepSlice";
import { createAudioSlice, type AudioSlice } from "./audioSlice";

export type AppState =  AudioSlice & PlaylistSlice & SequencerSlice & StepSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createAudioSlice(...a),
  ...createPlaylistSlice(...a),
  ...createSequencerSlice(...a),
  ...createStepSlice(...a),
}));
