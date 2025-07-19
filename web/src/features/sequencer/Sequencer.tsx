import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import "./Sequencer.css";
import TrackRow from "./TrackRow";
import Controls from "./Controls";

const tracks = ["kick", "snare", "hihat"];

const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.1,
  },
}).toDestination();
const hihat = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.05,
    sustain: 0,
    release: 0.01,
  },
}).toDestination();

const initialSequence = [
  Array(16).fill(0),
  Array(16).fill(0),
  Array(16).fill(0),
];

export default function Sequencer() {
  const [pattern, setPattern] = useState<number[][]>(initialSequence);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);

  const [velocities, setVelocities] = useState<number[]>([1, 1, 1])

  const sequence = useRef<Tone.Sequence>(null);

  useEffect(() => {
    sequence.current = new Tone.Sequence(
      (time, col) => {
        if (pattern[0][col]) kick.triggerAttackRelease("C1", "16n", time, velocities[0]);
        if (pattern[1][col]) snare.triggerAttackRelease("16n", time, velocities[1]);
        if (pattern[2][col]) hihat.triggerAttackRelease("16n", time, velocities[2]);
        setCurrentStep(col);
      },
      Array.from({ length: 16 }, (_, i) => i),
      "16n"
    );

    return () => {
      sequence.current?.dispose();
    };
  }, []);

  // sync the sequence with the "pattern" state
  useEffect(() => {
    if (!sequence.current) return;

    // the callback runs for each column at the correct time
    sequence.current.callback = (time, col) => {
      if (pattern[0][col]) kick.triggerAttackRelease("C1", "16n", time, velocities[0]);
      if (pattern[1][col]) snare.triggerAttackRelease("16n", time, velocities[1]);
      if (pattern[2][col]) hihat.triggerAttackRelease("16n", time, velocities[2]);
      setCurrentStep(col);
    };
  }, [pattern, velocities]);

  // sync the Tone bpm with the "bpm" state
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  function toggleStep(trackId: number, stepId: number) {
    let newSequence = [...pattern];
    newSequence[trackId][stepId] = newSequence[trackId][stepId] ? 0 : 1;
    setPattern(newSequence);
  }

  async function togglePlay() {
    if (Tone.getContext().state !== "running") {
      await Tone.start();
    }

    if (isPlaying) {
      Tone.getTransport().stop();
      setIsPlaying(false);
      setCurrentStep(0);
    } else {
      sequence.current?.start(0);
      Tone.getTransport().start();
      setIsPlaying(true);
    }
  }

  function changeVelocity(trackIndex: number, velocity: number) {
    let newVelocities = [...velocities]
    newVelocities[trackIndex] = velocity
    setVelocities(newVelocities)
  }

  return (
    <div className="sequencer">
      <Controls
        bpm={bpm}
        isPlaying={isPlaying}
        onChangeBpm={(newBpm) => setBpm(newBpm)}
        onTogglePlay={togglePlay}
      />
      {tracks.map((track, trackIndex) => (
        <TrackRow
          key={trackIndex}
          index={trackIndex}
          name={track}
          sequence={pattern[trackIndex]}
          currentStep={currentStep}
          onToggleStep={toggleStep}
          onChangeVelocity={changeVelocity}
        />
      ))}
    </div>
  );
}
