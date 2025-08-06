import React from "react";
import DrumTrack from "./DrumTrack";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  clipId: number;
  sequencerTrackId: number;
}

function DrumTrackContainer({ clipId, sequencerTrackId }: Props) {
  const { sequencerTrack, currentStep } = useStore(
    useShallow((state) => ({
      sequencerTrack: state.sequencerTracks.byId[sequencerTrackId],
      currentStep: state.currentStep,
    }))
  );

  const {
    setVelocity,
    clearSequence,
    deleteSequence,
    toggleMuted,
    setSample,
    toggleStep,
    setStepVelocity,
    setStepRepeatValue,
  } = useStore(
    useShallow((state) => ({
      setVelocity: state.setVelocity,
      clearSequence: state.clearSequence,
      deleteSequence: state.deleteSequence,
      toggleMuted: state.toggleMuted,
      setSample: state.setSample,
      toggleStep: state.toggleStep,
      setStepVelocity: state.setStepVelocity,
      setStepRepeatValue: state.setStepRepeatValue,
    }))
  );

  return (
    <DrumTrack
      clipId={clipId}
      sequencerTrack={sequencerTrack}
      currentStep={currentStep}
      setTrackVelocity={setVelocity}
      clearSequence={clearSequence}
      deleteSequence={deleteSequence}
      toggleMuted={toggleMuted}
      setSample={setSample}
      toggleStep={toggleStep}
      setStepVelocity={setStepVelocity}
      setStepRepeatValue={setStepRepeatValue}
    />
  );
}

export default React.memo(DrumTrackContainer);
