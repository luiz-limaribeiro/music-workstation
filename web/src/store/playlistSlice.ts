import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { ClipData } from "../features/playlist/clipData";
import type { TrackData } from "../features/playlist/trackData";

export interface PlaylistSlice {
  tracks: TrackData[];
  addTrack: (track: TrackData) => void;
  setTrackVelocity: (trackId: number, velocity: number) => void;
  setTrackPanning: (trackId: number, panning: number) => void;
  toggleTrackMuted: (trackId: number) => void;
  toggleTrackSolo: (trackId: number) => void;

  clips: ClipData[];
  addClip: (clip: ClipData) => void;
  moveClip: (clipId: number, startStep: number) => void;
}

export const createPlaylistSlice: StateCreator<
  AppState,
  [],
  [],
  PlaylistSlice
> = (set) => ({
  tracks: [],
  addTrack: (track) => set((state) => ({ tracks: [...state.tracks, track] })),
  setTrackVelocity: (trackId, velocity) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId ? { ...track, velocity } : track
      ),
    })),
  setTrackPanning: (trackId, panning) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId ? { ...track, panning } : track
      ),
    })),
  toggleTrackMuted: (trackId) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId ? { ...track, muted: !track.muted } : track
      ),
    })),
  toggleTrackSolo: (trackId) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId ? { ...track, solo: !track.solo } : track
      ),
    })),
  clips: [],
  addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
  moveClip: (clipId, startStep) =>
    set((state) => {
      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId);
      if (clipIndex === -1) return state;

      const updatedClips = state.clips.map((clip, index) => {
        if (index === clipIndex) {
          return { ...clip, startStep };
        }
        return clip;
      });
      return { clips: updatedClips };
    }),
});
