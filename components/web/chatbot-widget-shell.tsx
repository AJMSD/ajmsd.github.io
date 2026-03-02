"use client";

import { useState } from "react";

export function ChatbotWidgetShell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="fixed bottom-4 right-4 z-50 flex max-w-xs flex-col items-end gap-3">
      {isOpen ? (
        <div className="w-72 rounded-2xl border border-white/15 bg-[#031220]/95 p-4 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-100">Chatbot</h3>
          <p className="mt-2 text-sm leading-6 text-[#bdd0df]">
            Widget panel scaffold is active. Strict RAG chat integration arrives with M3 while UI
            behaviors are expanded in M1.WEB.09.
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 rounded-md border border-white/20 px-3 py-1.5 text-xs text-[#d7e5f2] hover:border-cyan-100/70 hover:text-cyan-100"
          >
            Close
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="rounded-full border border-cyan-200/60 bg-[#0c3553]/95 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-cyan-50 shadow-[0_12px_30px_rgba(0,0,0,0.32)] transition hover:bg-[#11486f]"
      >
        {isOpen ? "Hide Chat" : "Open Chat"}
      </button>
    </aside>
  );
}
