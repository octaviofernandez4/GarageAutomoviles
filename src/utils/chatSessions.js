export function groupChatSessions(logs) {
  const bySession = new Map();
  for (const log of logs) {
    if (!bySession.has(log.sessionId)) bySession.set(log.sessionId, []);
    bySession.get(log.sessionId).push(log);
  }

  return Array.from(bySession.entries())
    .map(([sessionId, messages]) => {
      const sorted = messages.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const withName = messages.find((m) => m.visitorName);
      const withPhone = messages.find((m) => m.visitorPhone);
      return {
        sessionId,
        messages: sorted,
        lastAt: messages[0].createdAt,
        visitorName: withName?.visitorName,
        visitorPhone: withPhone?.visitorPhone,
      };
    })
    .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));
}
