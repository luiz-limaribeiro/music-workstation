import ProjectSelector from "./ProjectSelector";
import { exportToWav } from "../playback";
import './styles/TopBar.css'

export default function TopBar() {
  return (
    <div className="top-bar">
      <ProjectSelector />
      <button onClick={exportToWav}>WAV</button>
      <span className="material-symbols-outlined">settings</span>
    </div>
  );
}
