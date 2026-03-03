"use client";

import { useState } from "react";
import { EducationTab } from "@/components/web/tabs/education-tab";
import { ResearchTab } from "@/components/web/tabs/research-tab";
import { WorkTab } from "@/components/web/tabs/work-tab";
import { SectionHeading } from "@/components/web/section-heading";
import { EducationRecord, ProjectRecord, WorkRecord } from "@/components/web/types";

type TabId = "work" | "research" | "education";

type TabsSectionProps = {
  work: WorkRecord[];
  research: ProjectRecord[];
  education: EducationRecord[];
};

const tabConfig: Array<{ id: TabId; label: string }> = [
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" }
];

export function TabsSection({ work, research, education }: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("work");

  return (
    <section
      id="experience"
      className="min-h-[100svh] space-y-5 border-b border-[var(--web-border-soft)] px-4 py-14 sm:px-6 lg:px-10 lg:py-16"
    >
      <SectionHeading
        eyebrow="Experience"
        title="IDE-Style Tabs"
        description="Work, research, and education records are grouped into tabbed panels. Resume download is wired through /api/resume."
      />

      <div className="rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--web-border-soft)] pb-3">
          <div className="flex flex-wrap gap-2">
            {tabConfig.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-[var(--web-border-strong)] bg-[var(--web-accent-soft)] text-[var(--web-accent-strong)]"
                      : "border-[var(--web-border-soft)] bg-black/10 text-[var(--web-text-subtle)] hover:border-[var(--web-border-strong)] hover:text-[var(--web-text)]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <a
            href="/api/resume"
            download
            className="rounded-md border border-[var(--web-border-strong)] bg-[var(--web-accent-soft)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--web-accent-strong)] transition hover:border-[var(--web-accent)] hover:bg-[rgba(255,148,72,0.24)]"
          >
            Download Resume
          </a>
        </div>

        {activeTab === "work" ? <WorkTab records={work} /> : null}
        {activeTab === "research" ? <ResearchTab records={research} /> : null}
        {activeTab === "education" ? <EducationTab records={education} /> : null}
      </div>
    </section>
  );
}
