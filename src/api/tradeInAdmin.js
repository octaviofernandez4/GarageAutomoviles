const API_BASE = import.meta.env.VITE_API_URL || "";

export async function fetchTradeInLeads(token) {
  const res = await fetch(`${API_BASE}/api/trade-in/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "No pudimos cargar las tasaciones.");
  }

  return res.json();
}
