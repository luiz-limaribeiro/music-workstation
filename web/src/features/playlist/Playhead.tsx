import { useStore } from "../../store/store";
import "./styles/Playhead.css";

function convertPosToPixels(pos: string, gridCellWidth: number): string {
  const [bars, quarters, sixteenth] = pos.split(":").map(Number);
  const totalSteps =  (bars * 16) + (quarters * 4) + sixteenth;
  const posInPixels = Math.floor(totalSteps * gridCellWidth);

  return `${posInPixels}px`;
}

export default function Playhead() {
  const gridCellWidth = useStore((state) => state.gridCellWidth)
  const currentPosition = useStore((state) => state.currentPosition);
  const playheadPosInPixels = convertPosToPixels(currentPosition, gridCellWidth);

  return <div className="playhead" style={{ left: playheadPosInPixels }} />;
}
