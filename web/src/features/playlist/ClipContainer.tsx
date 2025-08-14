import React from "react";
import Clip from "./Clip";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";

interface Props {
  clipId: number;
  gridCellWidth: number;
  trackName: string;
}

function ClipContainer({ clipId, gridCellWidth, trackName }: Props) {
  const { clip, selectedClipId, currentStep, sequencerTrackIds } = useStore(
    useShallow((state) => ({
      clip: state.clips.byId[clipId],
      selectedClipId: state.selectedClipId,
      currentStep: state.currentStep,
      sequencerTrackIds: state.clipSequencerTracks[clipId]
    }))
  );

  const { selectClip, moveClip, addSequencerTrack, updateStepCount } = useStore(
    useShallow((state) => ({
      selectClip: state.selectClip,
      moveClip: state.moveClip,
      addSequencerTrack: state.addSequencerTrack,
      updateStepCount: state.updateStepCount,
    }))
  );

  return (
    <Clip
      clip={clip}
      trackName={trackName}
      gridCellWidth={gridCellWidth}
      selectedClipId={selectedClipId}
      currentStep={currentStep}
      sequencerTrackIds={sequencerTrackIds}
      selectClip={selectClip}
      moveClip={moveClip}
      addSequencerTrack={addSequencerTrack}
      updateStepCount={updateStepCount}
    />
  );
}

export default React.memo(ClipContainer);
