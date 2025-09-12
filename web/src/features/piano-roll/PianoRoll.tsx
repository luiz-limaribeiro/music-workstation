import { useRef } from "react";
import Keys from "./Keys";
import NotesTimeline from "./NotesTimeline";
import "./styles/PianoRoll.css";
import { startMove } from "../../common/startMove";

export default function PianoRoll() {
  const timelineRef = useRef<HTMLDivElement | null>(null);

  function handleScroll(e: MouseEvent) {
    if (!timelineRef.current) return;
    const startLeft = timelineRef.current.scrollLeft;

    startMove(
      e,
      timelineRef.current,
      (dx) => {
        if (timelineRef.current) {
          timelineRef.current.scrollLeft = startLeft - dx;
        }
      },
      undefined,
      false
    );
  }

  return (
    <div className="piano-roll">
      <div className="keys-container">
        <Keys />
      </div>
      <div
        className="timeline-container"
        ref={timelineRef}
        onMouseDown={(e) => {
          if (e.buttons & 2) {
            e.preventDefault();
            handleScroll(e as unknown as MouseEvent);
            document.body.classList.add("grabbing-cursor");
          }
        }}
      >
        <NotesTimeline />
      </div>
    </div>
  );
}
