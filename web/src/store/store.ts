import { create } from "zustand";
import { createTransportSlice, type TransportSlice } from "./transportSlice";
import { createPlaylistSlice, type PlaylistSlice } from "./playlistSlice";
import { createSequencerSlice, type SequencerSlice } from "./sequencerSlice";

export type AppState = TransportSlice & PlaylistSlice & SequencerSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createTransportSlice(...a),
  ...createPlaylistSlice(...a),
  ...createSequencerSlice(...a),
}));
