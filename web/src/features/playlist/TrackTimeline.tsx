import { useEffect, useRef } from "react";
import "./styles/TrackTimeline.css";
import ClipContainer from "./ClipContainer";
import { newClipData } from "../../data/clipData";
import React from "react";
import { useStore } from "../../store/store";
import Timeline from "./Timeline";

interface Props {
  trackId: number;
  totalSteps: number;
  stepCount: number;
}

function TrackTimeline({ trackId, totalSteps, stepCount }: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const clipIds = useStore((state) => state.trackClips[trackId]);
  const newClipGhost = useStore((state) => state.newClipGhost);
  const gridCellWidth = useStore((state) => state.gridCellWidth)

  const addClip = useStore((state) => state.playlistActions.addClip);
  const showNewClipButton = useStore((state) => state.playlistActions.showNewClipButton);
  const hideNewClipButton = useStore((state) => state.playlistActions.hideNewClipButton);
  const updateStepCount = useStore((state) => state.playlistActions.updateStepCount)
  const setGridCellWidth = useStore((state) => state.playlistActions.setGridCellWidth)

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
      style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
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

            const newClip = newClipData(startStep, clipLengthInSteps)
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
