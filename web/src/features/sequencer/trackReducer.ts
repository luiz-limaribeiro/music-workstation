import { newTrackData, type TrackData } from "./trackData";

export type TrackAction =
  | { type: "UPDATE_PATTERN"; id: number; pattern: number[] }
  | { type: "SET_VELOCITY"; id: number; velocity: number }
  | { type: "TOGGLE_MUTE"; id: number }
  | { type: "ADD_TRACK" }
  | { type: "CLEAR"; id: number }
  | { type: "DELETE"; id: number }
  | {
      type: "UPDATE_SAMPLE";
      payload: {
        id: number;
        name: string;
        play: (time: number, velocity: number) => void;
      };
    };

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
    case "TOGGLE_MUTE":
      return state.map((track) =>
        track.id === action.id ? { ...track, muted: !track.muted } : track
      );
    case "ADD_TRACK":
      return [...state, newTrackData("<empty>", () => {})];
    case "CLEAR":
      return state.map((track) =>
        track.id === action.id
          ? { ...track, pattern: Array(16).fill(0) }
          : track
      );
    case "DELETE": {
      const newState = state.filter((track) => track.id != action.id);
      if (newState.length > 0) return newState;

      return [newTrackData("<empty>", () => {})];
    }
    case "UPDATE_SAMPLE":
      return state.map((track) =>
        track.id === action.payload.id
          ? { ...track, name: action.payload.name, play: action.payload.play }
          : track
      );
    default:
      return state;
  }
}
