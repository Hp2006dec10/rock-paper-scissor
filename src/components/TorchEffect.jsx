import { useEffect, useRef } from "react";

const TorchEffect = () => {
  const overlayRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, currentX: -1000, currentY: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Initialize cursor positions if first movement
      if (mouseRef.current.currentX === -1000) {
        mouseRef.current.currentX = e.clientX;
        mouseRef.current.currentY = e.clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId;
    const update = () => {
      animId = requestAnimationFrame(update);
      
      const m = mouseRef.current;
      if (m.x !== -1000) {
        // Interpolate spotlight position (lerp)
        // Snappy, organic tracking (0.18)
        m.currentX += (m.x - m.currentX) * 0.8;
        m.currentY += (m.y - m.currentY) * 0.8;
        
        // Directly manipulate DOM styling to bypass React re-renders
        if (overlayRef.current) {
          overlayRef.current.style.background = `radial-gradient(circle 240px at ${Math.round(m.currentX)}px ${Math.round(m.currentY)}px, rgba(239, 68, 68, 0.16) 0%, rgba(185, 28, 28, 0.04) 50%, rgba(0, 0, 0, 0) 100%)`;
        }
      }
    };
    update();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        background: "none" // Managed dynamically by ref for high-performance updates
      }}
    />
  );
};

export default TorchEffect;
