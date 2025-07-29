import * as Tone from "tone";
import Sequencer from "./features/sequencer/Sequencer";
import { useEffect, useRef } from "react";
import "./App.css";
import { useStore } from "./store/store";

function App() {
  const isPlaying = useStore((state) => state.isPlaying);
  const bpm = useStore((state) => state.bpm);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  const drumTracks = useStore((state) => state.drumTracks);

  const sequence = useRef<Tone.Sequence>(null);

  useEffect(() => {
    sequence.current = new Tone.Sequence(
      (time, col) => {
        drumTracks.forEach((track) => {
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
      drumTracks.forEach((track) => {
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
  }, [drumTracks, setCurrentStep]);

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
    <main>
      <Sequencer />
    </main>
  );
}

export default App;
