import * as Tone from "tone";
import { useEffect, useRef } from "react";
import "./Sequencer.css";
import TrackRow from "./TrackRow";
import Controls from "./Controls";
import { useAppStore } from "../store";

export default function Sequencer() {
  const isPlaying = useAppStore((state) => state.isPlaying);
  const bpm = useAppStore((state) => state.bpm);
  const currentStep = useAppStore((state) => state.currentStep);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);

  const newTracks = useAppStore((state) => state.drumTracks);
  const addTrack = useAppStore((state) => state.addDrumTrack);

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
  }, [newTracks, setCurrentStep]);

  // sync the Tone bpm with the "bpm" state
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  // start/stop sequence on isPlaying change
  useEffect(() => {
    async function handlePlayback() {
      if (Tone.getContext().state !== "running") {
        await Tone.start();
      }
      if (isPlaying) {
        Tone.getTransport().start();
        sequence.current?.start(0);
      } else {
        Tone.getTransport().stop();
        sequence.current?.stop();
        setCurrentStep(0);
      }
    }
    handlePlayback();
  }, [isPlaying, setCurrentStep]);

  return (
    <div className="sequencer">
      <Controls />
      {newTracks.map((track, trackIndex) => (
        <TrackRow key={trackIndex} track={track} currentStep={currentStep} />
      ))}
      <div className="add-track">
        <button onClick={addTrack}>add track</button>
      </div>
    </div>
  );
}
