const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();

export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem("local_sewa_token");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("local_sewa_user") || "null");
  } catch {
    return null;
  }
}

export function saveSession(token, user, activeRole) {
  if (token) localStorage.setItem("local_sewa_token", token);
  if (user) localStorage.setItem("local_sewa_user", JSON.stringify(user));
  if (activeRole) localStorage.setItem("local_sewa_active_role", activeRole);
}

export function clearSession() {
  localStorage.removeItem("local_sewa_token");
  localStorage.removeItem("local_sewa_user");
  localStorage.removeItem("local_sewa_active_role");
}

function buildApiUrl(path) {
  if (!path.startsWith("/api")) {
    return `${API_BASE_URL}${path}`;
  }

  const [pathname, query = ""] = path.split("?", 2);
  const route = pathname.slice(4) || "/";
  const params = new URLSearchParams(query);
  params.set("route", route.startsWith("/") ? route : `/${route}`);

  return `${API_BASE_URL}/api/index.php?${params.toString()}`;
}

export async function apiRequest(path, options = {}) {
  const token = options.token === undefined ? getToken() : options.token;
  const headers = new Headers(options.headers || {});

  headers.set("Accept", "application/json");

  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = String(options.method || "GET").toUpperCase();
  const maximumAttempts = method === "GET" ? 2 : 1;
  let response;

  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    try {
      response = await fetch(buildApiUrl(path), {
        ...options,
        headers,
        body,
      });
    } catch {
      if (attempt + 1 >= maximumAttempts) {
        throw new Error("Unable to connect to the server. Please check your internet and try again.");
      }
    }

    if (response && ![502, 503, 504].includes(response.status)) break;
    if (attempt + 1 < maximumAttempts) {
      await new Promise((resolve) => window.setTimeout(resolve, 750));
    }
  }

  if (!response) {
    throw new Error("The server is temporarily unavailable. Please try again shortly.");
  }

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    const error = new Error(
      response.status >= 500
        ? "The server is temporarily unavailable. Please try again shortly."
        : "The server route is not configured correctly. Please refresh and try again.",
    );
    error.status = response.status;
    throw error;
  }

  if (!response.ok || data?.success === false) {
    const error = new Error(data?.message || "Request failed. Please try again.");
    error.status = response.status;
    error.data = data;
    if (response.status === 401 && token) clearSession();
    throw error;
  }

  return data;
}
