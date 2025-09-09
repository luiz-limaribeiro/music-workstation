import React from "react";
import type { PianoKey } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";

interface Props {
  pianoKey: PianoKey
  highlightKey: (keyId: number) => void;
  onMouseLeaveOrUp: (keyId: number) => void;
}

function Key({ pianoKey, highlightKey, onMouseLeaveOrUp }: Props) {
  const cellHeight = usePianoRollStore((state) => state.cellHeight)
  const highlighted = usePianoRollStore((state) => state.highlightedKeys.includes(pianoKey.id))

  function handleMouseEnter(e: React.MouseEvent, keyId: number) {
    if (e.buttons & 1) highlightKey(keyId);
  }
  
  return (
    <div
      className={`key
            ${pianoKey.note.length > 1 ? "black-key" : "white-key"}
            ${highlighted ? "active" : ""}
          `}
      style={{ height: cellHeight }}
      onMouseDown={() => highlightKey(pianoKey.id)}
      onMouseUp={() => onMouseLeaveOrUp(pianoKey.id)}
      onMouseEnter={(e) => handleMouseEnter(e, pianoKey.id)}
      onMouseLeave={() => onMouseLeaveOrUp(pianoKey.id)}
    >
      {pianoKey.note === "C" && (
        <div className="octave-label">
          {pianoKey.note}
          {pianoKey.octave}
        </div>
      )}
    </div>
  );
}

export default React.memo(Key)