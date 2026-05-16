"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  function validate(form) {
    const errors = {};
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email";
    if (!form.password) errors.password = "Password is required";
    return errors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setSubmitting(true);
      setServerError(null);
      const data = await api.login(form);
      login(data.token, data.user);
      router.push("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function inputClass(hasError) {
    return `w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
      hasError
        ? "border-red-300 focus:ring-red-200"
        : "border-stone-200 focus:ring-amber-200 focus:border-amber-300"
    }`;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#0F1117] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-7 h-7 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0F1117]">Welcome back</h1>
          <p className="text-stone-500 mt-1 text-sm">Sign in to post and manage jobs</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="john@example.com" className={inputClass(errors.email)}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="••••••" className={inputClass(errors.password)}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-[#F5A623] hover:bg-[#e09510] disabled:opacity-60 disabled:cursor-not-allowed text-[#0F1117] font-bold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#0F1117] font-bold hover:text-[#F5A623] transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}