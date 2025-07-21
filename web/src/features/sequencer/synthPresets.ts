import * as Tone from "tone";

// Kicks
const kick = new Tone.MembraneSynth().toDestination();
const hardKick = new Tone.MembraneSynth({
  pitchDecay: 0.06,
  octaves: 4,
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0,
    release: 0.4,
  },
}).toDestination();

// Snares
const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.1,
  },
}).toDestination();
const snappySnare = new Tone.NoiseSynth({
  noise: { type: 'white'},
  envelope: {
    attack: 0.001,
    decay: 0.15,
    sustain: 0
  }
}).toDestination()

// HiHats
const hihat = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.05,
    sustain: 0,
    release: 0.01,
  },
}).toDestination();
const openHat = new Tone.MetalSynth({
  envelope: {
    attack: 0.001,
    decay: 0.5,
    release: 0.2
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5,
}).toDestination();

// Claps
const clap = new Tone.NoiseSynth({
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0
  }
}).toDestination()

// Toms
const tom = new Tone.MembraneSynth().toDestination()

export const drums = {
  kick: (time: number, velocity: number) =>
    kick.triggerAttackRelease("C1", "16n", time, velocity),
  hardKick: (time: number, velocity: number) =>
    hardKick.triggerAttackRelease("C1", "16n", time, velocity),
  snare: (time: number, velocity: number) =>
    snare.triggerAttackRelease("16n", time, velocity),
  snappySnare: (time: number, velocity: number) =>
    snappySnare.triggerAttackRelease("16n", time, velocity),
  hihat: (time: number, velocity: number) =>
    hihat.triggerAttackRelease("16n", time, velocity),
  openHat: (time: number, velocity: number) =>
    openHat.triggerAttackRelease("16n", time, velocity),
  clap: (time: number, velocity: number) =>
    clap.triggerAttackRelease("16n", time, velocity),
  lowTom: (time: number, velocity: number) =>
    tom.triggerAttackRelease("C3", "16n", time, velocity),
  midTom: (time: number, velocity: number) =>
    tom.triggerAttackRelease("A2", "16n", time, velocity),
  highTom: (time: number, velocity: number) =>
    tom.triggerAttackRelease("F2", "16n", time, velocity),
};
