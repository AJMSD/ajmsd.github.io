import { AboutContent, LinkItem } from "@/components/web/types";

type HeroSectionProps = {
  about: AboutContent;
  workCount: number;
  projectCount: number;
  educationCount: number;
  socialLinks: LinkItem[];
};

const heroStats = [
  { label: "Work Entries", key: "work" },
  { label: "Projects", key: "projects" },
  { label: "Education", key: "education" }
] as const;

export function HeroSection({
  about,
  workCount,
  projectCount,
  educationCount,
  socialLinks
}: HeroSectionProps) {
  const statValues: Record<(typeof heroStats)[number]["key"], number> = {
    work: workCount,
    projects: projectCount,
    education: educationCount
  };

  return (
    <section
      id="hero"
      className="grid gap-8 rounded-3xl border border-[var(--web-border-soft)] bg-[var(--web-panel-hero)] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8 lg:grid-cols-[1.3fr_1fr]"
    >
      <div className="space-y-5">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--web-text)] sm:text-5xl">
          Aman Jain
        </h1>
        <p className="text-base leading-7 text-[var(--web-text-muted)] sm:text-lg">
          {about.professional}
        </p>
        <p className="text-sm leading-7 text-[var(--web-text-subtle)] sm:text-base">{about.casual}</p>

        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link) => (
            <a
              key={`${link.type}-${link.url}`}
              href={link.url}
              className="rounded-full border border-[var(--web-border-soft)] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[var(--web-text)] transition hover:border-[var(--web-border-strong)] hover:bg-[var(--web-accent-soft)] hover:text-[var(--web-accent-strong)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-5">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[var(--web-border-strong)] bg-[radial-gradient(circle_at_35%_30%,rgba(255,214,171,0.85),rgba(146,78,36,0.88))] text-2xl font-semibold tracking-[0.15em] text-[#2f1809]">
          AJ
        </div>
        <div className="grid grid-cols-3 gap-2">
          {heroStats.map((stat) => (
            <article
              key={stat.key}
              className="rounded-xl border border-[var(--web-border-soft)] bg-black/10 px-2 py-3 text-center"
            >
              <p className="text-xl font-semibold text-[var(--web-text)]">{statValues[stat.key]}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--web-text-faint)]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
        <p
          className="text-xs leading-5 text-[var(--web-text-faint)]"
          style={{ fontFamily: "var(--font-web-mono)" }}
        >
          Recruiter mode prioritizes concise scanning, measurable impact, and direct artifact links.
        </p>
      </div>
    </section>
  );
}
