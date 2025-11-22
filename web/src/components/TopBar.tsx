import usePianoRollStore from "../store/pianoRollStore";
import ProjectSelector from "./ProjectSelector";
import TopBarTransport from "./TopBarTransport";
import "./styles/TopBar.css";

export default function TopBar() {
  const stepWidth = usePianoRollStore((state) => state.stepWidth);
  const stepHeight = usePianoRollStore((state) => state.stepHeight);
  const updateStepsDimension = usePianoRollStore(
    (state) => state.pianoRollActions.updateStepsDimension
  );

  return (
    <div className="top-bar">
      <ProjectSelector />
      <TopBarTransport />
      <div className="vertical">
        <span className="material-symbols-outlined">unfold_more</span>
        <input
          type="range"
          min={14}
          max={28}
          step={1}
          value={stepHeight}
          onChange={(e) => {
            updateStepsDimension(stepWidth, parseInt(e.currentTarget.value));
          }}
        />
      </div>
      <div className="horizontal">
        <span className="material-symbols-outlined">unfold_less</span>
        <input
          type="range"
          min={10}
          max={38}
          step={1}
          value={stepWidth}
          onChange={(e) => {
            updateStepsDimension(parseInt(e.currentTarget.value), stepHeight);
          }}
        />
      </div>
      <span className="material-symbols-outlined icon settings">settings</span>
    </div>
  );
}
