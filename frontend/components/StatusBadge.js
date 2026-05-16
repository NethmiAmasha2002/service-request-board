export const STATUS_STYLES = {
  Open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "In Progress": "bg-amber-50 text-amber-700 border border-amber-200",
  Closed: "bg-stone-100 text-stone-500 border border-stone-200",
};

export const STATUS_DOTS = {
  Open: "bg-emerald-500",
  "In Progress": "bg-amber-500 animate-pulse",
  Closed: "bg-stone-400",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
        STATUS_STYLES[status] || STATUS_STYLES.Open
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status] || STATUS_DOTS.Open}`} />
      {status}
    </span>
  );
}