import "./styles/NotesTimeline.css";
import usePianoRollStore from "../../store/pianoRollStore";
import Grid from "./Grid";

export default function NotesTimeline() {
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);

  function gridToPixels(col: number, row: number) {
    return {
      x: col * cellWidth,
      y: row * cellHeight,
    };
  }

  function pixelsToGrid(x: number, y: number) {
    return {
      col: Math.floor(x / cellWidth),
      row: Math.floor(y / cellHeight),
    };
  }

  return (
    <div className="notes-timeline">
      <Grid />
    </div>
  );
}
