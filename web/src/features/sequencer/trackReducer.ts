import { newStep } from "./step";
import { newTrackData, type Track } from "./track";

export type TrackAction =
  | { type: "TOGGLE_STEP"; id: number; stepIndex: number }
  | { type: "SET_VELOCITY"; id: number; velocity: number }
  | { type: "TOGGLE_MUTE"; id: number }
  | { type: "ADD_TRACK" }
  | { type: "CLEAR"; id: number }
  | { type: "DELETE"; id: number }
  | {
      type: "UPDATE_SAMPLE";
      id: number;
      name: string;
      play: (time: number, velocity: number) => void;
    }
  | {
      type: "SET_STEP_VELOCITY";
      id: number;
      stepIndex: number;
      velocity: number;
    }
  | {
      type: "SET_STEP_REPEAT_VALUE";
      id: number;
      stepIndex: number;
      repeatValue: number;
    };

export function trackReducer(state: Track[], action: TrackAction): Track[] {
  switch (action.type) {
    case "TOGGLE_STEP":
      return state.map((track) =>
        track.id === action.id
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
    case "SET_VELOCITY":
      return state.map((track) =>
        track.id === action.id ? { ...track, velocity: action.velocity } : track
      );
    case "TOGGLE_MUTE":
      return state.map((track) =>
        track.id === action.id ? { ...track, muted: !track.muted } : track
      );
    case "ADD_TRACK":
      return [...state, newTrackData("<empty>", () => {})];
    case "CLEAR":
      return state.map((track) =>
        track.id === action.id
          ? { ...track, pattern: Array(16).fill(newStep()) }
          : track
      );
    case "DELETE": {
      const newState = state.filter((track) => track.id != action.id);
      if (newState.length > 0) return newState;

      return [newTrackData("<empty>", () => {})];
    }
    case "UPDATE_SAMPLE":
      return state.map((track) =>
        track.id === action.id
          ? { ...track, name: action.name, play: action.play }
          : track
      );
    case "SET_STEP_VELOCITY":
      return state.map((track) =>
        track.id === action.id
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
        track.id === action.id
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
