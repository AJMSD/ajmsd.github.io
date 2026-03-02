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
      className="grid gap-8 rounded-3xl border border-white/10 bg-[#062842]/80 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8 lg:grid-cols-[1.3fr_1fr]"
    >
      <div className="space-y-5">
        <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-100">
          Web Mode
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[#fff8ea] sm:text-5xl">
          Aman Jain
        </h1>
        <p className="text-base leading-7 text-[#d4e2ef] sm:text-lg">{about.professional}</p>
        <p className="text-sm leading-7 text-[#b8cada] sm:text-base">{about.casual}</p>

        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link) => (
            <a
              key={`${link.type}-${link.url}`}
              href={link.url}
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[#f8f3ea] transition hover:border-cyan-200/80 hover:text-cyan-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/15 bg-[#041a2f]/70 p-5">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-cyan-200/45 bg-[radial-gradient(circle_at_35%_30%,rgba(114,235,255,0.7),rgba(16,59,94,0.85))] text-2xl font-semibold tracking-[0.15em] text-[#052036]">
          AJ
        </div>
        <div className="grid grid-cols-3 gap-2">
          {heroStats.map((stat) => (
            <article
              key={stat.key}
              className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center"
            >
              <p className="text-xl font-semibold text-[#fff8ea]">{statValues[stat.key]}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#9db8cb]">{stat.label}</p>
            </article>
          ))}
        </div>
        <p
          className="text-xs leading-5 text-[#9db8cb]"
          style={{ fontFamily: "var(--font-web-mono)" }}
        >
          Recruiter mode prioritizes concise scanning, measurable impact, and direct artifact links.
        </p>
      </div>
    </section>
  );
}
