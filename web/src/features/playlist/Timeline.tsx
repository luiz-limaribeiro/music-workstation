import React from "react";
import "./styles/Timeline.css";

interface Props {
  totalSteps: number;
}

function Timeline({ totalSteps }: Props) {
  return (
    <div
      className="timeline"
      style={{
        gridTemplateColumns: `repeat(${totalSteps}, 1fr)`,
      }}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          className="timeline-step"
          key={i}
          style={{
            backgroundColor: i === 0 ? "transparent" : "black",
            height: i % 16 === 0 ? "3rem" : "0px",
            borderLeft: i % 64 === 0 ? "2px solid black" : "none",
          }}
        />
      ))}
    </div>
  );
}

export default React.memo(Timeline)