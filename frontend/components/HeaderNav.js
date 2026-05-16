"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function HeaderNav() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="bg-[#0F1117] sticky top-0 z-10 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-[#F5A623] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-5 h-5 text-[#0F1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white group-hover:text-[#F5A623] transition-colors duration-200">
            TradeBoard
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-8 bg-white/10 rounded-lg animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/new-job"
                className="bg-[#F5A623] hover:bg-[#e09510] text-[#0F1117] text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
              >
                + Post a Job
              </Link>
              <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                <div className="w-8 h-8 bg-[#F5A623]/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-[#F5A623]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-white/80 font-medium hidden sm:block">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white/40 hover:text-red-400 transition-colors ml-1"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-[#F5A623] hover:bg-[#e09510] text-[#0F1117] text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}