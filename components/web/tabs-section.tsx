import { SectionHeading } from "@/components/web/section-heading";

const TAB_NAMES = ["Work", "Research", "Education"] as const;

export function TabsSection() {
  return (
    <section
      id="experience"
      className="space-y-5 rounded-3xl border border-white/10 bg-[#06243a]/80 p-6 backdrop-blur sm:p-8"
    >
      <SectionHeading
        eyebrow="Experience"
        title="IDE-Style Tabs"
        description="The section scaffold is in place. Interactive tab switching and resume download integration are implemented in M1.WEB.05."
      />

      <div className="rounded-2xl border border-white/10 bg-[#051a2b]/75 p-4">
        <div className="flex flex-wrap gap-2">
          {TAB_NAMES.map((tab, index) => (
            <button
              key={tab}
              type="button"
              disabled
              className={`rounded-md border px-3 py-1.5 text-sm transition ${
                index === 0
                  ? "border-cyan-200/55 bg-cyan-200/12 text-cyan-50"
                  : "border-white/10 bg-white/5 text-[#b6c9d9]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-white/20 bg-[#031221]/70 p-4 text-sm leading-6 text-[#9db7c9]">
          Tabs content panel scaffolding is ready for data wiring and resume download action.
        </div>
      </div>
    </section>
  );
}
