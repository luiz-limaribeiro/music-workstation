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
  kick: (time: number, velocity: number, stepVelocity: number = 1) =>
    kick.triggerAttackRelease("C1", "16n", time, velocity * stepVelocity),
  hardKick: (time: number, velocity: number, stepVelocity: number = 1) =>
    hardKick.triggerAttackRelease("C1", "16n", time, velocity * stepVelocity),
  snare: (time: number, velocity: number, stepVelocity: number = 1) =>
    snare.triggerAttackRelease("16n", time, velocity * stepVelocity),
  snappySnare: (time: number, velocity: number, stepVelocity: number = 1) =>
    snappySnare.triggerAttackRelease("16n", time, velocity * stepVelocity),
  hihat: (time: number, velocity: number, stepVelocity: number = 1) =>
    hihat.triggerAttackRelease("16n", time, velocity * stepVelocity),
  openHat: (time: number, velocity: number, stepVelocity: number = 1) =>
    openHat.triggerAttackRelease("16n", time, velocity * stepVelocity),
  clap: (time: number, velocity: number, stepVelocity: number = 1) =>
    clap.triggerAttackRelease("16n", time, velocity * stepVelocity),
  highTom: (time: number, velocity: number, stepVelocity: number = 1) =>
    tom.triggerAttackRelease("C3", "16n", time, velocity * stepVelocity),
  midTom: (time: number, velocity: number, stepVelocity: number = 1) =>
    tom.triggerAttackRelease("A2", "16n", time, velocity * stepVelocity),
  lowTom: (time: number, velocity: number, stepVelocity: number = 1) =>
    tom.triggerAttackRelease("F2", "16n", time, velocity * stepVelocity),
};
