import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import "./Sequencer.css";
import TrackRow from "./TrackRow";
import Controls from "./Controls";
import { useAppStore } from "./sequencerStore";

export default function Sequencer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);

  const newTracks = useAppStore((state) => state.drumTracks);
  const addTrack = useAppStore((state) => state.addTrack);

  const sequence = useRef<Tone.Sequence>(null);

  useEffect(() => {
    sequence.current = new Tone.Sequence(
      (time, col) => {
        newTracks.forEach((track) => {
          if (track.pattern[col].active)
            track.play(
              time,
              track.velocity,
              track.pattern[col].velocity,
              track.pattern[col].repeatValue
            );
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
      newTracks.forEach((track) => {
        if (!track.muted && track.pattern[col].active)
          track.play(
            time,
            track.velocity,
            track.pattern[col].velocity,
            track.pattern[col].repeatValue
          );
      });
      setCurrentStep(col);
    };
  }, [newTracks]);

  // sync the Tone bpm with the "bpm" state
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

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

  return (
    <div className="sequencer">
      <Controls
        bpm={bpm}
        isPlaying={isPlaying}
        onChangeBpm={(newBpm) => setBpm(newBpm)}
        onTogglePlay={togglePlay}
      />
      {newTracks.map((track, trackIndex) => (
        <TrackRow
          key={trackIndex}
          track={track}
          currentStep={currentStep}
        />
      ))}
      <div className="add-track">
        <button onClick={addTrack}>add track</button>
      </div>
    </div>
  );
}
