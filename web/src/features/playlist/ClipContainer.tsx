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
  const { clip, selectedClipId, sequencerTrackIds } = useStore(
    useShallow((state) => ({
      clip: state.clips.byId[clipId],
      selectedClipId: state.selectedClipId,
      sequencerTrackIds: state.clipSequencerTracks[clipId],
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
      selectClip: state.playlistActions.selectClip,
      moveClip: state.playlistActions.moveClip,
      addSequencerTrack: state.sequencerActions.addSequencerTrack,
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
      sequencerTrackIds={sequencerTrackIds}
      selectClip={selectClip}
      moveClip={moveClip}
      addSequencerTrack={addSequencerTrack}
      updateStepCount={updateStepCount}
      updateTrackPart={updateTrackPart}
    />
  );
}

export default React.memo(ClipContainer);
