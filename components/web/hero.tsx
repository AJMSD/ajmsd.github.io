import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AvatarScrollScene } from "@/components/web/avatar-scroll-scene";
import { HeroTyping } from "@/components/web/hero-typing";
import { getSocialIcon } from "@/components/web/social-icons";
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
      className="grid gap-8 border-b border-[var(--web-border-soft)] px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-10 lg:py-16"
    >
      <div className="space-y-5">
        <HeroTyping
          text="Hi! Welcome to my portfolio."
          className="text-sm uppercase tracking-[0.14em] text-[var(--web-accent-strong)]"
        />
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--web-text)] sm:text-5xl">
          Aman Jain
        </h1>
        <p className="text-base leading-7 text-[var(--web-text-muted)] sm:text-lg">
          {about.professional}
        </p>
        <p className="text-sm leading-7 text-[var(--web-text-subtle)] sm:text-base">{about.casual}</p>

        <div className="flex flex-wrap items-center gap-4">
          {socialLinks.map((link) => {
            const icon = getSocialIcon(link.label);
            if (icon) {
              return (
                <a
                  key={`${link.type}-${link.url}`}
                  href={link.url}
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex items-center justify-center p-1 text-3xl text-[var(--web-text)] transition hover:text-[var(--web-accent-strong)]"
                >
                  <FontAwesomeIcon icon={icon} />
                  <span className="sr-only">{link.label}</span>
                </a>
              );
            }

            return (
              <a
                key={`${link.type}-${link.url}`}
                href={link.url}
                className="rounded-full border border-[var(--web-border-soft)] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[var(--web-text)] transition hover:border-[var(--web-border-strong)] hover:bg-[var(--web-accent-soft)] hover:text-[var(--web-accent-strong)]"
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-5">
        <AvatarScrollScene />
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
