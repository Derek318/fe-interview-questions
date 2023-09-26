import { useRef, useEffect, useState } from "react";
import "./Paint.css";
import { Button } from "antd";

function Paint() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevCoords, setPrevCoords] = useState({ x: 0, y: 0 });

  const startDrawing = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    setIsDrawing(true);
    setPrevCoords({
      x: e.clientX - canvas.offsetLeft,
      y: e.clientY - canvas.offsetTop,
    });

    // Set drawing properties (e.g., line color, width)
    ctx.strokeStyle = "black"; // Change this to your desired color
    ctx.lineWidth = 2; // Change this to your desired line width
    ctx.lineCap = "round";

    // Start the path
    ctx.beginPath();
    ctx.moveTo(prevCoords.x, prevCoords.y);
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const currentCoords = {
      x: e.clientX - canvas.offsetLeft,
      y: e.clientY - canvas.offsetTop,
    };

    // Draw a line from the previous coordinates to the current coordinates
    ctx.lineTo(currentCoords.x, currentCoords.y);
    ctx.stroke();

    // Update the previous coordinates
    setPrevCoords(currentCoords);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Event listeners for mouse events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);

    return () => {
      // Cleanup: Remove event listeners when the component unmounts
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
    };
  }, [draw, startDrawing]);

  const endDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div>
      <Button
        onClick={() => {
          const canvas = canvasRef.current?.getContext("2d");
          if (canvas) {
            canvas.clearRect(0, 0, 800, 800);
          }
        }}
      >
        Clear
      </Button>
      <canvas className="canvas" ref={canvasRef} width={800} height={600} />
    </div>
  );
}

export default Paint;
