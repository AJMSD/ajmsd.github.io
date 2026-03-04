"use client";

import { useMemo, useState } from "react";
import { ProjectModal } from "@/components/web/project-modal";
import { SectionHeading } from "@/components/web/section-heading";
import { ProjectRecord } from "@/components/web/types";

type ProjectsGridProps = {
  projects: ProjectRecord[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categoryTagOptions = useMemo(() => {
    return Array.from(
      new Set(projects.flatMap((project) => project.category_tags.map((tag) => tag.trim())))
    ).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const techTagOptions = useMemo(() => {
    return Array.from(
      new Set(projects.flatMap((project) => project.tech_stack.map((tag) => tag.trim())))
    ).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const visibleProjects = useMemo(() => {
    if (selectedTags.length === 0) {
      return projects;
    }

    const normalizedSelectedTags = new Set(selectedTags.map((tag) => tag.toLowerCase()));
    return projects.filter((project) => {
      const combinedTags = [...project.category_tags, ...project.tech_stack];
      return combinedTags.some((tag) => normalizedSelectedTags.has(tag.toLowerCase()));
    });
  }, [projects, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((existingTag) => existingTag !== tag) : [...prev, tag]
    );
  };

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

      <div className="space-y-3 rounded-xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-[0.13em] text-[var(--web-accent-strong)]">
            Category Filters
          </p>
          {categoryTagOptions.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={`category-${tag}`}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={selected}
                className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] transition ${
                  selected
                    ? "border-[var(--web-border-strong)] bg-[var(--web-accent-soft)] text-[var(--web-accent-strong)]"
                    : "border-[var(--web-border-soft)] bg-black/10 text-[var(--web-text-subtle)] hover:border-[var(--web-border-strong)]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-[0.13em] text-[var(--web-accent-strong)]">
            Tech Filters
          </p>
          {techTagOptions.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={`tech-${tag}`}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={selected}
                className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] transition ${
                  selected
                    ? "border-[var(--web-border-strong)] bg-[var(--web-accent-soft)] text-[var(--web-accent-strong)]"
                    : "border-[var(--web-border-soft)] bg-black/10 text-[var(--web-text-subtle)] hover:border-[var(--web-border-strong)]"
                }`}
              >
                {tag}
              </button>
            );
          })}
          {selectedTags.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedTags([])}
              className="rounded-full border border-[var(--web-border-soft)] px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-[var(--web-text-muted)] transition hover:border-[var(--web-border-strong)] hover:text-[var(--web-accent-strong)]"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      </div>

      {visibleProjects.length === 0 ? (
        <p className="rounded-xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] px-4 py-3 text-sm text-[var(--web-text-muted)]">
          No projects match the selected filters.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleProjects.map((project) => (
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
        <ProjectModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />
      ) : null}
    </section>
  );
}
