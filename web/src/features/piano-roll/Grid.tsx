import usePianoRollStore from '../../store/pianoRollStore'
import './styles/Grid.css'

const NUMBER_OF_KEYS = 12 * 9;

export default function Grid() {
  const timelineLength = usePianoRollStore((state) => state.length);
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);

  return (
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${timelineLength}, ${cellWidth}px)`,
          gridTemplateRows: `repeat(${NUMBER_OF_KEYS}, ${cellHeight}px)`,
        }}
      >
        {Array.from({ length: NUMBER_OF_KEYS }).flatMap((_, rowIndex) =>
          Array.from({ length: timelineLength }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: cellWidth,
                height: cellHeight,
                borderLeft: colIndex % 4 === 0 ? "2px solid #1115" : "1px solid #1115",
                borderTop: rowIndex % 12 === 0 ? "2px solid #1115" : "1px solid #1115",
              }}
            />
          ))
        )}
      </div>
  )
}