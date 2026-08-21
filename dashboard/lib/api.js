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

async function request(path, { method = "GET", params, body } = {}) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.detail);
  }

  return data;
}

export function requestOtp(email) {
  return request("/auth/request-otp", { method: "POST", body: { email } });
}

export function verifyOtp(email, code) {
  return request("/auth/verify-otp", { method: "POST", body: { email, code } });
}

export function getCurrentUser() {
  return request("/auth/me");
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

export function listSites() {
  return request("/sites");
}

export function createSite(name) {
  return request("/sites", { method: "POST", params: { name } });
}

export function getTopPages(siteId) {
  return request("/stats/top-pages", { params: { site_id: siteId } });
}

export function getTopReferrers(siteId) {
  return request("/stats/top-referrers", { params: { site_id: siteId } });
}

export function getVisitsOverTime(siteId) {
  return request("/stats/visits-over-time", { params: { site_id: siteId } });
}
