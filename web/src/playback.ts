import * as Tone from "tone";
import { newPianoSampler, sampler } from "./samples/piano";
import usePianoRollStore from "./store/pianoRollStore";
import { pianoKeys } from "./data/pianoKeys";
import { stepsToSeconds, stepsToToneTime } from "./common/syncHelper";

function keyIdToNoteName(keyId: number) {
  const key = pianoKeys[keyId];
  return key.note + key.octave;
}

function bufferToWaveBlob(buffer: Tone.ToneAudioBuffer): Blob {
  const numOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numOfChannels * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray)

  let offset = 0;

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
    offset += str.length;
  }

  function writeUint32(value: number) {
    view.setUint32(offset, value, true);
    offset += 4;
  }

  function writeUint16(value: number) {
    view.setUint16(offset, value, true);
    offset += 2;
  }

  writeString("RIFF");
  writeUint32(length - 8);
  writeString("WAVE");
  writeString("fmt ");
  writeUint32(16);
  writeUint16(1); // PCM
  writeUint16(numOfChannels);
  writeUint32(buffer.sampleRate);
  writeUint32(buffer.sampleRate * 2 * numOfChannels);
  writeUint16(numOfChannels * 2);
  writeUint16(16);
  writeString("data");
  writeUint32(length - offset - 4);

  // Write PCM samples
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      let sample = buffer.getChannelData(channel)[i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: "audio/wav" });
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
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
  transport.loopEnd = stepsToToneTime(usePianoRollStore.getState().loopLength);

  const events = notes.allIds.map((id) => {
    const note = notes.byId[id];
    return {
      time: stepsToToneTime(note.start),
      note: keyIdToNoteName(note.keyId),
      dur: Tone.Time(stepsToToneTime(note.length)).toSeconds(),
      velocity: note.velocity / 127
    };
  });

  part = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(value.note, value.dur, time, value.velocity);
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

export async function exportToWav() {
  const notes = usePianoRollStore.getState().notes;
  const bpm = usePianoRollStore.getState().bpm;
  const loopLength = usePianoRollStore.getState().loopLength;
  const setLoadingWAV = usePianoRollStore.getState().pianoRollActions.setLoadingWAV

  const duration = stepsToSeconds(loopLength, bpm); // Full loop length in seconds

  setLoadingWAV(true)
  const rendered = await Tone.Offline(async ({ transport }) => {
    transport.bpm.value = bpm;

    const sampler = newPianoSampler();
    await Tone.loaded()

    const events = notes.allIds.map((id) => {
      const note = notes.byId[id];
      return {
        time: stepsToToneTime(note.start),
        note: keyIdToNoteName(note.keyId),
        dur: Tone.Time(stepsToToneTime(note.length)).toSeconds(),
        velocity: note.velocity / 127
      };
    });

    new Tone.Part((time, value) => {
      sampler.triggerAttackRelease(value.note, value.dur, time, value.velocity);
    }, events).start(0);

    transport.start();
  }, duration);

  // Convert rendered AudioBuffer to WAV Blob
  const wavBlob = bufferToWaveBlob(rendered);
  setLoadingWAV(false)

  // Create a download link
  const url = URL.createObjectURL(wavBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "musicworkstation.wav";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}