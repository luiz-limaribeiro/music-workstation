import { create } from "zustand";
import { createTransportSlice, type TransportSlice } from "./transportSlice";
import { createPlaylistSlice, type PlaylistSlice } from "./playlistSlice";

export type AppState = TransportSlice & PlaylistSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createTransportSlice(...a),
  ...createPlaylistSlice(...a),
}));
