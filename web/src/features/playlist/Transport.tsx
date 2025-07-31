import './Transport.css'

export default function Transport() {
  return (
    <div className="transport">
      <button className="play-button">Play</button>
      <button className="stop-button">Stop</button>
      <div className="bpm-display">BPM: 120</div>
      <div className="time-display">00:00</div>
    </div>
  );
}