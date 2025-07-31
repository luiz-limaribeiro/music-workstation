import "./Sequencer.css";
import TrackRow from "./TrackRow";
import Controls from "./Controls";
import { useStore } from "../../store/store";

export default function Sequencer() {
  const drumTracks = useStore((state) => state.drumTracks);
  const addTrack = useStore((state) => state.addDrumTrack);

  return (
    <div className="sequencer">
      <Controls />
      {drumTracks.map((track, trackIndex) => (
        <TrackRow key={trackIndex} track={track} />
      ))}
      <div className="add-track">
        <button onClick={addTrack}>add track</button>
      </div>
    </div>
  );
}