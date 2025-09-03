import { useCallback, useRef, useState } from "react";
import Sequencer from "../sequencer/Sequencer";
import "./styles/Clip.css";
import React from "react";
import type { ClipData } from "../../data/clipData";
import type { InstrumentData } from "../../data/instrumentData";

interface Props {
  clip: ClipData;
  trackId: number;
  trackName: string;
  gridCellWidth: number;
  selectedClipId: number;
  instrumentIds: number[];
  selectClip: (clipId: number) => void;
  moveClip: (clipId: number, startStep: number) => void;
  addInstrument: (trackId: number, instrumentData: InstrumentData) => void;
  updateStepCount: (clipId: number) => void;
  updateTrackPart: (trackId: number) => void;
  duplicateClip: (trackId: number, clipId: number, startStep?: number) => void;
  deleteClip: (trackId: number, clipId: number) => void;
}

function Clip({
  clip,
  trackId,
  trackName,
  gridCellWidth,
  selectedClipId,
  instrumentIds,
  selectClip,
  moveClip,
  addInstrument,
  updateStepCount,
  updateTrackPart,
  duplicateClip,
  deleteClip,
}: Props) {
  const [showEditor, setShowEditor] = useState(false);

  const isDragging = useRef(false);
  const startMouseX = useRef(0);
  const startClipStep = useRef(0);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    if (event.altKey) duplicateClip(trackId, clip.id, clip.startStep);

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
  }, [handleMouseMove, updateStepCount, updateTrackPart, trackId, clip.id]);

  return (
    <div
      style={{
        left: clip.startStep * gridCellWidth,
        width: clip.length * gridCellWidth,
      }}
      className={`clip ${selectedClipId === clip.id ? "selected" : ""}`}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setShowEditor(true)}
      onKeyDown={(e) => {
        if (selectedClipId === clip.id)
          if (e.key === "Delete") {
            deleteClip(trackId, clip.id);
            updateTrackPart(trackId);
          }
      }}
    >
      <span className="clip-name">{trackName}</span>
      {selectedClipId === clip.id && (
        <div className="clip-controls">
          <span
            className="duplicate-clip-handle"
            onClick={() => {
              duplicateClip(trackId, clip.id);
              updateTrackPart(trackId);
            }}
            title="Duplicate (Alt + Drag)"
          >
            ⧉
          </span>
          <span
            className="delete-clip-handle"
            title="Delete (Del)"
            onClick={() => {
              deleteClip(trackId, clip.id);
              updateTrackPart(trackId);
            }}
          >
            ✕
          </span>
        </div>
      )}
      {showEditor && (
        <Sequencer
          clipId={clip.id}
          trackId={trackId}
          instrumentIds={instrumentIds}
          onCloseEditor={() => setShowEditor(false)}
          addInstrument={addInstrument}
        />
      )}
    </div>
  );
}

export default React.memo(Clip);
