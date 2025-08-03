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

  updateSequencerTracks: (newSequencerTracks: SequencerTrack[]) => void;

  showSequencer: boolean;
  setShowSequencer: (show: boolean) => void;

  selectedClipIndex: number;
  selectedTrackIndex: number;
  selectClip: (trackId: number, clipId: number) => void;
  unselectClip: () => void;
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
  moveClip: (clipId, startStep) =>
    set((state) => {
      const updatedTracks = state.tracks.map((track) => {
        const updatedClips = track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, startStep } : clip
        );
        return { ...track, clips: updatedClips };
      });
      return { tracks: updatedTracks };
    }),
  updateSequencerTracks: (newSequencerTracks) =>
    set((state) => {
      const { selectedTrackIndex, selectedClipIndex, tracks } = state;
      const updatedTracks = [...tracks];
      updatedTracks[selectedTrackIndex].clips[
        selectedClipIndex
      ].sequencerTracks = newSequencerTracks;
      return { tracks: updatedTracks };
    }),
  clips: [],
  showSequencer: false,
  setShowSequencer: (show) => set({ showSequencer: show }),
  selectedClipIndex: -1,
  selectedTrackIndex: -1,
  selectClip: (trackId, clipId) =>
    set((state) => {
      const trackIndex = state.tracks.findIndex((t) => t.id === trackId);
      const clipIndex = state.tracks[trackIndex].clips.findIndex(
        (c) => c.id === clipId
      );

      return {
        selectedTrackIndex: trackIndex,
        selectedClipIndex: clipIndex,
      };
    }),
  unselectClip: () =>
    set({
      selectedTrackIndex: -1,
      selectedClipIndex: -1,
    }),
});
