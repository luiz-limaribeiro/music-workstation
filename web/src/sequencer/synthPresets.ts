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

function createPlayer(
  synth: Tone.Synth | Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth | Tone.Sampler,
  note: string,
  duration: string = "16n"
) {
  const stepDurationSec = Tone.Time(duration).toSeconds()
  return (time: number, velocity: number, stepVelocity: number = 1, repeatValue: number = 1) => {
    const substepDuration = stepDurationSec / repeatValue;

    for (let i = 0; i < repeatValue; ++i) {
      const scheduledTime = time + i * substepDuration;

      if (note)
        synth.triggerAttackRelease(note, substepDuration, scheduledTime, velocity * stepVelocity)
      else
        synth.triggerAttackRelease(duration, scheduledTime, velocity * stepVelocity)
    }
  }
}

export const drums = {
  kick: createPlayer(kick, "C1"),
  hardKick: createPlayer(hardKick, "C1"),
  snare: createPlayer(snare, ""),
  snappySnare: createPlayer(snappySnare, ""),
  hihat: createPlayer(hihat, ""),
  openHat: createPlayer(openHat, ""),
  clap: createPlayer(clap, ""),
  highTom: createPlayer(tom, "C3"),
  midTom: createPlayer(tom, "A2"),
  lowTom: createPlayer(tom, "F2"),
};
