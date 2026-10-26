import { supabase } from "./supabase.js";

const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export function apiUrl(path) {
  return `${configuredApiUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

// Supabase keeps the session (and refreshes the access token) for us.
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || "";
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error("Unable to sign you out. Please try again.");
  }
}

export function redirectToGoogleClassroomConnect() {
  window.location.href = apiUrl("/api/google/classroom/connect");
}

export async function getGoogleClassroomStatus() {
  const response = await apiFetch("/api/google/classroom/status");
  if (!response.ok) {
    throw new Error("Unable to read Google Classroom connection status.");
  }
  return response.json();
}

export async function disconnectGoogleClassroom() {
  const response = await apiFetch("/api/google/classroom/disconnect", { method: "POST" });
  if (!response.ok) {
    throw new Error("Unable to disconnect Google Classroom.");
  }
  return response.json();
}

export async function syncGoogleClassroomAssignments() {
  const response = await apiFetch("/api/google/classroom/sync", { method: "POST" });
  if (!response.ok) {
    throw new Error("Unable to sync Google Classroom assignments.");
  }
  return response.json();
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = await getAccessToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(apiUrl(path), { ...options, headers });
}
