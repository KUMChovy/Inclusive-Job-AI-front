import { useState, useRef, useEffect } from "react";

/*
|--------------------------------------------------------------------------
| Modal: Entrevista REAL (solicitada por un reclutador)
|--------------------------------------------------------------------------
| Componente independiente de EntrevistaModal (el de la entrevista
| simulada). No comparte estado ni estilos con el.
|
| Llama al endpoint unico Postulante/chat/entrevista_real.php mandando
| "accion": "iniciar" | "responder" | "finalizar" en el body.
|
| AJUSTA API_BASE a la ruta real donde publicaste el backend.
*/

const API_BASE = "/Modelo/Postulante/chat"; // <-- ajusta a tu ruta real
const ENDPOINT = `${API_BASE}/entrevista_real.php`;

async function postJSON(body) {
  const res = await fetch(ENDPOINT, {
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

export default function EntrevistaRealModal({ vacante, onClose, onEvaluacionLista }) {
  const [historial, setHistorial] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [finalizada, setFinalizada] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    postJSON({ accion: "iniciar", id_vacante: vacante.id_vacante })
      .then((data) => {
        if (!active) return;
        setHistorial([{ role: "assistant", content: data.mensaje }]);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacante.id_vacante]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historial, loading]);

  async function handleEnviar() {
    const texto = input.trim();
    if (!texto || sending || finalizada || loading) return;

    const nuevoHistorial = [...historial, { role: "user", content: texto }];
    setHistorial(nuevoHistorial);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setSending(true);
    setError("");

    try {
      const data = await postJSON({
        accion: "responder",
        id_vacante: vacante.id_vacante,
        mensaje: texto,
        historial: nuevoHistorial,
      });
      setHistorial((prev) => [...prev, { role: "assistant", content: data.mensaje }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function handleFinalizar() {
    if (sending || finalizada || loading) return;
    setSending(true);
    setError("");

    try {
      const data = await postJSON({
        accion: "finalizar",
        id_vacante: vacante.id_vacante,
        historial,
      });
      setFinalizada(true);
      onEvaluacionLista?.({ text: data.text, evaluacion: data.evaluacion });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
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

  const respuestasUsuario = historial.filter((m) => m.role === "user").length;
  const disabledGeneral = loading || sending || finalizada;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerText}>
            <strong style={styles.headerTitle}>
              Entrevista — {vacante?.titulo_puesto ?? "Vacante"}
            </strong>
            <span style={styles.headerSubtitle}>
              Esta es una entrevista real del proceso de seleccion.
            </span>
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={styles.closeBtn}>
            ×
          </button>
        </div>

        <div style={styles.body}>
          {historial.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                ...(m.role === "user" ? styles.msgUser : styles.msgBot),
              }}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.msg, ...styles.msgBot }}>
              Preparando la entrevista...
            </div>
          )}

          {sending && !loading && (
            <div style={styles.typingRow}>
              <span style={{ ...styles.dot, animationDelay: "0s" }} />
              <span style={{ ...styles.dot, animationDelay: "0.15s" }} />
              <span style={{ ...styles.dot, animationDelay: "0.3s" }} />
            </div>
          )}

          <div ref={endRef} />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.footer}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={disabledGeneral}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu respuesta..."
            style={styles.input}
          />
          <button
            onClick={handleEnviar}
            disabled={disabledGeneral || !input.trim()}
            style={{
              ...styles.sendBtn,
              ...((disabledGeneral || !input.trim()) ? styles.btnDisabled : {}),
            }}
          >
            Enviar
          </button>
        </div>

        <div style={styles.footerActions}>
          <button
            onClick={handleFinalizar}
            disabled={disabledGeneral || respuestasUsuario < 2}
            style={{
              ...styles.finalizarBtn,
              ...((disabledGeneral || respuestasUsuario < 2) ? styles.btnDisabled : {}),
            }}
          >
            Finalizar entrevista
          </button>
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
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000000,
    padding: 16,
  },
  modal: {
    width: 420,
    maxWidth: "94vw",
    height: 560,
    maxHeight: "90vh",
    background: "#fff",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "14px 16px",
    borderBottom: "1px solid #e5e5ea",
    background: "#ecfdf5",
  },
  headerText: { display: "flex", flexDirection: "column", gap: 2 },
  headerTitle: { fontSize: 14, color: "#065f46" },
  headerSubtitle: { fontSize: 12, color: "#047857" },
  closeBtn: {
    border: "none",
    background: "none",
    fontSize: 20,
    lineHeight: 1,
    cursor: "pointer",
    color: "#065f46",
    padding: 2,
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#f7f7fb",
  },
  msg: {
    maxWidth: "82%",
    padding: "9px 13px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.4,
    whiteSpace: "pre-line",
    wordWrap: "break-word",
  },
  msgBot: {
    alignSelf: "flex-start",
    background: "#fff",
    border: "1px solid #e5e5ea",
    borderBottomLeftRadius: 4,
    color: "#1f1f1f",
  },
  msgUser: {
    alignSelf: "flex-end",
    background: "#10b981",
    color: "#fff",
    borderBottomRightRadius: 4,
  },
  typingRow: {
    alignSelf: "flex-start",
    display: "flex",
    gap: 4,
    padding: "10px 14px",
    background: "#fff",
    border: "1px solid #e5e5ea",
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
  error: {
    color: "#b91c1c",
    fontSize: 12,
    padding: "8px 16px 0",
  },
  footer: {
    display: "flex",
    gap: 8,
    padding: 10,
    borderTop: "1px solid #e5e5ea",
    background: "#fff",
  },
  input: {
    flex: 1,
    border: "1px solid #e0e0e6",
    borderRadius: 12,
    padding: "9px 12px",
    fontSize: 14,
    resize: "none",
    fontFamily: "inherit",
    maxHeight: 90,
    outline: "none",
  },
  sendBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  },
  footerActions: {
    padding: "0 10px 10px",
    background: "#fff",
  },
  finalizarBtn: {
    width: "100%",
    border: "1px solid #10b981",
    background: "#ecfdf5",
    color: "#065f46",
    borderRadius: 10,
    padding: "9px 10px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  btnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
