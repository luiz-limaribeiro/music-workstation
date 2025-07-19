import "./TrackRow.css";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  id: number;
  name: string;
  velocity: number;
  sequence: number[];
  currentStep: number;
  onToggleStep: (trackId: number, stepId: number) => void;
  onChangeVelocity: (trackId: number, volume: number) => void;
}

export default function TrackRow({
  id,
  name,
  velocity,
  sequence,
  currentStep,
  onToggleStep,
  onChangeVelocity,
}: Props) {
  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    onChangeVelocity(id, newVelocity);
  }

  return (
    <div className="track-row">
      <span>{name}</span>
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
        {sequence.map((step, stepIndex) => (
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
