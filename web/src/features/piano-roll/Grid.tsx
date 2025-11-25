import React, { useEffect, useRef } from "react";
import "./styles/Grid.css";
import usePianoRollStore from "../../store/pianoRollStore";

interface Props {
  cellWidth: number;
  cellHeight: number;
  offsetY: number;
}

const activeAreaColor = "#334"
const stepLineColor = "#1115"
const barLineColor = "#111"

function Grid({ cellWidth, cellHeight, offsetY }: Props) {
  const loopLength = usePianoRollStore((state) => state.loopLengthInSteps);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    function drawGrid(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const width = ctx.canvas.width / (window.devicePixelRatio || 1);
      const height = ctx.canvas.height / (window.devicePixelRatio || 1);

      // Active area
      ctx.fillStyle = activeAreaColor;
      ctx.fillRect(0, 0, loopLength * cellWidth, ctx.canvas.height / dpr);

      // Lines
      ctx.strokeStyle = stepLineColor;
      ctx.lineWidth = 1;

      for (let x = cellWidth; x < width; x += cellWidth) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += cellHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = barLineColor;
      ctx.lineWidth = 1;

      for (let x = cellWidth * 4; x < width; x += cellWidth * 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += cellHeight * 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.lineWidth = 3;

      for (let x = cellWidth * 16; x < width; x += cellWidth * 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    drawGrid(ctx);
  }, [cellWidth, cellHeight, offsetY, loopLength]);

  return <canvas ref={canvasRef} className="grid" />;
}

export default React.memo(Grid);
