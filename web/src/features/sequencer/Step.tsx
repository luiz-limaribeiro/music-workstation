import { useCallback, useEffect, useRef, type ActionDispatch } from "react";
import "./Step.css";
import type { TrackAction } from "./trackReducer";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  trackId: number;
  stepIndex: number;
  currentStep: number;
  active: boolean;
  velocity: number;
  repeatValue: number;
  dispatch: ActionDispatch<[action: TrackAction]>;
}

export default function Step({
  trackId,
  stepIndex,
  currentStep,
  active,
  velocity,
  repeatValue,
  dispatch,
}: Props) {
  const stepRef = useRef<HTMLDivElement | null>(null);

  const bars = Array.from({ length: repeatValue }, (_, index) => (
    <div key={index} className="repeat-bar"></div>
  ))

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      if (!active) return;
      e.preventDefault();

      if (e.ctrlKey) {
        const value = repeatValue - e.deltaY / 100;
        const newRepeatValue = Math.max(1, Math.min(value, 8));

        dispatch({
          type: "SET_STEP_REPEAT_VALUE",
          id: trackId,
          stepIndex: stepIndex,
          repeatValue: newRepeatValue,
        });

        return;
      }

      const value = velocity - e.deltaY / 1000;
      const factor = Math.pow(10, 1);
      const newVelocity =
        Math.round((value + Number.EPSILON) * factor) / factor;

      dispatch({
        type: "SET_STEP_VELOCITY",
        id: trackId,
        stepIndex: stepIndex,
        velocity: Math.max(0, Math.min(newVelocity, 1)),
      });
    },
    [active, stepIndex, trackId, velocity, repeatValue, dispatch]
  );

  useEffect(() => {
    const stepElement = stepRef.current;

    if (stepElement) {
      stepElement.addEventListener("wheel", handleScroll, { passive: false });

      return () => {
        stepElement.removeEventListener("wheel", handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <div
      ref={stepRef}
      key={stepIndex}
      className={`step
                  ${stepColors.includes(stepIndex) ? "other-color" : ""}
                  ${active ? "active" : ""}
                  ${currentStep === stepIndex ? "current" : ""}`}
      style={{
        opacity: `${active ? Math.max(0.2, Math.min(velocity, 1)) : 1}`,
      }}
      onClick={() => dispatch({ type: "TOGGLE_STEP", id: trackId, stepIndex })}
    >
      {active && bars}
    </div>
  );
}
