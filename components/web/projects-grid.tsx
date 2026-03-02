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
      className="space-y-5 rounded-3xl border border-white/10 bg-[#06243a]/80 p-6 backdrop-blur sm:p-8"
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
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#051728]/80 p-4"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-100/80">
              Priority {project.priority}
            </p>
            <h3 className="mt-2 text-lg font-medium text-[#fff8ea]">{project.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#b7c7d6]">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.category_tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[#c7d7e5]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(project.id)}
              className="mt-auto rounded-lg border border-cyan-200/40 bg-cyan-200/10 px-3 py-2 text-xs uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/75 hover:bg-cyan-200/20"
            >
              View Details
            </button>
          </article>
        ))}
      </div>

      {selectedProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#031220] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-[#fff8ea]">{selectedProject.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="rounded-md border border-white/15 px-2 py-1 text-xs text-[#d7e5f2] hover:border-white/35"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#bdd0e0]">{selectedProject.description}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#9fb6c9]">
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
