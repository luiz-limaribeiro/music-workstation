import { useCallback, useRef } from "react";
import { useStore } from "../../store/store";
import "./styles/Playhead.css";

function convertPosToPixels(pos: string, gridCellWidth: number): string {
  const [bars, quarters, sixteenth] = pos.split(":").map(Number);
  const totalSteps = bars * 16 + quarters * 4 + sixteenth;
  const posInPixels = Math.floor(totalSteps * gridCellWidth);

  return `${posInPixels}px`;
}

export default function Playhead() {
  const isPlaying = useStore((state) => state.isPlaying);
  const gridCellWidth = useStore((state) => state.gridCellWidth);
  const currentPosition = useStore((state) => state.currentPosition);
  const stopPlayback = useStore((state) => state.audioActions.stopPlayback);
  const setCurrentPosition = useStore(
    (state) => state.audioActions.setCurrentPosition
  );

  const isDragging = useRef(false);
  const startMouseX = useRef(0);
  const startPlayheadStep = useRef(0);

  const playheadPosInPixels = convertPosToPixels(
    currentPosition,
    gridCellWidth
  );

  function handleMouseDown(event: React.MouseEvent) {
    if (event.button !== 0) return;
    event.stopPropagation();

    if (isPlaying)
      stopPlayback();

    isDragging.current = true;
    startMouseX.current = event.clientX;

    const [bars, quarters, sixteenths] = currentPosition.split(":").map(Number);
    const currentPositionInSteps = bars * 16 + quarters * 4 + sixteenths;
    startPlayheadStep.current = currentPositionInSteps;

    document.body.classList.add("grabbing-cursor");
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging.current) return;

      const currentX = event.clientX;
      const deltaX = currentX - startMouseX.current;
      const deltaSteps = Math.round(deltaX / gridCellWidth);
      const newStartStep = startPlayheadStep.current + deltaSteps;
      const finalStartStep = Math.max(0, newStartStep);
      setCurrentPosition(
        `${Math.floor(finalStartStep / 16)}:${Math.floor(
          (finalStartStep % 16) / 4
        )}:${finalStartStep % 4}`
      );
    },
    [gridCellWidth, setCurrentPosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.classList.remove("grabbing-cursor");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  return (
    <div
      className="playhead"
      style={{
        left: playheadPosInPixels,
        transition: isPlaying ? "all .2s linear" : "none",
      }}
      onMouseDown={handleMouseDown}
    />
  );
}
