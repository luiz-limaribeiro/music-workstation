import { useEffect, useRef } from "react";
import "./styles/Transport.css";
import { useStore } from "../../store/store";

export default function Transport() {
  const bpm = useStore((state) => state.bpm);
  const transport = useStore((state) => state.transport);
  const isPlaying = useStore((state) => state.isPlaying);
  const startPlayback = useStore((state) => state.audioActions.startPlayback);
  const stopPlayback = useStore((state) => state.audioActions.stopPlayback);
  const setBpm = useStore((state) => state.audioActions.setBpm);
  const setCurrentPosition = useStore((state) => state.audioActions.setCurrentPosition);

  const previousBpm = useRef(0);
  const positionListenerId = useRef(0);

  useEffect(() => {
    const posListenerId = transport.scheduleRepeat(() => {
      const currentPos = transport.position;
      setCurrentPosition(currentPos.toString());
    }, "16n");

    positionListenerId.current = posListenerId;

    return () => {
      transport.clear(positionListenerId.current);
    };
  }, [isPlaying, transport, setCurrentPosition]);

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
        onClick={() => {
          console.log("");
          console.log("isPlaying:", isPlaying, transport.state === "started");
        }}
      >
        Test
      </button>
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
        onClick={() => {
          stopPlayback();
          transport.clear(positionListenerId.current);
        }}
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
