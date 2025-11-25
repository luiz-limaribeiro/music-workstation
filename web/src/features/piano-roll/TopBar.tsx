import { useState } from "react";
import { redo, undo } from "../../utils/functions";
import usePianoRollStore from "../../store/pianoRollStore";
import HelpModal from "./HelpModal";
import TopBarTransport from "./TopBarTransport";
import "./styles/TopBar.css";

export default function TopBar() {
  const stepWidth = usePianoRollStore((state) => state.stepWidth);
  const stepHeight = usePianoRollStore((state) => state.stepHeight);
  const canUndo = usePianoRollStore((s) => s.canUndo);
  const canRedo = usePianoRollStore((s) => s.canRedo);
  const updateStepsDimension = usePianoRollStore(
    (state) => state.pianoRollActions.updateStepsDimension
  );

  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className="top-bar">
      <h4>Project name</h4>
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
      <span
        className={`material-symbols-outlined icon undo ${
          canUndo ? "" : "disabled"
        }`}
        onClick={() => undo()}
      >
        undo
      </span>
      <span
        className={`material-symbols-outlined icon redo ${
          canRedo ? "" : "disabled"
        }`}
        onClick={() => redo()}
      >
        redo
      </span>
      <div className="icons">
        <span
          className={`material-symbols-outlined icon help ${
            showHelpModal ? "disabled" : ""
          }`}
          onClick={() => setShowHelpModal(true)}
        >
          help
        </span>
        <span className="material-symbols-outlined icon home">home</span>
      </div>
      {showHelpModal && (
        <HelpModal onCloseClick={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}
