import { useState, useRef, useEffect } from "react";

/**
 * ChatBubble
 * ------------------------------------------------------------
 * Burbuja de chat flotante para React. Se queda fija en la
 * esquina inferior derecha y no afecta el layout del resto de
 * la página (position: fixed).
 *
 * Uso:
 *   import ChatBubble from "./ChatBubble";
 *   ...
 *   <ChatBubble /> // colócalo una sola vez, cerca de la raíz de tu app
 *
 * Para conectar tu backend real, reemplaza la función
 * `getBotReply` por una llamada a tu API (ver comentario dentro).
 */

const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  bg: "#f7f7fb",
  border: "#e5e5ea",
};

async function getBotReply(userText) {
  // ---------------------------------------------------------
  // CONECTA TU BACKEND AQUÍ
  //
  // const res = await fetch("https://tu-backend.com/api/chat", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ message: userText }),
  // });
  // const data = await res.json();
  // return data.reply;
  // ---------------------------------------------------------

  const res = await fetch(
    "http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/chat/chatbot.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "mensaje=" + encodeURIComponent(userText),
    }
  );

  if (!res.ok) {
    throw new Error("Error del servidor");
  }

  return await res.text();
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
    </svg>
  );
}

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev;
      if (next) setHasUnread(false);
      return next;
    });
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || typing) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTyping(true);

    try {
      const reply = await getBotReply(text);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      if (!open) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Ocurrió un error, intenta de nuevo." },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 90) + "px";
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={toggleOpen}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        style={styles.bubbleBtn}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {hasUnread && !open && <span style={styles.badge}>1</span>}
      </button>

      {/* Ventana de chat */}
      {open && (
        <div style={styles.window}>
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <span style={styles.statusDot} />
              Asistente virtual
            </div>
            <button
              onClick={toggleOpen}
              aria-label="Cerrar chat"
              style={styles.closeBtn}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div style={styles.messagesBox}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  ...(m.sender === "user" ? styles.msgUser : styles.msgBot),
                }}
              >
                {m.text}
              </div>
            ))}

            {typing && (
              <div style={styles.typingRow}>
                <span style={{ ...styles.dot, animationDelay: "0s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.15s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.3s" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputRow}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              style={styles.input}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || typing}
              aria-label="Enviar mensaje"
              style={{
                ...styles.sendBtn,
                ...(!input.trim() || typing ? styles.sendBtnDisabled : {}),
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Animación de "escribiendo..." (keyframes globales, se inyectan una vez) */}
      <style>{`
        @keyframes chat-typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

const styles = {
  bubbleBtn: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: COLORS.primary,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
    zIndex: 999999,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    background: "#ef4444",
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  },
  window: {
    position: "fixed",
    bottom: 96,
    right: 24,
    width: 340,
    maxWidth: "calc(100vw - 32px)",
    height: 460,
    maxHeight: "calc(100vh - 140px)",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 999999,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    background: COLORS.primary,
    color: "#fff",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 600,
    fontSize: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    opacity: 0.85,
    padding: 4,
    display: "flex",
    alignItems: "center",
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: COLORS.bg,
  },
  msg: {
    maxWidth: "78%",
    padding: "9px 13px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.4,
    wordWrap: "break-word",
  },
  msgBot: {
    alignSelf: "flex-start",
    background: "#fff",
    border: `1px solid ${COLORS.border}`,
    borderBottomLeftRadius: 4,
    color: "#1f1f1f",
  },
  msgUser: {
    alignSelf: "flex-end",
    background: COLORS.primary,
    color: "#fff",
    borderBottomRightRadius: 4,
  },
  typingRow: {
    alignSelf: "flex-start",
    display: "flex",
    gap: 4,
    padding: "10px 14px",
    background: "#fff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    borderBottomLeftRadius: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#aaa",
    animation: "chat-typing-bounce 1.1s infinite",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderTop: `1px solid ${COLORS.border}`,
    background: "#fff",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: `1px solid #e0e0e6`,
    borderRadius: 20,
    padding: "9px 14px",
    fontSize: 14,
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    maxHeight: 90,
  },
  sendBtn: {
    background: COLORS.primary,
    border: "none",
    color: "#fff",
    width: 36,
    height: 36,
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sendBtnDisabled: {
    background: "#c7c7d1",
    cursor: "not-allowed",
  },
};
