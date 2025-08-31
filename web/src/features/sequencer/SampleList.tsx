import { useState } from "react";
import "./SampleList.css";
import { synthPresets, type SynthPreset } from "../../data/synthPresets";

interface Props {
  selectedSampleName: string;
  onSampleSelect: (
    sample: SynthPreset
  ) => void;
  onClose: () => void;
}

export default function SampleList({
  selectedSampleName = "",
  onSampleSelect,
  onClose,
}: Props) {
  const [selectedSample, setSelectedSample] = useState<string>(selectedSampleName);

  return (
    <div className="sample-list">
      <h3>Samples</h3>
      <button className="close-button" onClick={() => onClose()}>
        X
      </button>
      <hr />
      <ul>
        {Object.entries(synthPresets).map(([key, value]) => (
          <li
            key={key}
            className={key === selectedSample ? "selected-sample" : ""}
            onClick={() => {
              console.log("selecting sample", key, value);
              onSampleSelect(value);
              setSelectedSample(key);
            }}
          >
            <span>{value.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
