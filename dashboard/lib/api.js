const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://pane-analytics.in";

export class ApiError extends Error {
  constructor(status, detail) {
    super("Request failed");
    this.status = status;
    this.detail = detail;
  }
}

export function formatApiError(error) {
  if (!(error instanceof ApiError)) return "Something went wrong. Try again.";
  if (typeof error.detail === "string") return error.detail;
  if (Array.isArray(error.detail) && error.detail[0]?.msg) return error.detail[0].msg;
  return "Something went wrong. Try again.";
}

async function request(path, { method = "GET", token, params, body } = {}) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.detail);
  }

  return data;
}

export function signup(email, password) {
  return request("/auth/signup", { method: "POST", body: { email, password } });
}

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export function listSites(token) {
  return request("/sites", { token });
}

export function createSite(token, name) {
  return request("/sites", { method: "POST", token, params: { name } });
}

export function getTopPages(token, siteId) {
  return request("/stats/top-pages", { token, params: { site_id: siteId } });
}

export function getTopReferrers(token, siteId) {
  return request("/stats/top-referrers", { token, params: { site_id: siteId } });
}

export function getVisitsOverTime(token, siteId) {
  return request("/stats/visits-over-time", { token, params: { site_id: siteId } });
}
