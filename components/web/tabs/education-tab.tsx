import { EducationRecord } from "@/components/web/types";
import { formatTimelineRange } from "@/components/web/tabs/utils";

type EducationTabProps = {
  records: EducationRecord[];
};

export function EducationTab({ records }: EducationTabProps) {
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

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-cyan-100/75">Coursework</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#b9cbdc]">
                {record.coursework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-cyan-100/75">Achievements</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#b9cbdc]">
                {record.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
