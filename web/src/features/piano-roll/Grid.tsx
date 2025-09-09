import React from "react";
import "./styles/Grid.css";
import usePianoRollStore from "../../store/pianoRollStore";

interface Props {
  cellWidth: number;
  cellHeight: number;
}

const NUMBER_OF_KEYS = 12 * 9;

function Grid({ cellWidth, cellHeight }: Props) {
  const timelineLength = usePianoRollStore(state => state.length)
  
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
              borderLeft:
                colIndex % 4 === 0 ? "2px solid #1115" : "1px solid #1115",
              borderTop:
                rowIndex % 12 === 0 ? "2px solid #1115" : "1px solid #1115",
            }}
          />
        ))
      )}
    </div>
  );
}

export default React.memo(Grid);
