import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAnalisisCvIA,
  usePostulanteChat,
  usePostulanteChatHistorial,
  useRecomendacionVacantesIA,
  usePostulacionesEntrevistaIA,
} from "../assets/Hook/Postulante/useDomain";
import EntrevistaModal from "./modal_entrevista";
import EntrevistaRealModal from "./modal_entrevista_real";

const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  bg: "#f7f7fb",
  border: "#e5e5ea",
};

const DEFAULT_MESSAGES = [
  { sender: "bot", text: "Hola! En que puedo ayudarte hoy?" },
];

function cleanAiText(value) {
  return String(value ?? "")
    .replace(/\[INSERTAR % O NUMERO\]/gi, "[PORCENTAJE O METRICA]")
    .replace(/\[INSERTAR % O NÚMERO\]/gi, "[PORCENTAJE O METRICA]")
    .replace(/\[INSERTAR %\]/gi, "[PORCENTAJE O METRICA]")
    .replace(/\[INSERTAR NUMERO\]/gi, "[PORCENTAJE O METRICA]")
    .replace(/\[INSERTAR NÚMERO\]/gi, "[PORCENTAJE O METRICA]")
    .replace(/\[INSERTAR\]/gi, "[PORCENTAJE O METRICA]");
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

// ── Ícono micrófono (notificación de entrevista solicitada) ──
function MicBadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <path d="M12 18v4M8 22h8" />
    </svg>
  );
}

function formatVacantesRecomendadas(recomendaciones = []) {
  if (!recomendaciones.length) {
    return "No encontre vacantes nuevas para recomendarte por ahora. Revisa que tu perfil y discapacidades esten completos.";
  }

  return "Estas son mis recomendaciones para ti. Puedes abrir cualquiera para ver el detalle completo.";
}

function formatPostulacionesEntrevista(postulaciones = []) {
  if (!postulaciones.length) {
    return "Aun no tienes postulaciones activas. Postulate a una vacante para poder simular una entrevista sobre ella.";
  }

  return "Elige la vacante a la que te postulaste para simular una entrevista sobre ella.";
}

function formatCvAnalysis(analisis) {
  if (!analisis) {
    return "No pude generar recomendaciones para tu CV en este momento.";
  }

  const score = analisis.diagnostico_ats?.puntuacion;
  const lines = [];
  if (score) lines.push(`Puntuacion ATS estimada: ${score}/10.`);
  lines.push(cleanAiText(analisis.resumen_chat ?? "Revise tu CV y encontre mejoras importantes."));

  if (analisis.nota) {
    lines.push("", cleanAiText(analisis.nota));
  }

  lines.push("", "Analisis generado con IA; puede equivocarse.");
  lines.push("", "Para una mejor lectura ve a la pestaña de certificaciones");
  return lines.filter((line) => line !== undefined && line !== null).join("\n");
}

function parseStoredPayload(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function mapHistoryToMessages(rows = []) {
  if (!rows.length) return DEFAULT_MESSAGES;

  const mapped = [];
  rows.forEach((row) => {
    if (row.mensaje_usuario) {
      mapped.push({ sender: "user", text: row.mensaje_usuario });
    }

    const payload = parseStoredPayload(row.respuesta_ia);
    if (row.resultado === "recomendar_vacantes" && payload?.recomendaciones) {
      mapped.push({
        sender: "bot",
        type: "recommendations",
        text: payload.text || formatVacantesRecomendadas(payload.recomendaciones),
        recomendaciones: payload.recomendaciones,
      });
      return;
    }

    if (row.resultado === "analizar_cv" && payload?.analisis) {
      mapped.push({
        sender: "bot",
        type: "cv-analysis",
        text: payload.text ? cleanAiText(payload.text) : formatCvAnalysis(payload.analisis),
        analisis: payload.analisis,
      });
      return;
    }

    // Resultado de entrevista SIMULADA (practica) — sin cambios.
    if (row.resultado === "simular_entrevista" && payload?.evaluacion) {
      mapped.push({
        sender: "bot",
        type: "entrevista-resultado",
        text: payload.text || "Evaluacion de tu entrevista simulada lista.",
        evaluacion: payload.evaluacion,
      });
      return;
    }

    // Resultado de entrevista REAL (proceso de seleccion) — nuevo.
    if (row.resultado === "entrevista_real_realizada" && payload?.evaluacion) {
      mapped.push({
        sender: "bot",
        type: "entrevista-resultado",
        text: payload.text || "Evaluacion de tu entrevista lista.",
        evaluacion: payload.evaluacion,
      });
      return;
    }

    // Notificacion de "un reclutador te invito a una entrevista SIMULADA de
    // practica" — se deja intacta por compatibilidad con notificaciones
    // antiguas ya guardadas en `chabots` antes de este cambio.
    if (row.resultado === "entrevista_solicitada" && payload?.vacante) {
      mapped.push({
        sender: "bot",
        type: "entrevista-solicitada",
        text: payload.text || `Un reclutador te invito a una entrevista simulada para "${payload.vacante.titulo_puesto}".`,
        vacante: payload.vacante,
      });
      return;
    }

    // Notificacion de "un reclutador te invito a una entrevista REAL",
    // guardada por solicitar_entrevista.php (lado Reclutador) directamente
    // en esta misma tabla `chabots`, usando el id_usuario de este postulante.
    if (row.resultado === "entrevista_real_solicitada" && payload?.vacante) {
      mapped.push({
        sender: "bot",
        type: "entrevista-real-solicitada",
        text: payload.text || `Un reclutador te invito a una entrevista para "${payload.vacante.titulo_puesto}".`,
        vacante: payload.vacante,
      });
      return;
    }

    if (row.respuesta_ia) {
      mapped.push({ sender: "bot", text: payload?.text || row.respuesta_ia });
    }
  });

  return mapped.length ? mapped : DEFAULT_MESSAGES;
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

function PostulacionesEntrevistaCards({ postulaciones = [], onSimular }) {
  if (!postulaciones.length) return null;

  return (
    <div style={styles.recommendationsList}>
      {postulaciones.map((item) => {
        const vacante = item.vacante ?? {};
        const idVacante = getVacanteId(item);

        return (
          <div key={item.id_postulacion ?? idVacante} style={styles.recommendationCard}>
            <div style={styles.recommendationTop}>
              <span style={styles.recommendationBadge}>
                {item.estado_postulacion ?? "Postulacion"}
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

            <button
              type="button"
              onClick={() => onSimular(vacante)}
              disabled={!idVacante}
              style={{
                ...styles.recommendationButton,
                ...(!idVacante ? styles.recommendationButtonDisabled : {}),
              }}
            >
              Simular entrevista
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Tarjeta de notificación: "un reclutador te invitó a entrevista SIMULADA" ──
// (se conserva intacta por compatibilidad con notificaciones antiguas)
function EntrevistaSolicitadaCard({ vacante, onIniciar }) {
  const idVacante = getVacanteId({ vacante });

  return (
    <div style={styles.entrevistaSolicitadaCard}>
      <div style={styles.entrevistaSolicitadaTop}>
        <span style={styles.entrevistaSolicitadaBadge}>
          <MicBadgeIcon /> Entrevista simulada
        </span>
      </div>
      <strong style={styles.recommendationTitle}>
        {vacante?.titulo_puesto ?? "Vacante"}
      </strong>
      {vacante?.empresa && (
        <span style={styles.recommendationCompany}>{vacante.empresa}</span>
      )}
      <button
        type="button"
        onClick={() => onIniciar(vacante)}
        disabled={!idVacante}
        style={{
          ...styles.recommendationButton,
          ...(!idVacante ? styles.recommendationButtonDisabled : {}),
        }}
      >
        Iniciar entrevista
      </button>
    </div>
  );
}

// ── Tarjeta de notificación: "un reclutador te invitó a entrevista REAL" ──
function EntrevistaRealSolicitadaCard({ vacante, onIniciar }) {
  const idVacante = getVacanteId({ vacante });

  return (
    <div style={styles.entrevistaRealCard}>
      <div style={styles.entrevistaSolicitadaTop}>
        <span style={styles.entrevistaRealBadge}>
          <MicBadgeIcon /> Entrevista real
        </span>
      </div>
      <strong style={styles.recommendationTitle}>
        {vacante?.titulo_puesto ?? "Vacante"}
      </strong>
      {vacante?.empresa && (
        <span style={styles.recommendationCompany}>{vacante.empresa}</span>
      )}
      <button
        type="button"
        onClick={() => onIniciar(vacante)}
        disabled={!idVacante}
        style={{
          ...styles.recommendationButton,
          ...(!idVacante ? styles.recommendationButtonDisabled : {}),
        }}
      >
        Iniciar entrevista
      </button>
    </div>
  );
}

export default function ChatBubble() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [entrevista, setEntrevista] = useState({ open: false, vacante: null });
  const [entrevistaReal, setEntrevistaReal] = useState({ open: false, vacante: null });

  const { enviarMensaje, loading: sendingMessage } = usePostulanteChat();
  const { cargarHistorial } = usePostulanteChatHistorial();
  const {
    recomendarVacantes,
    loading: recommendingVacantes,
  } = useRecomendacionVacantesIA();
  const {
    analizarCV,
    loading: reviewingCv,
  } = useAnalisisCvIA();
  const {
    listarPostulaciones,
    loading: loadingPostulaciones,
  } = usePostulacionesEntrevistaIA();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    let active = true;

    cargarHistorial()
      .then((rows) => {
        if (!active || !rows?.length) return;
        const mensajesMapeados = mapHistoryToMessages(rows);
        setMessages(mensajesMapeados);

        // Si la última fila del historial es una notificación de entrevista
        // (simulada o real) recién generada, marca como no leído para que
        // el postulante vea el badge en la burbuja, igual que con cualquier
        // otra respuesta nueva del bot.
        const ultimaFila = rows[rows.length - 1];
        if (
          (ultimaFila?.resultado === "entrevista_solicitada" ||
            ultimaFila?.resultado === "entrevista_real_solicitada") &&
          !openRef.current
        ) {
          setHasUnread(true);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [cargarHistorial]);

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

  async function handleReviewCv() {
    if (typing || sendingMessage || recommendingVacantes || reviewingCv) return;

    setMessages((prev) => [...prev, { sender: "user", text: "Revisar mi CV con IA" }]);
    setTyping(true);

    try {
      const data = await analizarCV();
      const text = data.chat_resumen ? cleanAiText(data.chat_resumen) : formatCvAnalysis(data.analisis);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "cv-analysis",
          text,
          analisis: data.analisis,
        },
      ]);
      if (!openRef.current) setHasUnread(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No pude revisar tu CV ahora. Intenta de nuevo en un momento.";
      setMessages((prev) => [...prev, { sender: "bot", text: message }]);
    } finally {
      setTyping(false);
    }
  }

  async function handleSimularEntrevista() {
    if (typing || sendingMessage || recommendingVacantes || reviewingCv || loadingPostulaciones) return;

    setMessages((prev) => [...prev, { sender: "user", text: "Simular entrevista" }]);
    setTyping(true);

    try {
      const postulaciones = await listarPostulaciones();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "postulaciones-entrevista",
          text: formatPostulacionesEntrevista(postulaciones),
          postulaciones,
        },
      ]);
      if (!openRef.current) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "No pude cargar tus postulaciones ahora. Intenta de nuevo en un momento." },
      ]);
    } finally {
      setTyping(false);
    }
  }


  async function handleAppHelp() {
      if (typing || sendingMessage || recommendingVacantes || reviewingCv) return;

      const pregunta = "Tengo dudas sobre cómo funciona la aplicación InclusiveJob.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: "Dudas sobre la aplicación",
        },
      ]);

      setTyping(true);

      try {
        const reply = await enviarMensaje(pregunta);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: reply,
          },
        ]);

        if (!openRef.current) setHasUnread(true);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "No pude responder en este momento.",
          },
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

  function handleOpenCertificaciones() {
    navigate("/postulante/certificaciones");
    setOpen(false);
    setHasUnread(false);
  }

  // ── Entrevista SIMULADA (practica) — handlers sin cambios ──
  function handleAbrirEntrevista(vacante) {
    if (!vacante?.id_vacante) return;
    setEntrevista({ open: true, vacante });
  }

  function handleCerrarEntrevista() {
    setEntrevista({ open: false, vacante: null });
  }

  function handleEvaluacionEntrevista(payload) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        type: "entrevista-resultado",
        text: cleanAiText(payload.text),
        evaluacion: payload.evaluacion,
      },
    ]);
    if (!openRef.current) setHasUnread(true);
  }

  // ── Entrevista REAL (proceso de seleccion) — handlers nuevos ──
  function handleAbrirEntrevistaReal(vacante) {
    if (!vacante?.id_vacante) return;
    setEntrevistaReal({ open: true, vacante });
  }

  function handleCerrarEntrevistaReal() {
    setEntrevistaReal({ open: false, vacante: null });
  }

  function handleEvaluacionEntrevistaReal(payload) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        type: "entrevista-resultado",
        text: cleanAiText(payload.text),
        evaluacion: payload.evaluacion,
      },
    ]);
    if (!openRef.current) setHasUnread(true);
  }

  const isSending = typing || sendingMessage || recommendingVacantes || reviewingCv || loadingPostulaciones;

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
                  ...(m.type === "recommendations" || m.type === "postulaciones-entrevista" || m.type === "entrevista-solicitada" || m.type === "entrevista-real-solicitada" ? styles.msgRecommendations : {}),
                }}
              >
                {m.text}
                {m.type === "recommendations" && (
                  <RecommendationCards
                    recomendaciones={m.recomendaciones}
                    onOpenVacante={handleOpenVacante}
                  />
                )}
                {m.type === "postulaciones-entrevista" && (
                  <PostulacionesEntrevistaCards
                    postulaciones={m.postulaciones}
                    onSimular={handleAbrirEntrevista}
                  />
                )}
                {m.type === "entrevista-solicitada" && (
                  <EntrevistaSolicitadaCard
                    vacante={m.vacante}
                    onIniciar={handleAbrirEntrevista}
                  />
                )}
                {m.type === "entrevista-real-solicitada" && (
                  <EntrevistaRealSolicitadaCard
                    vacante={m.vacante}
                    onIniciar={handleAbrirEntrevistaReal}
                  />
                )}
                {m.type === "cv-analysis" && (
                  <button
                    type="button"
                    onClick={handleOpenCertificaciones}
                    style={styles.cvAnalysisButton}
                  >
                    Ver recomendaciones completas
                  </button>
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
            <button
              onClick={handleReviewCv}
              disabled={isSending}
              style={{
                ...styles.quickActionBtn,
                ...(isSending ? styles.quickActionBtnDisabled : {}),
              }}
            >
              Revisar CV
            </button>
            <button
              onClick={handleSimularEntrevista}
              disabled={isSending}
              style={{
                ...styles.quickActionBtn,
                ...(isSending ? styles.quickActionBtnDisabled : {}),
              }}
            >
              Simular entrevista
            </button>
            <button
              onClick={handleAppHelp}
              disabled={isSending}
              style={{
                ...styles.quickActionBtn,
                ...(isSending ? styles.quickActionBtnDisabled : {}),
              }}
            >
              Ayuda
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

      {entrevista.open && entrevista.vacante && (
        <EntrevistaModal
          vacante={entrevista.vacante}
          onClose={handleCerrarEntrevista}
          onEvaluacionLista={handleEvaluacionEntrevista}
        />
      )}

      {entrevistaReal.open && entrevistaReal.vacante && (
        <EntrevistaRealModal
          vacante={entrevistaReal.vacante}
          onClose={handleCerrarEntrevistaReal}
          onEvaluacionLista={handleEvaluacionEntrevistaReal}
        />
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
  cvAnalysisButton: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 58%, #0ea5e9 100%)",
    color: "#fff",
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 10,
    boxShadow: "0 8px 18px rgba(79, 70, 229, 0.22)",
  },
  entrevistaSolicitadaCard: {
    marginTop: 10,
    border: "1px solid #fde68a",
    borderRadius: 12,
    background: "linear-gradient(180deg, #fffbeb 0%, #fff8e8 100%)",
    padding: 10,
    boxShadow: "0 8px 20px rgba(217, 119, 6, 0.1)",
  },
  entrevistaSolicitadaTop: {
    display: "flex",
    marginBottom: 7,
  },
  entrevistaSolicitadaBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    background: "#fef3c7",
    border: "1px solid #fcd34d",
    color: "#92400e",
    fontSize: 11,
    fontWeight: 800,
    padding: "3px 9px",
    whiteSpace: "nowrap",
  },
  entrevistaRealCard: {
    marginTop: 10,
    border: "1px solid #bbf7d0",
    borderRadius: 12,
    background: "linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)",
    padding: 10,
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.1)",
  },
  entrevistaRealBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    background: "#d1fae5",
    border: "1px solid #6ee7b7",
    color: "#065f46",
    fontSize: 11,
    fontWeight: 800,
    padding: "3px 9px",
    whiteSpace: "nowrap",
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
    flexWrap: "wrap",
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
