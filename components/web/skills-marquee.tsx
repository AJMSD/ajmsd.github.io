import { SectionHeading } from "@/components/web/section-heading";

type SkillsMarqueeProps = {
  skillsGrouped: Record<string, string[]>;
};

export function SkillsMarquee({ skillsGrouped }: SkillsMarqueeProps) {
  const categories = Object.entries(skillsGrouped);

  return (
    <section
      id="skills"
      className="space-y-5 rounded-3xl border border-[var(--web-border-soft)] bg-[var(--web-panel)] p-6 backdrop-blur sm:p-8"
    >
      <SectionHeading
        eyebrow="Skills"
        title="Stack Snapshot"
        description="Skill groups are pulled from canonical content and rendered as horizontally scrollable lanes."
      />

      <div className="grid gap-3">
        {categories.map(([category, skills]) => (
          <article
            key={category}
            className="rounded-xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-3"
          >
            <p className="mb-2 text-xs uppercase tracking-[0.13em] text-[var(--web-accent-strong)]">
              {category}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="whitespace-nowrap rounded-full border border-[var(--web-border-soft)] bg-black/10 px-3 py-1 text-xs text-[var(--web-text-muted)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
