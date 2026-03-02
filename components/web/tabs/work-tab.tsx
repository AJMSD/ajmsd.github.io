import { WorkRecord } from "@/components/web/types";
import { formatTimelineRange } from "@/components/web/tabs/utils";

type WorkTabProps = {
  records: WorkRecord[];
};

export function WorkTab({ records }: WorkTabProps) {
  return (
    <div className="grid gap-3">
      {records.map((record) => (
        <article key={record.id} className="rounded-xl border border-white/10 bg-[#031221]/80 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-medium text-[#fff8ea]">{record.title}</h3>
            <p className="text-xs uppercase tracking-[0.1em] text-[#98b2c6]">
              {formatTimelineRange(record.start_date, record.end_date, record.present)}
            </p>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[#b9cbdc]">
            {record.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
