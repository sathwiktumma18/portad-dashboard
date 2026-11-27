"use client";

import { motion, useReducedMotion } from "motion/react";

const RIBBON_PATH_A = "M -80 600 C 300 470, 720 260, 1520 55";
const RIBBON_PATH_B = "M -80 540 C 340 390, 760 310, 1520 95";

const ECHO_PATH_A = "M -80 650 C 360 510, 780 210, 1520 120";
const ECHO_PATH_B = "M -80 610 C 320 450, 740 280, 1520 75";

export default function HeroRibbon() {
  const reduce = Boolean(useReducedMotion());

  return (
    <div
      aria-hidden
      data-reduced-motion={reduce ? "true" : "false"}
      className="perspective-stage pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.svg
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        className="h-full w-full opacity-60 dark:opacity-75"
        animate={
          reduce
            ? undefined
            : {
                rotateX: [4, -4, 4],
                rotateY: [-3, 3, -3],
                scale: [1, 1.03, 1],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="portadRibbonMain" x1="0%" y1="80%" x2="100%" y2="10%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
            <stop offset="30%" stopColor="#a855f7" stopOpacity="0.65" />
            <stop offset="62%" stopColor="#ec4899" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#08CFFE" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="portadRibbonPulse" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0" />
            <stop offset="50%" stopColor="#08CFFE" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Soft glowing ribbon band */}
        <motion.path
          d={RIBBON_PATH_A}
          animate={reduce ? undefined : { d: [RIBBON_PATH_A, RIBBON_PATH_B, RIBBON_PATH_A] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          stroke="url(#portadRibbonMain)"
          strokeWidth="36"
          fill="none"
          style={{ filter: "blur(22px)" }}
        />

        {/* Secondary echo ribbon */}
        <motion.path
          d={ECHO_PATH_A}
          animate={reduce ? undefined : { d: [ECHO_PATH_A, ECHO_PATH_B, ECHO_PATH_A] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          stroke="url(#portadRibbonMain)"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          fill="none"
        />

        {/* Crisp main sweeping line */}
        <motion.path
          d={RIBBON_PATH_A}
          animate={reduce ? undefined : { d: [RIBBON_PATH_A, RIBBON_PATH_B, RIBBON_PATH_A] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          stroke="url(#portadRibbonMain)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Continuous traveling 3D energy pulse along the ribbon */}
        {!reduce && (
          <motion.path
            d={RIBBON_PATH_A}
            animate={{
              d: [RIBBON_PATH_A, RIBBON_PATH_B, RIBBON_PATH_A],
              strokeDashoffset: [1800, 0],
            }}
            transition={{
              d: { duration: 11, repeat: Infinity, ease: "easeInOut" },
              strokeDashoffset: { duration: 4.5, repeat: Infinity, ease: "linear" },
            }}
            stroke="url(#portadRibbonPulse)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="220 1580"
            fill="none"
          />
        )}
      </motion.svg>
    </div>
  );
}
