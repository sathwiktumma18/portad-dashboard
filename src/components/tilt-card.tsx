"use client";

import { useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const SPRING_CONFIG = { stiffness: 240, damping: 20, mass: 0.6 };

export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = Boolean(useReducedMotion());
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const springX = useSpring(rotateX, SPRING_CONFIG);
  const springY = useSpring(rotateY, SPRING_CONFIG);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 10);
    rotateY.set(px * 10);
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    setSpotlight((prev) => ({ ...prev, active: false }));
  }

  return (
    <div
      data-reduced-motion={reduce ? "true" : "false"}
      className="perspective-stage"
    >
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={
          reduce
            ? undefined
            : {
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
              }
        }
        whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden ${className}`}
      >
        {!reduce && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: spotlight.active ? 1 : 0,
              background: `radial-gradient(320px circle at ${spotlight.x}% ${spotlight.y}%, rgba(8, 207, 254, 0.14), transparent 70%)`,
            }}
          />
        )}
        <div className="relative" style={reduce ? undefined : { transform: "translateZ(14px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
