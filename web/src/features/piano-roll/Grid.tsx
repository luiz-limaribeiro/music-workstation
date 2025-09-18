import React, { useEffect, useRef } from "react";
import "./styles/Grid.css";

interface Props {
  cellWidth: number;
  cellHeight: number;
  offsetX: number;
  offsetY: number;
  timelineLength: number;
}

function Grid({
  cellWidth,
  cellHeight,
  offsetX,
  offsetY,
  timelineLength,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    drawGrid(ctx);
  }, [cellWidth, cellHeight, offsetX, offsetY, timelineLength]);

  function drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const width = ctx.canvas.width / (window.devicePixelRatio || 1);
    const height = ctx.canvas.height / (window.devicePixelRatio || 1);

    ctx.strokeStyle = "#1115";
    ctx.lineWidth = 1;

    for (let x = -offsetX % cellWidth; x < width; x += cellWidth) {
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

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;

    for (let x = -offsetX % (cellWidth * 4); x < width; x += cellWidth * 4) {
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
  }

  return (
    <canvas
      ref={canvasRef}
      className="grid"
    />
  );
}

export default React.memo(Grid);
