"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectRecord } from "@/components/web/types";

type ProjectModalProps = {
  project: ProjectRecord;
  onClose: () => void;
};

const DEFAULT_HIGHLIGHT_COUNT = 4;
const DESCRIPTION_MORE_THRESHOLD = 220;

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const shouldShowMore = useMemo(() => {
    return (
      project.description.length > DESCRIPTION_MORE_THRESHOLD ||
      project.highlights.length > DEFAULT_HIGHLIGHT_COUNT
    );
  }, [project.description.length, project.highlights.length]);

  const visibleHighlights = isExpanded
    ? project.highlights
    : project.highlights.slice(0, DEFAULT_HIGHLIGHT_COUNT);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-[2px]"
      role="dialog"
      aria-modal
      aria-labelledby={`project-modal-title-${project.id}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-center">
        <article className="w-full overflow-hidden rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-strong)] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <header className="flex items-start justify-between gap-3 border-b border-[var(--web-border-soft)] px-5 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--web-accent-strong)]">
                Priority {project.priority}
              </p>
              <h3
                id={`project-modal-title-${project.id}`}
                className="mt-1 text-xl font-semibold text-[var(--web-text)]"
              >
                {project.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[var(--web-border-soft)] px-2.5 py-1 text-xs text-[var(--web-text)] transition hover:border-[var(--web-border-strong)]"
            >
              Close
            </button>
          </header>

          <div className="max-h-[min(72svh,620px)] overflow-y-auto px-5 py-4">
            <p
              className={`text-sm leading-6 text-[var(--web-text-muted)] ${
                isExpanded
                  ? ""
                  : "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]"
              }`}
            >
              {project.description}
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.13em] text-[var(--web-accent-strong)]">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--web-border-soft)] bg-black/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-[var(--web-text-subtle)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-[var(--web-text-subtle)]">
              {visibleHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            {project.links.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.links.map((link) => (
                  <a
                    key={`${link.type}-${link.url}`}
                    href={link.url}
                    className="rounded-md border border-[var(--web-border-soft)] px-3 py-1.5 text-xs uppercase tracking-[0.11em] text-[var(--web-text)] transition hover:border-[var(--web-border-strong)] hover:bg-[var(--web-accent-soft)] hover:text-[var(--web-accent-strong)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}

            {shouldShowMore ? (
              <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                className="mt-4 rounded-md border border-[var(--web-border-soft)] px-3 py-1.5 text-xs uppercase tracking-[0.11em] text-[var(--web-text)] transition hover:border-[var(--web-border-strong)] hover:text-[var(--web-accent-strong)]"
              >
                {isExpanded ? "Less" : "More"}
              </button>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}
