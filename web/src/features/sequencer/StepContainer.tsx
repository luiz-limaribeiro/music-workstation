import React from "react";
import Step from "./Step";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  stepId: number;
  sequencerTrackId: number;
}

function StepContainer({ stepId, sequencerTrackId }: Props) {
  const step = useStore((state) => state.steps.byId[stepId]);
  const currentStep = useStore((state) => state.currentStep);

  const { toggleStep, setRepeatValue, setStepVelocity } = useStore(
    useShallow((state) => ({
      toggleStep: state.stepActions.toggleStep,
      setRepeatValue: state.stepActions.setRepeatValue,
      setStepVelocity: state.stepActions.setVelocity,
    }))
  );

  return (
    <Step
      stepId={stepId}
      sequencerTrackId={sequencerTrackId}
      currentStep={currentStep}
      active={step.active}
      velocity={step.velocity}
      repeatValue={step.repeatValue}
      toggleStep={toggleStep}
      setRepeatValue={setRepeatValue}
      setStepVelocity={setStepVelocity}
    />
  );
}

export default React.memo(StepContainer);
