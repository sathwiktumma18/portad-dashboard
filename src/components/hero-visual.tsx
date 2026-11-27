"use client";

import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const INPUTS = [
  { id: "pages", label: "Pages", meta: "1,284", y: 24 },
  { id: "dbs", label: "Databases", meta: "48", y: 78 },
  { id: "files", label: "Attachments", meta: "84 MB", y: 132 },
];

const OUTPUTS = [
  { id: "preserved", label: "✓ Preserved", delay: 0.85, y: 24 },
  { id: "checksummed", label: "✓ Checksummed", delay: 1.0, y: 78 },
  { id: "ready", label: "✓ Huly Ready", delay: 1.15, y: 132 },
];

const TILT_SPRING = { stiffness: 220, damping: 24, mass: 0.7 };
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroVisual() {
  const reduce = useReducedMotion();
  const [runKey, setRunKey] = useState(0);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT_SPRING);
  const springY = useSpring(rotateY, TILT_SPRING);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 8);
    rotateY.set(px * 10);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      className="perspective-stage w-full max-w-[500px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        key={runKey}
        initial={reduce ? false : { opacity: 0, y: 16, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.65, ease: EASE }}
        style={
          reduce
            ? undefined
            : {
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
              }
        }
        className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#121318]/95 p-6 text-white shadow-[0_28px_80px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:shadow-[0_30px_90px_-30px_rgba(8,207,254,0.28)]"
      >
        {/* Ambient violet/cyan corner highlights */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#08CFFE]/20 blur-3xl"
        />

        {/* Card header */}
        <div className="relative flex items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#08CFFE] shadow-[0_0_10px_#08CFFE]" />
            <span className="font-mono text-xs text-[#D6D7E6]">
              portad · verification hub
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRunKey((k) => k + 1)}
            className="rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-[11px] font-medium text-white transition hover:border-[#08CFFE] hover:bg-white/20"
          >
            Replay flow ↻
          </button>
        </div>

        {/* Flow stage: Inputs -> Hub -> Cyan Verified Outputs */}
        <div className="relative my-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
          {/* Left: 3 Source Input Pills */}
          <div className="relative z-10 flex flex-col gap-3">
            {INPUTS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: EASE }}
                className="group flex items-center justify-between gap-2 rounded-full border border-white/15 bg-[#2a2c32]/85 px-3 py-2 text-xs text-[#E4E6F0] transition-all hover:border-white/35 hover:bg-[#3a3d45] hover:text-white"
              >
                <span className="truncate font-medium">{item.label}</span>
                <span className="hidden font-mono text-[10px] text-white/65 sm:inline">
                  {item.meta}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Center: Animated SVG Connectors + Flowing Packets + White Shield Hub */}
          <div className="relative flex flex-col items-center justify-center px-1 sm:px-2">
            <svg
              aria-hidden
              viewBox="0 0 180 156"
              className="pointer-events-none absolute -left-[52px] -right-[52px] top-1/2 h-[156px] w-[180px] -translate-y-1/2 overflow-visible sm:-left-[64px] sm:-right-[64px] sm:w-[208px]"
              fill="none"
            >
              {/* 3 Input lines joining center + continuous flowing light dots */}
              {INPUTS.map((item, idx) => {
                const pathD = `M 4 ${item.y} C 45 ${item.y}, 55 78, 86 78`;
                return (
                  <g key={`in-${item.id}`}>
                    <motion.path
                      d={pathD}
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.55, delay: 0.3 + idx * 0.08, ease: EASE }}
                    />
                    {!reduce && (
                      <circle r="2.6" fill="#E879F9">
                        <animateMotion
                          dur="2.2s"
                          begin={`${idx * 0.45}s`}
                          repeatCount="indefinite"
                          path={pathD}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* 3 Output lines fanning to Cyan pills + continuous flowing cyan dots */}
              {OUTPUTS.map((out, idx) => {
                const pathD = `M 94 78 C 125 78, 135 ${out.y}, 176 ${out.y}`;
                return (
                  <g key={`out-${out.id}`}>
                    <motion.path
                      d={pathD}
                      stroke="#08CFFE"
                      strokeOpacity="0.7"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.55, delay: 0.65 + idx * 0.1, ease: EASE }}
                    />
                    {!reduce && (
                      <circle r="2.8" fill="#08CFFE">
                        <animateMotion
                          dur="2.2s"
                          begin={`${0.9 + idx * 0.45}s`}
                          repeatCount="indefinite"
                          path={pathD}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Vertical Stem from Hub */}
              <motion.line
                x1="90"
                y1="96"
                x2="90"
                y2="178"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.25"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.95, ease: EASE }}
              />
            </svg>

            {/* White Rounded Shield Hub Tile */}
            <motion.div
              initial={reduce ? false : { scale: 0.65, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.55, ease: EASE }}
              whileHover={reduce ? undefined : { scale: 1.08 }}
              className="relative z-20 grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#060607] shadow-[0_0_28px_rgba(255,255,255,0.35)] transition-shadow hover:shadow-[0_0_38px_rgba(8,207,254,0.8)]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                className="h-6 w-6"
              >
                <path
                  d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>

          {/* Right: 3 Cyan Verified Output Pills */}
          <div className="relative z-10 flex flex-col gap-3">
            {OUTPUTS.map((out) => (
              <motion.div
                key={out.id}
                initial={
                  reduce
                    ? false
                    : { opacity: 0.35, scale: 0.94, borderColor: "rgba(255,255,255,0.15)" }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  borderColor: "rgba(8,207,254,0.7)",
                }}
                transition={{ duration: 0.45, delay: out.delay, ease: EASE }}
                className="flex items-center justify-center rounded-full border border-[#08CFFE]/65 bg-[#0c3c52]/75 px-3 py-2 text-xs font-medium text-[#7ee8ff] shadow-[0_0_18px_-6px_rgba(8,207,254,0.55)] transition-all hover:bg-[#0e4e6b] hover:text-white"
              >
                {out.label}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom verification stem label */}
        <div className="relative mt-6 flex items-center justify-between border-t border-white/12 pt-3.5 text-xs">
          <span className="font-mono text-[11px] text-white/65">
            sha256:9f2c…e41a
          </span>
          <span className="font-mono text-[11px] font-medium text-[#08CFFE]">
            Notion → .portad → Huly
          </span>
        </div>
      </motion.div>
    </div>
  );
}
