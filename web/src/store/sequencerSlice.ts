import type { StateCreator } from "zustand";
import { newTrackData, type DrumTrack } from "../features/sequencer/drumTrack";
import type { AppState } from "./store";
import { drums } from "../features/sequencer/synthPresets";
import { newStep } from "../features/sequencer/step";

export interface SequencerSlice {
  drumTracks: DrumTrack[];
  toggleStep: (trackId: number, stepIndex: number) => void;
  addDrumTrack: () => void;
  setStepVelocity: (
    trackId: number,
    stepIndex: number,
    velocity: number
  ) => void;
  setRepeatValue: (
    trackId: number,
    stepIndex: number,
    repeatValue: number
  ) => void;
  setTrackVelocity: (trackId: number, velocity: number) => void;
  clearPattern: (trackId: number) => void;
  removeDrumTrack: (trackId: number) => void;
  toggleMute: (trackId: number) => void;
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
  drumTracks: [
    newTrackData("kick", drums.kick),
    newTrackData("snare", drums.snare),
    newTrackData("hihat", drums.hihat),
  ],
  toggleStep: (trackId, stepIndex) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      // Create a new pattern array with the toggled step
      const newPattern = state.drumTracks[trackIndex].pattern.map((step, idx) =>
        idx === stepIndex ? { ...step, active: !step.active } : step
      );

      // Create a new drumTracks array with the updated track
      const newDrumTracks = state.drumTracks.map((track, idx) =>
        idx === trackIndex ? { ...track, pattern: newPattern } : track
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
  addDrumTrack: () =>
    set((state) => ({
      drumTracks: [...state.drumTracks, newTrackData("<empty>", () => {})],
    })),
  setStepVelocity: (trackId, stepIndex, velocity) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const newPattern = state.drumTracks[trackIndex].pattern.map((step, idx) =>
        idx === stepIndex ? { ...step, velocity: velocity } : step
      );

      const newDrumTracks = state.drumTracks.map((track, idx) =>
        idx === trackIndex ? { ...track, pattern: newPattern } : track
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
  setRepeatValue: (trackId, stepIndex, repeatValue) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const newPattern = state.drumTracks[trackIndex].pattern.map((step, idx) =>
        idx === stepIndex ? { ...step, repeatValue: repeatValue } : step
      );

      const newDrumTracks = state.drumTracks.map((track, idx) =>
        idx === trackIndex ? { ...track, pattern: newPattern } : track
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
  setTrackVelocity: (trackId, velocity) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const newDrumTracks = state.drumTracks.map((track, idx) =>
        idx === trackIndex ? { ...track, velocity: velocity } : track
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
  clearPattern: (trackId) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const newDrumTracks = state.drumTracks.map((track, idx) =>
        idx === trackIndex
          ? { ...track, pattern: Array(16).fill(newStep()) }
          : track
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
  removeDrumTrack: (trackId) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const newDrumTracks = state.drumTracks.filter(
        (_, idx) => idx != trackIndex
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
  toggleMute: (trackId) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const newDrumTracks = state.drumTracks.map((track, idx) =>
        idx === trackIndex ? { ...track, muted: !track.muted } : track
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
  setSample: (trackId, name, play) =>
    set((state) => {
      const trackIndex = state.drumTracks.findIndex(
        (track) => track.id === trackId
      );
      if (trackIndex === -1) return state;

      const newDrumTracks = state.drumTracks.map((track, idx) =>
        idx === trackIndex ? { ...track, name: name, play: play } : track
      );

      return {
        drumTracks: newDrumTracks,
      };
    }),
});
