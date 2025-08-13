import {
  newSequencerTrackData,
  type SequencerTrack,
} from "../../models/sequencerTrackData";
import SequencerTrackContainer from "./SequencerTrackContainer";
import "./Sequencer.css";

interface Props {
  clipId: number;
  trackName: string;
  sequencerTrackIds: number[];
  onCloseEditor: () => void;
  addSequencerTrack: (
    clipId: number,
    sequencerTrackData: SequencerTrack
  ) => void;
}

export default function Sequencer({
  clipId,
  trackName,
  sequencerTrackIds,
  onCloseEditor,
  addSequencerTrack,
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
        <div className="sequencer-header">
          <h3>{trackName}</h3>
        </div>
        {sequencerTrackIds.map((id) => (
          <SequencerTrackContainer
            key={id}
            clipId={clipId}
            sequencerTrackId={id}
          />
        ))}
        <div className="add-instrument">
          <button
            onClick={() =>
              addSequencerTrack(
                clipId,
                newSequencerTrackData("<empty>", () => {})
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
