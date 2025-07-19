import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import "./Sequencer.css";
import TrackRow from "./TrackRow";
import Controls from "./Controls";

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

type TrackData = {
  id: number;
  name: string;
  velocity: number;
  pattern: number[];
  play: (time: number, velocity: number) => void;
};

const initialTracks: TrackData[] = [
  {
    id: 1,
    name: "kick",
    velocity: 1.0,
    pattern: Array(16).fill(0),
    play: (time, velocity) => {
      kick.triggerAttackRelease("C1", "16n", time, velocity);
    },
  },
  {
    id: 2,
    name: "snare",
    velocity: 1.0,
    pattern: Array(16).fill(0),
    play: (time, velocity) => {
      snare.triggerAttackRelease("16n", time, velocity);
    },
  },
  {
    id: 3,
    name: "hihat",
    velocity: 1.0,
    pattern: Array(16).fill(0),
    play: (time, velocity) => {
      hihat.triggerAttackRelease("16n", time, velocity);
    },
  },
];

export default function Sequencer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [tracks, setTracks] = useState<TrackData[]>(initialTracks);

  const sequence = useRef<Tone.Sequence>(null);

  useEffect(() => {
    sequence.current = new Tone.Sequence(
      (time, col) => {
        tracks.forEach(track => {
          if (track.pattern[col]) track.play(time, track.velocity);
        });
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
      tracks.forEach(track => {
        if (track.pattern[col]) track.play(time, track.velocity);
      });
      setCurrentStep(col);
    };
  }, [tracks]);

  // sync the Tone bpm with the "bpm" state
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  function toggleStep(trackId: number, stepId: number) {
    const track = tracks.find(track => track.id === trackId)
    if (!track) return;

    const newPattern = [...track.pattern];
    newPattern[stepId] = newPattern[stepId] ? 0 : 1;

    setTracks((prev) =>
      prev.map(track =>
        track.id === trackId ? { ...track, pattern: newPattern } : track
      )
    );
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

  function changeVelocity(trackId: number, velocity: number) {
    setTracks((prev) =>
      prev.map(track =>
        track.id === trackId ? { ...track, velocity: velocity } : track
      )
    );
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
          id={track.id}
          name={track.name}
          velocity={track.velocity}
          sequence={track.pattern}
          currentStep={currentStep}
          onToggleStep={toggleStep}
          onChangeVelocity={changeVelocity}
        />
      ))}
    </div>
  );
}
