import type { TrackData } from "./trackData";
import "./TrackRow.css";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  track: TrackData;
  currentStep: number;
  onToggleStep: (trackId: number, stepId: number) => void;
  onChangeVelocity: (trackId: number, volume: number) => void;
  onMute: (trackId: number) => void;
}

export default function TrackRow({
  track,
  currentStep,
  onToggleStep,
  onChangeVelocity,
  onMute,
}: Props) {
  const { id, name, pattern, velocity, muted } = track;

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    onChangeVelocity(id, newVelocity);
  }

  return (
    <div className="track-row">
      <span>{name}</span>
      <div className="mute-unmute">
        <input
          type="button"
          className={muted ? "muted" : ""}
          onClick={() => onMute(id)}
        />
      </div>
      <div className="velocity-input">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={velocity}
          onChange={changeVelocity}
        />
      </div>
      <div className="steps">
        {pattern.map((step, stepIndex) => (
          <div
            key={stepIndex}
            className={`step
                  ${stepColors.includes(stepIndex) ? "other-color" : ""}
                  ${step ? "active" : ""}
                  ${currentStep === stepIndex ? "current" : ""}`}
            onClick={() => onToggleStep(id, stepIndex)}
          ></div>
        ))}
      </div>
    </div>
  );
}
