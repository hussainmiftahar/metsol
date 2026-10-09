const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export function apiUrl(path) {
  return `${configuredApiUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getAuthToken() {
  try {
    return window.localStorage.getItem("token") || window.sessionStorage.getItem("token") || "";
  } catch {
    throw new Error("Browser storage is unavailable. Enable site storage and try again.");
  }
}

export function saveAuthToken(token, rememberMe) {
  try {
    const destination = rememberMe ? window.localStorage : window.sessionStorage;
    const other = rememberMe ? window.sessionStorage : window.localStorage;
    destination.setItem("token", token);
    other.removeItem("token");
  } catch {
    throw new Error("Unable to save your session. Enable browser storage and try again.");
  }
}

export function clearAuthToken() {
  try {
    window.localStorage.removeItem("token");
    window.sessionStorage.removeItem("token");
  } catch {
    throw new Error("Unable to clear your saved session. Check your browser storage settings.");
  }
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = getAuthToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(apiUrl(path), { ...options, headers });
}
