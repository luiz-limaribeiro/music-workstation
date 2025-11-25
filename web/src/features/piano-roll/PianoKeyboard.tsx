import { pianoKeys, type PianoKey } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";
import Key from "./PianoKey";
import "./styles/PianoKeyboard.css";

interface Props {
  onKeyDown: (pianoKey: PianoKey) => void;
  onKeyUp: (pianoKey: PianoKey) => void;
}

export default function PianoKeyboard({ onKeyDown, onKeyUp }: Props) {
  const highlightKey = usePianoRollStore(
    (state) => state.pianoRollActions.highlightKey
  );
  const resetKey = usePianoRollStore(
    (state) => state.pianoRollActions.resetKey
  );

  return (
    <div className="keys">
      {pianoKeys.map((key) => (
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
