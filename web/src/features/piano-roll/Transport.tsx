import { useEffect } from "react";
import usePianoRollStore from "../../store/pianoRollStore";
import { play, stop } from "./playback";
import "./styles/Transport.css";

export default function Transport() {
  const time = usePianoRollStore((state) => state.playbackTime);
  const isPlaying = usePianoRollStore((state) => state.isPlaying);
  const setIsPlaying = usePianoRollStore((state) => state.pianoRollActions.setIsPlaying)

  useEffect(() => {
    if (isPlaying) {
      play()
    } else {
      stop()
    }
  }, [isPlaying])

  return (
    <div className="transport">
      <button className="start" onClick={() => setIsPlaying(true)} disabled={isPlaying}>
        start
      </button>
      <button className="stop" onClick={() => setIsPlaying(false)} disabled={!isPlaying}>
        stop
      </button>
      <span className="bpm">BPM: 120</span>
      <span className="time">{time}</span>
    </div>
  );
}
