import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = ({ state = "idle" }) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const speedRef = useRef(1);

  // Sync speed multiplier with game states
  useEffect(() => {
    if (state === "clashing") {
      speedRef.current = 8; // Speed up during clash sequence
    } else if (state === "victory") {
      speedRef.current = 15; // Blast speed
      const timer = setTimeout(() => {
        speedRef.current = 1;
      }, 1500);
      return () => clearTimeout(timer);
    } else if (state === "defeat") {
      speedRef.current = 0.2; // Slow freeze
    } else {
      speedRef.current = 1; // Standard idle speed
    }
    return undefined;
  }, [state]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 4. Geometry: Generate galaxy particles
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const purpleColor = new THREE.Color("#0ec2e2ff");
    const blueColor = new THREE.Color("#4400ffff");
    const cyanColor = new THREE.Color("#d106a5ff");

    for (let i = 0; i < particleCount; i++) {
      // Position: Spherical / Ring shape distribution for a galaxy feel
      const distance = Math.random() * 2500 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = distance * Math.cos(phi);

      // Color interpolation for a magical gradient starfield
      let mixedColor;
      const rand = Math.random();
      if (rand < 0.4) {
        mixedColor = purpleColor.clone().lerp(blueColor, Math.random());
      } else if (rand < 0.8) {
        mixedColor = blueColor.clone().lerp(cyanColor, Math.random());
      } else {
        mixedColor = new THREE.Color("#ffffff").lerp(purpleColor, Math.random() * 0.5);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 5. Material: Circular glow particles
    // Creating a procedural texture for circular particles
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // 6. Particle system
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 7. Interactive Mouse movement listeners
    const handleMouseMove = (event) => {
      mouseRef.current.targetX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseRef.current.targetY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 8. Responsive Resize listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let animationFrameId;
    let currentSpeed = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Lerp mouse coordinate values for butter-smooth camera movement
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x;
      camera.position.y = -mouseRef.current.y;
      camera.lookAt(scene.position);

      // Lerp the speed multipliers for smooth transition transitions
      currentSpeed += (speedRef.current - currentSpeed) * 0.08;

      // Rotate galaxy
      points.rotation.y += 0.0006 * currentSpeed;
      points.rotation.x += 0.0002 * currentSpeed;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Memory clean up on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: "radial-gradient(circle at center, #0f0728 0%, #03000b 100%)" }}
    />
  );
};

export default ThreeBackground;
