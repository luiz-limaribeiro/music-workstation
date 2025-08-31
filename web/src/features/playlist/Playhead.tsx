import "./styles/Playhead.css";

interface Props {
  gridCellWidth: number;
  currentPosition: string;
}

function convertPosToPixels(pos: string, gridCellWidth: number): string {
  const [bars, quarters, sixteenth] = pos.split(":").map(Number);
  const totalSteps =  (bars * 16) + (quarters * 4) + sixteenth;
  const posInPixels = Math.floor(totalSteps * gridCellWidth);

  return `${posInPixels}px`;
}

export default function Playhead({ gridCellWidth, currentPosition}: Props) {
  const playheadPosInPixels = convertPosToPixels(currentPosition, gridCellWidth);

  return <div className="playhead" style={{ left: playheadPosInPixels }} />;
}
