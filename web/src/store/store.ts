import { create } from "zustand";
import { createSequencerSlice, type SequencerSlice } from "./sequencerSlice";
import { createTransportSlice, type TransportSlice } from "./transportSlice";
import { createPlaylistSlice, type PlaylistSlice } from "./playlistSlice";

export type AppState = SequencerSlice & TransportSlice & PlaylistSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createSequencerSlice(...a),
  ...createTransportSlice(...a),
  ...createPlaylistSlice(...a)
}));
