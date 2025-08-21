import React from "react";
import SequencerTrack from "./SequencerTrack";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  clipId: number;
  trackId: number;
  sequencerTrackId: number;
}

function SequencerTrackContainer({ clipId, trackId, sequencerTrackId }: Props) {
  const { sequencerTrack, stepIds } = useStore(
    useShallow(state => ({
      sequencerTrack: state.sequencerTracks.byId[sequencerTrackId],
      stepIds: state.sequencerTrackSteps[sequencerTrackId]
    }))
  );

  const {
    setVelocity,
    clearSequence,
    deleteSequence,
    toggleMuted,
    setSample,
    updateTrackPart,
  } = useStore(
    useShallow((state) => ({
      setVelocity: state.sequencerActions.setVelocity,
      clearSequence: state.sequencerActions.clearSequence,
      deleteSequence: state.sequencerActions.deleteSequence,
      toggleMuted: state.sequencerActions.toggleMuted,
      setSample: state.sequencerActions.setSample,
      updateTrackPart: state.audioActions.updateTrackPart,
    }))
  );

  return (
    <SequencerTrack
      clipId={clipId}
      stepIds={stepIds}
      trackId={trackId}
      sequencerTrack={sequencerTrack}
      setTrackVelocity={setVelocity}
      clearSequence={clearSequence}
      deleteSequence={deleteSequence}
      toggleMuted={toggleMuted}
      setSample={setSample}
      updateTrackPart={updateTrackPart}
    />
  );
}

export default React.memo(SequencerTrackContainer);
