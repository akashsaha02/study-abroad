"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className, maxTilt = 4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    return !prefersReduced && !isTouch;
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(800px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`,
    });
  }

  function handleLeave() {
    setStyle({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg)" });
  }

  return (
    <div
      ref={ref}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
