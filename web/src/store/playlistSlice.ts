import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { TrackData } from "../models/trackData";
import type { ClipData } from "../models/clipData";
import { newSequencerTrackData } from "../models/sequencerTrackData";
import { newStepData } from "../models/stepData";

export interface PlaylistSlice {
  tracks: {
    byId: { [id: number]: TrackData };
    allIds: number[];
  };
  clips: {
    byId: { [id: number]: ClipData };
    allIds: number[];
  };
  trackClips: { [trackId: number]: number[] };

  selectedClipId: number;
  newClipGhost: { trackId: number; x: number } | null;
  stepCount: number;

  addTrack: (track: TrackData) => void;
  updateTrackVelocity: (trackId: number, velocity: number) => void;
  updateTrackPanning: (trackId: number, panning: number) => void;
  toggleTrackMuted: (trackId: number) => void;
  toggleTrackSolo: (trackId: number) => void;
  addClip: (trackId: number, clip: ClipData) => void;
  moveClip: (clipId: number, startStep: number) => void;
  selectClip: (clipId: number) => void;
  showNewClipButton: (trackId: number, x: number) => void;
  hideNewClipButton: () => void;
  updateStepCount: (count: number) => void;
}

export const createPlaylistSlice: StateCreator<
  AppState,
  [],
  [],
  PlaylistSlice
> = (set) => ({
  tracks: { byId: [], allIds: [] },
  clips: { byId: [], allIds: [] },
  trackClips: {},
  selectedClipId: -1,
  newClipGhost: null,
  stepCount: 32,
  addTrack: (newTrackData) =>
    set((state) => {
      const newTrackId = newTrackData.id;

      const newById = {
        ...state.tracks.byId,
        [newTrackId]: newTrackData,
      };

      const newAllIds = [...state.tracks.allIds, newTrackId];

      const newTrackClips = {
        ...state.trackClips,
        [newTrackId]: [],
      };

      return {
        tracks: {
          byId: newById,
          allIds: newAllIds,
        },
        trackClips: newTrackClips,
      };
    }),
  updateTrackVelocity: (trackId, velocity) =>
    set((state) => ({
      tracks: {
        ...state.tracks,
        byId: {
          ...state.tracks.byId,
          [trackId]: {
            ...state.tracks.byId[trackId],
            velocity: velocity,
          },
        },
      },
    })),
  updateTrackPanning: (trackId, panning) =>
    set((state) => ({
      tracks: {
        ...state.tracks,
        byId: {
          ...state.tracks.byId,
          [trackId]: {
            ...state.tracks.byId[trackId],
            panning: panning,
          },
        },
      },
    })),
  toggleTrackMuted: (trackId) =>
    set((state) => {
      const track = state.tracks.byId[trackId];

      return {
        tracks: {
          ...state.tracks,
          byId: {
            ...state.tracks.byId,
            [trackId]: { ...track, muted: !track.muted },
          },
        },
      };
    }),
  toggleTrackSolo: (trackId) =>
    set((state) => {
      const track = state.tracks.byId[trackId];

      return {
        tracks: {
          ...state.tracks,
          byId: {
            ...state.tracks.byId,
            [trackId]: { ...track, solo: !track.solo },
          },
        },
      };
    }),
  addClip: (trackId, newClipData) =>
    set((state) => {
      const newClipId = newClipData.id;

      const newById = {
        ...state.clips.byId,
        [newClipId]: newClipData,
      };
      const newAllIds = [...state.clips.allIds, newClipId];
      const newTrackClips = {
        ...state.trackClips,
        [trackId]: [...(state.trackClips[trackId] || []), newClipId],
      };

      const initialSequencerTrack = newSequencerTrackData("<empty>", () => {});
      const newSequencerTrackId = initialSequencerTrack.id;

      const newSequencerTracksById = {
        ...state.sequencerTracks.byId,
        [newSequencerTrackId]: initialSequencerTrack,
      };
      const newSequencerTracksAllIds = [
        ...state.sequencerTracks.allIds,
        newSequencerTrackId,
      ];

      const newClipSequencerTracks = {
        ...state.clipSequencerTracks,
        [newClipId]: [newSequencerTrackId],
      };

      const newStepsById = { ...state.steps.byId };
      const newStepsAllIds = [...state.steps.allIds];
      const newStepIdsForTrack = [];

      for (let i = 0; i < 16; ++i) {
        const newStep = newStepData();
        newStepsById[newStep.id] = newStep;
        newStepsAllIds.push(newStep.id);
        newStepIdsForTrack.push(newStep.id);
      }

      const newSequencerTrackSteps = {
        ...state.sequencerTrackSteps,
        [newSequencerTrackId]: newStepIdsForTrack,
      };

      return {
        clips: { byId: newById, allIds: newAllIds },
        trackClips: newTrackClips,
        sequencerTracks: {
          byId: newSequencerTracksById,
          allIds: newSequencerTracksAllIds,
        },
        clipSequencerTracks: newClipSequencerTracks,
        steps: { byId: newStepsById, allIds: newStepsAllIds },
        sequencerTrackSteps: newSequencerTrackSteps,
      };
    }),
  moveClip: (clipId, startStep) =>
    set((state) => ({
      clips: {
        ...state.clips,
        byId: {
          ...state.clips.byId,
          [clipId]: {
            ...state.clips.byId[clipId],
            startStep: startStep,
          },
        },
      },
    })),
  selectClip: (clipId) => set({ selectedClipId: clipId }),
  showNewClipButton: (trackId, x) => set({ newClipGhost: { trackId, x } }),
  hideNewClipButton: () => set({ newClipGhost: null }),
  updateStepCount: (clipId) =>
    set((state) => {
      const clip = state.clips.byId[clipId];
      const clipEndStep = clip.startStep + clip.length;
      const currentStepCount = state.stepCount;

      if (clipEndStep > currentStepCount) {
        const newStepCount = Math.ceil(clipEndStep / 16) * 16;
        return {
          stepCount: newStepCount,
        };
      }

      return state;
    }),
});
