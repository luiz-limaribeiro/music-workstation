import { useGlobalKeyBindings } from "./common/useGlobalKeyBindings";
import PianoRoll from "./components/PianoRoll";
import TopBar from "./components/TopBar";

function App() {
  useGlobalKeyBindings();

  return (
    <main style={{ overflowY: "hidden" }}>
      <TopBar />
      <PianoRoll />
    </main>
  );
}

export default App;
