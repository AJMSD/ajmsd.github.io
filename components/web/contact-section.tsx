import { SectionHeading } from "@/components/web/section-heading";
import { LinksContent } from "@/components/web/types";

type ContactSectionProps = {
  links: LinksContent;
};

export function ContactSection({ links }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="space-y-5 rounded-3xl border border-white/10 bg-[#06243a]/80 p-6 backdrop-blur sm:p-8"
    >
      <SectionHeading
        eyebrow="Contact"
        title="Reach Out"
        description="This scaffold establishes the final section structure. API submission, CAPTCHA, and email alert integration land in M1.WEB.10+."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <article className="space-y-3 rounded-2xl border border-white/10 bg-[#051728]/80 p-4">
          <p className="text-sm leading-6 text-[#b7c7d6]">
            Preferred channels for recruiter and collaborator outreach.
          </p>
          <ul className="space-y-2 text-sm">
            {links.social.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <a
                  href={link.url}
                  className="inline-flex rounded-md border border-white/15 px-3 py-1.5 text-[#d7e5f2] transition hover:border-cyan-200/70 hover:text-cyan-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <form className="space-y-3 rounded-2xl border border-white/10 bg-[#051728]/80 p-4">
          <label className="block space-y-1 text-sm text-[#d7e5f2]">
            <span>Name</span>
            <input
              type="text"
              placeholder="Your name"
              disabled
              className="w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm text-[#b7c7d6] placeholder:text-[#6a8397]"
            />
          </label>
          <label className="block space-y-1 text-sm text-[#d7e5f2]">
            <span>Email or handle</span>
            <input
              type="text"
              placeholder="you@company.com"
              disabled
              className="w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm text-[#b7c7d6] placeholder:text-[#6a8397]"
            />
          </label>
          <label className="block space-y-1 text-sm text-[#d7e5f2]">
            <span>Message</span>
            <textarea
              rows={4}
              placeholder="How can I help?"
              disabled
              className="w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm text-[#b7c7d6] placeholder:text-[#6a8397]"
            />
          </label>
          <button
            type="button"
            disabled
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#8fa5b7]"
          >
            Contact API integration pending
          </button>
        </form>
      </div>
    </section>
  );
}
