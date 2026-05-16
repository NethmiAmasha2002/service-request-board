import Link from "next/link";
import StatusBadge from "./StatusBadge";

const CATEGORY_ICONS = {
  Plumbing: "🔧",
  Electrical: "⚡",
  Painting: "🎨",
  Joinery: "🪚",
  Other: "🔨",
};

const CATEGORY_COLORS = {
  Plumbing: "bg-blue-50 text-blue-700 border-blue-100",
  Electrical: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Painting: "bg-pink-50 text-pink-700 border-pink-100",
  Joinery: "bg-orange-50 text-orange-700 border-orange-100",
  Other: "bg-stone-50 text-stone-600 border-stone-200",
};

export default function JobCard({ job }) {
  const icon = CATEGORY_ICONS[job.category] || "🔨";
  const categoryColor = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Other;
  const date = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/jobs/${job._id}`} className="block group">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100 transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-xl shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-syne font-bold text-[#0F1117] group-hover:text-[#F5A623] transition-colors truncate text-base leading-snug">
                {job.title}
              </h3>
              <p className="text-sm text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {job.category && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${categoryColor}`}>
              {job.category}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1 text-xs text-stone-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
          )}
          <span className="ml-auto text-xs text-stone-300">{date}</span>
        </div>
      </div>
    </Link>
  );
}