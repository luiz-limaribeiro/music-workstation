import Keys from "./Keys";
import NotesTimeline from "./NotesTimeline";
import "./styles/PianoRoll.css";

export default function PianoRoll() {
  return (
    <div>
      <Keys />
      <NotesTimeline />
    </div>
  );
}
