import {
  newInstrumentData,
  type InstrumentData,
} from "../../data/instrumentData";
import InstrumentContainer from "./InstrumentContainer";
import "./Sequencer.css";

interface Props {
  clipId: number;
  trackId: number;
  instrumentIds: number[];
  onCloseEditor: () => void;
  addInstrument: (
    clipId: number,
    instrumentData: InstrumentData
  ) => void;
}

export default function Sequencer({
  clipId,
  trackId,
  instrumentIds,
  onCloseEditor,
  addInstrument,
}: Props) {
  return (
    <div
      className="sequencer-container"
      onMouseDown={(e) => {
        e.stopPropagation();
        onCloseEditor();
      }}
    >
      <div className="sequencer" onMouseDown={(e) => e.stopPropagation()}>
        {instrumentIds.map((id) => (
          <InstrumentContainer
            key={id}
            clipId={clipId}
            trackId={trackId}
            instrumentId={id}
          />
        ))}
        <div className="add-instrument">
          <button
            onClick={() =>
              addInstrument(
                trackId,
                newInstrumentData()
              )
            }
          >
            add track
          </button>
        </div>
      </div>
    </div>
  );
}
