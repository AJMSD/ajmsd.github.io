import Link from "next/link";

const SECTION_LINKS = [
  { href: "#hero", label: "Overview" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" }
] as const;

export function WebNavbar() {
  return (
    <header className="sticky top-4 z-40">
      <nav className="rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-nav)] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--web-text)]"
          >
            AJMSD Space
          </Link>
          <ul className="flex flex-wrap items-center gap-2 text-sm">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-1.5 text-[var(--web-text-muted)] transition hover:bg-[var(--web-accent-soft)] hover:text-[var(--web-text)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
