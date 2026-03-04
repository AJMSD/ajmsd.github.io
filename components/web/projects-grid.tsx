"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/web/section-heading";
import { ProjectRecord } from "@/components/web/types";

type ProjectsGridProps = {
  projects: ProjectRecord[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  return (
    <section
      id="projects"
      className="min-h-[100svh] space-y-5 px-4 py-14 sm:px-6 lg:px-10 lg:py-16"
    >
      <SectionHeading
        eyebrow="Projects"
        title="Grid + Modal Scaffold"
        description="Project cards are data-driven now, with a lightweight details modal to establish interaction flow before filtering and embed support."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex h-full flex-col rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-4"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--web-accent-strong)]">
              Priority {project.priority}
            </p>
            <h3 className="mt-2 text-lg font-medium text-[var(--web-text)]">{project.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--web-text-muted)]">
              {project.description}
            </p>
            <div className="mb-4 mt-3 flex flex-wrap gap-2">
              {project.category_tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--web-border-soft)] bg-black/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[var(--web-text-subtle)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(project.id)}
              className="mt-auto rounded-lg border border-[var(--web-border-strong)] bg-[var(--web-accent-soft)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--web-accent-strong)] transition hover:border-[var(--web-accent)] hover:bg-[rgba(255,148,72,0.24)]"
            >
              View Details
            </button>
          </article>
        ))}
      </div>

      {selectedProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-strong)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-[var(--web-text)]">{selectedProject.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="rounded-md border border-[var(--web-border-soft)] px-2 py-1 text-xs text-[var(--web-text)] hover:border-[var(--web-border-strong)]"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--web-text-muted)]">
              {selectedProject.description}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--web-text-subtle)]">
              {selectedProject.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
