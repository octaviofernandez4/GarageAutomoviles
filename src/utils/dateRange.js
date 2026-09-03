export const DATE_RANGE_OPTIONS = [
  { key: "all", label: "Todo" },
  { key: "today", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
];

export function isWithinDateRange(dateValue, rangeKey) {
  if (!rangeKey || rangeKey === "all") return true;

  const date = new Date(dateValue);
  const now = new Date();

  if (rangeKey === "today") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  const days = rangeKey === "7d" ? 7 : rangeKey === "30d" ? 30 : null;
  if (!days) return true;

  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return date.getTime() >= cutoff;
}
