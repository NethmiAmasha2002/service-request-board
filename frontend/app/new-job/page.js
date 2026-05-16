"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Other"];
const CATEGORY_ICONS = {
  Plumbing: "🔧", Electrical: "⚡", Painting: "🎨", Joinery: "🪚", Other: "🔨",
};

const INITIAL_FORM = {
  title: "", description: "", category: "Plumbing",
  location: "", contactName: "", contactEmail: "",
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  else if (form.title.trim().length < 5) errors.title = "Title must be at least 5 characters";
  if (!form.description.trim()) errors.description = "Description is required";
  else if (form.description.trim().length < 10) errors.description = "Description must be at least 10 characters";
  if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
    errors.contactEmail = "Please enter a valid email address";
  }
  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

function inputClass(hasError) {
  return `w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
    hasError
      ? "border-red-300 focus:ring-red-200 bg-red-50"
      : "border-stone-200 focus:ring-amber-200 focus:border-amber-300 bg-white"
  }`;
}

export default function NewJobPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(INITIAL_FORM).map(k => [k, true]));
    setTouched(allTouched);
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    try {
      setSubmitting(true);
      setServerError(null);
      await api.createJob(form);
      router.push("/");
    } catch (err) {
      if (err.message.includes("authorized") || err.message.includes("log in")) {
        router.push("/login"); return;
      }
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-stone-200 rounded-xl w-1/3" />
        <div className="bg-white rounded-2xl border border-stone-200 p-6 h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1.5 mb-5 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-[#0F1117] tracking-tight">Post a Service Request</h1>
        <p className="text-stone-500 mt-1.5">Fill in the details and a tradesperson will get in touch.</p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title" value={form.title} onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g. Leaking kitchen tap needs fixing"
              className={inputClass(errors.title)}
            />
            <div className="flex items-center justify-between">
              <FieldError message={errors.title} />
              <span className="text-xs text-stone-300 mt-1 ml-auto">{form.title.length}/100</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description" value={form.description} onChange={handleChange} onBlur={handleBlur}
              rows={4} placeholder="Describe the work needed, access requirements, etc."
              className={`${inputClass(errors.description)} resize-none`}
            />
            <div className="flex items-start justify-between">
              <FieldError message={errors.description} />
              <span className={`text-xs mt-1 ml-auto ${form.description.length > 900 ? "text-red-400" : "text-stone-300"}`}>
                {form.description.length}/1000
              </span>
            </div>
          </div>

          {/* Category - visual button grid */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Category</label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c} type="button"
                  onClick={() => setForm((prev) => ({ ...prev, category: c }))}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all ${
                    form.category === c
                      ? "bg-[#0F1117] border-[#0F1117] text-white shadow-md"
                      : "bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  <span className="text-lg">{CATEGORY_ICONS[c]}</span>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Location</label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Glasgow, London, Colombo"
                className={`${inputClass(false)} pl-10`}
              />
            </div>
          </div>

          {/* Contact Name + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Your Name</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  name="contactName" value={form.contactName} onChange={handleChange}
                  placeholder="John Smith" className={`${inputClass(false)} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Contact Email</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  name="contactEmail" value={form.contactEmail} onChange={handleChange} onBlur={handleBlur}
                  type="email" placeholder="john@example.com"
                  className={`${inputClass(errors.contactEmail)} pl-10`}
                />
              </div>
              <FieldError message={errors.contactEmail} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4">
          <p className="text-xs text-stone-400">Fields marked <span className="text-red-400">*</span> are required</p>
          <button
            type="submit" disabled={submitting}
            className="bg-[#F5A623] hover:bg-[#e09510] disabled:opacity-60 disabled:cursor-not-allowed text-[#0F1117] font-bold py-2.5 px-8 rounded-xl transition-all text-sm shadow-md shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Posting…
              </span>
            ) : "Post Request →"}
          </button>
        </div>
      </form>
    </div>
  );
}