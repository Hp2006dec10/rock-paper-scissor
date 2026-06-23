import { useEffect, useRef } from "react";

const GlitterTrail = () => {
  const canvasRef = useRef(null);
  const sparklesRef = useRef([]);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set full screen bounds
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#ff5e5eff", "#ff7777ff","#ff2929ff", "#ff0000ff",  "#720000ff"];

    const addSparkles = (x, y) => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        sparklesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 0.5, // slight drift up
          size: Math.random() * 10 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.015,
        });
      }
    };

    const handleMouseMove = (e) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only add sparkles if mouse has moved a minimum threshold
      if (distance > 5) {
        addSparkles(e.clientX, e.clientY);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Draw sparkle as a custom 4-pointed star
    const drawSparkle = (p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size;
      ctx.shadowColor = p.color;

      ctx.beginPath();
      // Draw standard curved 4-pointed star shape
      ctx.moveTo(p.x, p.y - p.size);
      ctx.quadraticCurveTo(p.x, p.y, p.x + p.size, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + p.size);
      ctx.quadraticCurveTo(p.x, p.y, p.x - p.size, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - p.size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparklesRef.current = sparklesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha > 0) {
          drawSparkle(p);
          return true;
        }
        return false;
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-9999"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default GlitterTrail;
