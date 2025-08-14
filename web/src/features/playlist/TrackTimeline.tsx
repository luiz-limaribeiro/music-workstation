import { useEffect, useRef, useState } from "react";
import "./styles/TrackTimeline.css";
import ClipContainer from "./ClipContainer";
import { newClipData } from "../../models/clipData";
import React from "react";
import { useStore } from "../../store/store";

interface Props {
  trackId: number;
  totalSteps: number;
}

function TrackTimeline({ trackId, totalSteps }: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [gridCellWidth, setGridCellWidth] = useState(0);

  const name = useStore((state) => state.tracks.byId[trackId].name);
  const clipIds = useStore((state) => state.trackClips[trackId]);
  const newClipGhost = useStore((state) => state.newClipGhost);

  const addClip = useStore((state) => state.addClip);
  const showNewClipButton = useStore((state) => state.showNewClipButton);
  const hideNewClipButton = useStore((state) => state.hideNewClipButton);

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
  }, [totalSteps]);

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
      {clipIds.map((id) => (
        <ClipContainer
          key={id}
          clipId={id}
          gridCellWidth={gridCellWidth}
          trackName={name}
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
            addClip(trackId, newClipData(startStep, clipLengthInSteps));
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
