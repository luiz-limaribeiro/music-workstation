import * as Tone from "tone";
import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { TransportClass } from "tone/build/esm/core/clock/Transport";
import { setupPlayback } from "../data/playbackEvent";

export interface AudioSlice {
  isTransportRunning: boolean;
  transport: TransportClass;
  bpm: number;
  currentStep: number;
  audioActions: {
    startPlayback: () => void;
    stopPlayback: () => void;
    setBpm: (bpm: number) => void;
    setCurrentStep: (step: number) => void;
  };
}

export const createAudioSlice: StateCreator<AppState, [], [], AudioSlice> = (
  set
) => ({
  isTransportRunning: false,
  transport: Tone.getTransport(),
  bpm: 120,
  currentStep: 0,
  audioActions: {
    startPlayback: () =>
      set((state) => {
        setupPlayback(state);
        state.transport.start();
        return { isTransportRunning: true };
      }),
    stopPlayback: () =>
      set((state) => {
        state.transport.stop();
        state.transport.position = 0;

        return {
          isTransportRunning: false,
          currentStep: 0,
        };
      }),
    setBpm: (bpm) => set({ bpm }),
    setCurrentStep: (step) => set({ currentStep: step }),
  },
});
