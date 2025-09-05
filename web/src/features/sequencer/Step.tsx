import { useCallback, useEffect, useRef } from "react";
import "./styles/Step.css";
import React from "react";

interface Props {
  stepId: number;
  trackId: number;
  active: boolean;
  velocity: number;
  repeatValue: number;
  index: number;
  toggleStep: (stepId: number) => void;
  setRepeatValue: (stepId: number, repeatValue: number) => void;
  setStepVelocity: (stepId: number, velocity: number) => void;
  updateTrackPart: (trackId: number) => void;
}

function Step({
  stepId,
  trackId,
  active,
  velocity,
  repeatValue,
  index,
  toggleStep,
  setRepeatValue,
  setStepVelocity,
  updateTrackPart,
}: Props) {
  const stepRef = useRef<HTMLDivElement | null>(null);

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

        setRepeatValue(stepId, newRepeatValue);
        updateTrackPart(trackId);
        return;
      }

      const value = velocity - e.deltaY / 1000;
      const factor = Math.pow(10, 1);
      const newVelocity =
        Math.round((value + Number.EPSILON) * factor) / factor;
      setStepVelocity(stepId, newVelocity);
      updateTrackPart(trackId);
    },
    [
      stepId,
      trackId,
      active,
      velocity,
      repeatValue,
      setRepeatValue,
      setStepVelocity,
      updateTrackPart,
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
      className={`step ${active ? "active" : ""}`}
      style={{
        opacity: `${active ? Math.max(0.2, Math.min(velocity, 1)) : 1}`,
        backgroundColor: `${
          active ? "rgb(251, 143, 255)" : index % 4 === 0 ? "#2a2a3a" : "#223"
        }`,
      }}
      onClick={() => {
        toggleStep(stepId);
        updateTrackPart(trackId);
      }}
    >
      {active && bars}
    </div>
  );
}

export default React.memo(Step);
