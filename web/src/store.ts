import { create } from "zustand";
import { newTrackData, type DrumTrack } from "./sequencer/drumTrack";
import { drums } from "./sequencer/synthPresets";
import { newStep } from "./sequencer/step";

type AppState = {
  // Sequencer slice
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

  // Transport slice
  isPlaying: boolean;
  bpm: number;
  currentStep: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setBpm: (bpm: number) => void;
  setCurrentStep: (step: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  // Sequencer slice
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

  // Transport slice
  isPlaying: false,
  bpm: 120,
  currentStep: 0,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setBpm: (bpm) => set({ bpm: bpm < 30 ? 30 : bpm > 240 ? 240 : bpm }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));
