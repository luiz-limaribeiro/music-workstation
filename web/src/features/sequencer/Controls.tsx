import type React from "react";
import "./Controls.css";

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
  function onWheel(event: React.WheelEvent) {
    let newBpm = bpm - event.deltaY / 100;
    onChangeBpm(Math.max(20, Math.min(newBpm, 240)));
  }

  return (
    <div className="controls">
      <span className="bpm-label" onWheel={onWheel}>
        BPM: {bpm}
      </span>
      <button className="play-button" onClick={onTogglePlay}>
        {isPlaying ? "stop" : "start"}
      </button>
    </div>
  );
}
