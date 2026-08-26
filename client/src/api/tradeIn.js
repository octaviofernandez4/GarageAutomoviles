const API_BASE = import.meta.env.VITE_API_URL || "";

export async function submitTradeIn(payload) {
  const res = await fetch(`${API_BASE}/api/trade-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to submit trade-in: ${res.status}`);
  }

  return res.json();
}
