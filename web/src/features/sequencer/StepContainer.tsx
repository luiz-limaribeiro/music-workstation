import React from "react";
import Step from "./Step";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  stepId: number;
  trackId: number;
}

function StepContainer({ stepId, trackId }: Props) {
  const step = useStore((state) => state.steps.byId[stepId]);

  const { toggleStep, setRepeatValue, setStepVelocity, updateTrackPart } = useStore(
    useShallow((state) => ({
      toggleStep: state.stepActions.toggleStep,
      setRepeatValue: state.stepActions.setRepeatValue,
      setStepVelocity: state.stepActions.setVelocity,
      updateTrackPart: state.audioActions.updateTrackPart,
    }))
  );

  return (
    <Step
      stepId={stepId}
      trackId={trackId}
      active={step.active}
      velocity={step.velocity}
      repeatValue={step.repeatValue}
      index={step.index}
      toggleStep={toggleStep}
      setRepeatValue={setRepeatValue}
      setStepVelocity={setStepVelocity}
      updateTrackPart={updateTrackPart}
    />
  );
}

export default React.memo(StepContainer);
