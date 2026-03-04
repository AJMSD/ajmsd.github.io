"use client";

import { useEffect, useMemo, useState } from "react";
import { LorQuote } from "@/components/web/types";
import { usePhoneMotionPolicy } from "@/components/web/use-phone-motion-policy";

type LorCarouselProps = {
  lors: LorQuote[];
  className?: string;
};

type CarouselQuote = {
  id: string;
  quote: string;
  author: string;
  context: string;
  placeholder?: boolean;
};

const CAROUSEL_INTERVAL_MS = 6200;

const PLACEHOLDER_QUOTES: CarouselQuote[] = [
  {
    id: "placeholder-lor-1",
    quote: "[Placeholder] Recommendation content pending owner approval for publication.",
    author: "Reference Pending",
    context: "Placeholder Content",
    placeholder: true
  },
  {
    id: "placeholder-lor-2",
    quote: "[Placeholder] Public testimonial copy will be replaced after explicit permission is granted.",
    author: "Reference Pending",
    context: "Placeholder Content",
    placeholder: true
  },
  {
    id: "placeholder-lor-3",
    quote: "[Placeholder] Draft quote rotation active until approved letters of recommendation are available.",
    author: "Reference Pending",
    context: "Placeholder Content",
    placeholder: true
  }
];

export function LorCarousel({ lors, className }: LorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPhone = usePhoneMotionPolicy();

  const approvedQuotes = useMemo(() => {
    return lors
      .filter((quote) => quote.permission_flag === true)
      .map((quote) => ({
        id: quote.id,
        quote: quote.quote,
        author: quote.author,
        context: quote.context
      }));
  }, [lors]);

  const quotes = approvedQuotes.length > 0 ? approvedQuotes : PLACEHOLDER_QUOTES;
  const isPlaceholderMode = approvedQuotes.length === 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [quotes.length]);

  useEffect(() => {
    if (isPhone || quotes.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % quotes.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPhone, quotes.length]);

  const activeQuote = quotes[activeIndex];

  const stepQuote = (direction: number) => {
    setActiveIndex((prev) => (prev + direction + quotes.length) % quotes.length);
  };

  return (
    <article
      className={`rounded-xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-3 sm:p-4 ${className ?? ""}`}
      aria-label="Letter of recommendation highlights"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--web-accent-strong)]">
          LOR Highlights
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => stepQuote(-1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--web-border-soft)] text-xs text-[var(--web-text)] transition hover:border-[var(--web-border-strong)]"
            aria-label="Previous quote"
          >
            {"<"}
          </button>
          <button
            type="button"
            onClick={() => stepQuote(1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--web-border-soft)] text-xs text-[var(--web-text)] transition hover:border-[var(--web-border-strong)]"
            aria-label="Next quote"
          >
            {">"}
          </button>
        </div>
      </div>

      <blockquote
        className="mt-2 text-sm leading-6 text-[var(--web-text-muted)] transition-opacity duration-300"
        aria-live="polite"
      >
        {activeQuote.quote}
      </blockquote>

      <p className="mt-2 text-xs text-[var(--web-text-subtle)]">
        {activeQuote.author} - {activeQuote.context}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {quotes.map((quote, index) => (
            <span
              key={quote.id}
              className={`h-1.5 w-4 rounded-full ${
                index === activeIndex ? "bg-[var(--web-accent)]" : "bg-[var(--web-border-soft)]"
              }`}
              aria-hidden
            />
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--web-text-faint)]">
          {isPhone ? "Static on mobile" : "Auto-rotate"}
        </p>
      </div>

      {isPlaceholderMode ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[var(--web-text-faint)]">
          Placeholder carousel shown until quote permissions are approved.
        </p>
      ) : null}
    </article>
  );
}
