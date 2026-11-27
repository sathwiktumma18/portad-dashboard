"use client";

import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const TILT_SPRING = { stiffness: 200, damping: 22, mass: 0.65 };

const CUBE_FACES = [
  {
    id: "front",
    label: "manifest.json",
    sub: "Spec 0.1 · 1,284 records",
    accent: "from-orange-500/25 via-amber-500/10 to-transparent",
    border: "border-orange-400/50",
    dot: "bg-orange-400",
    transform: (d: number) => `rotateY(0deg) translateZ(${d}px)`,
  },
  {
    id: "back",
    label: "checksums.txt",
    sub: "SHA-256 · 5/5 layers",
    accent: "from-emerald-500/25 via-teal-500/10 to-transparent",
    border: "border-emerald-400/50",
    dot: "bg-emerald-400",
    transform: (d: number) => `rotateY(180deg) translateZ(${d}px)`,
  },
  {
    id: "right",
    label: "entities/",
    sub: "Notion → Huly map",
    accent: "from-indigo-500/25 via-violet-500/10 to-transparent",
    border: "border-indigo-400/50",
    dot: "bg-indigo-400",
    transform: (d: number) => `rotateY(90deg) translateZ(${d}px)`,
  },
  {
    id: "left",
    label: "attachments/",
    sub: "12 files · 84.2 MB",
    accent: "from-teal-500/25 via-cyan-500/10 to-transparent",
    border: "border-teal-400/50",
    dot: "bg-teal-400",
    transform: (d: number) => `rotateY(-90deg) translateZ(${d}px)`,
  },
  {
    id: "top",
    label: "notion.portad",
    sub: "Verified archive",
    accent: "from-amber-500/25 via-orange-500/10 to-transparent",
    border: "border-amber-400/50",
    dot: "bg-amber-400",
    transform: (d: number) => `rotateX(90deg) translateZ(${d}px)`,
  },
  {
    id: "bottom",
    label: "diff.json",
    sub: "0 silent drops",
    accent: "from-rose-500/25 via-orange-500/10 to-transparent",
    border: "border-rose-400/50",
    dot: "bg-rose-400",
    transform: (d: number) => `rotateX(-90deg) translateZ(${d}px)`,
  },
];

export default function HeroVisual() {
  const reduce = useReducedMotion();
  const [exploded, setExploded] = useState(false);
  const [spinning, setSpinning] = useState(true);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT_SPRING);
  const springY = useSpring(rotateY, TILT_SPRING);

  const faceDistance = exploded ? 112 : 84;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 24);
    rotateY.set(px * 28);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      className="perspective-stage w-full max-w-[440px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="glass-strong hairline relative overflow-hidden rounded-3xl p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-brand-600 dark:text-brand-400">
              3D Vault · notion.portad
            </p>
            <p className="mt-0.5 text-sm font-medium text-frost-100">
              Interactive package cube
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSpinning((s) => !s)}
              className="rounded-lg border px-2.5 py-1 font-mono text-[11px] text-frost-300 transition-colors hover:text-frost-100"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--surface-raised)",
              }}
            >
              {spinning ? "Pause" : "Spin"}
            </button>
            <button
              type="button"
              onClick={() => setExploded((prev) => !prev)}
              className="rounded-lg border border-orange-500/40 bg-orange-500/15 px-2.5 py-1 font-mono text-[11px] font-medium text-orange-600 transition-colors hover:bg-orange-500/25 dark:text-orange-300"
            >
              {exploded ? "Assemble" : "Explode 3D"}
            </button>
          </div>
        </div>

        {/* True 3D Cube Stage */}
        <div className="perspective-stage relative mx-auto my-6 flex h-[250px] w-full items-center justify-center">
          {/* 3D Orbiting Ring */}
          <div
            aria-hidden
            className={
              "pointer-events-none absolute h-[230px] w-[230px] rounded-full border border-dashed border-orange-400/35 " +
              (!reduce && spinning ? "animate-orbit-ring" : "")
            }
            style={!reduce && !spinning ? { transform: "rotateX(72deg) rotateZ(24deg)" } : undefined}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute h-[200px] w-[200px] rounded-full border border-teal-400/25"
            style={{ transform: "rotateX(68deg) rotateY(28deg)" }}
          />

          {/* Interactive Pointer Tilt Wrapper */}
          <motion.div
            style={
              reduce
                ? { transformStyle: "preserve-3d" }
                : {
                    rotateX: springX,
                    rotateY: springY,
                    transformStyle: "preserve-3d",
                  }
            }
            className="preserve-3d relative flex h-[168px] w-[168px] items-center justify-center"
          >
            {/* Continuous 3D Cube Spin */}
            <div
              className={
                "preserve-3d relative h-[168px] w-[168px] " +
                (!reduce && spinning ? "animate-cube-spin" : "")
              }
              style={
                reduce || !spinning
                  ? { transform: "rotateX(-18deg) rotateY(-32deg)" }
                  : undefined
              }
            >
              {/* Inner glowing checksum core visible when exploded */}
              <div
                className="preserve-3d absolute inset-10 flex flex-col items-center justify-center rounded-2xl border border-indigo-400/60 bg-indigo-600/30 text-center shadow-[0_0_32px_rgba(99,102,241,0.45)] backdrop-blur-sm"
                style={{ transform: "translateZ(0px)" }}
              >
                <span className="font-mono text-[10px] font-semibold text-indigo-200">
                  CORE SEAL
                </span>
                <span className="mt-0.5 font-mono text-xs font-bold text-white">
                  9f2c…e41a
                </span>
              </div>

              {/* 6 True 3D Cube Faces */}
              {CUBE_FACES.map((face) => (
                <div
                  key={face.id}
                  className={`absolute inset-0 flex flex-col justify-between rounded-2xl border bg-gradient-to-br p-3.5 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${face.accent} ${face.border}`}
                  style={{
                    transform: face.transform(faceDistance),
                    backgroundColor: "var(--surface-card)",
                    backfaceVisibility: "visible",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`h-2 w-2 rounded-full ${face.dot}`} />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-frost-500">
                      {face.id}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-frost-100">
                      {face.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-frost-400">{face.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Vivid 3-stage pipeline summary */}
        <div
          className="grid grid-cols-3 gap-2 border-t pt-4 text-center"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 px-2 py-2">
            <p className="font-mono text-[10px] text-orange-600 dark:text-orange-300">
              Source
            </p>
            <p className="text-xs font-semibold text-frost-100">Notion</p>
          </div>
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-2 py-2">
            <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-300">
              Package
            </p>
            <p className="text-xs font-semibold text-frost-100">.portad</p>
          </div>
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-2 py-2">
            <p className="font-mono text-[10px] text-emerald-600 dark:text-emerald-300">
              Target
            </p>
            <p className="text-xs font-semibold text-frost-100">Huly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
