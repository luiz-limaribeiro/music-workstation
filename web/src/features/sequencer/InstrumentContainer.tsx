import React from "react";
import Instrument from "./Instrument";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  clipId: number;
  trackId: number;
  instrumentId: number;
  index: number;
}

function InstrumentContainer({ clipId, trackId, instrumentId, index }: Props) {
  const { instrument, stepIds } = useStore(
    useShallow(state => ({
      instrument: state.instruments.byId[instrumentId],
      stepIds: state.clipSteps[clipId]
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
      setVelocity: state.instrumentActions.setVelocity,
      clearSequence: state.instrumentActions.clearSequence,
      deleteSequence: state.instrumentActions.deleteSequence,
      toggleMuted: state.instrumentActions.toggleMute,
      setSample: state.instrumentActions.setSample,
      updateTrackPart: state.audioActions.updateTrackPart,
    }))
  );

  return (
    <Instrument
      clipId={clipId}
      stepIds={stepIds.slice(index * 16, index * 16 + 16)}
      trackId={trackId}
      instrument={instrument}
      setVelocity={setVelocity}
      clearSequence={clearSequence}
      deleteSequence={deleteSequence}
      toggleMuted={toggleMuted}
      setSample={setSample}
      updateTrackPart={updateTrackPart}
    />
  );
}

export default React.memo(InstrumentContainer);
