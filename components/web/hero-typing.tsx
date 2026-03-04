"use client";

import { useEffect, useState } from "react";

type HeroTypingProps = {
  text: string;
  className?: string;
  startDelayMs?: number;
  as?: "p" | "h1";
};

const TYPING_DELAY_MS = 800;
const TYPING_INTERVAL_MS = 90;

export function HeroTyping({ text, className, startDelayMs, as = "p" }: HeroTypingProps) {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const Component = as;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setTypedText("");
    setIsTyping(false);

    let index = 0;
    let intervalId: number | null = null;

    const startId = window.setTimeout(() => {
      setIsTyping(true);
      intervalId = window.setInterval(() => {
        index += 1;
        setTypedText(text.slice(0, index));

        if (index >= text.length) {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
          }
          setIsTyping(false);
        }
      }, TYPING_INTERVAL_MS);
    }, startDelayMs ?? TYPING_DELAY_MS);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [startDelayMs, text]);

  return (
    <Component className={className}>
      <span>{typedText}</span>
      {isTyping ? (
        <span
          className="ml-1 inline-block h-[1.15em] w-[2px] animate-pulse align-middle bg-[var(--web-accent-strong)]"
          aria-hidden
        />
      ) : null}
    </Component>
  );
}
