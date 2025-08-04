import { useCallback, useRef, useState } from "react";
import Sequencer from "../sequencer/Sequencer";
import "./Clip.css";
import type { ClipData } from "./clipData";
import { useStore } from "../../store/store";

interface Props {
  trackId: number;
  trackName: string;
  clipData: ClipData;
  gridCellWidth: number
}

export default function Clip({ trackId, trackName, clipData, gridCellWidth }: Props) {
  const [showEditor, setShowEditor] = useState(false);

  const selectedClipId = useStore((state) => state.selectedClipId);
  const selectClip = useStore((state) => state.selectClip);
  const moveClip = useStore((state) => state.moveClip);

  const isDragging = useRef(false)
  const startMouseX = useRef(0)
  const startClipStep = useRef(0)

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    isDragging.current = true
    selectClip(clipData.id)

    startMouseX.current = event.clientX
    startClipStep.current = clipData.startStep

    document.body.classList.add("grabbing-cursor");
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;

    const currentX = event.clientX
    const deltaX = currentX - startMouseX.current

    const deltaSteps = Math.round(deltaX / gridCellWidth)

    const newStartStep = startClipStep.current + deltaSteps

    const finalStartStep = Math.max(0, newStartStep)

    moveClip(trackId, clipData.id, finalStartStep)
  }, [clipData.id, gridCellWidth, isDragging, moveClip, trackId])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    document.body.classList.remove("grabbing-cursor");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove])

  return (
    <div
      style={{
        gridColumnStart: clipData.startStep + 1,
        gridColumnEnd: `span ${clipData.length}`,
      }}
    >
      <div
        className={`clip ${selectedClipId === clipData.id ? "selected" : ""}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setShowEditor(true)}
      />
      {showEditor && (
        <Sequencer
          trackId={trackId}
          clipId={clipData.id}
          trackName={trackName}
          sequencerTracks={clipData.sequencerTracks}
          onCloseEditor={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
