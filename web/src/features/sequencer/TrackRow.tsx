import "./TrackRow.css";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  index: number;
  name: string;
  sequence: number[];
  currentStep: number;
  toggleStep: (trackId: number, stepId: number) => void;
}

export default function TrackRow({
  index,
  name,
  sequence,
  currentStep,
  toggleStep,
}: Props) {
  return (
    <div className="track-row">
      <span>{name}</span>
      <div className="steps">
        {sequence.map((step, stepIndex) => (
          <div
            key={stepIndex}
            className={`step
                  ${stepColors.includes(stepIndex) ? "other-color" : ""}
                  ${step ? "active" : ""}
                  ${currentStep === stepIndex ? "current" : ""}`}
            onClick={() => toggleStep(index, stepIndex)}
          ></div>
        ))}
      </div>
    </div>
  );
}
