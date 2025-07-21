import { useState } from "react";
import "./SamplesList.css";
import { drums } from "./synthPresets";

interface Props {
  selectedSample?: string,
  onSampleSelect: (sampleName: string, play: (time: number, velocity: number) => void) => void,
  onClose: () => void
}

export default function SampleList({ selectedSample = '', onSampleSelect, onClose }: Props) {
  const [selected, setSelected] = useState<string>(selectedSample)

  return (
      <div className="sample-list">
        <h3>Samples</h3>
        <button className="close-button" onClick={() => onClose()}>X</button>
        <hr />
        <ul>
          {Object.entries(drums).map(([key, value]) => (
            <li key={key} className={key === selected ? 'selected' : ''}>
              <span onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                onSampleSelect(key, value)
                setSelected(key)
              }}>{key}</span>
            </li>
          ))}
        </ul>
    </div>
  );
}
