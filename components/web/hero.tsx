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
  const greetingText = "Hi! Welcome to my portfolio.";
  const headingText = "Aman Jain";
  const typingIntervalMs = 90;
  const typingStartDelayMs = 160;
  const linePauseMs = 260;

  const headingDelayMs =
    typingStartDelayMs + greetingText.length * typingIntervalMs + linePauseMs;
  const professionalDelayMs =
    headingDelayMs + headingText.length * typingIntervalMs + linePauseMs;
  const casualDelayMs =
    professionalDelayMs + about.professional.length * typingIntervalMs + linePauseMs;

  const statValues: Record<(typeof heroStats)[number]["key"], number> = {
    work: workCount,
    projects: projectCount,
    education: educationCount
  };

  return (
    <section
      id="hero"
      className="grid min-h-[calc(100svh-6.5rem)] items-stretch gap-6 px-4 py-8 sm:gap-8 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-10"
    >
      <div className="flex h-full min-h-[52svh] flex-col justify-between gap-6 lg:min-h-[56svh]">
        <div className="space-y-7">
          <div className="space-y-3">
            <HeroTyping
              text={greetingText}
              startDelayMs={typingStartDelayMs}
              className="min-h-6 text-sm uppercase tracking-[0.14em] text-[var(--web-accent-strong)]"
            />
            <HeroTyping
              as="h1"
              text={headingText}
              startDelayMs={headingDelayMs}
              className="min-h-[3.5rem] text-4xl font-semibold tracking-tight text-[var(--web-text)] sm:text-5xl"
            />
            <HeroTyping
              text={about.professional}
              startDelayMs={professionalDelayMs}
              className="min-h-[3.5rem] text-base leading-7 text-[var(--web-text-muted)] sm:text-lg"
            />
            <HeroTyping
              text={about.casual}
              startDelayMs={casualDelayMs}
              className="min-h-[3.5rem] text-sm leading-7 text-[var(--web-text-subtle)] sm:text-base"
            />
          </div>

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

        <div className="flex flex-wrap gap-3">
          {heroStats.map((stat) => (
            <article
              key={stat.key}
              className="min-w-[112px] flex-1 rounded-xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] px-3 py-2 text-center"
            >
              <p className="text-xl font-semibold text-[var(--web-text)]">{statValues[stat.key]}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--web-text-faint)]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="h-full min-h-[52svh] overflow-hidden rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] lg:min-h-[56svh]">
        <AvatarScrollScene className="h-full" fullHeight showCaption={false} />
      </div>
    </section>
  );
}
