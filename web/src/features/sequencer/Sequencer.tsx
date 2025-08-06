import { newSequencerTrackData, type SequencerTrack } from "../../models/sequencerTrackData";
import DrumTrackContainer from "./DrumTrackContainer";
import "./Sequencer.css";

interface Props {
  clipId: number;
  trackName: string;
  sequencerTrackIds: number[];
  onCloseEditor: () => void;
  addSequencerTrack: (clipId: number, sequencerTrackData: SequencerTrack) => void;
}

export default function Sequencer({
  clipId,
  trackName,
  sequencerTrackIds,
  onCloseEditor,
  addSequencerTrack
}: Props) {
  return (
    <div className="sequencer-container">
      <div className="sequencer">
        <div className="sequencer-header">
          <h3>{trackName}</h3>
          <button onClick={onCloseEditor}>done</button>
        </div>
        {sequencerTrackIds.map((id) => (
          <DrumTrackContainer
            key={id}
            clipId={clipId}
            sequencerTrackId={id}
          />
        ))}
        <div className="add-instrument">
          <button onClick={() => addSequencerTrack(clipId, newSequencerTrackData("<empty>", () => {}))}>
            add track
          </button>
        </div>
      </div>
    </div>
  );
}
