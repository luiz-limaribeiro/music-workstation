import Keys from "./Keys";
import NotesTimeline from "./NotesTimeline";
import "./styles/PianoRoll.css";

export default function PianoRoll() {
  return (
    <div className="piano-roll">
      <div className="keys-container">
        <Keys />
      </div>
      <div className="timeline-container">
        <NotesTimeline />
      </div>
    </div>
  );
}
