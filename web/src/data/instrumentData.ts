import * as Tone from "tone";
import type { SynthPreset } from "./synthPresets";

export type InstrumentData = {
  id: number;
  name: string;
  velocity: number;
  muted: boolean;
  volumeNode: Tone.Volume;
  synthPreset?: SynthPreset | null;
  sample:
    | Tone.Synth
    | Tone.MembraneSynth
    | Tone.NoiseSynth
    | Tone.MetalSynth
    | Tone.Sampler;
  player: (time: number, stepRepeatValue: number) => void;
};

let nextId = 0;

export function newInstrumentData(synth?: SynthPreset): InstrumentData {
  if (!synth) {
    const volume = new Tone.Volume(0);
    const emptySampler = new Tone.Sampler({}).connect(volume);

    return {
      id: nextId++,
      name: "<empty>",
      velocity: 1,
      muted: false,
      volumeNode: volume,
      synthPreset: null,
      sample: emptySampler,
      player: () => {},
    };
  }
  
  const volume = new Tone.Volume(0);
  const sample = synth.synth().connect(volume);

  return {
    id: nextId++,
    name: synth.name,
    velocity: 1,
    muted: false,
    volumeNode: volume,
    synthPreset: synth,
    sample: sample,
    player: createPlayer(sample, synth.note),
  };
}

export function createPlayer(
  synth:
    | Tone.Synth
    | Tone.MembraneSynth
    | Tone.NoiseSynth
    | Tone.MetalSynth
    | Tone.Sampler,
  note: string,
  duration: string = "16n"
) {
  const stepDurationSec = Tone.Time(duration).toSeconds();
  return (
    time: number,
    velocity: number = 1,
    stepVelocity: number = 1,
    repeatValue: number = 1
  ) => {
    const substepDuration = stepDurationSec / repeatValue;

    for (let i = 0; i < repeatValue; ++i) {
      const scheduledTime = time + i * substepDuration;

      if (note)
        synth.triggerAttackRelease(
          note,
          substepDuration,
          scheduledTime,
          velocity * stepVelocity
        );
      else
        synth.triggerAttackRelease(
          duration,
          scheduledTime,
          velocity * stepVelocity
        );
    }
  };
}
