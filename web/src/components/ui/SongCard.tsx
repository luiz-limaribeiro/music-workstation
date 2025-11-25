import { useState } from "react";
import "./SongCard.css";

export default function SongCard() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="song-card" onClick={() => setIsPlaying(!isPlaying)}>
      <div className="texts">
        <h4>Song name</h4>
        <span>User name</span>
      </div>
      <button className="material-symbols-rounded icon">
        {!isPlaying ? "play_arrow" : "pause"}
      </button>
      {isPlaying && <div className="waveform" />}
    </div>
  );
}
