import * as Tone from "tone";
import { sampler } from "../../samples/piano";
import usePianoRollStore from "../../store/pianoRollStore";
import { pianoKeys } from "../../data/pianoKeys";
import { stepsToToneTime } from "../../common/syncHelper";

function keyIdToNoteName(keyId: number) {
  const key = pianoKeys[keyId];
  return key.note + key.octave;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 100);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");
  const paddedMilliseconds = String(milliseconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
}

function updateClock() {
  const position = Tone.getTransport().position;
  const seconds = Tone.Time(position).toSeconds();
  const setPlaybackTime =
    usePianoRollStore.getState().pianoRollActions.setPlaybackClock;

  setPlaybackTime(formatTime(seconds));
}

let part: Tone.Part | null = null;
let scheduleId: number = -1;

export function buildPlayback() {
  const synth = sampler;
  if (!synth) return;

  const transport = Tone.getTransport();
  const notes = usePianoRollStore.getState().notes;
  const bpm = usePianoRollStore.getState().bpm;

  transport.cancel(0);
  if (part) part.dispose();

  transport.set({ bpm: bpm });
  transport.loop = true;
  transport.loopEnd = stepsToToneTime(usePianoRollStore.getState().length);

  const events = notes.allIds.map((id) => {
    const note = notes.byId[id];
    return {
      time: stepsToToneTime(note.start),
      note: keyIdToNoteName(note.keyId),
      dur: Tone.Time(stepsToToneTime(note.length)).toSeconds(),
    };
  });

  part = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(value.note, value.dur, time);
  }, events).start(0);
}

export async function startPlayback() {
  await Tone.start();

  const transport = Tone.getTransport();

  scheduleId = transport.scheduleRepeat(() => {
    updateClock();
  }, 0.05, 0);

  transport.start();
}

export function pausePlayback() {
  const transport = Tone.getTransport();
  transport.stop();
  transport.cancel(scheduleId);
  transport.position = 0;
}
