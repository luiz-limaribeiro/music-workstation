import type { TrackData } from "./trackData";

export type TrackAction =
  | { type: "UPDATE_PATTERN"; id: number; pattern: number[] }
  | { type: "SET_VELOCITY"; id: number; velocity: number };

export function trackReducer(
  state: TrackData[],
  action: TrackAction
): TrackData[] {
  switch (action.type) {
    case "UPDATE_PATTERN":
      return state.map((track) =>
        track.id === action.id ? { ...track, pattern: action.pattern } : track
      );
    case "SET_VELOCITY":
      return state.map((track) =>
        track.id === action.id ? { ...track, velocity: action.velocity } : track
      );
    default:
      return state;
  }
}
