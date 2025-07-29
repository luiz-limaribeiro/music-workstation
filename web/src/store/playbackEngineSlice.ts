import * as Tone from "tone";
import { type StateCreator } from "zustand";
import type { AppState } from "./store";

export interface PlaybackSlice {
  isPlaying: boolean;
  bpm: number;
  currentStep: number;
  startPlayback: () => void;
  stopPlayback: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setBpm: (bpm: number) => void;
  setCurrentStep: (step: number) => void;
}

export const createPlaybackEngineSlice: StateCreator<
  AppState,
  [],
  [],
  PlaybackSlice
> = (set) => ({
  isPlaying: false,
  bpm: 120,
  currentStep: 0,
  startPlayback: () => {
    if (Tone.getContext().state !== "running") {
      Tone.start();
    }

    Tone.getTransport().start();
    set({ isPlaying: true });
  },
  stopPlayback: () => {
    Tone.getTransport().stop();
    set({ currentStep: 0 });
    set({ isPlaying: false });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setBpm: (bpm) => set({ bpm }),
  setCurrentStep: (step) => set({ currentStep: step }),
});
