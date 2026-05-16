"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  function validate(form) {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";
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
      const data = await api.register({ name: form.name, email: form.email, password: form.password });
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

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Smith" },
    { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "Min. 6 characters" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#0F1117] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-7 h-7 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0F1117]">Create an account</h1>
          <p className="text-stone-500 mt-1 text-sm">Register to post service requests</p>
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
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
              <input
                name={name} type={type} value={form[name]}
                onChange={handleChange} placeholder={placeholder}
                className={inputClass(errors[name])}
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>}
            </div>
          ))}

          <button
            type="submit" disabled={submitting}
            className="w-full bg-[#F5A623] hover:bg-[#e09510] disabled:opacity-60 disabled:cursor-not-allowed text-[#0F1117] font-bold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0F1117] font-bold hover:text-[#F5A623] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}