"use client";

import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const INPUTS = [
  { id: "pages", label: "Notion Pages", meta: "412 docs", y: 24, delay: 0.08 },
  { id: "tables", label: "Notion Tables", meta: "48 dbs", y: 78, delay: 0.45 },
  { id: "files", label: "Media & Files", meta: "84 MB", y: 132, delay: 0.82 },
];

const OUTPUTS = [
  { id: "docs", label: "✓ Huly Docs", meta: "412", y: 24, delay: 0.55 },
  { id: "boards", label: "✓ Huly Boards", meta: "48", y: 78, delay: 0.92 },
  { id: "sha", label: "✓ SHA-256 Safe", meta: "0 drops", y: 132, delay: 1.28 },
];

const TILT_SPRING = { stiffness: 200, damping: 22, mass: 0.7 };
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroVisual() {
  const reduce = Boolean(useReducedMotion());
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
    rotateX.set(-py * 12);
    rotateY.set(px * 14);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      data-reduced-motion={reduce ? "true" : "false"}
      className="perspective-stage w-full max-w-[540px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Continuous 3D breathing float + pointer-steered tilt */}
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotateX: [2, -2, 2],
                rotateY: [-3, 3, -3],
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={
          reduce
            ? undefined
            : {
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
              }
        }
        className="preserve-3d relative overflow-hidden rounded-3xl border border-white/20 bg-[#101116]/92 p-6 text-white shadow-[0_32px_90px_-24px_rgba(15,23,42,0.55)] backdrop-blur-2xl dark:shadow-[0_32px_90px_-24px_rgba(8,207,254,0.3)]"
      >
        {/* Ambient violet/cyan inner glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fuchsia-500/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#08CFFE]/25 blur-3xl"
        />

        {/* Card header */}
        <div className="relative flex items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#08CFFE] shadow-[0_0_12px_#08CFFE]" />
            <span className="font-mono text-xs text-[#D6D7E6]">
              Live migration pipeline
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRunKey((k) => k + 1)}
            className="rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md transition hover:border-[#08CFFE] hover:bg-white/20 active:scale-95"
          >
            Replay flow ↻
          </button>
        </div>

        {/* Clear 3-Stage Story Header so first-time users instantly understand */}
        <div className="relative mb-3 grid grid-cols-[1fr_76px_1fr] text-center font-mono text-[10px] uppercase tracking-wider text-white/55 sm:grid-cols-[1fr_88px_1fr]">
          <span>1. Source Export</span>
          <span>2. Verify</span>
          <span>3. Target Ready</span>
        </div>

        {/* Keyed animation container so Replay restarts the entire wave cleanly */}
        <div
          key={runKey}
          className="preserve-3d relative my-2 grid grid-cols-[1fr_76px_1fr] items-center gap-0 sm:grid-cols-[1fr_88px_1fr]"
        >
          {/* Left: 3 Notion Source Pills */}
          <div
            className="preserve-3d relative z-20 flex flex-col gap-3"
            style={reduce ? undefined : { transform: "translateZ(16px)" }}
          >
            {INPUTS.map((item) => (
              <motion.div
                key={item.id}
                initial={
                  reduce
                    ? false
                    : {
                        opacity: 0.3,
                        x: -14,
                        scale: 0.94,
                        borderColor: "rgba(255,255,255,0.12)",
                      }
                }
                animate={
                  reduce
                    ? undefined
                    : {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        borderColor: [
                          "rgba(255,255,255,0.15)",
                          "rgba(232,121,249,0.85)",
                          "rgba(255,255,255,0.22)",
                        ],
                      }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 0.65,
                        delay: item.delay,
                        ease: EASE,
                      }
                }
                className="flex h-[36px] items-center justify-between gap-2 rounded-full border border-white/20 bg-[#22242a] px-3 text-xs text-[#F1F2F7] shadow-md transition-colors hover:border-fuchsia-400/70 hover:bg-[#2d3038]"
              >
                <span className="truncate font-medium">{item.label}</span>
                <span className="hidden font-mono text-[10px] text-white/60 sm:inline">
                  {item.meta}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Center: SVG Connectors + Continuous Light Waves + Popped-Out PortaD Shield */}
          <div className="preserve-3d relative flex h-[156px] flex-col items-center justify-center">
            <svg
              aria-hidden
              viewBox="0 0 100 156"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              fill="none"
            >
              {/* Left -> Center Curves */}
              {INPUTS.map((item) => {
                const pathD = `M -2 ${item.y} C 24 ${item.y}, 30 78, 50 78`;
                return (
                  <g key={`in-${item.id}`}>
                    <path
                      d={pathD}
                      stroke="rgba(255,255,255,0.16)"
                      strokeWidth="1.5"
                    />
                    <motion.path
                      d={pathD}
                      stroke="#E879F9"
                      strokeOpacity={reduce ? 0.45 : undefined}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
                      animate={
                        reduce
                          ? undefined
                          : { pathLength: 1, opacity: [0.3, 1, 0.45] }
                      }
                      transition={
                        reduce
                          ? undefined
                          : {
                              duration: 0.5,
                              delay: item.delay + 0.12,
                              ease: EASE,
                            }
                      }
                    />
                    {!reduce && (
                      <motion.path
                        d={pathD}
                        stroke="#F0ABFC"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="14 90"
                        initial={{ strokeDashoffset: 104 }}
                        animate={{ strokeDashoffset: [104, 0] }}
                        transition={{
                          duration: 1.8,
                          delay: item.delay + 0.6,
                          repeat: Infinity,
                          repeatDelay: 0.8,
                          ease: "linear",
                        }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Center -> Right Curves */}
              {OUTPUTS.map((out) => {
                const pathD = `M 50 78 C 70 78, 76 ${out.y}, 102 ${out.y}`;
                return (
                  <g key={`out-${out.id}`}>
                    <path
                      d={pathD}
                      stroke="rgba(8,207,254,0.2)"
                      strokeWidth="1.5"
                    />
                    <motion.path
                      d={pathD}
                      stroke="#08CFFE"
                      strokeOpacity={reduce ? 0.7 : undefined}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
                      animate={
                        reduce
                          ? undefined
                          : { pathLength: 1, opacity: [0.3, 1, 0.7] }
                      }
                      transition={
                        reduce
                          ? undefined
                          : {
                              duration: 0.5,
                              delay: out.delay - 0.22,
                              ease: EASE,
                            }
                      }
                    />
                    {!reduce && (
                      <motion.path
                        d={pathD}
                        stroke="#7EE8FF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="14 90"
                        initial={{ strokeDashoffset: 104 }}
                        animate={{ strokeDashoffset: [104, 0] }}
                        transition={{
                          duration: 1.8,
                          delay: out.delay + 0.3,
                          repeat: Infinity,
                          repeatDelay: 0.8,
                          ease: "linear",
                        }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Vertical Stem */}
              <motion.line
                x1="50"
                y1="96"
                x2="50"
                y2="176"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.25"
                initial={reduce ? false : { pathLength: 0 }}
                animate={reduce ? undefined : { pathLength: 1 }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 0.5, delay: 0.75, ease: EASE }
                }
              />
            </svg>

            {/* Popped-out 3D White PortaD Shield Hub */}
            <motion.div
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={
                reduce
                  ? undefined
                  : {
                      scale: [0.6, 1.12, 1],
                      opacity: 1,
                      boxShadow: [
                        "0 0 18px rgba(255,255,255,0.25)",
                        "0 0 38px rgba(8,207,254,0.85)",
                        "0 0 24px rgba(8,207,254,0.4)",
                      ],
                    }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 0.75, delay: 0.35, ease: EASE }
              }
              whileHover={reduce ? undefined : { scale: 1.12 }}
              style={
                reduce
                  ? { boxShadow: "0 0 24px rgba(8,207,254,0.4)" }
                  : { transform: "translateZ(28px)" }
              }
              className="relative z-30 grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#060607]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                className="h-5 w-5"
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
            <span
              className="relative z-30 mt-2 rounded-full bg-[#101116]/90 px-2 py-0.5 font-mono text-[9px] text-[#08CFFE]"
              style={reduce ? undefined : { transform: "translateZ(22px)" }}
            >
              .portad
            </span>
          </div>

          {/* Right: 3 Huly Target Output Pills */}
          <div
            className="preserve-3d relative z-20 flex flex-col gap-3"
            style={reduce ? undefined : { transform: "translateZ(16px)" }}
          >
            {OUTPUTS.map((out) => (
              <motion.div
                key={out.id}
                initial={
                  reduce
                    ? false
                    : {
                        opacity: 0.25,
                        x: 10,
                        scale: 0.92,
                        borderColor: "rgba(255,255,255,0.12)",
                      }
                }
                animate={
                  reduce
                    ? undefined
                    : {
                        opacity: 1,
                        x: 0,
                        scale: [0.92, 1.04, 1],
                        borderColor: "rgba(8,207,254,0.75)",
                      }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 0.55,
                        delay: out.delay,
                        ease: EASE,
                      }
                }
                className="flex h-[36px] items-center justify-between gap-2 rounded-full border border-[#08CFFE]/70 bg-[#0d3548] px-3 text-xs font-medium text-[#7ee8ff] shadow-[0_0_20px_-6px_rgba(8,207,254,0.6)] transition-all hover:bg-[#104761] hover:text-white"
              >
                <span className="truncate">{out.label}</span>
                <span className="hidden font-mono text-[10px] text-[#7ee8ff]/75 sm:inline">
                  {out.meta}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom verification stem label */}
        <div className="relative mt-5 flex items-center justify-between border-t border-white/12 pt-3.5 text-xs">
          <span className="font-mono text-[11px] text-white/65">
            5-layer check · sha256:9f2c…e41a
          </span>
          <span className="font-mono text-[11px] font-medium text-[#08CFFE]">
            0 silent drops
          </span>
        </div>
      </motion.div>
    </div>
  );
}
