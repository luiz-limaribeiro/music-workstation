import {
  newSequencerTrackData,
  type SequencerTrack,
} from "./sequencerTrackData";
import { newStep } from "./step";

export type SequencerAction =
  | { type: "TOGGLE_STEP"; trackId: number; stepIndex: number }
  | { type: "SET_TRACK_VELOCITY"; trackId: number; velocity: number }
  | { type: "TOGGLE_MUTED"; trackId: number }
  | { type: "ADD_TRACK" }
  | { type: "CLEAR"; trackId: number }
  | { type: "DELETE"; trackId: number }
  | {
      type: "SET_SAMPLE";
      trackId: number;
      name: string;
      play: (time: number, velocity: number) => void;
    }
  | {
      type: "SET_STEP_VELOCITY";
      trackId: number;
      stepIndex: number;
      velocity: number;
    }
  | {
      type: "SET_STEP_REPEAT_VALUE";
      trackId: number;
      stepIndex: number;
      repeatValue: number;
    };

export function sequencerReducer(
  state: SequencerTrack[],
  action: SequencerAction
): SequencerTrack[] {
  switch (action.type) {
    case "TOGGLE_STEP":
      return state.map((track) =>
        track.id === action.trackId
          ? {
              ...track,
              pattern: track.pattern.map((step, i) =>
                i === action.stepIndex
                  ? { ...step, active: !step.active }
                  : step
              ),
            }
          : track
      );
    case "SET_TRACK_VELOCITY":
      return state.map((track) =>
        track.id === action.trackId
          ? { ...track, velocity: action.velocity }
          : track
      );
    case "TOGGLE_MUTED":
      return state.map((track) =>
        track.id === action.trackId ? { ...track, muted: !track.muted } : track
      );
    case "ADD_TRACK":
      return [...state, newSequencerTrackData("<empty>", () => {})];
    case "CLEAR":
      return state.map((track) =>
        track.id === action.trackId
          ? { ...track, pattern: Array(16).fill(newStep()) }
          : track
      );
    case "DELETE": {
      const newState = state.filter((track) => track.id != action.trackId);
      if (newState.length > 0) return newState;

      return [newSequencerTrackData("<empty>", () => {})];
    }
    case "SET_SAMPLE":
      return state.map((track) =>
        track.id === action.trackId
          ? { ...track, name: action.name, play: action.play }
          : track
      );
    case "SET_STEP_VELOCITY":
      return state.map((track) =>
        track.id === action.trackId
          ? {
              ...track,
              pattern: track.pattern.map((step, i) =>
                i === action.stepIndex
                  ? { ...step, velocity: action.velocity }
                  : step
              ),
            }
          : track
      );
    case "SET_STEP_REPEAT_VALUE":
      return state.map((track) =>
        track.id === action.trackId
          ? {
              ...track,
              pattern: track.pattern.map((step, i) =>
                i === action.stepIndex
                  ? { ...step, repeatValue: action.repeatValue }
                  : step
              ),
            }
          : track
      );
    default:
      return state;
  }
}
