import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../../api/chat.js";
import "./ChatWidget.css";

const GREETING = "¡Hola! Soy el asistente de El Garage. Preguntame por el stock, precios, horarios o financiación.";

function getSessionId() {
  let id = sessionStorage.getItem("chat-session-id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("chat-session-id", id);
  }
  return id;
}

function getVisitor() {
  try {
    return JSON.parse(sessionStorage.getItem("chat-visitor") || "null");
  } catch {
    return null;
  }
}

function saveVisitor(visitor) {
  sessionStorage.setItem("chat-visitor", JSON.stringify(visitor));
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h16v11H8l-4 4V5z" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState(getVisitor);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, sending, open, visitor]);

  const handleStart = (e) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) return;
    const next = { name, phone: phoneInput.trim() };
    saveVisitor(next);
    setVisitor(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const reply = await sendChatMessage(text, history, getSessionId(), visitor);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-widget__panel">
          <div className="chat-widget__header">
            <span>Asistente El Garage</span>
            <button
              type="button"
              className="chat-widget__icon-btn"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
            >
              <CloseIcon />
            </button>
          </div>

          {!visitor ? (
            <form className="chat-widget__intro" onSubmit={handleStart}>
              <p className="chat-widget__intro-text">Antes de arrancar, contanos quién sos:</p>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Tu nombre"
                maxLength={60}
                required
                autoFocus
              />
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Tu WhatsApp (opcional)"
                maxLength={30}
              />
              <button type="submit" disabled={!nameInput.trim()}>
                Empezar a chatear
              </button>
            </form>
          ) : (
            <>
              <div className="chat-widget__messages" ref={listRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-widget__bubble chat-widget__bubble--${m.role}`}>
                    {m.content}
                  </div>
                ))}
                {sending && (
                  <div className="chat-widget__bubble chat-widget__bubble--assistant chat-widget__typing">
                    Escribiendo...
                  </div>
                )}
              </div>

              {error && <p className="chat-widget__error">{error}</p>}

              <form className="chat-widget__form" onSubmit={handleSubmit}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu consulta..."
                  maxLength={500}
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !input.trim()}>
                  Enviar
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className="chat-widget__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}
