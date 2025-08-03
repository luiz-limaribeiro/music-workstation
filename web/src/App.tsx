import * as Tone from "tone";
import { useEffect } from "react";
import { useStore } from "./store/store";
import Playlist from "./features/playlist/Playlist";
import Sequencer from "./features/sequencer/Sequencer";

function App() {
  const isPlaying = useStore((state) => state.isPlaying);
  const bpm = useStore((state) => state.bpm);
  const clips = useStore((state) => state.clips);
  const instruments = useStore((state) => state.instruments);
  const showSequencer = useStore((state) => state.showSequencer);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  function scheduleClips() {
    clips.forEach((clip) => {
      const instrument = instruments.find((i) => i.id === clip.instrumentId);

      if (!instrument) {
        console.warn("intrument not found");
        return;
      }

      const startTime = Tone.Time(`${clip.startStep}n`).toSeconds();

      Tone.getTransport().schedule((time) => {
        clip.pattern.forEach((step, i) => {
          if (step.active) {
            const stepTime = time + Tone.Time(`${i}n`).toSeconds();
            Tone.getTransport().scheduleOnce((t) => {
              instrument.play(t, step.velocity, step.repeatValue);
            }, stepTime);
          }
        });
      }, startTime);
    });
  }

  useEffect(() => {
    scheduleClips();
  }, [clips]);

  // sync the Tone bpm with the "bpm" state
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  // start/stop playback when "isPlaying" changes
  useEffect(() => {
    async function handlePlayback() {
      if (Tone.getContext().state !== "running") await Tone.start();

      if (isPlaying) {
        Tone.getTransport().start();
      } else {
        Tone.getTransport().stop();
        setCurrentStep(0);
      }
    }
    handlePlayback();
  }, [isPlaying, setCurrentStep]);

  return (
    <main>
      <Playlist />

      {showSequencer && <Sequencer />}
    </main>
  );
}

export default App;
