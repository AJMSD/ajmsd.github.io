type SectionLink = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  id: string;
  isOpen: boolean;
  links: readonly SectionLink[];
  onClose: () => void;
  onNavigate: (href: string) => void;
};

export function MobileMenu({ id, isOpen, links, onClose, onNavigate }: MobileMenuProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        id={id}
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 h-full w-72 max-w-[85vw] border-l border-[var(--web-border-soft)] bg-[var(--web-panel-nav)]/95 p-5 shadow-[0_20px_56px_rgba(0,0,0,0.42)] backdrop-blur-md transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.16em] text-[var(--web-accent-strong)]">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--web-border-soft)] text-[var(--web-text)] transition hover:border-[var(--web-border-strong)]"
            aria-label="Close mobile menu"
            title="Close menu"
          >
            <span className="relative h-4 w-4" aria-hidden>
              <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(link.href);
                  }}
                  className="block rounded-lg border border-[var(--web-border-soft)] px-3 py-2 text-sm text-[var(--web-text-muted)] transition hover:border-[var(--web-border-strong)] hover:bg-[var(--web-accent-soft)] hover:text-[var(--web-text)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
