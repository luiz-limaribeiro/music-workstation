import { pianoKeys } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";
import Key from "./Key";
import "./styles/Keys.css";

export default function Keys() {
  const highlightKey = usePianoRollStore(
    (state) => state.pianoRollActions.highlightKey
  );
  const resetKey = usePianoRollStore(
    (state) => state.pianoRollActions.resetKey
  )

  const keys = pianoKeys;

  return (
    <div className="keys">
      {keys.map((key) => (
        <Key
          key={key.id}
          pianoKey={key}
          highlightKey={highlightKey}
          onMouseLeaveOrUp={resetKey}
        />
      ))}
    </div>
  );
}
