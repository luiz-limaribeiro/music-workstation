import React from "react";
import type { PianoKey } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";

interface Props {
  pianoKey: PianoKey;
  highlightKey: (keyId: number) => void;
  onMouseLeaveOrUp: (keyId: number) => void;
  onKeyDown: (pianoKey: PianoKey) => void;
  onKeyUp: (pianoKey: PianoKey) => void;
}

function Key({
  pianoKey,
  highlightKey,
  onMouseLeaveOrUp,
  onKeyDown,
  onKeyUp,
}: Props) {
  const cellHeight = usePianoRollStore((state) => state.stepHeight);
  const highlighted = usePianoRollStore((state) =>
    state.highlightedKeys.includes(pianoKey.id)
  );

  function handleMouseEnter(e: React.MouseEvent, keyId: number) {
    if (e.buttons & 1) {
      highlightKey(keyId);
      onKeyDown(pianoKey);
    }
  }

  return (
    <div
      className={`key
            ${pianoKey.note.length > 1 ? "black-key" : "white-key"}
            ${highlighted ? "active" : ""}
          `}
      style={{ height: cellHeight }}
      onMouseDown={() => {
        highlightKey(pianoKey.id);
        onKeyDown(pianoKey);
      }}
      onMouseUp={() => {
        onMouseLeaveOrUp(pianoKey.id);
        onKeyUp(pianoKey);
      }}
      onMouseEnter={(e) => handleMouseEnter(e, pianoKey.id)}
      onMouseLeave={() => {
        onMouseLeaveOrUp(pianoKey.id);
        onKeyUp(pianoKey);
      }}
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

export default React.memo(Key);
