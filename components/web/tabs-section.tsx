"use client";

import { useMemo, useState } from "react";
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

  const tabCounts = useMemo(
    () => ({
      work: work.length,
      research: research.length,
      education: education.length
    }),
    [education.length, research.length, work.length]
  );

  return (
    <section
      id="experience"
      className="space-y-5 rounded-3xl border border-white/10 bg-[#06243a]/80 p-6 backdrop-blur sm:p-8"
    >
      <SectionHeading
        eyebrow="Experience"
        title="IDE-Style Tabs"
        description="Work, research, and education records are grouped into tabbed panels. Resume download is wired through /api/resume."
      />

      <div className="rounded-2xl border border-white/10 bg-[#051a2b]/75 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
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
                      ? "border-cyan-200/55 bg-cyan-200/12 text-cyan-50"
                      : "border-white/10 bg-white/5 text-[#b6c9d9] hover:border-white/30 hover:text-[#dff0ff]"
                  }`}
                >
                  {tab.label} ({tabCounts[tab.id]})
                </button>
              );
            })}
          </div>

          <a
            href="/api/resume"
            download
            className="rounded-md border border-emerald-300/45 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-emerald-100 transition hover:border-emerald-200/70 hover:bg-emerald-300/20"
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
