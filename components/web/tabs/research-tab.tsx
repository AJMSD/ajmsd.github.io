import { ProjectRecord } from "@/components/web/types";
import { formatTimelineRange } from "@/components/web/tabs/utils";

type ResearchTabProps = {
  records: ProjectRecord[];
};

export function ResearchTab({ records }: ResearchTabProps) {
  return (
    <div className="grid gap-3">
      {records.map((record) => (
        <article
          key={record.id}
          className="rounded-xl border border-[var(--web-border-soft)] bg-[var(--web-panel-strong)]/85 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-medium text-[var(--web-text)]">{record.title}</h3>
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--web-text-faint)]">
              {formatTimelineRange(record.start_date, record.end_date, record.present)}
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--web-text-muted)]">{record.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {record.tech_stack.slice(0, 5).map((stackItem) => (
              <span
                key={stackItem}
                className="rounded-full border border-[var(--web-border-soft)] bg-black/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[var(--web-text-subtle)]"
              >
                {stackItem}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
