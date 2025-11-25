import LandingPage from "./pages/LandingPage";
import { useGlobalKeyBindings } from "./utils/useGlobalKeyBindings";

function App() {
  useGlobalKeyBindings();

  return (
    <LandingPage />
  );
}

export default App;
