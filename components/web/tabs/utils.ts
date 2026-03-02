function formatMonthYear(value: string): string {
  const [year, month] = value.split("-");
  if (!year) {
    return value;
  }
  if (!month) {
    return year;
  }

  const monthNumber = Number(month);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const monthLabel = monthNames[monthNumber - 1];
  if (!monthLabel) {
    return value;
  }

  return `${monthLabel} ${year}`;
}

export function formatTimelineRange(startDate: string, endDate?: string, present?: boolean): string {
  const start = formatMonthYear(startDate);
  const end = present ? "Present" : endDate ? formatMonthYear(endDate) : "Present";
  return `${start} -> ${end}`;
}
