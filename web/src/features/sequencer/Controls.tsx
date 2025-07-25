import type React from "react";
import "./Controls.css";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  bpm: number;
  isPlaying: boolean;
  onChangeBpm: (newBpm: number) => void;
  onTogglePlay: () => void;
}

export default function Controls({
  bpm,
  isPlaying,
  onChangeBpm,
  onTogglePlay,
}: Props) {
  const bpmRef = useRef<HTMLSpanElement | null>(null);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const newBpm = bpm - event.deltaY / 100;
    onChangeBpm(Math.max(20, Math.min(newBpm, 240)));
  }, [onChangeBpm, bpm]);

  useEffect(() => {
    const bpmElement = bpmRef.current;
    if (bpmElement) {
      bpmElement.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        bpmElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel]);

  return (
    <div className="controls">
      <span ref={bpmRef} className="bpm-label">
        BPM: {bpm}
      </span>
      <button className="play-button" onClick={onTogglePlay}>
        {isPlaying ? "stop" : "start"}
      </button>
    </div>
  );
}
