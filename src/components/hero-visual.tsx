"use client";

import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const ARCHIVE_LAYERS = [
  {
    file: "checksums.txt",
    role: "SHA-256 verification seal",
    meta: "sha256:9f2c…e41a",
    status: "Verified",
    zOffset: 54,
    accent: true,
  },
  {
    file: "entities/",
    role: "Notion → Huly neutral records",
    meta: "1,284 records",
    status: "Mapped",
    zOffset: 36,
    accent: false,
  },
  {
    file: "attachments/",
    role: "Path-contained binary assets",
    meta: "12 files · 84.2 MB",
    status: "Verified",
    zOffset: 18,
    accent: false,
  },
  {
    file: "manifest.json",
    role: "Spec 0.1 schema & checkpoint",
    meta: "checkpoint 4/6",
    status: "Resumable",
    zOffset: 0,
    accent: false,
  },
];

const TILT_SPRING = { stiffness: 220, damping: 24, mass: 0.7 };
const LAYER_TRANSITION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

export default function HeroVisual() {
  const reduce = useReducedMotion();
  const [exploded, setExploded] = useState(true);

  const rotateX = useMotionValue(reduce ? 0 : 7);
  const rotateY = useMotionValue(reduce ? 0 : -9);
  const springX = useSpring(rotateX, TILT_SPRING);
  const springY = useSpring(rotateY, TILT_SPRING);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(7 - py * 12);
    rotateY.set(-9 + px * 14);
  }

  function handlePointerLeave() {
    rotateX.set(reduce ? 0 : 7);
    rotateY.set(reduce ? 0 : -9);
  }

  return (
    <div
      className="perspective-stage w-full max-w-[440px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        style={
          reduce
            ? undefined
            : {
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
              }
        }
        className="glass-strong hairline relative w-full rounded-2xl p-6"
      >
        {/* Top instrument header */}
        <div
          className="flex items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <div className="min-w-0">
            <p className="font-mono text-xs text-frost-500">notion.portad · spec 0.1</p>
            <p className="mt-0.5 text-sm font-medium text-frost-100">
              Notion → Huly package
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExploded((prev) => !prev)}
            className="shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-xs text-frost-300 transition-colors hover:text-frost-100"
            style={{
              borderColor: "var(--border-hairline-strong)",
              backgroundColor: "var(--surface-raised)",
            }}
          >
            {exploded ? "Collapse 3D" : "Inspect 3D layers"}
          </button>
        </div>

        {/* 3D Stacked Archive Layers */}
        <div className="preserve-3d relative my-5 space-y-2.5">
          {ARCHIVE_LAYERS.map((layer, index) => (
            <motion.div
              key={layer.file}
              animate={
                reduce
                  ? undefined
                  : {
                      z: exploded ? layer.zOffset : 0,
                      y: exploded ? index * -2 : 0,
                      scale: exploded ? 1 + (3 - index) * 0.008 : 1,
                    }
              }
              transition={LAYER_TRANSITION}
              className="preserve-3d flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-colors"
              style={{
                borderColor: layer.accent
                  ? "rgba(59, 130, 246, 0.35)"
                  : "var(--border-hairline)",
                backgroundColor: layer.accent
                  ? "rgba(37, 99, 235, 0.08)"
                  : "var(--surface-raised)",
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={
                      "h-1.5 w-1.5 rounded-full " +
                      (layer.accent ? "bg-brand-500" : "bg-emerald-500")
                    }
                  />
                  <span className="truncate font-mono text-xs font-medium text-frost-100">
                    {layer.file}
                  </span>
                </div>
                <p className="mt-0.5 truncate pl-3.5 text-xs text-frost-500">
                  {layer.role}
                </p>
              </div>
              <div className="shrink-0 text-right font-mono tabular-nums">
                <span className="block text-xs text-frost-200">{layer.meta}</span>
                <span
                  className={
                    "block text-[11px] " +
                    (layer.accent
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-emerald-600 dark:text-emerald-400")
                  }
                >
                  {layer.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pipeline verification footer */}
        <div
          className="space-y-2.5 border-t pt-4"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <div className="flex items-center justify-between text-xs tabular-nums">
            <span className="text-frost-500">Validation · 5 layers</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
              5/5 passed
            </span>
          </div>
          <div className="flex items-center justify-between text-xs tabular-nums">
            <span className="text-frost-500">Round-trip diff</span>
            <span className="font-mono font-medium text-brand-600 dark:text-brand-400">
              0 silent drops
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--surface-raised)" }}
          >
            <motion.div
              className="h-full rounded-full bg-brand-600 dark:bg-brand-500"
              initial={{ width: "68%" }}
              animate={{ width: exploded ? "100%" : "68%" }}
              transition={LAYER_TRANSITION}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
