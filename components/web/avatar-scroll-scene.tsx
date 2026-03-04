"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import avatarImage from "@/images/ajmsd.png";
import { usePhoneMotionPolicy } from "@/components/web/use-phone-motion-policy";

type AvatarScrollSceneProps = {
  className?: string;
  fullHeight?: boolean;
  showCaption?: boolean;
};

const SCROLL_RANGE_PX = 680;
const SEATED_THRESHOLD = 0.58;
const WAVE_VISIBILITY_SCROLL_PX = 24;

export function AvatarScrollScene({
  className,
  fullHeight = false,
  showCaption = true
}: AvatarScrollSceneProps) {
  const [progress, setProgress] = useState(0);
  const [showWaveVideo, setShowWaveVideo] = useState(true);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const isPhone = usePhoneMotionPolicy();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let rafId = 0;

    const updateProgress = () => {
      const currentScrollY = window.scrollY;
      const rawProgress = clamp(currentScrollY / SCROLL_RANGE_PX, 0, 1);
      const nextProgress = isPhone ? 0 : rawProgress;

      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.01 ? prev : nextProgress));
      setShowWaveVideo(currentScrollY <= WAVE_VISIBILITY_SCROLL_PX);
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
  }, [isPhone]);

  const isSeated = !isPhone && progress >= SEATED_THRESHOLD;
  const imageTransform = useMemo(() => {
    if (isPhone) {
      return "translate3d(0px, 0px, 0) scale(1) rotate(0deg)";
    }

    const eased = 1 - Math.pow(1 - progress, 2);
    const x = fullHeight ? lerp(26, -24, eased) : lerp(38, -44, eased);
    const y = fullHeight ? lerp(10, -8, eased) : lerp(8, -6, eased);
    const scale = fullHeight ? lerp(1.08, 0.96, eased) : lerp(1.02, 0.92, eased);
    const rotate = fullHeight ? lerp(2, -3.5, eased) : lerp(5, -7, eased);
    return `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(1)}deg)`;
  }, [fullHeight, isPhone, progress]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className={`relative overflow-hidden bg-[#26150c]/80 ${
          fullHeight ? "h-full min-h-[46svh] lg:min-h-[54svh]" : "h-52 rounded-2xl border border-[var(--web-border-soft)]"
        }`}
      >
        <div
          className={`absolute inset-0 flex justify-center ${fullHeight ? "items-center" : "items-end"} ${
            isPhone ? "" : "transition-transform duration-300 ease-out"
          }`}
          style={{ transform: imageTransform }}
        >
          {showWaveVideo && !videoUnavailable ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/waving-poster.jpg"
              onError={() => setVideoUnavailable(true)}
              className={`object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
                fullHeight ? "h-[98%] w-auto max-h-none max-w-none sm:h-[102%]" : "h-auto w-auto max-h-[220px] max-w-[250px]"
              }`}
              aria-label="Waving avatar animation"
            >
              <source src="/media/waving.webm" type="video/webm" />
              <source src="/media/waving.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              src={avatarImage}
              alt="Aman avatar"
              width={fullHeight ? 533 : 270}
              height={fullHeight ? 468 : 238}
              priority
              className={`object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
                fullHeight ? "h-[98%] w-auto max-h-none max-w-none sm:h-[102%]" : "h-auto w-auto max-h-[220px] max-w-[250px]"
              } ${
                isSeated ? "opacity-92 saturate-90" : "opacity-100"
              }`}
            />
          )}
        </div>
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

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
