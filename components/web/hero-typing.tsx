"use client";

import { useEffect, useState } from "react";
import { getBooleanFlag, setBooleanFlag } from "@/lib/client/storage";

type HeroTypingProps = {
  text: string;
  storageKey: string;
  className?: string;
};

const TYPING_DELAY_MS = 200;
const TYPING_INTERVAL_MS = 32;

export function HeroTyping({ text, storageKey, className }: HeroTypingProps) {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasSeenTyping = getBooleanFlag(storageKey);
    if (hasSeenTyping || mediaQuery.matches) {
      setTypedText(text);
      setBooleanFlag(storageKey, true);
      setIsTyping(false);
      return;
    }

    setTypedText("");
    setIsTyping(true);

    let index = 0;
    let intervalId: number | null = null;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setTypedText(text.slice(0, index));

        if (index >= text.length) {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
          }
          setBooleanFlag(storageKey, true);
          setIsTyping(false);
        }
      }, TYPING_INTERVAL_MS);
    }, TYPING_DELAY_MS);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [storageKey, text]);

  return (
    <p className={className}>
      <span>{typedText}</span>
      {isTyping ? (
        <span
          className="ml-1 inline-block h-[1.15em] w-[2px] animate-pulse align-middle bg-[var(--web-accent-strong)]"
          aria-hidden
        />
      ) : null}
    </p>
  );
}
