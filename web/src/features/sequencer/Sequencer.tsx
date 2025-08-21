import {
  newSequencerTrackData,
  type SequencerTrack,
} from "../../data/sequencerTrackData";
import SequencerTrackContainer from "./SequencerTrackContainer";
import "./Sequencer.css";

interface Props {
  clipId: number;
  trackId: number;
  sequencerTrackIds: number[];
  onCloseEditor: () => void;
  addSequencerTrack: (
    clipId: number,
    sequencerTrackData: SequencerTrack
  ) => void;
}

export default function Sequencer({
  clipId,
  trackId,
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
        {sequencerTrackIds.map((id) => (
          <SequencerTrackContainer
            key={id}
            clipId={clipId}
            trackId={trackId}
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
