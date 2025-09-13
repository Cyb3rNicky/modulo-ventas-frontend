// src/utils/apiFetch.js
import { getAuth } from "./auth";

export async function apiFetch(url, options = {}) {
  const auth = getAuth();
  const token = auth?.token;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // 🔍 Debug: ver los headers antes del fetch
  console.log("🚀 API Fetch:", url);
  console.log("📦 Options:", { ...options, headers });

  const resp = await fetch(url, { ...options, headers });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try {
      msg += ` - ${await resp.text()}`;
    } catch {}
    throw new Error(msg);
  }

  return resp.json();
}
