import React from "react";
import Step from "./Step";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  stepId: number;
}

function StepContainer({ stepId }: Props) {
  const step = useStore((state) => state.steps.byId[stepId]);

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
      active={step.active}
      velocity={step.velocity}
      repeatValue={step.repeatValue}
      index={step.index}
      toggleStep={toggleStep}
      setRepeatValue={setRepeatValue}
      setStepVelocity={setStepVelocity}
    />
  );
}

export default React.memo(StepContainer);
