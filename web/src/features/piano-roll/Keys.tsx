import type { MouseEvent } from "react";
import { pianoKeys } from "../../data/pianoKeys";
import "./styles/Keys.css";
import usePianoRollStore from "../../store/pianoRollStore";

export default function Keys() {
  const highlightedKeys = usePianoRollStore((state) => state.highlightedKeys);
  const cellHeight = usePianoRollStore((state) => state.cellHeight)
  const setHighlightedKeys = usePianoRollStore((state) => state.pianoRollActions.setHighlightedKeys);
  const highlightKey = usePianoRollStore((state) => state.pianoRollActions.highlightKey);

  const keys = pianoKeys;

  function handleMouseEnter(e: MouseEvent, keyId: number) {
    if (e.buttons & 1) highlightKey(keyId)
  }

  function handleMouseLeave(keyId: number) {
    setHighlightedKeys(highlightedKeys.filter(id => id !== keyId))
  }

  return (
    <div className="keys">
      {keys.map((key) => (
        <div
          key={key.id}
          className={`key
            ${key.note.length > 1 ? "black-key" : "white-key"}
            ${highlightedKeys.includes(key.id) ? "active" : ""}
          `}
          style={{ height: cellHeight }}
          onMouseDown={() => setHighlightedKeys([...highlightedKeys, key.id])}
          onMouseUp={() => setHighlightedKeys(highlightedKeys.filter(id => id !== key.id))}
          onMouseEnter={(e) => handleMouseEnter(e, key.id)}
          onMouseLeave={() => handleMouseLeave(key.id)}
        >
          {key.note === "C" && (
            <div className="octave-label">
              {key.note}
              {key.octave}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
