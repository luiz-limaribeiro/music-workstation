import * as Tone from "tone";
import type { SynthPreset } from "./synthPresets";

export type InstrumentData = {
  id: number;
  name: string;
  velocity: number;
  muted: boolean;
  synthPreset?: SynthPreset | null;
  sample:
    | Tone.Synth
    | Tone.MembraneSynth
    | Tone.NoiseSynth
    | Tone.MetalSynth
    | Tone.Sampler;
  player: (time: number, stepVelocity: number, stepRepeatValue: number) => void;
};

let nextId = 0;

export function newInstrumentData(synth?: SynthPreset): InstrumentData {
  if (!synth)
    return {
      id: nextId++,
      name: "<empty>",
      velocity: 1,
      muted: false,
      synthPreset: null,
      sample: new Tone.Sampler({}),
      player: () => {},
    };
  
  const sample = synth.synth();

  return {
    id: nextId++,
    name: synth.name,
    velocity: 1,
    muted: false,
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
