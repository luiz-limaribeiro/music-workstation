import { useEffect, useRef, useState } from "react";
import Knob from "../../common/Knob";
import "./Track.css";
import type { TrackData } from "../../models/trackData";
import ClipContainer from "./ClipContainer";

interface Props {
  track: TrackData;
  clipIds: number[];
  totalSteps: number;
  setVelocity: (trackId: number, velocity: number) => void;
  setPanning: (trackId: number, panning: number) => void;
  toggleMuted: (trackId: number) => void;
  toggleSolo: (trackId: number) => void;
}

export default function Track({
  track,
  clipIds,
  totalSteps,
  setVelocity,
  setPanning,
  toggleMuted,
  toggleSolo,
}: Props) {
  const trackRowRef = useRef<HTMLDivElement>(null);

  const [gridCellWidth, setGridCellWidth] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (trackRowRef.current) {
      const width = trackRowRef.current.offsetWidth;
      setGridCellWidth(width / totalSteps);
    }
  }, [totalSteps]);

  const { name, id, panning, velocity, muted, solo } = track;

  return (
    <div className="track" ref={trackRowRef}>
      <span className="title" onMouseDown={() => setShowOptions(!showOptions)}>
        {name}
      </span>
      <button
        className={`mute-unmute ${muted ? "muted" : ""}`}
        onClick={() => toggleMuted(id)}
      />
      <button
        className={`solo-button ${solo ? "solo" : ""}`}
        onClick={() => toggleSolo(id)}
      >
        solo
      </button>
      <Knob
        value={panning}
        onValueChange={(newValue) => setPanning(id, newValue)}
        mode="pan"
      />
      <Knob
        value={velocity}
        onValueChange={(newValue) => setVelocity(id, newValue)}
        mode="velocity"
      />
      <div
        className="clips"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
      >
        {clipIds.map((id) => (
          <ClipContainer
            key={id}
            clipId={id}
            gridCellWidth={gridCellWidth}
            trackName={track.name}
          />
        ))}
      </div>
      {showOptions && (
        <div className="track-options">
          <button>rename</button>
          <button>clear</button>
          <button>delete</button>
        </div>
      )}
    </div>
  );
}
