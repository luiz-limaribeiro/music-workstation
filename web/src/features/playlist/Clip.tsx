import "./Clip.css";
import type { ClipData } from "./clipData";

interface Props {
  clipData: ClipData;
}

export default function Clip({ clipData }: Props) {
  return (
    <div
      className="clip"
      style={{
        gridColumnStart: clipData.startStep + 1,
        gridColumnEnd: `span ${clipData.length}`,
      }}
    />
  );
}
