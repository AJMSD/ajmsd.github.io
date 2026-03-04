"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import avatarImage from "@/images/ajmsd.png";

type AvatarScrollSceneProps = {
  className?: string;
  fullHeight?: boolean;
  showCaption?: boolean;
};

const SCROLL_RANGE_PX = 560;
const SEATED_THRESHOLD = 0.58;

export function AvatarScrollScene({
  className,
  fullHeight = false,
  showCaption = true
}: AvatarScrollSceneProps) {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let rafId = 0;

    const updateProgress = () => {
      const rawProgress = clamp(window.scrollY / SCROLL_RANGE_PX, 0, 1);
      const nextProgress = reducedMotion
        ? rawProgress >= SEATED_THRESHOLD
          ? 1
          : 0
        : rawProgress;

      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.01 ? prev : nextProgress));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId !== 0) {
        return;
      }
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [reducedMotion]);

  const isSeated = progress >= SEATED_THRESHOLD;
  const imageTransform = useMemo(() => {
    const x = fullHeight ? 18 - 36 * progress : 54 - 108 * progress;
    const scale = fullHeight ? 1.32 - 0.24 * progress : 1 - 0.08 * progress;
    const rotate = fullHeight ? 4 - 6 * progress : 8 - 12 * progress;
    return `translateX(${x.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(1)}deg)`;
  }, [fullHeight, progress]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className={`relative overflow-hidden bg-[#26150c]/80 ${
          fullHeight ? "h-full min-h-[52svh] lg:min-h-[56svh]" : "h-52 rounded-2xl border border-[var(--web-border-soft)]"
        }`}
      >
        <div
          className={`absolute inset-0 flex justify-center transition-transform duration-300 ease-out ${
            fullHeight ? "items-center" : "items-end"
          }`}
          style={{ transform: imageTransform }}
        >
          <Image
            src={avatarImage}
            alt="Aman avatar"
            width={fullHeight ? 620 : 270}
            height={fullHeight ? 580 : 238}
            priority
            className={`object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
              fullHeight ? "h-[112%] w-auto max-h-none max-w-none" : "h-auto w-auto max-h-[220px] max-w-[250px]"
            } ${
              isSeated ? "opacity-90 saturate-75" : "opacity-100"
            }`}
          />
        </div>

        {isSeated ? (
          <div className="absolute bottom-3 left-1/2 w-[78%] -translate-x-1/2 rounded-lg border border-[var(--web-border-soft)] bg-[#2f1b10]/85 px-3 py-2">
            <div className="mb-1 h-1.5 w-full rounded-full bg-[var(--web-accent-soft)]" />
            <p
              className="text-[11px] uppercase tracking-[0.14em] text-[var(--web-accent-strong)]"
              style={{ fontFamily: "var(--font-web-mono)" }}
            >
              typing...
            </p>
          </div>
        ) : null}
      </div>

      {showCaption ? (
        <p
          className="mt-2 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--web-text-faint)]"
          style={{ fontFamily: "var(--font-web-mono)" }}
        >
          {isSeated ? "Seated typing state" : "Scroll to transition avatar"}
        </p>
      ) : null}
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
