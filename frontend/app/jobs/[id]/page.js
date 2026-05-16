"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import StatusBadge from "../../../components/StatusBadge";

const STATUSES = ["Open", "In Progress", "Closed"];
const CATEGORY_ICONS = {
  Plumbing: "🔧", Electrical: "⚡", Painting: "🎨", Joinery: "🪚", Other: "🔨",
};

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const data = await api.getJob(id);
        setJob(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    try {
      setStatusLoading(true);
      const data = await api.updateStatus(id, newStatus);
      setJob(data.data);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      setDeleteLoading(true);
      await api.deleteJob(id);
      router.push("/");
    } catch (err) {
      if (err.message.includes("authorized") || err.message.includes("log in")) {
        router.push("/login"); return;
      }
      alert("Failed to delete: " + err.message);
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 bg-stone-200 rounded-xl w-1/4" />
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <div className="h-7 bg-stone-200 rounded-xl w-3/4" />
          <div className="h-4 bg-stone-100 rounded-xl" />
          <div className="h-4 bg-stone-100 rounded-xl w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-2xl border border-stone-200">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-bold text-stone-800 text-lg">Job not found</p>
        <p className="text-sm mt-1 text-stone-400">{error}</p>
        <button onClick={() => router.push("/")} className="mt-5 text-sm font-semibold text-[#F5A623] hover:underline">
          ← Back to all jobs
        </button>
      </div>
    );
  }

  const icon = CATEGORY_ICONS[job.category] || "🔨";
  const date = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.push("/")}
        className="text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1.5 mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All jobs
      </button>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl shrink-0">
                {icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0F1117] leading-tight">{job.title}</h1>
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-stone-400">
                  {job.category && <span className="font-medium text-stone-500">{job.category}</span>}
                  {job.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                    </>
                  )}
                  <span>·</span>
                  <span>Posted {date}</span>
                </div>
              </div>
            </div>
            <StatusBadge status={job.status} />
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Description</h2>
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Contact */}
        {(job.contactName || job.contactEmail) && (
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Contact</h2>
            <div className="space-y-2 text-sm text-stone-700">
              {job.contactName && (
                <p className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  {job.contactName}
                </p>
              )}
              {job.contactEmail && (
                <p className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <a href={`mailto:${job.contactEmail}`} className="text-[#F5A623] hover:underline font-medium">
                    {job.contactEmail}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 bg-stone-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
              Update Status
            </label>
            <select
              value={job.status} onChange={handleStatusChange} disabled={statusLoading}
              className="px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 bg-white disabled:opacity-60 cursor-pointer"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {statusLoading && <span className="text-xs text-stone-400 ml-2">Saving…</span>}
          </div>

          {/* Delete — only for logged-in users */}
          {user ? (
            <button
              onClick={handleDelete} disabled={deleteLoading}
              onMouseLeave={() => !deleteLoading && setConfirmDelete(false)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 ${
                confirmDelete
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleteLoading ? "Deleting…" : confirmDelete ? "Confirm?" : "Delete Job"}
            </button>
          ) : (
            <p className="text-sm text-stone-400">
              <a href="/login" className="text-[#F5A623] font-semibold hover:underline">Sign in</a> to post or delete jobs
            </p>
          )}
        </div>
      </div>
    </div>
  );
}