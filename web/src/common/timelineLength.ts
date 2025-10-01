import usePianoRollStore from "../store/pianoRollStore";

export function updateTimelineLength() {
  const setLoopLength = usePianoRollStore.getState().pianoRollActions.setLoopLength;
  const setGridLength = usePianoRollStore.getState().pianoRollActions.setGridLength;
  const notesIds = usePianoRollStore.getState().notes.allIds;

  let largestLength = 16;

  notesIds.forEach((id) => {
    const note = usePianoRollStore.getState().notes.byId[id];
    const newLength = (Math.floor((note.start + note.length - 1) / 16) + 1) * 16

    if (newLength > largestLength) largestLength = newLength;
  });

  setLoopLength(largestLength);
  setGridLength(largestLength + 16)
}
