import * as Tone from "tone";
import { useEffect } from "react";
import { useStore } from "./store/store";
import Playlist from "./features/playlist/Playlist";

function App() {
  const isPlaying = useStore((state) => state.isPlaying);
  const bpm = useStore((state) => state.bpm);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  // TODO schedule clips

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
    </main>
  );
}

export default App;
