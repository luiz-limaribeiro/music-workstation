import { useCallback, useRef, useState } from "react";
import Sequencer from "../sequencer/Sequencer";
import "./styles/Clip.css";
import React from "react";
import type { ClipData } from "../../data/clipData";
import type { SequencerTrack } from "../../data/sequencerTrackData";

interface Props {
  clip: ClipData;
  trackId: number;
  gridCellWidth: number;
  selectedClipId: number;
  sequencerTrackIds: number[];
  selectClip: (clipId: number) => void;
  moveClip: (clipId: number, startStep: number) => void;
  addSequencerTrack: (
    clipId: number,
    sequencerTrackData: SequencerTrack
  ) => void;
  updateStepCount: (clipId: number) => void;
  updateTrackPart: (trackId: number) => void;
}

function Clip({
  clip,
  trackId,
  gridCellWidth,
  selectedClipId,
  sequencerTrackIds,
  selectClip,
  moveClip,
  addSequencerTrack,
  updateStepCount,
  updateTrackPart,
}: Props) {
  const [showEditor, setShowEditor] = useState(false);

  const isDragging = useRef(false);
  const startMouseX = useRef(0);
  const startClipStep = useRef(0);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button != 0) return;

    isDragging.current = true;
    selectClip(clip.id);

    startMouseX.current = event.clientX;
    startClipStep.current = clip.startStep;

    document.body.classList.add("grabbing-cursor");
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;

      const currentX = event.clientX;
      const deltaX = currentX - startMouseX.current;

      const deltaSteps = Math.round(deltaX / gridCellWidth);

      const newStartStep = startClipStep.current + deltaSteps;

      const finalStartStep = Math.max(0, newStartStep);

      moveClip(clip.id, finalStartStep);
    },
    [clip.id, gridCellWidth, isDragging, moveClip]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.classList.remove("grabbing-cursor");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    updateStepCount(clip.id);
    updateTrackPart(trackId);
  }, [handleMouseMove, updateStepCount, updateTrackPart, clip.id, trackId]);

  return (
    <div
      style={{
        left: clip.startStep * gridCellWidth,
        width: clip.length * gridCellWidth,
      }}
      className={`clip ${selectedClipId === clip.id ? "selected" : ""}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setShowEditor(true)}
    >
      {showEditor && (
        <Sequencer
          clipId={clip.id}
          trackId={trackId}
          sequencerTrackIds={sequencerTrackIds}
          onCloseEditor={() => setShowEditor(false)}
          addSequencerTrack={addSequencerTrack}
        />
      )}
    </div>
  );
}

export default React.memo(Clip);
