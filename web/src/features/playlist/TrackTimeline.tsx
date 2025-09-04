import { useEffect, useRef } from "react";
import "./styles/TrackTimeline.css";
import ClipContainer from "./ClipContainer";
import { newClipData, type ClipData } from "../../data/clipData";
import React from "react";
import Timeline from "./Timeline";

interface Props {
  trackId: number;
  totalSteps: number;
  stepCount: number;
  clipIds: number[];
  gridCellWidth: number;
  newClipGhost: { trackId: number; x: number } | null;
  addClip: (trackId: number, clipData: ClipData) => void;
  showNewClipButton: (trackId: number, x: number) => void;
  hideNewClipButton: () => void;
  updateStepCount: (count: number) => void;
  setGridCellWidth: (width: number) => void;
}

function TrackTimeline({
  trackId,
  totalSteps,
  stepCount,
  clipIds,
  gridCellWidth,
  newClipGhost,
  addClip,
  showNewClipButton,
  hideNewClipButton,
  updateStepCount,
  setGridCellWidth,
}: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateGridWidth = () => {
      if (timelineRef.current) {
        const width = timelineRef.current.offsetWidth;
        setGridCellWidth(width / totalSteps);
      }
    };
    calculateGridWidth();
    window.addEventListener("resize", calculateGridWidth);
    return () => {
      window.removeEventListener("resize", calculateGridWidth);
    };
  }, [totalSteps, setGridCellWidth]);

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && e.button === 0) {
      const timelineRect = timelineRef.current?.getBoundingClientRect();
      if (!timelineRect) return;

      const relativeX = e.clientX - timelineRect.left;
      showNewClipButton(trackId, relativeX);
    }
  }

  return (
    <div
      className="track-timeline clips"
      style={{
        gridTemplateColumns: `repeat(${totalSteps}, 1fr)`,
        marginTop: trackId === 1 ? "2em" : 0,
      }}
      onMouseDown={handleMouseDown}
      ref={timelineRef}
    >
      <div
        className="step-count-highlight"
        style={{
          left: 0,
          width: stepCount * gridCellWidth,
        }}
      >
        <Timeline totalSteps={stepCount} />
      </div>
      {clipIds.map((id) => (
        <ClipContainer
          key={id}
          clipId={id}
          trackId={trackId}
          gridCellWidth={gridCellWidth}
        />
      ))}
      {newClipGhost?.trackId === trackId && (
        <button
          className="add-clip-button"
          onMouseDown={(e) => {
            const trackRect = timelineRef.current?.getBoundingClientRect();
            if (!trackRect) return;

            const clipLengthInSteps = 16;
            const clipWidthInPixels = clipLengthInSteps * gridCellWidth;

            const relativeX = e.clientX - trackRect.left;
            const adjustedX = relativeX - clipWidthInPixels / 2;
            const startStep = Math.max(
              0,
              Math.floor(adjustedX / gridCellWidth)
            );

            const newClip = newClipData(startStep, clipLengthInSteps);
            addClip(trackId, newClip);
            updateStepCount(newClip.id);
            hideNewClipButton();
          }}
          style={{ left: newClipGhost.x - 15 }}
        >
          add
        </button>
      )}
    </div>
  );
}

export default React.memo(TrackTimeline);
