import { SectionHeading } from "@/components/web/section-heading";
import { getSocialIcon } from "@/components/web/social-icons";
import { LinksContent } from "@/components/web/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ContactSectionProps = {
  links: LinksContent;
};

export function ContactSection({ links }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="space-y-5 px-4 py-14 sm:px-6 lg:px-10 lg:py-16"
    >
      <SectionHeading
        eyebrow="Contact"
        title="Reach Out"
        description="This scaffold establishes the final section structure. API submission, CAPTCHA, and email alert integration land in M1.WEB.10+."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <article className="space-y-3 rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-4">
          <p className="text-sm leading-6 text-[var(--web-text-muted)]">
            Preferred channels for recruiter and collaborator outreach.
          </p>
          <ul className="space-y-2 text-sm">
            {links.social.map((link) => {
              const icon = getSocialIcon(link.label);
              return (
                <li key={`${link.label}-${link.url}`}>
                  {icon ? (
                  <a
                    href={link.url}
                    aria-label={link.label}
                    title={link.label}
                    className="inline-flex items-center justify-center p-1 text-3xl text-[var(--web-text)] transition hover:text-[var(--web-accent-strong)]"
                  >
                    <FontAwesomeIcon icon={icon} />
                    <span className="sr-only">{link.label}</span>
                  </a>
                ) : (
                  <a
                    href={link.url}
                    className="inline-flex rounded-md border border-[var(--web-border-soft)] px-3 py-1.5 text-[var(--web-text)] transition hover:border-[var(--web-border-strong)] hover:bg-[var(--web-accent-soft)] hover:text-[var(--web-accent-strong)]"
                  >
                    {link.label}
                  </a>
                  )}
                </li>
              );
            })}
          </ul>
        </article>

        <form className="space-y-3 rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-elevated)] p-4">
          <label className="block space-y-1 text-sm text-[var(--web-text)]">
            <span>Name</span>
            <input
              type="text"
              placeholder="Your name"
              disabled
              className="w-full rounded-md border border-[var(--web-border-soft)] bg-black/20 px-3 py-2 text-sm text-[var(--web-text-muted)] placeholder:text-[var(--web-text-faint)]"
            />
          </label>
          <label className="block space-y-1 text-sm text-[var(--web-text)]">
            <span>Email or handle</span>
            <input
              type="text"
              placeholder="you@company.com"
              disabled
              className="w-full rounded-md border border-[var(--web-border-soft)] bg-black/20 px-3 py-2 text-sm text-[var(--web-text-muted)] placeholder:text-[var(--web-text-faint)]"
            />
          </label>
          <label className="block space-y-1 text-sm text-[var(--web-text)]">
            <span>Message</span>
            <textarea
              rows={4}
              placeholder="How can I help?"
              disabled
              className="w-full rounded-md border border-[var(--web-border-soft)] bg-black/20 px-3 py-2 text-sm text-[var(--web-text-muted)] placeholder:text-[var(--web-text-faint)]"
            />
          </label>
          <button
            type="button"
            disabled
            className="rounded-lg border border-[var(--web-border-soft)] bg-black/15 px-4 py-2 text-sm text-[var(--web-text-faint)]"
          >
            Contact API integration pending
          </button>
        </form>
      </div>
    </section>
  );
}
