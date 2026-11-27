"use client";

import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const SPRING_CONFIG = { stiffness: 260, damping: 24, mass: 0.6 };

export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, SPRING_CONFIG);
  const springY = useSpring(rotateY, SPRING_CONFIG);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 5);
    rotateY.set(px * 5);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div className="perspective-stage">
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
        whileHover={reduce ? undefined : { y: -2 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
