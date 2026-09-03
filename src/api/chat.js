const API_BASE = import.meta.env.VITE_API_URL || "";

export async function sendChatMessage(message, history, sessionId, visitor) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history,
      sessionId,
      visitorName: visitor?.name,
      visitorPhone: visitor?.phone,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "No pudimos responder en este momento.");
  }

  return data.reply;
}

export async function fetchChatLogs(token) {
  const res = await fetch(`${API_BASE}/api/chat/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "No pudimos cargar las conversaciones.");
  }

  return res.json();
}
