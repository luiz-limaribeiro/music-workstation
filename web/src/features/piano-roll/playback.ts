import * as Tone from 'tone'
import { sampler } from '../../samples/piano';
import usePianoRollStore from '../../store/pianoRollStore';
import { pianoKeys } from '../../data/pianoKeys';

function keyIdToNoteName(keyId: number) {
  const key = pianoKeys[keyId]
  return key.note + key.octave
}

function stepsToToneTime(steps: number) {
  return `0:0:${steps}`
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  const milliseconds = Math.floor((seconds % 1) * 100)

  const paddedMinutes = String(minutes).padStart(2, '0')
  const paddedSeconds = String(remainingSeconds).padStart(2, '0')
  const paddedMilliseconds = String(milliseconds).padStart(2, '0')

  return `${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`
}

function updateClock() {
  const timeInSeconds = Tone.getTransport().seconds;
  const setPlaybackTime = usePianoRollStore.getState().pianoRollActions.setPlaybackTime

  setPlaybackTime(formatTime(timeInSeconds))
}

let part: Tone.Part | null = null
let scheduleId: number = -1

export async function play() {
  await Tone.start()

  const synth = sampler
  if (!synth) return;

  const transport = Tone.getTransport()
  const notes = usePianoRollStore.getState().notes;
  const bpm = usePianoRollStore.getState().bpm

  transport.cancel(0)
  if (part) part.dispose();

  transport.set({ bpm: bpm })
  transport.position = 0
  transport.loop = true
  transport.loopEnd = stepsToToneTime(usePianoRollStore.getState().length)

  const events = notes.allIds.map((id) => {
    const note = notes.byId[id];
    return {
      time: stepsToToneTime(note.start),
      note: keyIdToNoteName(note.keyId),
      dur: Tone.Time(stepsToToneTime(note.length)).toSeconds()
    }
  })

  part = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(value.note, value.dur, time);
  }, events).start(0);

  scheduleId = transport.scheduleRepeat(() => {
    updateClock()
  }, 0.05)

  transport.start();
}

export function stop() {
  Tone.getTransport().stop();
  Tone.getTransport().position = 0;
  Tone.getTransport().cancel(scheduleId)
}