import { useRef } from "react";
import "./Transport.css";
import { useStore } from "../../store/store";

export default function Transport() {
  const bpm = useStore((state) => state.bpm);
  const setBpm = useStore((state) => state.setBpm);

  const isPlaying = useStore((state) => state.isPlaying);
  const startPlayback = useStore((state) => state.startPlayback);
  const stopPlayback = useStore((state) => state.stopPlayback);

  const previousBpm = useRef(0);

  function handleMouseMove(event: MouseEvent) {
    previousBpm.current += event.movementX;
    previousBpm.current = Math.max(1, Math.min(999, previousBpm.current));
    setBpm(Math.round(previousBpm.current));
  }

  function handleMouseDown() {
    previousBpm.current = bpm;
    document.body.classList.add("grabbing-cursor");
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseUp() {
    document.body.classList.remove("grabbing-cursor");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }
  return (
    <div className="transport">
      <button
        className="play-button"
        disabled={isPlaying}
        onClick={startPlayback}
      >
        Play
      </button>
      <button
        className="stop-button"
        disabled={!isPlaying}
        onClick={stopPlayback}
      >
        Stop
      </button>
      <div className="bpm-display" onMouseDown={handleMouseDown}>
        BPM: {bpm}
      </div>
      <div className="time-display">00:00</div>
    </div>
  );
}
