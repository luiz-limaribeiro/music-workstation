import { useRef } from "react";
import "./Knob.css";

interface Props {
  value: number;
  onValueChange: (newValue: number) => void;
  mode: "velocity" | "pan";
}

export default function Knob({ value, onValueChange, mode }: Props) {
  const lastRotation = useRef(0)

  const valueToRotation = (v: number) =>
    mode === "velocity" ? v * 280 - 140 : v * 140;
  const rotationToValue = (r: number) =>
    mode === "velocity" ? (r + 140) / 280 : r / 140;

  const rotation = valueToRotation(value)

  function handleMouseMove(event: MouseEvent) {
    lastRotation.current += event.movementX;
    lastRotation.current = Math.max(-140, Math.min(140, lastRotation.current));
    const newValue = rotationToValue(lastRotation.current);
    onValueChange(newValue);
  }

  function handleMouseDown() {
    document.body.classList.add("grabbing-cursor");
    lastRotation.current = valueToRotation(value)
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseUp() {
    document.body.classList.remove("grabbing-cursor");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div className="knob" onMouseDown={handleMouseDown}>
      <div className="pointer" style={{ rotate: `${rotation}deg` }} />
    </div>
  );
}
