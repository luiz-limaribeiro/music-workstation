import * as Tone from "tone";

function kick() { return new Tone.MembraneSynth(); }
function hardKick() { return new Tone.MembraneSynth({
  pitchDecay: 0.06,
  octaves: 4,
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0,
    release: 0.4,
  },
}); }
function snare() { return new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.1,
  },
}); }
function snappySnare() { return new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.15,
    sustain: 0,
  },
}); }
function hihat() { return new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.05,
    sustain: 0,
    release: 0.01,
  },
}); }
function openHat() { return new Tone.MetalSynth({
  envelope: {
    attack: 0.001,
    decay: 0.5,
    release: 0.2,
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5,
}); }
function clap() { return new Tone.NoiseSynth({
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
  },
}); }
function tom() { return new Tone.MembraneSynth(); }

export type SynthPreset = {
  name: string;
  synth: () =>
    | Tone.Synth
    | Tone.MembraneSynth
    | Tone.NoiseSynth
    | Tone.MetalSynth
    | Tone.Sampler;
  note: string;
};

export const synthPresets: { [name: string]: SynthPreset } = {
  kick: { name: 'Kick', synth: kick, note: "C1" },
  hardKick: { name: 'Hard Kick', synth: hardKick, note: "C1" },
  snare: { name: 'Snare', synth: snare, note: "" },
  snappySnare: { name: 'Snappy Snare', synth: snappySnare, note: "" },
  hihat: { name: 'Hi-Hat', synth: hihat, note: "" },
  openHat: { name: 'Open Hat', synth: openHat, note: "C6" },
  clap: { name: 'Clap', synth: clap, note: "" },
  tom: { name: 'Low Tom', synth: tom, note: "C2" },
  midTom: { name: 'Mid Tom', synth: tom, note: "C3" },
  highTom: { name: 'High Tom', synth: tom, note: "C4"  },
};
