import { useEffect, useRef, useState } from "react";
import { ENDPOINTS } from "../assets/Hook/Postulante/apiPostulante";

/*
|--------------------------------------------------------------------------
| Modal: Entrevista REAL (solicitada por un reclutador)
|--------------------------------------------------------------------------
| Misma estructura, estilos e interaccion que EntrevistaModal (la
| entrevista simulada/practica): mismo layout de header/mensajes/footer,
| misma tarjeta de evaluacion mostrada dentro del modal, mismos botones
| "Cancelar entrevista" / "Finalizar y evaluar".
|
| La UNICA diferencia real es de donde vienen los datos: en vez de los
| 3 endpoints de la entrevista simulada (entrevista_iniciar.php,
| entrevista_responder.php, entrevista_finalizar.php), esta usa un solo
| endpoint (entrevista_real.php) que recibe { accion: "iniciar" |
| "responder" | "finalizar", ... } en el body.
|
| Cancelar SIEMPRE cierra sin evaluar ni guardar nada; solo
| "Finalizar y evaluar" llama al backend para calificar.
|
| NUEVO (entrevista real: solo una vez): si la llamada a "iniciar" falla
| (por ejemplo porque el backend responde 409 "ya realizaste esta
| entrevista"), el modal entra en estado `initError`: no se muestra el
| textarea de respuesta ni los botones de "Cancelar entrevista" /
| "Finalizar y evaluar" — solo un boton "Cerrar". Asi el postulante no
| puede escribir respuestas ni intentar finalizar una entrevista que el
| backend ya rechazo desde el inicio.
*/

const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  bg: "#f7f7fb",
  border: "#e5e5ea",
};

function CloseIcon({ size = 20 }) {
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

async function postJSON(body) {
  const res = await fetch(ENDPOINTS.ia.entrevistaReal, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.message || "Ocurrio un error en la entrevista.");
  }
  return data;
}

/**
 * EntrevistaRealModal
 * Modal centrado con un chat grande dedicado a la entrevista REAL de una
 * vacante especifica (proceso de seleccion, solicitada por un reclutador).
 * Cancelar SIEMPRE cierra sin evaluar ni guardar nada; solo
 * "Finalizar y evaluar" llama al backend para calificar.
 *
 * Props:
 * - vacante: { id_vacante, titulo_puesto, empresa, modalidad }
 * - onClose: () => void  (cancelar o cerrar despues de evaluar)
 * - onEvaluacionLista: (payload) => void  (para que el chat principal muestre el resumen)
 */
export default function EntrevistaRealModal({ vacante, onClose, onEvaluacionLista }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [starting, setStarting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [evaluacion, setEvaluacion] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  // NUEVO: true cuando "iniciar" fallo (p.ej. la entrevista ya fue
  // realizada anteriormente). Bloquea el input y los botones de accion.
  const [initError, setInitError] = useState(false);

  const messagesEndRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const data = await postJSON({ accion: "iniciar", id_vacante: vacante.id_vacante });
        setMessages([{ sender: "bot", text: data.mensaje }]);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "No se pudo iniciar la entrevista.");
        setInitError(true);
      } finally {
        setStarting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function buildHistorial() {
    return messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));
  }

  async function handleSend() {
    const texto = input.trim();
    if (!texto || loading || evaluacion || initError) return;

    const historial = buildHistorial();
    setMessages((prev) => [...prev, { sender: "user", text: texto }]);
    setInput("");
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await postJSON({
        accion: "responder",
        id_vacante: vacante.id_vacante,
        mensaje: texto,
        historial,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: data.mensaje }]);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo continuar la entrevista.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalizar() {
    if (loading || evaluacion || initError) return;
    setErrorMsg("");
    setLoading(true);

    try {
      const historial = buildHistorial();
      const data = await postJSON({
        accion: "finalizar",
        id_vacante: vacante.id_vacante,
        historial,
      });
      setEvaluacion(data.evaluacion);
      onEvaluacionLista?.({
        text: data.text,
        evaluacion: data.evaluacion,
        vacante,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo evaluar la entrevista. Intenta de nuevo.");
      // Si el backend rechazo el finalizar porque ya existia una
      // entrevista realizada (carrera entre dos pestañas), tambien
      // bloqueamos el modal igual que si hubiera fallado al iniciar.
      setInitError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const respuestasUsuario = messages.filter((m) => m.sender === "user").length;
  const puedeFinalizar = respuestasUsuario >= 2 && !evaluacion && !initError;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <div style={styles.headerTitle}>Entrevista</div>
            <div style={styles.headerSubtitle}>
              {vacante.titulo_puesto}
              {vacante.empresa ? ` · ${vacante.empresa}` : ""}
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={styles.closeBtn}>
            <CloseIcon />
          </button>
        </div>

        <div style={styles.messagesBox}>
          {starting && (
            <div style={styles.systemNote}>Preparando tu entrevista...</div>
          )}

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

          {loading && !starting && (
            <div style={styles.typingRow}>
              <span style={{ ...styles.dot, animationDelay: "0s" }} />
              <span style={{ ...styles.dot, animationDelay: "0.15s" }} />
              <span style={{ ...styles.dot, animationDelay: "0.3s" }} />
            </div>
          )}

          {evaluacion && (
            <div style={styles.evalCard}>
              <strong style={styles.evalScore}>{evaluacion.puntuacion}/10</strong>
              <p style={styles.evalText}>{evaluacion.resumen}</p>

              {evaluacion.fortalezas?.length > 0 && (
                <>
                  <div style={styles.evalHeading}>Fortalezas</div>
                  <ul style={styles.evalList}>
                    {evaluacion.fortalezas.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </>
              )}

              {evaluacion.areas_mejora?.length > 0 && (
                <>
                  <div style={styles.evalHeading}>Areas de mejora</div>
                  <ul style={styles.evalList}>
                    {evaluacion.areas_mejora.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </>
              )}

              <p style={styles.evalConsejo}>{evaluacion.consejo_final}</p>
              <p style={styles.evalDisclaimer}>Evaluacion generada con IA; puede equivocarse.</p>
            </div>
          )}

          {errorMsg && <div style={styles.errorNote}>{errorMsg}</div>}
          <div ref={messagesEndRef} />
        </div>

        {!evaluacion && !initError && (
          <div style={styles.inputRow}>
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu respuesta..."
              style={styles.input}
              disabled={starting || loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || starting || loading}
              aria-label="Enviar respuesta"
              style={{
                ...styles.sendBtn,
                ...((!input.trim() || starting || loading) ? styles.sendBtnDisabled : {}),
              }}
            >
              <SendIcon />
            </button>
          </div>
        )}

        <div style={styles.footer}>
          {evaluacion ? (
            <button onClick={onClose} style={styles.finishBtn}>
              Cerrar
            </button>
          ) : initError ? (
            <button onClick={onClose} style={styles.finishBtn}>
              Cerrar
            </button>
          ) : (
            <>
              <button onClick={onClose} style={styles.cancelBtn}>
                Cancelar entrevista
              </button>
              <button
                onClick={handleFinalizar}
                disabled={!puedeFinalizar || loading}
                style={{
                  ...styles.finishBtn,
                  ...((!puedeFinalizar || loading) ? styles.finishBtnDisabled : {}),
                }}
              >
                Finalizar y evaluar
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes entrevista-real-typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17, 17, 27, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000000,
    padding: 16,
  },
  modal: {
    width: 640,
    maxWidth: "100%",
    height: "80vh",
    maxHeight: 720,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    background: COLORS.primary,
    color: "#fff",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.85,
    marginTop: 2,
  },
  closeBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: COLORS.bg,
  },
  systemNote: {
    alignSelf: "center",
    color: "#6b7280",
    fontSize: 13,
    fontStyle: "italic",
  },
  msg: {
    maxWidth: "80%",
    padding: "11px 15px",
    borderRadius: 16,
    fontSize: 14.5,
    lineHeight: 1.45,
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
    animation: "entrevista-real-typing-bounce 1.1s infinite",
  },
  errorNote: {
    alignSelf: "center",
    color: "#b91c1c",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
  },
  evalCard: {
    alignSelf: "stretch",
    background: "#fff",
    border: "1px solid #ddd6fe",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.1)",
  },
  evalScore: {
    display: "inline-block",
    background: "#eef2ff",
    color: COLORS.primaryDark,
    border: "1px solid #c4b5fd",
    borderRadius: 999,
    padding: "4px 12px",
    fontSize: 14,
    marginBottom: 8,
  },
  evalText: {
    fontSize: 13.5,
    color: "#374151",
    margin: "6px 0 10px",
  },
  evalHeading: {
    fontSize: 12,
    fontWeight: 800,
    color: "#5b21b6",
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  evalList: {
    margin: "0 0 6px",
    paddingLeft: 18,
    fontSize: 13,
    color: "#374151",
    lineHeight: 1.5,
  },
  evalConsejo: {
    fontSize: 13.5,
    color: "#1f1f1f",
    fontWeight: 600,
    marginTop: 10,
  },
  evalDisclaimer: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 8,
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderTop: `1px solid ${COLORS.border}`,
    background: "#fff",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: "1px solid #e0e0e6",
    borderRadius: 20,
    padding: "10px 15px",
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
    width: 38,
    height: 38,
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
  footer: {
    display: "flex",
    gap: 10,
    padding: "12px 16px 16px",
    borderTop: `1px solid ${COLORS.border}`,
    background: "#fff",
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1,
    border: "1px solid #e5e5ea",
    background: "#fff",
    color: "#4b5563",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  finishBtn: {
    flex: 1,
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 58%, #0ea5e9 100%)",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13.5,
    fontWeight: 800,
    cursor: "pointer",
  },
  finishBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};