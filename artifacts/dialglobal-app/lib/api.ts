import { supabase } from "./supabase";
import { Platform } from "react-native";

function getApiBase() {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) {
    return `https://${domain}/api`;
  }
  return "/api";
}

const API_BASE = getApiBase();

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
  };
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  signup: (email: string, password: string, name: string) =>
    apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiFetch("/auth/me"),

  searchNumbers: (countryCode = "US", limit = 10) =>
    apiFetch(`/numbers/search?country_code=${countryCode}&limit=${limit}`),

  provisionNumber: (data: {
    phone_number: string;
    country: string;
    country_code: string;
    flag: string;
  }) =>
    apiFetch("/numbers/provision", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getNumbers: () => apiFetch("/numbers"),

  deleteNumber: (id: string) =>
    apiFetch(`/numbers/${id}`, { method: "DELETE" }),

  sendMessage: (from_number: string, to_number: string, body: string) =>
    apiFetch("/messages/send", {
      method: "POST",
      body: JSON.stringify({ from_number, to_number, body }),
    }),

  getMessages: (numberId?: string) =>
    apiFetch(`/messages${numberId ? `?number_id=${numberId}` : ""}`),

  getThreads: () => apiFetch("/messages/threads"),

  getCalls: () => apiFetch("/calls"),

  initiateCall: (from_number: string, to_number: string) =>
    apiFetch("/calls/initiate", {
      method: "POST",
      body: JSON.stringify({ from_number, to_number }),
    }),
};
