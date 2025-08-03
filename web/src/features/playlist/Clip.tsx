import { useStore } from "../../store/store";
import "./Clip.css";
import type { ClipData } from "./clipData";

interface Props {
  trackId: number
  clipData: ClipData;
}

export default function Clip({ trackId, clipData }: Props) {
  const selectClip = useStore((state) => state.selectClip);
  const setShowSequencer = useStore((state) => state.setShowSequencer);

  function handleClick() {
    selectClip(trackId, clipData.id)
    setShowSequencer(true)
  }

  return (
    <div
      className="clip"
      style={{
        gridColumnStart: clipData.startStep + 1,
        gridColumnEnd: `span ${clipData.length}`,
      }}
      onClick={handleClick}
    />
  );
}
