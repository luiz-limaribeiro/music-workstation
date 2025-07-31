import "./Timeline.css";

interface Props {
  totalSteps: number;
}

export default function Timeline({ totalSteps }: Props) {
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
            height: i % 4 === 0 ? "16px" : "12px",
          }}
        />
      ))}
    </div>
  );
}
