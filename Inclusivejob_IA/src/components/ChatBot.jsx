import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePostulanteChat,
  useRecomendacionVacantesIA,
} from "../assets/Hook/Postulante/useDomain";

const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  bg: "#f7f7fb",
  border: "#e5e5ea",
};

const CHAT_STORAGE_KEY = "inclusivejob_postulante_chat";
const DEFAULT_MESSAGES = [
  { sender: "bot", text: "Hola! En que puedo ayudarte hoy?" },
];

function loadChatState() {
  if (typeof window === "undefined") {
    return { messages: DEFAULT_MESSAGES, open: false, hasUnread: false };
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      return { messages: DEFAULT_MESSAGES, open: false, hasUnread: false };
    }

    const parsed = JSON.parse(raw);
    return {
      messages: Array.isArray(parsed.messages) && parsed.messages.length
        ? parsed.messages
        : DEFAULT_MESSAGES,
      open: Boolean(parsed.open),
      hasUnread: Boolean(parsed.hasUnread),
    };
  } catch {
    return { messages: DEFAULT_MESSAGES, open: false, hasUnread: false };
  }
}

function saveChatState({ messages, open, hasUnread }) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        messages: messages.slice(-40),
        open,
        hasUnread,
      })
    );
  } catch {
    // Si el navegador bloquea localStorage, el chat sigue funcionando en memoria.
  }
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

function formatVacantesRecomendadas(recomendaciones = []) {
  if (!recomendaciones.length) {
    return "No encontre vacantes nuevas para recomendarte por ahora. Revisa que tu perfil y discapacidades esten completos.";
  }

  return "Estas son mis recomendaciones para ti. Puedes abrir cualquiera para ver el detalle completo.";
}

function getVacanteId(item) {
  return Number(item?.id_vacante ?? item?.vacante?.id_vacante ?? 0);
}

function RecommendationCards({ recomendaciones = [], onOpenVacante }) {
  if (!recomendaciones.length) return null;

  return (
    <div style={styles.recommendationsList}>
      {recomendaciones.map((item) => {
        const vacante = item.vacante ?? {};
        const idVacante = getVacanteId(item);

        return (
          <div key={idVacante || vacante.titulo_puesto} style={styles.recommendationCard}>
            <div style={styles.recommendationTop}>
              <span style={styles.recommendationBadge}>
                {item.compatibilidad ?? 0}% compatible
              </span>
              <span style={styles.recommendationMode}>
                {vacante.modalidad ?? "Modalidad"}
              </span>
            </div>

            <strong style={styles.recommendationTitle}>
              {vacante.titulo_puesto ?? "Vacante"}
            </strong>
            <span style={styles.recommendationCompany}>
              {vacante.empresa ?? "Empresa"}
            </span>
            {item.motivo && (
              <p style={styles.recommendationReason}>{item.motivo}</p>
            )}

            <button
              type="button"
              onClick={() => onOpenVacante(item)}
              disabled={!idVacante}
              style={{
                ...styles.recommendationButton,
                ...(!idVacante ? styles.recommendationButtonDisabled : {}),
              }}
            >
              Ver vacante
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function ChatBubble() {
  const navigate = useNavigate();
  const [initialChatState] = useState(() => loadChatState());
  const [open, setOpen] = useState(initialChatState.open);
  const [messages, setMessages] = useState(initialChatState.messages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(initialChatState.hasUnread);

  const { enviarMensaje, loading: sendingMessage } = usePostulanteChat();
  const {
    recomendarVacantes,
    loading: recommendingVacantes,
  } = useRecomendacionVacantesIA();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    saveChatState({ messages, open, hasUnread });
  }, [messages, open, hasUnread]);

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
    if (!text || typing || sendingMessage) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTyping(true);

    try {
      const reply = await enviarMensaje(text);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      if (!openRef.current) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Ocurrio un error, intenta de nuevo." },
      ]);
    } finally {
      setTyping(false);
    }
  }

  async function handleRecommendVacantes() {
    if (typing || sendingMessage || recommendingVacantes) return;

    setMessages((prev) => [...prev, { sender: "user", text: "Recomiendame vacantes" }]);
    setTyping(true);

    try {
      const data = await recomendarVacantes();
      const recomendaciones = data.recomendaciones ?? [];
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "recommendations",
          text: formatVacantesRecomendadas(recomendaciones),
          recomendaciones,
        },
      ]);
      if (!openRef.current) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "No pude generar recomendaciones ahora. Intenta de nuevo en un momento." },
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

  function handleOpenVacante(item) {
    const idVacante = getVacanteId(item);
    if (!idVacante) return;

    navigate(`/postulante/vacantes?vacante=${idVacante}`, {
      state: { recomendacionIA: item },
    });
    setOpen(false);
    setHasUnread(false);
  }

  const isSending = typing || sendingMessage || recommendingVacantes;

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        style={styles.bubbleBtn}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {hasUnread && !open && <span style={styles.badge}>1</span>}
      </button>

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
                  ...(m.type === "recommendations" ? styles.msgRecommendations : {}),
                }}
              >
                {m.text}
                {m.type === "recommendations" && (
                  <RecommendationCards
                    recomendaciones={m.recomendaciones}
                    onOpenVacante={handleOpenVacante}
                  />
                )}
              </div>
            ))}

            {isSending && (
              <div style={styles.typingRow}>
                <span style={{ ...styles.dot, animationDelay: "0s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.15s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.3s" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.quickActions}>
            <button
              onClick={handleRecommendVacantes}
              disabled={isSending}
              style={{
                ...styles.quickActionBtn,
                ...(isSending ? styles.quickActionBtnDisabled : {}),
              }}
            >
              Recomendar vacantes
            </button>
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
              disabled={!input.trim() || isSending}
              aria-label="Enviar mensaje"
              style={{
                ...styles.sendBtn,
                ...(!input.trim() || isSending ? styles.sendBtnDisabled : {}),
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

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
    whiteSpace: "pre-line",
  },
  msgBot: {
    alignSelf: "flex-start",
    background: "#fff",
    border: `1px solid ${COLORS.border}`,
    borderBottomLeftRadius: 4,
    color: "#1f1f1f",
  },
  msgRecommendations: {
    maxWidth: "92%",
    width: "92%",
  },
  recommendationsList: {
    display: "grid",
    gap: 8,
    marginTop: 10,
  },
  recommendationCard: {
    border: "1px solid #ddd6fe",
    borderRadius: 12,
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    padding: 10,
    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.08)",
  },
  recommendationTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 7,
  },
  recommendationBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    background: "#eef2ff",
    border: "1px solid #c4b5fd",
    color: "#5b21b6",
    fontSize: 11,
    fontWeight: 800,
    padding: "3px 8px",
    whiteSpace: "nowrap",
  },
  recommendationMode: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  recommendationTitle: {
    display: "block",
    color: "#111827",
    fontSize: 13,
    lineHeight: 1.25,
    marginBottom: 2,
  },
  recommendationCompany: {
    display: "block",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  recommendationReason: {
    margin: "0 0 9px",
    color: "#475569",
    fontSize: 12,
    lineHeight: 1.35,
  },
  recommendationButton: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 58%, #0ea5e9 100%)",
    color: "#fff",
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(79, 70, 229, 0.22)",
  },
  recommendationButtonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
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
  quickActions: {
    display: "flex",
    gap: 8,
    padding: "8px 10px 0",
    background: "#fff",
    borderTop: `1px solid ${COLORS.border}`,
  },
  quickActionBtn: {
    border: `1px solid ${COLORS.primary}`,
    background: "#eef2ff",
    color: COLORS.primaryDark,
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  quickActionBtnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
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
