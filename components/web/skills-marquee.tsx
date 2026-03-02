import { SectionHeading } from "@/components/web/section-heading";

type SkillsMarqueeProps = {
  skillsGrouped: Record<string, string[]>;
};

export function SkillsMarquee({ skillsGrouped }: SkillsMarqueeProps) {
  const categories = Object.entries(skillsGrouped);

  return (
    <section
      id="skills"
      className="space-y-5 rounded-3xl border border-white/10 bg-[#06243a]/80 p-6 backdrop-blur sm:p-8"
    >
      <SectionHeading
        eyebrow="Skills"
        title="Stack Snapshot"
        description="Skill groups are pulled from canonical content and rendered as horizontally scrollable lanes."
      />

      <div className="grid gap-3">
        {categories.map(([category, skills]) => (
          <article key={category} className="rounded-xl border border-white/10 bg-[#051728]/75 p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.13em] text-cyan-100/85">{category}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-[#d8e4ef]"
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
