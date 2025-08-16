import type { StateCreator } from "zustand";
import type { StepData } from "../data/stepData";
import type { AppState } from "./store";

export interface StepSlice {
  steps: {
    byId: { [id: number]: StepData };
    allIds: number[];
  };
  sequencerTrackSteps: { [sequencerTrackId: number]: number[] };
  
  stepActions: {
    toggleStep: (stepId: number) => void;
    setVelocity: (stepId: number, velocity: number) => void;
    setRepeatValue: (stepId: number, repeatValue: number) => void;
  };
}

export const createStepSlice: StateCreator<AppState, [], [], StepSlice> = (
  set
) => ({
  steps: { byId: {}, allIds: [] },
  sequencerTrackSteps: {},
  stepActions: {
    toggleStep: (stepId) =>
      set((state) => {
        const step = state.steps.byId[stepId];
        return {
          steps: {
            ...state.steps,
            byId: {
              ...state.steps.byId,
              [stepId]: { ...step, active: !step.active },
            },
          },
        };
      }),
    setVelocity: (stepId, velocity) =>
      set((state) => ({
        steps: {
          ...state.steps,
          byId: {
            ...state.steps.byId,
            [stepId]: { ...state.steps.byId[stepId], velocity },
          },
        },
      })),
    setRepeatValue: (stepId, repeatValue) =>
      set((state) => ({
        steps: {
          ...state.steps,
          byId: {
            ...state.steps.byId,
            [stepId]: { ...state.steps.byId[stepId], repeatValue },
          },
        },
      })),
  },
});
