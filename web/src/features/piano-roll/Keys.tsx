import { pianoKeys, type PianoKey } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";
import Key from "./Key";
import "./styles/Keys.css";

interface Props {
  onKeyDown: (pianoKey: PianoKey) => void;
  onKeyUp: (pianoKey: PianoKey) => void;
}

export default function Keys({ onKeyDown, onKeyUp }: Props) {
  const highlightKey = usePianoRollStore(
    (state) => state.pianoRollActions.highlightKey
  );
  const resetKey = usePianoRollStore(
    (state) => state.pianoRollActions.resetKey
  );

  const keys = pianoKeys;

  return (
    <div className="keys">
      {keys.map((key) => (
        <Key
          key={key.id}
          pianoKey={key}
          highlightKey={highlightKey}
          onMouseLeaveOrUp={resetKey}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        />
      ))}
    </div>
  );
}
