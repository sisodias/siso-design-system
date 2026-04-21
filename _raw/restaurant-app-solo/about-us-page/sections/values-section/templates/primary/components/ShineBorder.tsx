"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

/**
 * ShineBorder — animated border wrapper used for feature/values sections.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  // Use brand accent by default; falls back to current color var
  color = "var(--color-accent, #D4AF37)",
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={{
        ["--border-radius" as any]: `${borderRadius}px`,
      }}
      className={cn(
        "relative grid h-full w-full place-items-center rounded-3xl p-3",
        // Match tenant theme instead of forcing white/black
        "bg-background text-foreground border border-border",
        className,
      )}
    >
      <style>
        {`@keyframes shine-pulse { 0%{background-position:0% 0%} 50%{background-position:100% 100%} 100%{background-position:0% 0%} }`}
      </style>
      <div
        style={{
          ["--border-width" as any]: `${borderWidth}px`,
          ["--border-radius" as any]: `${borderRadius}px`,
          ["--shine-pulse-duration" as any]: `${duration}s`,
          ["--mask-linear-gradient" as any]: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          ["--background-radial-gradient" as any]: `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(",") : color},transparent,transparent)`,
        }}
        className="before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-3xl before:p-[--border-width] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:![mask-composite:exclude] before:[mask:--mask-linear-gradient] motion-safe:before:[animation:shine-pulse_var(--shine-pulse-duration)_infinite_linear]"
      />
      {children}
    </div>
  );
}
