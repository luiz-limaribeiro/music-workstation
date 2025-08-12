import { useEffect, useRef, useState } from "react";
import Knob from "../../common/Knob";
import "./Track.css";
import type { TrackData } from "../../models/trackData";
import ClipContainer from "./ClipContainer";
import { newClipData, type ClipData } from "../../models/clipData";

interface Props {
  track: TrackData;
  clipIds: number[];
  totalSteps: number;
  newClipGhost: { trackId: number; x: number } | null;
  setVelocity: (trackId: number, velocity: number) => void;
  setPanning: (trackId: number, panning: number) => void;
  toggleMuted: (trackId: number) => void;
  toggleSolo: (trackId: number) => void;
  addClip: (trackId: number, clipData: ClipData) => void;
  showAddClipButton: (trackId: number, x: number) => void;
}

export default function Track({
  track,
  clipIds,
  totalSteps,
  newClipGhost,
  setVelocity,
  setPanning,
  toggleMuted,
  toggleSolo,
  addClip,
  showAddClipButton,
}: Props) {
  const { id, name, panning, velocity, muted, solo } = track;
  const trackRowRef = useRef<HTMLDivElement>(null);

  const [gridCellWidth, setGridCellWidth] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const calculateGridWidth = () => {
      if (trackRowRef.current) {
        const width = trackRowRef.current.offsetWidth;
        setGridCellWidth(width / totalSteps);
      }
    }
    calculateGridWidth();
    window.addEventListener("resize", calculateGridWidth);
    return () => {
      window.removeEventListener("resize", calculateGridWidth);
    };
  }, [totalSteps]);

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      showAddClipButton(id, e.clientX);
    }
  }

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
      {newClipGhost?.trackId === id && (
        <button
          className="add-clip-button"
          onMouseDown={(e) => {
            const trackRect = trackRowRef.current?.getBoundingClientRect();
            if (!trackRect) return;

            const clipLengthInSteps = 16;
            const clipWidthInPixels = clipLengthInSteps * gridCellWidth;

            const relativeX = e.clientX - trackRect.left;
            const adjustedX = relativeX - (clipWidthInPixels / 2);
            const startStep = Math.max(0, Math.floor(adjustedX / gridCellWidth));
            addClip(id, newClipData(startStep, clipLengthInSteps));
          }}
          style={{ left: newClipGhost.x - 15 }}
        >
          add
        </button>
      )}
      <div
        className="clips"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
        onMouseDown={handleMouseDown}
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
