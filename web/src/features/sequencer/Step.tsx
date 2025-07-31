import { useCallback, useEffect, useRef } from "react";
import "./Step.css";
import React from "react";
import { useStore } from "../../store/store";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  trackId: number;
  stepIndex: number;
  currentStep: number;
  active: boolean;
  velocity: number;
  repeatValue: number;
}

const Step = React.memo(function Step({
  trackId,
  stepIndex,
  currentStep,
  active,
  velocity,
  repeatValue,
}: Props) {
  const stepRef = useRef<HTMLDivElement | null>(null);
  const toggleStep = useStore((state) => state.toggleStep);
  const setStepVelocity = useStore((state) => state.setStepVelocity);
  const setRepeatValue = useStore((state) => state.setRepeatValue);

  const bars = Array.from({ length: repeatValue }, (_, index) => (
    <div key={index} className="repeat-bar"></div>
  ));

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      if (!active) return;
      e.preventDefault();

      if (e.ctrlKey) {
        const value = repeatValue + e.deltaY / 100;
        const newRepeatValue = Math.max(1, Math.min(value, 8));

        setRepeatValue(trackId, stepIndex, newRepeatValue);

        return;
      }

      const value = velocity - e.deltaY / 1000;
      const factor = Math.pow(10, 1);
      const newVelocity =
        Math.round((value + Number.EPSILON) * factor) / factor;

      setStepVelocity(trackId, stepIndex, newVelocity);
    },
    [
      active,
      stepIndex,
      trackId,
      velocity,
      repeatValue,
      setStepVelocity,
      setRepeatValue,
    ]
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
      onClick={() => toggleStep(trackId, stepIndex)}
    >
      {active && bars}
    </div>
  );
});

export default Step;
