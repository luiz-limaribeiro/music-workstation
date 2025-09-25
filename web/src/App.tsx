import { useGlobalKeyBindings } from "./common/useGlobalKeyBindings";
import PianoRoll from "./features/piano-roll/PianoRoll";

function App() {
  useGlobalKeyBindings()

  return <PianoRoll />;
}

export default App;
