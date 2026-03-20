// src/services/api.js
// All API calls go to YOUR backend (Node/Express), which calls Telnyx.
// Never put Telnyx API keys in this file or anywhere client-side.

const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

// ── Numbers ─────────────────────────────────────────────────────
export const getNumbers        = ()              => request("/numbers");
export const searchNumbers     = (country, type) => request(`/numbers/search?country=${country}&type=${type||"local"}`);
export const provisionNumber   = (phone, plan)   => request("/numbers/provision", { method:"POST", body:JSON.stringify({phone,plan}) });
export const releaseNumber     = (id)            => request(`/numbers/${id}`,     { method:"DELETE" });

// ── Messages ────────────────────────────────────────────────────
export const getThreads        = (numberId)      => request(`/numbers/${numberId}/threads`);
export const sendMessage       = (from, to, text)=> request("/messages/send", { method:"POST", body:JSON.stringify({from,to,text}) });

// ── Calls ───────────────────────────────────────────────────────
export const getCallLog        = (numberId)      => request(`/numbers/${numberId}/calls`);
export const initiateCall      = (from, to)      => request("/calls/initiate", { method:"POST", body:JSON.stringify({from,to}) });
export const hangupCall        = (callControlId) => request("/calls/hangup",   { method:"POST", body:JSON.stringify({callControlId}) });

// ── Auth ────────────────────────────────────────────────────────
export const login             = (email, pass)   => request("/auth/login",  { method:"POST", body:JSON.stringify({email,password:pass}) });
export const signup            = (email, pass, name) => request("/auth/signup", { method:"POST", body:JSON.stringify({email,password:pass,name}) });
export const logout            = ()              => request("/auth/logout",  { method:"POST" });

// ── Billing ──────────────────────────────────────────────────────
// In production wire this to Stripe or your payment processor.
// Your backend creates a Stripe checkout session and returns the URL.
export const createCheckout    = (planId, billing) => request("/billing/checkout", { method:"POST", body:JSON.stringify({planId,billing}) });
export const cancelSubscription= ()              => request("/billing/cancel",   { method:"POST" });
