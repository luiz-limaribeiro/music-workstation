import { create } from "zustand";
import { createPlaylistSlice, type PlaylistSlice } from "./playlistSlice";
import { createStepSlice, type StepSlice } from "./stepSlice";
import { createAudioSlice, type AudioSlice } from "./audioSlice";

export type AppState = AudioSlice & PlaylistSlice & StepSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createAudioSlice(...a),
  ...createPlaylistSlice(...a),
  ...createStepSlice(...a),
}));
