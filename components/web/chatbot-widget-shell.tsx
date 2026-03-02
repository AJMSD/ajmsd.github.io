"use client";

import { useState } from "react";

export function ChatbotWidgetShell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="fixed bottom-4 right-4 z-50 flex max-w-xs flex-col items-end gap-3">
      {isOpen ? (
        <div className="w-72 rounded-2xl border border-[var(--web-border-soft)] bg-[var(--web-panel-strong)]/95 p-4 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--web-accent-strong)]">
            Chatbot
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--web-text-muted)]">
            Widget panel scaffold is active. Strict RAG chat integration arrives with M3 while UI
            behaviors are expanded in M1.WEB.09.
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 rounded-md border border-[var(--web-border-soft)] px-3 py-1.5 text-xs text-[var(--web-text)] hover:border-[var(--web-border-strong)] hover:text-[var(--web-accent-strong)]"
          >
            Close
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="rounded-full border border-[var(--web-border-strong)] bg-[#7f431f]/95 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--web-accent-strong)] shadow-[0_12px_30px_rgba(0,0,0,0.32)] transition hover:bg-[#985025]"
      >
        {isOpen ? "Hide Chat" : "Open Chat"}
      </button>
    </aside>
  );
}
