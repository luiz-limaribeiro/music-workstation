import { create } from "zustand";
import { createTransportSlice, type TransportSlice } from "./transportSlice";
import { createPlaylistSlice, type PlaylistSlice } from "./playlistSlice";
import { createSequencerSlice, type SequencerSlice } from "./sequencerSlice";
import { createStepSlice, type StepSlice } from "./stepSlice";

export type AppState = TransportSlice & PlaylistSlice & SequencerSlice & StepSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createTransportSlice(...a),
  ...createPlaylistSlice(...a),
  ...createSequencerSlice(...a),
  ...createStepSlice(...a),
}));
