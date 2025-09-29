import { useEffect } from "react";
import usePianoRollStore from "../../store/pianoRollStore";

export default function AutoSaver() {
  const notes = usePianoRollStore((s) => s.notes);
  const length = usePianoRollStore((s) => s.loopLength);
  const bpm = usePianoRollStore((s) => s.bpm);
  const nextNoteId = usePianoRollStore((s) => s.nextNoteId)
  const save = usePianoRollStore((s) => s.pianoRollActions.saveStateToDB);

  useEffect(() => {
    const timeout = setTimeout(() => {
      save();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [notes, length, bpm, nextNoteId, save]);

  return null;
}
