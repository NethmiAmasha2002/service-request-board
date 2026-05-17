const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  try {
    return localStorage.getItem("tb_token");
  } catch {
    return null;
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  //  Jobs
  getJobs: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return apiFetch(`/api/jobs${qs ? `?${qs}` : ""}`);
  },

  getJob: (id) => apiFetch(`/api/jobs/${id}`),

  createJob: (body) =>
    apiFetch("/api/jobs", { method: "POST", body: JSON.stringify(body) }),

 

  // Status-only patch
  updateStatus: (id, status) =>
    apiFetch(`/api/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteJob: (id) => apiFetch(`/api/jobs/${id}`, { method: "DELETE" }),

  // Auth 
  register: (body) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  getMe: () => apiFetch("/api/auth/me"),
};