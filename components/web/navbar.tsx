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
      <nav className="rounded-2xl border border-white/10 bg-[#05263f]/75 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f3ea]">
            AJMSD Space
          </Link>
          <ul className="flex flex-wrap items-center gap-2 text-sm">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-1.5 text-[#d6e6f4] transition hover:bg-white/10 hover:text-[#fff8ea]"
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
