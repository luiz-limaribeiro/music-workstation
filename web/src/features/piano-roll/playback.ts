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

let part: Tone.Part | null = null

export async function play() {
  await Tone.start()

  const synth = sampler
  if (!synth) return;

  const transport = Tone.getTransport()
  const notes = usePianoRollStore.getState().notes;

  transport.cancel(0)
  if (part) part.dispose();

  transport.set({ bpm: 120 })
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

  // Part
  part = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(value.note, value.dur, time);
  }, events).start(0);

  transport.start();
}

export function stop() {
  Tone.getTransport().stop();
  Tone.getTransport().position = 0;
}