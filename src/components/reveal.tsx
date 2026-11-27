"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Reveal({
  children,
  delay = 0,
  y = 26,
  duration = 0.65,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      reduceMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      element.style.opacity = "1";
      element.style.transform = "perspective(900px) translateY(0) rotateX(0deg)";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 70px 0px" }
    );

    observer.observe(element);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        element.style.opacity = "1";
        element.style.transform = "perspective(900px) translateY(0) rotateX(0deg)";
        element.style.transition = "none";
        observer.disconnect();
      }
    };

    reduceMotion.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "perspective(900px) translateY(0) rotateX(0deg) scale(1)"
          : `perspective(900px) translateY(${y}px) rotateX(8deg) scale(0.985)`,
        transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
