import { useEffect, useState } from "react";
import { useGlobalKeyBindings } from "./common/useGlobalKeyBindings";
import PianoRoll from "./features/piano-roll/PianoRoll";
import ProjectSelector from "./features/piano-roll/ProjectSelector";
import ThemeToggle from "./features/piano-roll/ThemeToggle";
import './App.css'
import { exportToWav } from "./features/piano-roll/playback";

function App() {
  useGlobalKeyBindings();

  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  }

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <PianoRoll />
      <div className="top-bar">
        <button onClick={exportToWav}>WAV</button>
        <ThemeToggle onChange={toggleTheme} />
        <ProjectSelector />
      </div>
    </div>
  );
}

export default App;
