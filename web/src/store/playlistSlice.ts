import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { TrackData } from "../features/playlist/trackData";
import type { ClipData } from "../features/playlist/clipData";
import type { SequencerTrack } from "../features/sequencer/sequencerTrackData";

export interface PlaylistSlice {
  tracks: TrackData[];
  addTrack: (track: TrackData) => void;
  setTrackVelocity: (trackId: number, velocity: number) => void;
  setTrackPanning: (trackId: number, panning: number) => void;
  toggleTrackMuted: (trackId: number) => void;
  toggleTrackSolo: (trackId: number) => void;
  addClip: (trackId: number, clip: ClipData) => void;
  moveClip: (trackId: number, clipId: number, startStep: number) => void;
  updateSequencerTracks: (
    trackId: number,
    clipId: number,
    newSequencerTracks: SequencerTrack[]
  ) => void;
  selectedClipId: number;
  selectClip: (clipId: number) => void;
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
  addClip: (trackId, clip) =>
    set((state) => {
      const trackIndex = state.tracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const updatedTracks = state.tracks.map((track, index) => {
        if (index === trackIndex) {
          return { ...track, clips: [...track.clips, clip] };
        }
        return track;
      });
      return { tracks: updatedTracks };
    }),
  moveClip: (trackId, clipId, startStep) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              clips: track.clips.map((clip) =>
                clip.id === clipId ? { ...clip, startStep: startStep } : clip
              ),
            }
          : track
      ),
    })),
  updateSequencerTracks: (trackId, clipId, newSequencerTracks) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              clips: track.clips.map((clip) =>
                clip.id === clipId
                  ? { ...clip, sequencerTracks: newSequencerTracks }
                  : clip
              ),
            }
          : track
      ),
    })),
  selectedClipId: -1,
  selectClip: (clipId) => set({ selectedClipId: clipId }),
});
