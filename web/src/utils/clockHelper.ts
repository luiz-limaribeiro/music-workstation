import * as Tone from "tone";
import usePianoRollStore from "../store/pianoRollStore";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");
  const paddedMilliseconds = String(milliseconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds.slice(0, 2)}`;
}

export function updateClock() {
  const position = Tone.getTransport().position;
  const seconds = Tone.Time(position).toSeconds();
  const setPlaybackTime =
    usePianoRollStore.getState().pianoRollActions.setPlaybackClock;

  setPlaybackTime(formatTime(seconds));
}