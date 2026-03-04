"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MobileMenu } from "@/components/web/mobile-menu";
import { usePhoneMotionPolicy } from "@/components/web/use-phone-motion-policy";

const SECTION_LINKS = [
  { href: "#hero", label: "Overview" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" }
] as const;

export function WebNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);
  const isPhone = usePhoneMotionPolicy();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (wasOpenRef.current && !isMenuOpen) {
      menuButtonRef.current?.focus();
    }
    wasOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  const onNavigate = (href: string) => {
    setIsMenuOpen(false);
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: isPhone ? "auto" : "smooth", block: "start" });
      return;
    }
    window.location.hash = href.replace("#", "");
  };

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-10">
      <nav
        className={`rounded-2xl border border-[var(--web-border-soft)] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors duration-200 ${
          isScrolled ? "bg-[var(--web-panel-nav)]/68" : "bg-[var(--web-panel-nav)]/96"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--web-text)]"
          >
            AJMSD Space
          </Link>
          <ul className="hidden items-center gap-2 text-sm md:flex">
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

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--web-border-soft)] md:hidden"
            aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-controls="web-mobile-menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="relative inline-flex h-4 w-5 items-center justify-center">
              <span
                className={`absolute h-[2px] w-5 bg-[var(--web-text)] transition-transform duration-200 ${
                  isMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0"
                }`}
              />
              <span
                className={`absolute h-[2px] w-5 bg-[var(--web-text)] transition-opacity duration-200 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-[2px] w-5 bg-[var(--web-text)] transition-transform duration-200 ${
                  isMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <MobileMenu
        id="web-mobile-menu"
        isOpen={isMenuOpen}
        links={SECTION_LINKS}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
}
