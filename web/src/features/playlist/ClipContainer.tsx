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
  const { clip, selectedClipId, instrumentIds, trackName } = useStore(
    useShallow((state) => ({
      clip: state.clips.byId[clipId],
      selectedClipId: state.selectedClipId,
      instrumentIds: state.trackInstruments[trackId],
      trackName: state.tracks.byId[trackId]?.name || "Unknown Track",
    }))
  );

  const {
    selectClip,
    moveClip,
    addSequencerTrack,
    updateStepCount,
    updateTrackPart,
    duplicateClip,
    deleteClip,
  } = useStore(
    useShallow((state) => ({
      selectClip: state.clipActions.selectClip,
      moveClip: state.clipActions.moveClip,
      addSequencerTrack: state.instrumentActions.addInstrument,
      updateStepCount: state.playlistActions.updateStepCount,
      updateTrackPart: state.audioActions.updateTrackPart,
      duplicateClip: state.clipActions.duplicateClip,
      deleteClip: state.clipActions.deleteClip,
    }))
  );

  if (!clip) return null;

  return (
    <Clip
      clip={clip}
      trackId={trackId}
      trackName={trackName}
      gridCellWidth={gridCellWidth}
      selectedClipId={selectedClipId}
      instrumentIds={instrumentIds}
      selectClip={selectClip}
      moveClip={moveClip}
      addInstrument={addSequencerTrack}
      updateStepCount={updateStepCount}
      updateTrackPart={updateTrackPart}
      duplicateClip={duplicateClip}
      deleteClip={deleteClip}
    />
  );
}

export default React.memo(ClipContainer);
