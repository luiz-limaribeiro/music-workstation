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

  toggleStep: (trackId: number, stepIndex: number) => void;
  setVelocity: (trackId: number, velocity: number) => void;
  toggleMuted: (trackId: number) => void;
  clearSequence: (trackId: number) => void;
  deleteSequence: (clipId: number, trackId: number) => void;
  addSequencerTrack: (
    clipId: number,
    sequencerTrackData: SequencerTrack
  ) => void;
  setStepVelocity: (
    trackId: number,
    stepIndex: number,
    velocity: number
  ) => void;
  setStepRepeatValue: (
    trackId: number,
    stepIndex: number,
    repeatValue: number
  ) => void;
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
  toggleStep: (trackId, stepIndex) =>
    set((state) => {
      const trackToUpdate = state.sequencerTracks.byId[trackId];

      const newPattern = trackToUpdate.pattern.map((step, i) =>
        i === stepIndex ? { ...step, active: !step.active } : step
      );

      return {
        sequencerTracks: {
          ...state.sequencerTracks,
          byId: {
            ...state.sequencerTracks.byId,
            [trackId]: { ...trackToUpdate, pattern: newPattern },
          },
        },
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
  addSequencerTrack: (clipId, sequencerTrackData) =>
    set((state) => {
      const newTrackId = sequencerTrackData.id;

      const newById = {
        ...state.sequencerTracks.byId,
        [newTrackId]: sequencerTrackData,
      };

      const newAllIds = [...state.sequencerTracks.allIds, newTrackId];

      const existingTrackIds = state.clipSequencerTracks[clipId] || [];
      const newClipTracks = {
        ...state.clipSequencerTracks,
        [clipId]: [...existingTrackIds, newTrackId],
      };

      return {
        sequencerTracks: {
          byId: newById,
          allIds: newAllIds,
        },
        clipSequencerTracks: newClipTracks,
      };
    }),
  setStepVelocity: (trackId, stepIndex, velocity) => set((state) => {
      const track = state.sequencerTracks.byId[trackId];
      const newPattern = track.pattern.map((step, i) =>
        i === stepIndex ? { ...step, velocity: velocity } : step
      );

      return {
        sequencerTracks: {
          ...state.sequencerTracks,
          byId: {
            ...state.sequencerTracks.byId,
            [trackId]: { ...track, pattern: newPattern },
          },
        },
      };
  }),
  setStepRepeatValue: (trackId, stepIndex, repeatValue) =>
    set((state) => {
      const track = state.sequencerTracks.byId[trackId];
      const newPattern = track.pattern.map((step, i) =>
        i === stepIndex ? { ...step, repeatValue: repeatValue } : step
      );

      return {
        sequencerTracks: {
          ...state.sequencerTracks,
          byId: {
            ...state.sequencerTracks.byId,
            [trackId]: { ...track, pattern: newPattern },
          },
        },
      };
    }),
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
