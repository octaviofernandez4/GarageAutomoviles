import { useRef, useState } from "react";
import { sendChatMessage } from "../../api/chat.js";
import { CloseIcon, SendIcon, SparkleIcon } from "../../components/admin/icons.jsx";
import "./SimulateChatModal.css";

const TEST_VISITOR = { name: "Prueba interna (admin)", phone: undefined };

export default function SimulateChatModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const sessionIdRef = useRef(crypto.randomUUID());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || sending) return;

    const history = messages.map((m) => ({ role: m.role, content: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setText("");
    setSending(true);

    try {
      const reply = await sendChatMessage(value, history, sessionIdRef.current, TEST_VISITOR);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${err.message}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="sim-chat" onClick={(e) => e.stopPropagation()}>
        <div className="sim-chat__head">
          <div className="sim-chat__head-title">
            <SparkleIcon />
            <span>Simular Asistente Chat</span>
          </div>
          <button type="button" className="sim-chat__close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        <p className="sim-chat__note">
          Esto habla en vivo con el mismo asistente que ven los visitantes de la web. Queda guardado en
          Conversaciones marcado como prueba interna, no como un cliente real.
        </p>

        <div className="sim-chat__thread">
          {messages.length === 0 && (
            <div className="sim-chat__empty">Escribí algo como lo haría un cliente para probar el bot.</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`sim-chat__bubble sim-chat__bubble--${m.role}`}>
              {m.text}
            </div>
          ))}
          {sending && <div className="sim-chat__bubble sim-chat__bubble--assistant sim-chat__bubble--typing">Escribiendo…</div>}
        </div>

        <form className="sim-chat__form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribí un mensaje de prueba…"
            disabled={sending}
          />
          <button type="submit" disabled={sending || !text.trim()} aria-label="Enviar">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
