"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AvatarScrollScene } from "@/components/web/avatar-scroll-scene";
import { HeroTyping } from "@/components/web/hero-typing";
import { LorCarousel } from "@/components/web/lor-carousel";
import { getSocialIcon } from "@/components/web/social-icons";
import { AboutContent, LinkItem, LorQuote } from "@/components/web/types";
import { usePhoneMotionPolicy } from "@/components/web/use-phone-motion-policy";

type HeroSectionProps = {
  about: AboutContent;
  workCount: number;
  projectCount: number;
  educationCount: number;
  socialLinks: LinkItem[];
  lors: LorQuote[];
};

const heroStats = [
  { label: "Work Entries", key: "work" },
  { label: "Projects", key: "projects" },
  { label: "Education", key: "education" }
] as const;

export function HeroSection({
  about,
  workCount,
  projectCount,
  educationCount,
  socialLinks,
  lors
}: HeroSectionProps) {
  const greetingText = "Hi! Welcome to my portfolio.";
  const headingText = "Aman Jain";
  const typingIntervalMs = 90;
  const typingStartDelayMs = 140;
  const linePauseMs = 220;
  const lineCount = 4;
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const pauseTimeoutRef = useRef<number | null>(null);
  const isPhone = usePhoneMotionPolicy();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (pauseTimeoutRef.current !== null) {
      window.clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    if (isPhone) {
      setActiveLineIndex(lineCount);
      return;
    }

    setActiveLineIndex(-1);

    const timeoutId = window.setTimeout(() => {
      setActiveLineIndex(0);
    }, typingStartDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isPhone, lineCount, typingStartDelayMs]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const handleLineComplete = useCallback(
    (lineIndex: number) => {
      if (isPhone || lineIndex !== activeLineIndex || typeof window === "undefined") {
        return;
      }

      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
      }

      pauseTimeoutRef.current = window.setTimeout(() => {
        setActiveLineIndex((prev) => {
          if (prev !== lineIndex) {
            return prev;
          }
          return Math.min(lineCount, lineIndex + 1);
        });
      }, linePauseMs);
    },
    [activeLineIndex, isPhone, lineCount, linePauseMs]
  );

  const statValues: Record<(typeof heroStats)[number]["key"], number> = {
    work: workCount,
    projects: projectCount,
    education: educationCount
  };

  return (
    <section
      id="hero"
      className="grid min-h-[calc(100svh-6.5rem)] items-stretch gap-5 px-4 pb-8 pt-6 sm:gap-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-10 lg:pt-8"
    >
      <div className="flex h-full min-h-[46svh] flex-col gap-5 lg:min-h-[54svh]">
        <div className="space-y-6">
          <div className="space-y-2.5">
            {isPhone ? (
              <>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--web-accent-strong)] sm:text-sm">
                  {greetingText}
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-[var(--web-text)] sm:text-5xl">
                  {headingText}
                </h1>
                <p className="text-base leading-7 text-[var(--web-text-muted)] sm:text-lg">
                  {about.professional}
                </p>
                <p className="text-sm leading-7 text-[var(--web-text-subtle)] sm:text-base">
                  {about.casual}
                </p>
              </>
            ) : (
              <>
                <HeroTyping
                  text={greetingText}
                  isActive={activeLineIndex === 0}
                  isComplete={activeLineIndex > 0}
                  typingIntervalMs={typingIntervalMs}
                  onComplete={() => handleLineComplete(0)}
                  className="text-xs uppercase tracking-[0.16em] text-[var(--web-accent-strong)] sm:text-sm"
                />
                <HeroTyping
                  as="h1"
                  text={headingText}
                  isActive={activeLineIndex === 1}
                  isComplete={activeLineIndex > 1}
                  typingIntervalMs={typingIntervalMs}
                  onComplete={() => handleLineComplete(1)}
                  className="text-4xl font-semibold tracking-tight text-[var(--web-text)] sm:text-5xl"
                />
                <HeroTyping
                  text={about.professional}
                  isActive={activeLineIndex === 2}
                  isComplete={activeLineIndex > 2}
                  typingIntervalMs={typingIntervalMs}
                  onComplete={() => handleLineComplete(2)}
                  className="text-base leading-7 text-[var(--web-text-muted)] sm:text-lg"
                />
                <HeroTyping
                  text={about.casual}
                  isActive={activeLineIndex === 3}
                  isComplete={activeLineIndex > 3}
                  typingIntervalMs={typingIntervalMs}
                  onComplete={() => handleLineComplete(3)}
                  className="text-sm leading-7 text-[var(--web-text-subtle)] sm:text-base"
                />
              </>
            )}
          </div>

          <LorCarousel lors={lors} />

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {socialLinks.map((link) => {
              const icon = getSocialIcon(link.label);
              if (icon) {
                return (
                  <a
                    key={`${link.type}-${link.url}`}
                    href={link.url}
                    aria-label={link.label}
                    title={link.label}
                    className="inline-flex items-center justify-center p-1 text-3xl text-[var(--web-text)] transition hover:text-[var(--web-accent-strong)]"
                  >
                    <FontAwesomeIcon icon={icon} />
                    <span className="sr-only">{link.label}</span>
                  </a>
                );
              }

              return (
                <a
                  key={`${link.type}-${link.url}`}
                  href={link.url}
                  className="rounded-full border border-[var(--web-border-soft)] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[var(--web-text)] transition hover:border-[var(--web-border-strong)] hover:bg-[var(--web-accent-soft)] hover:text-[var(--web-accent-strong)]"
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 sm:gap-3">
          {heroStats.map((stat) => (
            <article
              key={stat.key}
              className="min-w-0 rounded-xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] px-3 py-2 text-center"
            >
              <p className="text-lg font-semibold text-[var(--web-text)] sm:text-xl">
                {statValues[stat.key]}
              </p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--web-text-faint)]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="h-full min-h-[46svh] overflow-hidden rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] lg:min-h-[54svh]">
        <AvatarScrollScene className="h-full" fullHeight showCaption={false} />
      </div>
    </section>
  );
}
