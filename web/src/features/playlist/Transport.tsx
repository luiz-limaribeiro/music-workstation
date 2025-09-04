import { useEffect, useRef } from "react";
import "./styles/Transport.css";
import { useStore } from "../../store/store";

export default function Transport() {
  const bpm = useStore((state) => state.bpm);
  const transport = useStore((state) => state.transport);
  const isPlaying = useStore((state) => state.isPlaying);
  const soloTrackIds = useStore((state) => state.soloTrackIds);
  const mutedTrackIds = useStore((state) => state.mutedTrackIds);
  const startPlayback = useStore((state) => state.audioActions.startPlayback);
  const stopPlayback = useStore((state) => state.audioActions.stopPlayback);
  const setBpm = useStore((state) => state.audioActions.setBpm);
  const setCurrentPosition = useStore(
    (state) => state.audioActions.setCurrentPosition
  );

  const previousBpm = useRef(0);
  const positionListenerId = useRef(0);
  const timeListenerId = useRef(0);
  const timeString = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = transport.scheduleRepeat(() => {
      const seconds = transport.seconds;
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const str = `${minutes}:${secs.toString().padStart(2, "0")}`;
      if (timeString.current) {
        timeString.current.textContent = str;
      }
    }, "1s");

    timeListenerId.current = id;

    return () => {
      transport.clear(id);
    };
  }, [isPlaying, transport]);

  useEffect(() => {
    const posListenerId = transport.scheduleRepeat(
      () => {
        const currentPos = transport.position;
        setCurrentPosition(currentPos.toString());
      },
      "16n",
      0
    );

    positionListenerId.current = posListenerId;

    return () => {
      transport.clear(positionListenerId.current);
    };
  }, [isPlaying, transport, soloTrackIds, mutedTrackIds, setCurrentPosition]);

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
        onClick={() => {
          stopPlayback();
          transport.clear(positionListenerId.current);
          transport.clear(timeListenerId.current);
        }}
      >
        Stop
      </button>
      <div className="bpm-display" onMouseDown={handleMouseDown}>
        BPM: {bpm}
      </div>
      <div className="time-display" ref={timeString}>0:00</div>
    </div>
  );
}
