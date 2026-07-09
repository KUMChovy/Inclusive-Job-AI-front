import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReclutadorChat, useReclutadorChatHistorial } from "../../assets/Hook/Reclutador/useDomain";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";

// ── Sugerencias rápidas ────────────────────────────────────
const SUGERENCIAS = [
  "¿Cuáles son los mejores postulantes para mi vacante activa?",
  "¿Cómo filtro candidatos por habilidades o discapacidad?",
  "¿Cómo publico una nueva vacante?",
  "¿Cómo reviso los reportes de mis vacantes?",
];

const MENSAJE_BIENVENIDA = {
  tipo: "bot",
  texto:
    "👋 ¡Hola! Soy el asistente de Inclusive Job.\n\nPuedo ayudarte a:\n• Encontrar los mejores postulantes para tus vacantes\n• Resolver dudas sobre el uso del sistema\n• Orientarte en procesos de reclutamiento\n\n¿En qué te ayudo hoy?",
};

// Duración de la animación de cierre del panel (debe coincidir con @keyframes chatSlideOut)
const CLOSE_ANIM_MS = 220;

function mapHistorialAMensajes(rows = []) {
  if (!rows.length) return [MENSAJE_BIENVENIDA];

  const mapeados = [];
  rows.forEach((row) => {
    if (row.mensaje_usuario) {
      mapeados.push({ tipo: "usuario", texto: row.mensaje_usuario });
    }
    if (row.respuesta_ia) {
      mapeados.push({ tipo: "bot", texto: row.respuesta_ia });
    }
  });

  return mapeados.length ? mapeados : [MENSAJE_BIENVENIDA];
}

// ── Store compartido entre páginas ─────────────────────────
let chatStore = { open: false, mensajes: [MENSAJE_BIENVENIDA] };
const listeners = new Set();

function setChatStore(updater) {
  chatStore = typeof updater === "function" ? updater(chatStore) : { ...chatStore, ...updater };
  listeners.forEach((l) => l());
}
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function getSnapshot() { return chatStore; }

// ── Ícono bot SVG ──────────────────────────────────────────
function BotIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="3" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <circle cx="9"  cy="14" r="1.2" fill={color} stroke="none" />
      <circle cx="15" cy="14" r="1.2" fill={color} stroke="none" />
      <path d="M9 17.5h6" strokeWidth="1.5" />
      <path d="M12 2v2" strokeWidth="1.5" />
    </svg>
  );
}

// ── Ícono enviar SVG ───────────────────────────────────────
function SendIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
  );
}

// ── Ícono cerrar SVG ───────────────────────────────────────
function CloseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ── Ícono chat SVG ─────────────────────────────────────────
function ChatIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h8M8 14h5" strokeWidth="1.5" />
    </svg>
  );
}

// ── Dots de carga ──────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: t.textMuted,
            display: "inline-block",
            animation: "dotBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Burbuja de mensaje ─────────────────────────────────────
function Burbuja({ msg }) {
  const esUsuario = msg.tipo === "usuario";
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: "8px",
      justifyContent: esUsuario ? "flex-end" : "flex-start",
      animation: "msgIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
    }}>
      {!esUsuario && (
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
          background: t.accentSoft, border: `1px solid ${t.accentBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BotIcon size={14} color={t.accent} />
        </div>
      )}
      <div style={{
        maxWidth: "78%",
        padding: "10px 14px",
        borderRadius: esUsuario ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        fontSize: "13px",
        lineHeight: "1.55",
        whiteSpace: "pre-line",
        background: esUsuario
          ? t.gradient
          : msg.error
            ? "rgba(239,68,68,0.08)"
            : t.bgElevated,
        color: esUsuario ? "#fff" : msg.error ? "#fca5a5" : t.textPrimary,
        border: esUsuario
          ? "none"
          : msg.error
            ? "1px solid rgba(239,68,68,0.25)"
            : `1px solid ${t.border}`,
        boxShadow: esUsuario
          ? `0 4px 12px ${t.accentGlow}`
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {msg.texto}
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────
export default function ChatBot() {
  const { open, mensajes } = useSyncExternalStore(subscribe, getSnapshot);
  const [mensaje, setMensaje] = useState("");
  const { enviarMensaje, loading } = useReclutadorChat();
  const { cargarHistorial } = useReclutadorChatHistorial();
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  // Controla el montaje/desmontaje del panel para poder animar el cierre
  // (antes el panel desaparecía de golpe porque se dejaba de renderizar
  // apenas `open` pasaba a false).
  const [panelVisible, setPanelVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const esInicio = mensajes.length === 1;

  const setOpen = (v) =>
    setChatStore((prev) => ({ ...prev, open: typeof v === "function" ? v(prev.open) : v }));

  const setMensajes = (v) =>
    setChatStore((prev) => ({ ...prev, mensajes: typeof v === "function" ? v(prev.mensajes) : v }));

  // Carga el historial guardado en BD una sola vez, solo si todavía no hay
  // conversación (mensajes.length === 1 -> solo está el mensaje de bienvenida).
  // Así, si el usuario navega entre páginas del portal y este componente se
  // vuelve a montar, no pisa una conversación que ya está en curso.
  useEffect(() => {
    if (mensajes.length > 1) return;

    let active = true;
    cargarHistorial()
      .then((rows) => {
        if (!active || !rows?.length) return;
        setMensajes(mapHistorialAMensajes(rows));
      })
      .catch(() => {
        // Si falla, simplemente se queda el mensaje de bienvenida.
      });

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza el montaje del panel con el estado global `open`
  useEffect(() => {
    if (open) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsClosing(false);
      setPanelVisible(true);
    } else {
      setIsClosing(true);
      closeTimerRef.current = setTimeout(() => {
        setPanelVisible(false);
        setIsClosing(false);
      }, CLOSE_ANIM_MS);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [mensajes, loading, open]);

  // Focus input al abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  const enviar = async (texto) => {
    const contenido = texto.trim();
    if (!contenido || loading) return;
    setMensajes((prev) => [...prev, { tipo: "usuario", texto: contenido }]);
    setMensaje("");
    try {
      const respuesta = await enviarMensaje(contenido);
      setMensajes((prev) => [
        ...prev,
        { tipo: "bot", texto: respuesta || "No obtuve respuesta, intenta de nuevo." },
      ]);
    } catch (err) {
      setMensajes((prev) => [
        ...prev,
        { tipo: "bot", texto: err?.message || "Ocurrió un error al contactar al asistente.", error: true },
      ]);
    }
  };

  return (
    <>
      <style>{`
        @keyframes dotBounce {
          0%,80%,100% { transform: translateY(0); opacity: 0.4; }
          40%          { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatSlideOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(14px) scale(0.96); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fabPulse {
          0%,100% { box-shadow: 0 0 0 0 ${t.accentGlow}; }
          50%      { box-shadow: 0 0 0 8px transparent; }
        }
        .chat-input::placeholder { color: ${t.textMuted}; }
        .chat-input:focus { outline: none; border-color: ${t.accent} !important; box-shadow: 0 0 0 3px ${t.accentGlow}; }
        .sugerencia-btn:hover { background: ${t.accentSoft} !important; border-color: ${t.accentBorder} !important; color: ${t.accent} !important; }
        .chat-fab { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .chat-fab:hover { transform: scale(1.08); }
        .chat-fab:active { transform: scale(0.92); }
        .chat-close-btn:hover { background: rgba(255,255,255,0.26) !important; transform: rotate(90deg); }
        .chat-close-btn:active { transform: rotate(90deg) scale(0.86); }
        .chat-send-btn:active { transform: scale(0.92) !important; }
      `}</style>

      {/* ── Botón flotante ── */}
      <button
        className="chat-fab"
        onClick={() => setOpen((prev) => !prev)}
        title={open ? "Cerrar chat" : "Abrir asistente"}
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "52px", height: "52px", borderRadius: "50%",
          background: t.gradient,
          border: "none", cursor: "pointer", zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff",
          boxShadow: `0 8px 24px ${t.accentGlow}, 0 2px 8px rgba(0,0,0,0.18)`,
          animation: !open ? "fabPulse 3s ease-in-out infinite" : "none",
        }}
      >
        <span style={{
          display: "inline-flex",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          transform: open ? "rotate(225deg)" : "rotate(0deg)",
        }}>
          {open ? <CloseIcon size={18} /> : <ChatIcon size={22} />}
        </span>
      </button>

      {/* ── Ventana del chat ── */}
      {panelVisible && (
        <div style={{
          position: "fixed", bottom: "88px", right: "24px",
          width: "380px", height: "580px",
          background: t.bgSurface,
          border: `1px solid ${t.border}`,
          borderRadius: "20px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.22), 0 0 0 1px ${t.accentBorder}`,
          display: "flex", flexDirection: "column",
          zIndex: 50, overflow: "hidden",
          transformOrigin: "bottom right",
          pointerEvents: isClosing ? "none" : "auto",
          animation: isClosing
            ? "chatSlideOut 0.22s cubic-bezier(0.4,0,1,1) forwards"
            : "chatSlideIn 0.25s cubic-bezier(0.34,1.2,0.64,1)",
        }}>

          {/* Header */}
          <div style={{
            background: t.gradient,
            padding: "16px 18px",
            display: "flex", alignItems: "center", gap: "12px",
            flexShrink: 0,
            position: "relative", overflow: "hidden",
          }}>
            {/* Círculo decorativo — pointerEvents:none para que NO bloquee los clics
                del botón de cerrar */}
            <div style={{
              position: "absolute", top: "-30px", right: "-20px",
              width: "100px", height: "100px", borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }} />

            {/* Avatar bot */}
            <div style={{
              width: "38px", height: "38px", borderRadius: "12px",
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <BotIcon size={20} color="#fff" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                Asistente InclusiveJob
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: "11.5px", color: "rgba(255,255,255,0.78)", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: loading ? "#fbbf24" : "#34d399",
                  display: "inline-block",
                  boxShadow: loading ? "0 0 6px #fbbf24" : "0 0 6px #34d399",
                }} />
                {loading ? "Escribiendo..." : "En línea"}
              </p>
            </div>

            <button
              className="chat-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              style={{
                width: "30px", height: "30px", borderRadius: "8px",
                background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff", flexShrink: 0,
                transition: "background 0.15s, transform 0.2s ease",
                position: "relative", zIndex: 1,
              }}
            >
              <CloseIcon size={14} />
            </button>
          </div>

          {/* Mensajes */}
          <div
            ref={scrollRef}
            style={{
              flex: 1, overflowY: "auto", padding: "16px",
              display: "flex", flexDirection: "column", gap: "10px",
              background: t.bgElevated,
              scrollbarWidth: "thin",
              scrollbarColor: `${t.border} transparent`,
            }}
          >
            {mensajes.map((msg, i) => (
              <Burbuja key={i} msg={msg} />
            ))}

            {/* Sugerencias solo al inicio */}
            {esInicio && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "36px", marginTop: "4px" }}>
                {SUGERENCIAS.map((s, idx) => (
                  <button
                    key={s}
                    className="sugerencia-btn"
                    onClick={() => enviar(s)}
                    style={{
                      textAlign: "left", fontSize: "12px", padding: "8px 12px",
                      borderRadius: "10px", cursor: "pointer",
                      border: `1px solid ${t.border}`,
                      background: t.bgSurface,
                      color: t.textSecondary,
                      fontWeight: 500, lineHeight: 1.4,
                      transition: "all 0.15s ease",
                      animation: "msgIn 0.3s ease both",
                      animationDelay: `${0.15 + idx * 0.06}s`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  background: t.accentSoft, border: `1px solid ${t.accentBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <BotIcon size={14} color={t.accent} />
                </div>
                <div style={{
                  padding: "10px 14px", borderRadius: "18px 18px 18px 4px",
                  background: t.bgSurface, border: `1px solid ${t.border}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px",
            borderTop: `1px solid ${t.border}`,
            background: t.bgSurface,
            display: "flex", gap: "8px", alignItems: "center",
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Escribe un mensaje..."
              value={mensaje}
              disabled={loading}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviar(mensaje)}
              style={{
                flex: 1, padding: "10px 14px", fontSize: "13px",
                borderRadius: "12px",
                border: `1px solid ${t.border}`,
                background: t.bgElevated,
                color: t.textPrimary,
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
            <button
              className="chat-send-btn"
              onClick={() => enviar(mensaje)}
              disabled={loading || !mensaje.trim()}
              style={{
                width: "38px", height: "38px", borderRadius: "10px",
                border: "none", cursor: loading || !mensaje.trim() ? "not-allowed" : "pointer",
                background: loading || !mensaje.trim() ? t.border : t.gradient,
                color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s ease",
                boxShadow: !loading && mensaje.trim() ? `0 4px 12px ${t.accentGlow}` : "none",
              }}
              onMouseEnter={(e) => { if (!loading && mensaje.trim()) e.currentTarget.style.transform = "scale(1.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <SendIcon size={15} />
            </button>
          </div>

          {/* Footer mínimo */}
          <div style={{
            padding: "6px 14px 8px",
            textAlign: "center", fontSize: "10.5px",
            color: t.textMuted,
            background: t.bgSurface,
            borderTop: `1px solid ${t.border}`,
            flexShrink: 0,
          }}>
            InclusiveJob IA · Respuestas generadas por IA
          </div>
        </div>
      )}
    </>
  );
}