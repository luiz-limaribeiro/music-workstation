import React from "react";
import SequencerTrack from "./SequencerTrack";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  clipId: number;
  sequencerTrackId: number;
}

function SequencerTrackContainer({ clipId, sequencerTrackId }: Props) {
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
  } = useStore(
    useShallow((state) => ({
      setVelocity: state.sequencerActions.setVelocity,
      clearSequence: state.sequencerActions.clearSequence,
      deleteSequence: state.sequencerActions.deleteSequence,
      toggleMuted: state.sequencerActions.toggleMuted,
      setSample: state.sequencerActions.setSample,
    }))
  );

  return (
    <SequencerTrack
      clipId={clipId}
      stepIds={stepIds}
      sequencerTrack={sequencerTrack}
      setTrackVelocity={setVelocity}
      clearSequence={clearSequence}
      deleteSequence={deleteSequence}
      toggleMuted={toggleMuted}
      setSample={setSample}
    />
  );
}

export default React.memo(SequencerTrackContainer);
