import { useState } from "react";
import Sequencer from "../sequencer/Sequencer";
import "./Clip.css";
import type { ClipData } from "./clipData";

interface Props {
  trackId: number;
  trackName: string;
  clipData: ClipData;
}

export default function Clip({ trackId, trackName, clipData }: Props) {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div
      style={{
        gridColumnStart: clipData.startStep + 1,
        gridColumnEnd: `span ${clipData.length}`,
      }}
    >
      <div className="clip" onClick={() => setShowEditor(true)} />
      {showEditor && (
        <Sequencer
          trackId={trackId}
          clipId={clipData.id}
          trackName={trackName}
          sequencerTracks={clipData.sequencerTracks}
          onCloseEditor={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
