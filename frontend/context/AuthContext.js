"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("tb_token");
      const savedUser = localStorage.getItem("tb_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  function login(token, user) {
    setToken(token);
    setUser(user);
    localStorage.setItem("tb_token", token);
    localStorage.setItem("tb_user", JSON.stringify(user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}