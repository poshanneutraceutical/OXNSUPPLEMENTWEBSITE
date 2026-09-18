import { useEffect, useRef, useState } from "react";

export default function ProductBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;

      setMouse({ x, y });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  const particles = Array.from({ length: 60 });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* ===========================================
          Ambient Top Glow
      =========================================== */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(25,118,197,0.08), transparent 65%)",
        }}
      />

      {/* ===========================================
          Chrome Rings
      =========================================== */}

      <div
        className="absolute w-[900px] h-[900px] rounded-full border border-white/5"
        style={{
          top: "-220px",
          left: "-250px",
          transform: `translate(${mouse.x}px,${mouse.y}px)`,
          animation: "ringRotate1 60s linear infinite",
        }}
      />

      <div
        className="absolute w-[700px] h-[700px] rounded-full border border-white/6"
        style={{
          right: "-180px",
          top: "180px",
          transform: `translate(${-mouse.x}px,${-mouse.y}px)`,
          animation: "ringRotate2 70s linear infinite",
        }}
      />

      <div
        className="absolute w-[500px] h-[500px] rounded-full border border-white/4"
        style={{
          left: "50%",
          bottom: "-150px",
          marginLeft: "-250px",
          animation: "ringRotate3 90s linear infinite",
        }}
      />

      {/* ===========================================
          Metallic Particles
      =========================================== */}

      {particles.map((_, index) => {
        const size = Math.random() * 3 + 1;

        return (
          <span
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,

              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,

              opacity: Math.random() * 0.35,

              animation: `particleFloat ${
                8 + Math.random() * 10
              }s ease-in-out infinite`,

              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        );
      })}

      {/* ===========================================
          Smoke Left
      =========================================== */}

      <div
        className="absolute w-[700px] h-[700px] blur-[120px]"
        style={{
          left: "-250px",
          top: "200px",
          opacity: 0.06,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)",
          animation: "smokeMove1 22s ease-in-out infinite",
        }}
      />

      {/* ===========================================
          Smoke Right
      =========================================== */}

      <div
        className="absolute w-[900px] h-[900px] blur-[160px]"
        style={{
          right: "-300px",
          top: "-120px",
          opacity: 0.04,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.5), transparent 72%)",
          animation: "smokeMove2 30s ease-in-out infinite",
        }}
      />

      {/* ===========================================
          Ghost Product Bottle
      =========================================== */}

      <img
        src="/products/oxn/double-rich-chocolate.png"
        alt=""
        draggable={false}
        className="absolute select-none"
        style={{
          width: "650px",

          right: "-120px",

          top: "50%",

          opacity: 0.045,

          transform: `translateY(-50%)
                      translate(${mouse.x * -0.5}px,
                      ${mouse.y * -0.5}px)
                      rotate(-8deg)`,

          filter:
            "grayscale(100%) contrast(130%) brightness(1.3)",

          animation: "ghostBottle 14s ease-in-out infinite",
        }}
      />

      {/* ===========================================
          Floating Reflection
      =========================================== */}

      <div
        className="absolute w-[900px] h-[280px]"
        style={{
          left: "50%",
          top: "45%",
          marginLeft: "-450px",

          opacity: 0.04,

          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent)",

          filter: "blur(80px)",

          transform: `translateX(${mouse.x}px)`,

          animation: "reflectionMove 12s ease-in-out infinite",
        }}
      />

      {/* ===========================================
          Bottom Ambient Glow
      =========================================== */}

      <div
        className="absolute bottom-0 left-0 w-full h-[300px]"
        style={{
          background:
            "radial-gradient(circle at bottom, rgba(25,118,197,.08), transparent 75%)",
        }}
      />
    </div>
  );
}