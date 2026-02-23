import Link from "next/link";

const MODES = [
  { href: "/web", label: "Webpage Mode" },
  { href: "/os", label: "ajmsdOS Mode" },
  { href: "/game", label: "Game Mode" }
] as const;

export function ModeSelector() {
  return (
    <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 p-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">AJMSD Portfolio Revamp</h1>
        <p className="text-zinc-300">
          Foundation scaffold for mode-based routing. Choose a mode to continue.
        </p>
      </header>
      <nav className="grid gap-3 sm:grid-cols-3">
        {MODES.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm font-medium transition hover:border-zinc-500 hover:bg-zinc-800"
          >
            {mode.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
