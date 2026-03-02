import { WorkRecord } from "@/components/web/types";
import { formatTimelineRange } from "@/components/web/tabs/utils";

type WorkTabProps = {
  records: WorkRecord[];
};

export function WorkTab({ records }: WorkTabProps) {
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
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--web-text-muted)]">
            {record.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
