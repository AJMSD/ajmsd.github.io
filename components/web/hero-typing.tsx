"use client";

import { useEffect, useRef, useState } from "react";

type HeroTypingProps = {
  text: string;
  className?: string;
  startDelayMs?: number;
  as?: "p" | "h1";
  isActive?: boolean;
  isComplete?: boolean;
  typingIntervalMs?: number;
  onComplete?: () => void;
};

const TYPING_INTERVAL_MS = 90;

export function HeroTyping({
  text,
  className,
  startDelayMs = 0,
  as = "p",
  isActive = true,
  isComplete = false,
  typingIntervalMs = TYPING_INTERVAL_MS,
  onComplete
}: HeroTypingProps) {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const completionSentRef = useRef(false);
  const Component = as;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isComplete) {
      setTypedText(text);
      setIsTyping(false);
      completionSentRef.current = true;
      return;
    }

    if (!isActive) {
      setTypedText("");
      setIsTyping(false);
      completionSentRef.current = false;
      return;
    }

    setTypedText("");
    setIsTyping(false);
    completionSentRef.current = false;

    let index = 0;
    let intervalId: number | null = null;

    const startId = window.setTimeout(() => {
      if (text.length === 0) {
        if (!completionSentRef.current) {
          completionSentRef.current = true;
          onComplete?.();
        }
        return;
      }

      setIsTyping(true);
      intervalId = window.setInterval(() => {
        index += 1;
        setTypedText(text.slice(0, index));

        if (index >= text.length) {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
          }
          setIsTyping(false);
          if (!completionSentRef.current) {
            completionSentRef.current = true;
            onComplete?.();
          }
        }
      }, typingIntervalMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [isActive, isComplete, onComplete, startDelayMs, text, typingIntervalMs]);

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
