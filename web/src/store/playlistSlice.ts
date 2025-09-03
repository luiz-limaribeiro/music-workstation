import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { TrackData } from "../data/trackData";
import { getNextClipId, type ClipData } from "../data/clipData";
import { getNextStepId, newStepData } from "../data/stepData";
import {
  createPlayer,
  newInstrumentData,
  type InstrumentData,
} from "../data/instrumentData";
import type { SynthPreset } from "../data/synthPresets";

export interface PlaylistSlice {
  tracks: {
    byId: { [id: number]: TrackData };
    allIds: number[];
  };
  clips: {
    byId: { [id: number]: ClipData };
    allIds: number[];
  };
  instruments: {
    byId: { [id: number]: InstrumentData };
    allIds: number[];
  };
  trackClips: { [trackId: number]: number[] };
  trackInstruments: { [trackId: number]: number[] };
  selectedClipId: number;
  selectedTrackId: number;
  trackToRenameId: number;
  newClipGhost: { trackId: number; x: number } | null;
  stepCount: number;
  gridCellWidth: number;
  soloTrackIds: number[];
  mutedTrackIds: number[];
  playlistActions: {
    addTrack: (track: TrackData) => void;
    renameTrack: (trackId: number, name: string) => void;
    deleteTrack: (trackId: number) => void;
    updateVelocity: (trackId: number, velocity: number) => void;
    updatePanning: (trackId: number, panning: number) => void;
    toggleMuted: (trackId: number) => void;
    toggleSolo: (trackId: number) => void;
    selectTrack: (trackId: number) => void;
    selectTrackToRename: (trackId: number) => void;
    updateStepCount: (count: number) => void;
    setGridCellWidth: (width: number) => void;
  };
  clipActions: {
    addClip: (trackId: number, clip: ClipData) => void;
    moveClip: (clipId: number, startStep: number) => void;
    selectClip: (clipId: number) => void;
    showNewClipButton: (trackId: number, x: number) => void;
    hideNewClipButton: () => void;
    duplicateClip: (
      trackId: number,
      clipId: number,
      startStep?: number
    ) => void;
    deleteClip: (trackId: number, clipId: number) => void;
  };
  instrumentActions: {
    addInstrument: (trackId: number, instrument: InstrumentData) => void;
    setVelocity: (instrumentId: number, velocity: number) => void;
    clearSequence: (instrumentId: number) => void;
    deleteSequence: (instrumentId: number) => void;
    toggleMute: (instrumentId: number) => void;
    setSample: (
      trackId: number,
      instrumentId: number,
      synthPreset: SynthPreset
    ) => void;
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
  instruments: { byId: [], allIds: [] },
  trackClips: {},
  trackInstruments: {},
  selectedClipId: -1,
  selectedTrackId: -1,
  trackToRenameId: -1,
  newClipGhost: null,
  stepCount: 64,
  gridCellWidth: 0,
  soloTrackIds: [],
  mutedTrackIds: [],
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

        // Initial instrument
        const newInstrument = newInstrumentData();
        const newInstrumentId = newInstrument.id;
        const newInstrumentsById = {
          ...state.instruments.byId,
          [newInstrumentId]: newInstrument,
        };
        const newInstrumentsAllIds = [
          ...state.instruments.allIds,
          newInstrumentId,
        ];
        const newTrackInstruments = {
          ...state.trackInstruments,
          [newTrackId]: [newInstrumentId],
        };

        return {
          tracks: {
            byId: newById,
            allIds: newAllIds,
          },
          trackClips: newTrackClips,
          trackInstruments: newTrackInstruments,
          instruments: {
            byId: newInstrumentsById,
            allIds: newInstrumentsAllIds,
          },
        };
      }),
    renameTrack: (trackId, name) =>
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
    deleteTrack: (trackId) =>
      set((state) => {
        const newState = { ...state };
        const clipIdsToDelete = newState.trackClips[trackId] || [];
        const instrumentIds = newState.trackInstruments[trackId] || [];
        const stepIdsToDelete = clipIdsToDelete.flatMap(
          (clipId) => newState.clipSteps[clipId] || []
        );

        // Track
        const track = newState.tracks.byId[trackId];
        track.volumeNode.dispose();
        track.pannerNode.dispose();

        delete newState.tracks.byId[trackId];
        delete newState.trackClips[trackId];
        delete newState.trackInstruments[trackId];
        newState.tracks.allIds = newState.tracks.allIds.filter(
          (id) => id !== trackId
        );

        // Clips associated with the track
        clipIdsToDelete.forEach((clipId) => {
          delete newState.clips.byId[clipId];
        });
        newState.clips.allIds = newState.clips.allIds.filter(
          (id) => !clipIdsToDelete.includes(id)
        );

        // Instruments associated with the track
        instrumentIds.forEach((instrumentId) => {
          delete newState.instruments.byId[instrumentId];
        });
        newState.instruments.allIds = newState.instruments.allIds.filter(
          (id) => !instrumentIds.includes(id)
        );

        // Clip's steps
        stepIdsToDelete.forEach((stepId) => {
          delete newState.steps.byId[stepId];
        });
        newState.steps.allIds = newState.steps.allIds.filter(
          (id) => !stepIdsToDelete.includes(id)
        );

        return newState;
      }),
    updateVelocity: (trackId, velocity) =>
      set((state) => {
        const track = state.tracks.byId[trackId];
        const velocityInDb = velocity * 60 - 60; // 0..1 → -60..0 dB
        track.volumeNode.volume.value = velocityInDb;

        return {
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
        };
      }),
    updatePanning: (trackId, panning) =>
      set((state) => {
        const track = state.tracks.byId[trackId];
        track.pannerNode.pan.value = panning;

        return {
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
        };
      }),
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
          mutedTrackIds: [trackId],
        };
      }),
    toggleSolo: (trackId) =>
      set((state) => ({
        soloTrackIds: state.soloTrackIds.includes(trackId)
          ? state.soloTrackIds.filter((id) => id !== trackId)
          : [...state.soloTrackIds, trackId],
        tracks: {
          ...state.tracks,
          byId: {
            ...state.tracks.byId,
            [trackId]: {
              ...state.tracks.byId[trackId],
              solo: !state.tracks.byId[trackId].solo,
            },
          },
        },
      })),
    selectTrack: (trackId) => set({ selectedTrackId: trackId }),
    selectTrackToRename: (trackId) => set({ trackToRenameId: trackId }),
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
    setGridCellWidth: (width) => set({ gridCellWidth: width }),
  },
  clipActions: {
    addClip: (trackId, newClipData) =>
      set((state) => {
        // Clip
        const newClipId = newClipData.id;

        const newById = {
          ...state.clips.byId,
          [newClipId]: newClipData,
        };
        const newAllIds = [...state.clips.allIds, newClipId];
        const newTrackClips = {
          ...state.trackClips,
          [trackId]: [...state.trackClips[trackId], newClipId],
        };

        // Steps
        const instrumets = state.trackInstruments[trackId];
        const newStepsById = { ...state.steps.byId };
        const newStepsAllIds = [...state.steps.allIds];
        const newStepIds: number[] = [];

        instrumets.forEach(() => {
          for (let i = 0; i < 16; ++i) {
            const newStep = newStepData(i);
            newStepsById[newStep.id] = newStep;
            newStepsAllIds.push(newStep.id);
            newStepIds.push(newStep.id);
          }
        });

        const newClipSteps = {
          ...state.clipSteps,
          [newClipId]: newStepIds,
        };

        return {
          clips: { byId: newById, allIds: newAllIds },
          trackClips: newTrackClips,
          steps: { byId: newStepsById, allIds: newStepsAllIds },
          clipSteps: newClipSteps,
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
    duplicateClip: (trackId, clipId, startStep) =>
      set((state) => {
        const originalClip = state.clips.byId[clipId];
        const newClip = {
          ...originalClip,
          id: getNextClipId(),
          startStep: originalClip.startStep + originalClip.length,
        };
        const newClipId = newClip.id;
        const newById = {
          ...state.clips.byId,
          [newClipId]: newClip,
        };
        const newAllIds = [...state.clips.allIds, newClipId];
        const newTrackClips = {
          ...state.trackClips,
          [trackId]: [...state.trackClips[trackId], newClipId],
        };

        // Steps
        const originalStepIds = state.clipSteps[clipId];
        const newStepsById = { ...state.steps.byId };
        const newStepsAllIds = [...state.steps.allIds];
        const newStepIds: number[] = [];
        originalStepIds.forEach((stepId) => {
          const originalStep = state.steps.byId[stepId];
          const newStep = { ...originalStep, id: getNextStepId() };
          newStepsById[newStep.id] = newStep;
          newStepsAllIds.push(newStep.id);
          newStepIds.push(newStep.id);
        });
        const newClipSteps = {
          ...state.clipSteps,
          [newClipId]: newStepIds,
        };

        if (startStep !== undefined && startStep >= 0)
          newClip.startStep = startStep;

        return {
          clips: { byId: newById, allIds: newAllIds },
          trackClips: newTrackClips,
          steps: { byId: newStepsById, allIds: newStepsAllIds },
          clipSteps: newClipSteps,
          selectedClipId: newClipId,
        };
      }),
    deleteClip: (trackId, clipId) =>
      set((state) => {
        const newState = { ...state };
        const stepIdsToDelete = newState.clipSteps[clipId] || [];

        // Clip
        delete newState.clips.byId[clipId];
        delete newState.clipSteps[clipId];
        newState.clips.allIds = newState.clips.allIds.filter(
          (id) => id !== clipId
        );
        newState.trackClips[trackId] = newState.trackClips[trackId].filter(
          (id) => id !== clipId
        );

        // Clip's steps
        stepIdsToDelete.forEach((stepId) => {
          delete newState.steps.byId[stepId];
        });
        newState.steps.allIds = newState.steps.allIds.filter(
          (id) => !stepIdsToDelete.includes(id)
        );

        newState.selectedClipId = -1;

        return newState;
      }),
  },
  instrumentActions: {
    addInstrument: (trackId, instrument) => {
      set((state) => {
        const newInstrumentId = instrument.id;
        const newById = {
          ...state.instruments.byId,
          [newInstrumentId]: instrument,
        };
        const newAllIds = [...state.instruments.allIds, newInstrumentId];

        const newTrackInstruments = {
          ...state.trackInstruments,
          [trackId]: [...state.trackInstruments[trackId], newInstrumentId],
        };

        // Steps
        const clips = state.trackClips[trackId];
        const newClipSteps: { [clipId: number]: number[] } = {
          ...state.clipSteps,
        };
        const newStepsById = { ...state.steps.byId };
        const newStepsAllIds = [...state.steps.allIds];

        for (const clipId of clips) {
          const existingStepIds = newClipSteps[clipId] || [];
          const newStepIds = [];

          for (let i = 0; i < 16; ++i) {
            const newStep = newStepData(i);
            newStepsById[newStep.id] = newStep;
            newStepsAllIds.push(newStep.id);
            newStepIds.push(newStep.id);
          }

          newClipSteps[clipId] = [...existingStepIds, ...newStepIds];
        }

        return {
          instruments: {
            byId: newById,
            allIds: newAllIds,
          },
          trackInstruments: newTrackInstruments,
          steps: { byId: newStepsById, allIds: newStepsAllIds },
          clipSteps: newClipSteps,
        };
      });
    },
    setVelocity: (instrumentId, velocity) => {
      set((state) => ({
        instruments: {
          ...state.instruments,
          byId: {
            ...state.instruments.byId,
            [instrumentId]: {
              ...state.instruments.byId[instrumentId],
              velocity: velocity,
            },
          },
        },
      }));
    },
    clearSequence: () => {},
    deleteSequence: () => {},
    toggleMute: () => {},
    setSample: (trackId, instrumentId, sample) => {
      set((state) => {
        const instruments = state.trackInstruments[trackId];
        for (const instId of instruments) {
          const instrument = state.instruments.byId[instId];
          if (instrument.sample.name === sample.name) return state;
        }

        let instrument = state.instruments.byId[instrumentId];
        instrument.sample.dispose();

        const newSample = sample.synth();

        instrument = {
          ...instrument,
          name: sample.name,
          synthPreset: sample,
          sample: newSample,
          player: createPlayer(newSample, sample.note),
        };

        return {
          instruments: {
            ...state.instruments,
            byId: {
              ...state.instruments.byId,
              [instrumentId]: instrument,
            },
          },
        };
      });
    },
  },
});
