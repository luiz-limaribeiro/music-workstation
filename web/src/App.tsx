import { useGlobalKeyBindings } from "./common/useGlobalKeyBindings";
import PianoRoll from "./features/piano-roll/PianoRoll";
import ProjectSelector from "./features/piano-roll/ProjectSelector";

function App() {
  useGlobalKeyBindings()

  return (
    <div>
      <PianoRoll />
      <ProjectSelector />
    </div>
  )
}

export default App;
