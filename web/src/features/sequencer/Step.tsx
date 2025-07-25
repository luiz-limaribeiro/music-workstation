import type { ActionDispatch } from "react";
import "./Step.css";
import type { TrackAction } from "./trackReducer";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  trackId: number;
  stepIndex: number;
  currentStep: number;
  active: boolean;
  velocity: number;
  dispatch: ActionDispatch<[action: TrackAction]>;
}

export default function Step({
  trackId,
  stepIndex,
  currentStep,
  active,
  velocity,
  dispatch,
}: Props) {
  function changeVelocity(e: React.WheelEvent) {
    if (!active) return;

    const value = velocity - e.deltaY / 1000;
    const factor = Math.pow(10, 1);
    const newVelocity = Math.round((value + Number.EPSILON) * factor) / factor;

    dispatch({
      type: "SET_STEP_VELOCITY",
      id: trackId,
      stepIndex: stepIndex,
      velocity: Math.max(0, Math.min(newVelocity, 1)),
    });
  }

  return (
    <div
      key={stepIndex}
      className={`step
                  ${stepColors.includes(stepIndex) ? "other-color" : ""}
                  ${active ? "active" : ""}
                  ${currentStep === stepIndex ? "current" : ""}`}
      style={{
        opacity: `${active ? Math.max(0.2, Math.min(velocity, 1)) : 1}`,
      }}
      onClick={() => dispatch({ type: "TOGGLE_STEP", id: trackId, stepIndex })}
      onWheel={(e: React.WheelEvent) => changeVelocity(e)}
    >
    </div>
  );
}
