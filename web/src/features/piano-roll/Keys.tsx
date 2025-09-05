import type { MouseEvent } from "react";
import { pianoKeys } from "../../data/pianoKeys";
import "./styles/Keys.css";
import usePianoRollStore from "../../store/pianoRollStore";

export default function Keys() {
  const activeKeyIds = usePianoRollStore((state) => state.activeKeyIds);
  const addKey = usePianoRollStore((state) => state.pianoRollActions.addKey);
  const removeKey = usePianoRollStore(
    (state) => state.pianoRollActions.removeKey
  );

  const keys = pianoKeys;

  function handleMouseEnter(e: MouseEvent, keyId: number) {
    if (e.buttons & 1) addKey(keyId);
  }

  function handleMouseLeave(keyId: number) {
    removeKey(keyId);
  }

  return (
    <div className="keys">
      {keys.map((key, index) => (
        <div
          key={index}
          className={`key
            ${key.note.length > 1 ? "black-key" : "white-key"}
            ${activeKeyIds.includes(key.id) ? "active" : ""}
          `}
          onMouseDown={() => addKey(key.id)}
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
