import { useAppStore } from "../store";
import "./Controls.css";
import { useCallback, useEffect, useRef } from "react";

export default function Controls() {
  const isPlaying = useAppStore((state) => state.isPlaying);
  const bpm = useAppStore((state) => state.bpm);
  const setIsPlaying = useAppStore((state) => state.setIsPlaying);
  const setBpm = useAppStore((state) => state.setBpm);

  const bpmRef = useRef<HTMLSpanElement | null>(null);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const newBpm = bpm - event.deltaY / 100;
    setBpm(Math.max(20, Math.min(newBpm, 240)));
  }, [bpm, setBpm]);

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
      <button className="play-button" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "stop" : "start"}
      </button>
    </div>
  );
}
