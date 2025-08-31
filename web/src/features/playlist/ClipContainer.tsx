import React from "react";
import Clip from "./Clip";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";

interface Props {
  clipId: number;
  trackId: number;
  gridCellWidth: number;
}

function ClipContainer({ clipId, trackId, gridCellWidth }: Props) {
  const { clip, selectedClipId, instrumentIds } = useStore(
    useShallow((state) => ({
      clip: state.clips.byId[clipId],
      selectedClipId: state.selectedClipId,
      instrumentIds: state.trackInstruments[trackId],
    }))
  );

  const {
    selectClip,
    moveClip,
    addSequencerTrack,
    updateStepCount,
    updateTrackPart,
  } = useStore(
    useShallow((state) => ({
      selectClip: state.clipActions.selectClip,
      moveClip: state.clipActions.moveClip,
      addSequencerTrack: state.instrumentActions.addInstrument,
      updateStepCount: state.playlistActions.updateStepCount,
      updateTrackPart: state.audioActions.updateTrackPart,
    }))
  );

  return (
    <Clip
      clip={clip}
      trackId={trackId}
      gridCellWidth={gridCellWidth}
      selectedClipId={selectedClipId}
      instrumentIds={instrumentIds}
      selectClip={selectClip}
      moveClip={moveClip}
      addInstrument={addSequencerTrack}
      updateStepCount={updateStepCount}
      updateTrackPart={updateTrackPart}
    />
  );
}

export default React.memo(ClipContainer);
