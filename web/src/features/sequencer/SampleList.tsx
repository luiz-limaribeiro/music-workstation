import { useState } from "react";
import "./SampleList.css";
import { drums } from "./synthPresets";

interface Props {
  selectedSampleName: string;
  onSampleSelect: (
    sampleName: string,
    play: (time: number, velocity: number) => void
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
        {Object.entries(drums).map(([key, value]) => (
          <li
            key={key}
            className={key === selectedSample ? "selected-sample" : ""}
            onClick={() => {
              onSampleSelect(key, value);
              setSelectedSample(key);
            }}
          >
            <span>{key}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
