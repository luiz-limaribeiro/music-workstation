import type { StateCreator } from "zustand";
import { type SequencerTrack } from "../models/sequencerTrackData";
import type { AppState } from "./store";
import { newStepData } from "../models/stepData";

export interface SequencerSlice {
  sequencerTracks: {
    byId: { [id: number]: SequencerTrack };
    allIds: number[];
  };
  clipSequencerTracks: { [clipId: number]: number[] };

  addSequencerTrack: (
    clipId: number,
    sequencerTrackData: SequencerTrack
  ) => void;
  setVelocity: (trackId: number, velocity: number) => void;
  toggleMuted: (trackId: number) => void;
  clearSequence: (trackId: number) => void;
  deleteSequence: (clipId: number, trackId: number) => void;
  setSample: (
    trackId: number,
    name: string,
    play: (time: number, velocity: number) => void
  ) => void;
}

export const createSequencerSlice: StateCreator<
  AppState,
  [],
  [],
  SequencerSlice
> = (set) => ({
  sequencerTracks: { byId: [], allIds: [] },
  clipSequencerTracks: {},
  addSequencerTrack: (clipId, sequencerTrackData) =>
    set((state) => {
      const newTrackId = sequencerTrackData.id;

      const newById = {
        ...state.sequencerTracks.byId,
        [newTrackId]: sequencerTrackData,
      };
      const newAllIds = [...state.sequencerTracks.allIds, newTrackId];

      const existingClipSequencerTracks =
        state.clipSequencerTracks[clipId] || [];
      const newClipSequencerTracks = {
        ...state.clipSequencerTracks,
        [clipId]: [...existingClipSequencerTracks, newTrackId],
      };

      const newStepsById = { ...state.steps.byId };
      const newStepsAllIds = [ ...state.steps.allIds ];
      const newStepIdsForTrack = [];

      for (let i = 0; i < 16; ++i) {
        const newStep = newStepData();
        newStepsById[newStep.id] = newStep;
        newStepsAllIds.push(newStep.id);
        newStepIdsForTrack.push(newStep.id);
      }

      const newSequencerTrackSteps = {
        ...state.sequencerTrackSteps,
        [newTrackId]: newStepIdsForTrack,
      };

      return {
        sequencerTracks: { byId: newById, allIds: newAllIds },
        clipSequencerTracks: newClipSequencerTracks,
        steps: { byId: newStepsById, allIds: newStepsAllIds },
        sequencerTrackSteps: newSequencerTrackSteps,
      };
    }),
  setVelocity: (trackId, velocity) =>
    set((state) => ({
      sequencerTracks: {
        ...state.sequencerTracks,
        byId: {
          ...state.sequencerTracks.byId,
          [trackId]: {
            ...state.sequencerTracks.byId[trackId],
            velocity: velocity,
          },
        },
      },
    })),
  toggleMuted: (trackId) =>
    set((state) => {
      const track = state.sequencerTracks.byId[trackId];

      return {
        sequencerTracks: {
          ...state.sequencerTracks,
          byId: {
            ...state.sequencerTracks.byId,
            [trackId]: { ...track, muted: !track.muted },
          },
        },
      };
    }),
  clearSequence: (trackId) =>
    set((state) => {
      const track = state.sequencerTracks.byId[trackId];

      return {
        sequencerTracks: {
          ...state.sequencerTracks,
          byId: {
            ...state.sequencerTracks.byId,
            [trackId]: { ...track, pattern: Array(16).fill(newStepData()) },
          },
        },
      };
    }),
  deleteSequence: () => {},
  setSample: (trackId, name, play) =>
    set((state) => ({
      sequencerTracks: {
        ...state.sequencerTracks,
        byId: {
          ...state.sequencerTracks.byId,
          [trackId]: { ...state.sequencerTracks.byId[trackId], name, play },
        },
      },
    })),
});
