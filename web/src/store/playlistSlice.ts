import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { TrackData } from "../data/trackData";
import type { ClipData } from "../data/clipData";
import { newSequencerTrackData } from "../data/sequencerTrackData";
import { newStepData } from "../data/stepData";

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
  selectedTrackId: number;
  trackToRenameId: number;
  newClipGhost: { trackId: number; x: number } | null;
  stepCount: number;
  gridCellWidth: number;
  playlistActions: {
    addTrack: (track: TrackData) => void;
    rename: (trackId: number, name: string) => void;
    delete: (trackId: number) => void;
    updateVelocity: (trackId: number, velocity: number) => void;
    updatePanning: (trackId: number, panning: number) => void;
    toggleMuted: (trackId: number) => void;
    toggleSolo: (trackId: number) => void;
    addClip: (trackId: number, clip: ClipData) => void;
    moveClip: (clipId: number, startStep: number) => void;
    selectClip: (clipId: number) => void;
    selectTrack: (trackId: number) => void;
    selectTrackToRename: (trackId: number) => void;
    showNewClipButton: (trackId: number, x: number) => void;
    hideNewClipButton: () => void;
    updateStepCount: (count: number) => void;
    setGridCellWidth: (width: number) => void;
  };
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
  selectedTrackId: -1,
  trackToRenameId: -1,
  newClipGhost: null,
  stepCount: 64,
  gridCellWidth: 0,
  playlistActions: {
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
    rename: (trackId, name) =>
      set((state) => ({
        tracks: {
          ...state.tracks,
          byId: {
            ...state.tracks.byId,
            [trackId]: {
              ...state.tracks.byId[trackId],
              name: name,
            },
          },
        },
      })),
    delete: (trackId) =>
      set((state) => {
        const newState = { ...state };
        const clipIdsToDelete = newState.trackClips[trackId] || [];
        const sequencerTrackIdsToDelete = clipIdsToDelete.flatMap(
          (clipId) => newState.clipSequencerTracks[clipId] || []
        );
        const stepIdsToDelete = sequencerTrackIdsToDelete.flatMap(
          (seqId) => newState.sequencerTrackSteps[seqId] || []
        );

        // Track
        delete newState.tracks.byId[trackId];
        delete newState.trackClips[trackId];
        newState.tracks.allIds = newState.tracks.allIds.filter(
          (id) => id !== trackId
        );

        // Clips associated with the track
        clipIdsToDelete.forEach((clipId) => {
          delete newState.clips.byId[clipId];
          delete newState.clipSequencerTracks[clipId];
        });
        newState.clips.allIds = newState.clips.allIds.filter(
          (id) => !clipIdsToDelete.includes(id)
        );

        // Sequencer associated with the clips
        sequencerTrackIdsToDelete.forEach((seqId) => {
          delete newState.sequencerTracks.byId[seqId];
          delete newState.sequencerTrackSteps[seqId];
        });
        newState.sequencerTracks.allIds =
          newState.sequencerTracks.allIds.filter(
            (id) => !sequencerTrackIdsToDelete.includes(id)
          );

        // Sequencer's steps
        stepIdsToDelete.forEach((stepId) => {
          delete newState.steps.byId[stepId];
        });
        newState.steps.allIds = newState.steps.allIds.filter(
          (id) => !stepIdsToDelete.includes(id)
        );

        return newState;
      }),
    updateVelocity: (trackId, velocity) =>
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
    updatePanning: (trackId, panning) =>
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
    toggleMuted: (trackId) =>
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
    toggleSolo: (trackId) =>
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

        const initialSequencerTrack = newSequencerTrackData(
          "<empty>",
          () => {}
        );
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
          const newStep = newStepData(i);
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
    selectTrack: (trackId) => set({ selectedTrackId: trackId }),
    selectTrackToRename: (trackId) => set({ trackToRenameId: trackId }),
    showNewClipButton: (trackId, x) => set({ newClipGhost: { trackId, x } }),
    hideNewClipButton: () => set({ newClipGhost: null }),
    updateStepCount: (clipId) =>
      set((state) => {
        const clip = state.clips.byId[clipId];
        const clipEndStep = clip.startStep + clip.length;
        const currentStepCount = state.stepCount;

        if (clipEndStep > currentStepCount) {
          const newStepCount = Math.ceil(clipEndStep / 16) * 16;
          console.log("new step count:", newStepCount);
          return {
            stepCount: newStepCount,
          };
        }

        return state;
      }),
    setGridCellWidth: (width) => set({ gridCellWidth: width }),
  },
});
