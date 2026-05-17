"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../lib/api";
import JobCard from "../components/JobCard";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "Other"];
const STATUSES = ["All", "Open", "In Progress", "Closed"];

const CATEGORY_ICONS = {
  Plumbing: "🔧", Electrical: "⚡", Painting: "🎨", Joinery: "🪚", Other: "🔨",
};

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [status, setStatus] = useState(searchParams.get("status") || "All");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        ...(category !== "All" && { category }),
        ...(status !== "All" && { status }),
        ...(search && { search }),
      };
      const data = await api.getJobs(params);
      setJobs(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-amber-200">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          Live Job Board
        </div>
        <h1 className="text-4xl font-syne font-extrabold text-[#0F1117] tracking-tight leading-tight">
          Find Local <span className="text-[#F5A623]">Service Requests</span>
        </h1>
        <p className="text-stone-500 mt-2 text-base">
          Browse open jobs or{" "}
          <a href="/new-job" className="text-[#0F1117] font-semibold underline underline-offset-2 hover:text-[#F5A623] transition-colors">
            post your own request
          </a>
          .
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-8 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search jobs…"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0F1117] text-white text-sm font-semibold rounded-xl hover:bg-[#1e2130] transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-stone-700 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-stone-700 cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </form>

        {/* Active filters */}
        {(category !== "All" || status !== "All" || search) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
            <span className="text-xs text-stone-400">Active filters:</span>
            {category !== "All" && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                {CATEGORY_ICONS[category]} {category}
                <button onClick={() => setCategory("All")} className="ml-1 hover:text-amber-900">×</button>
              </span>
            )}
            {status !== "All" && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-full">
                {status}
                <button onClick={() => setStatus("All")} className="ml-1 hover:text-stone-900">×</button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-full">
                "{search}"
                <button onClick={() => { setSearch(""); setSearchInput(""); }} className="ml-1 hover:text-stone-900">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 animate-pulse h-36" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 bg-red-50 rounded-2xl border border-red-100">
          <p className="font-semibold">Could not load jobs</p>
          <p className="text-sm mt-1 text-red-400">{error}</p>
          <button onClick={fetchJobs} className="mt-4 text-sm text-[#0F1117] font-semibold hover:text-[#F5A623] transition-colors">
            Try again →
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-stone-400 bg-white rounded-2xl border border-stone-200">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-syne font-bold text-stone-700 text-lg">No jobs found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search term</p>
          <button
            onClick={() => { setCategory("All"); setStatus("All"); setSearch(""); setSearchInput(""); }}
            className="mt-5 text-sm font-semibold text-[#F5A623] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-400 font-medium">
              <span className="text-[#0F1117] font-bold">{jobs.length}</span> job{jobs.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
