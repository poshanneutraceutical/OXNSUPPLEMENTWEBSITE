import {
  useRef,
  useEffect,
  type ReactNode,
} from "react";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    if (window.innerWidth < 768) return;

    let frame = 0;

    const handleMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) * strength;
      const moveY = (y - centerY) * strength;

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    };

    const handleLeave = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        element.style.transform = "translate3d(0,0,0)";
      });
    };

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(frame);

      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: "inline-flex",
        transition:
          "transform .45s cubic-bezier(.16,1,.3,1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}