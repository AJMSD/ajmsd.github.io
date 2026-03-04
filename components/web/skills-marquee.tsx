"use client";

import { SectionHeading } from "@/components/web/section-heading";
import { usePhoneMotionPolicy } from "@/components/web/use-phone-motion-policy";

type SkillsMarqueeProps = {
  skillsGrouped: Record<string, string[]>;
};

export function SkillsMarquee({ skillsGrouped }: SkillsMarqueeProps) {
  const isPhone = usePhoneMotionPolicy();
  const categories = Object.entries(skillsGrouped);

  return (
    <section
      id="skills"
      className="min-h-[100svh] space-y-5 px-4 py-14 sm:px-6 lg:px-10 lg:py-16"
    >
      <SectionHeading
        eyebrow="Skills"
        title="Stack Snapshot"
        description="Skill groups animate on desktop/tablet and stay static on mobile."
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
            {isPhone ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="whitespace-nowrap rounded-full border border-[var(--web-border-soft)] bg-black/10 px-3 py-1 text-xs text-[var(--web-text-muted)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden pb-1">
                <div
                  className="web-marquee-track flex w-max gap-2 pr-2 hover:[animation-play-state:paused]"
                  style={{ "--web-marquee-duration": `${Math.max(16, skills.length * 2.8)}s` } as Record<string, string>}
                >
                  {[...skills, ...skills].map((skill, index) => (
                    <span
                      key={`${category}-${skill}-${index}`}
                      className="whitespace-nowrap rounded-full border border-[var(--web-border-soft)] bg-black/10 px-3 py-1 text-xs text-[var(--web-text-muted)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
