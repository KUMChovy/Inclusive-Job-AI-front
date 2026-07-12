import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, CheckCircle, Code, Eye, FileText, GraduationCap, Mail, Mic, Phone, Sparkles, Users, XCircle } from "lucide-react";
import PortalLayout from "../../assets/Componentes/Portal/PortalLayout";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";
import { reclutadorNav } from "../../assets/Componentes/Portal/navItems";
import BubleChat from "../Reclutador/ChatBot.jsx";
import { errorAlert, successAlert } from "../../assets/Componentes/Admin/alerts";
import {
  useCandidatosVacanteReclutador,
  useVacantesConCandidatosReclutador,
  useSolicitarEntrevistaReclutador,
} from "../../assets/Hook/Reclutador/useDomain";

export default function Candidatos() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, refetch } = useVacantesConCandidatosReclutador();
  const { obtenerCandidatosVacante, actualizarEstadoPostulacion, loading } = useCandidatosVacanteReclutador();
  const { solicitarEntrevista } = useSolicitarEntrevistaReclutador();
  const [vacantes, setVacantes] = useState([]);
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [candidatoDestacado, setCandidatoDestacado] = useState(null);
  const [postulacionActualizando, setPostulacionActualizando] = useState(null);

  // NUEVO: control del boton "Mandar entrevista" dentro del perfil del
  // candidato. `entrevistaEnviando` guarda el id_postulacion mientras la
  // solicitud esta en curso; `entrevistasEnviadas` guarda los
  // id_postulacion que ya se enviaron en esta sesion, para evitar
  // duplicar el envio y mostrar "Entrevista enviada" en su lugar.
  const [entrevistaEnviando, setEntrevistaEnviando] = useState(null);
  const [entrevistasEnviadas, setEntrevistasEnviadas] = useState(() => new Set());

  useEffect(() => {
    const listado = data?.data ?? data;
    if (Array.isArray(listado)) setVacantes(listado);
  }, [data]);


  useEffect(() => {
    const rec = location.state?.recomendacionIA;
    if (!rec || vacantes.length === 0) return;

    const vacante = vacantes.find((v) => Number(v.id_vacante) === Number(rec.id_vacante));
    if (vacante) {
      verDetalleCandidatos(vacante);
      setCandidatoDestacado({
        id_postulacion: Number(rec.id_postulacion),
        porcentaje_compatibilidad: rec.porcentaje_compatibilidad,
      });
    }

    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacantes, location.state]);

  const verDetalleCandidatos = async (vacante) => {
    setVacanteSeleccionada(vacante);
    setCandidatoSeleccionado(null);
    try {
      const result = await obtenerCandidatosVacante(vacante.id_vacante);
      const listado = result?.data ?? result;
      setCandidatos(Array.isArray(listado) ? listado : []);
    } catch (error) {
      console.error("Error al obtener candidatos:", error);
      setCandidatos([]);
    }
  };

  const regresarAListado = () => {
    setVacanteSeleccionada(null);
    setCandidatos([]);
    setCandidatoSeleccionado(null);
    setCandidatoDestacado(null);
    refetch().catch(() => {});
  };

  const cambiarEstadoPostulacion = async (cand, estado) => {
    setPostulacionActualizando(cand.id_postulacion);

    try {
      const result = await actualizarEstadoPostulacion({
        id_postulacion: cand.id_postulacion,
        estado,
      });

      if (!result?.success) {
        throw new Error(result?.message || "No se pudo actualizar la postulacion.");
      }

      setCandidatos((prev) => prev.map((item) => (
        Number(item.id_postulacion) === Number(cand.id_postulacion)
          ? { ...item, estado_postulacion: estado }
          : item
      )));
      setCandidatoSeleccionado((prev) => (
        prev && Number(prev.id_postulacion) === Number(cand.id_postulacion)
          ? { ...prev, estado_postulacion: estado }
          : prev
      ));
      await refetch().catch(() => {});
      await successAlert(
        estado === "aceptado" ? "Candidato aceptado" : "Candidato rechazado",
        "El estado de la postulacion se actualizo correctamente.",
        t
      );
    } catch (err) {
      await errorAlert("Error al actualizar", err.message || "No se pudo guardar el cambio.", t);
    } finally {
      setPostulacionActualizando(null);
    }
  };

  // NUEVO: envia la solicitud de entrevista real al postulante desde el
  // perfil del candidato. Reutiliza el mismo hook/endpoint
  // (solicitar_entrevista.php) que ya usa el boton "Realizar entrevista"
  // del ChatBot. No abre ningun modal aqui: la entrevista la responde el
  // postulante desde su propio chat.
  const mandarEntrevista = async (cand) => {
    if (!cand?.id_postulacion) return;
    if (entrevistaEnviando) return;
    if (entrevistasEnviadas.has(cand.id_postulacion)) return;

    setEntrevistaEnviando(cand.id_postulacion);

    try {
      const data = await solicitarEntrevista(cand.id_postulacion);
      setEntrevistasEnviadas((prev) => {
        const next = new Set(prev);
        next.add(cand.id_postulacion);
        return next;
      });
      await successAlert(
        "Entrevista enviada",
        data?.mensaje || `Se envio la solicitud de entrevista a ${cand.nombre_completo}.`,
        t
      );
    } catch (err) {
      await errorAlert(
        "No se pudo enviar",
        err.message || "Ocurrio un error al enviar la solicitud de entrevista.",
        t
      );
    } finally {
      setEntrevistaEnviando(null);
    }
  };

  return (
    <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Seguimiento de Candidatos">
      {!vacanteSeleccionada && !candidatoSeleccionado && (
        <TableCard>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}`, background: t.bgElevated }}>
                {["Vacante", "Modalidad", "Estado", "Candidatos", "Accion"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: 14, fontSize: 13, color: t.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vacantes.map((v) => (
                <tr key={v.id_vacante} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: 14, color: t.textPrimary, fontWeight: 600 }}>{v.titulo_puesto}</td>
                  <td style={{ padding: 14, color: t.textSecondary }}>{v.modalidad}</td>
                  <td style={{ padding: 14 }}><Estado estado={v.estado} /></td>
                  <td style={{ padding: 14, color: t.textPrimary, fontWeight: 700 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Users size={16} style={{ color: t.accent }} /> {v.total_candidatos}
                    </span>
                  </td>
                  <td style={{ padding: 14 }}>
                    <button onClick={() => verDetalleCandidatos(v)} disabled={Number(v.total_candidatos) === 0} style={buttonStyle(Number(v.total_candidatos) === 0)}>
                      <Eye size={14} /> Ver lista
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      {vacanteSeleccionada && !candidatoSeleccionado && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={regresarAListado} style={backButtonStyle}><ArrowLeft size={16} /> Volver a Vacantes</button>
            <h2 style={{ color: t.textPrimary, margin: 0, fontSize: 18 }}>
              Candidatos para: <span style={{ color: t.accent }}>{vacanteSeleccionada.titulo_puesto}</span>
            </h2>
          </div>

          {loading ? (
            <div style={{ color: t.textMuted, textAlign: "center", padding: 20 }}>Cargando candidatos...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {candidatos.map((cand) => {
                const esDestacado = candidatoDestacado?.id_postulacion === Number(cand.id_postulacion);
                return (
                  <div key={cand.id_postulacion} style={esDestacado ? cardStyleDestacado : cardStyle}>
                    <div>
                      {esDestacado && (
                        <span style={badgeIAStyle}>
                          <Sparkles size={12} />
                          {typeof candidatoDestacado.porcentaje_compatibilidad === "number"
                            ? `Recomendado por IA · ${candidatoDestacado.porcentaje_compatibilidad}% compatible`
                            : "Visto desde el chat"}
                        </span>
                      )}
                      <h4 style={{ color: t.textPrimary, margin: 0, fontSize: 16, fontWeight: 600 }}>{cand.nombre_completo}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                        <p style={{ fontSize: 12, color: t.textMuted, margin: 0 }}>Postulado el: {safeDate(cand.fecha_postulacion)}</p>
                        <EstadoPostulacion estado={cand.estado_postulacion} />
                        {/* NUEVO: badge que indica que el postulante ya hizo la entrevista real */}
                        {cand.entrevista_realizada && <EntrevistaBadge puntuacion={cand.puntuacion_entrevista} />}
                      </div>
                      <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                        <span style={infoBadgeStyle}><Mail size={12} /> {cand.correo}</span>
                        <span style={infoBadgeStyle}><Phone size={12} /> {cand.telefono}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => setCandidatoSeleccionado(cand)} style={actionButtonStyle("perfil")}>
                        <Eye size={14} /> Ver perfil
                      </button>
                      <button
                        onClick={() => cambiarEstadoPostulacion(cand, "aceptado")}
                        disabled={postulacionActualizando === cand.id_postulacion || cand.estado_postulacion === "aceptado"}
                        style={actionButtonStyle("aceptar", postulacionActualizando === cand.id_postulacion || cand.estado_postulacion === "aceptado")}
                      >
                        <CheckCircle size={14} /> Aceptar
                      </button>
                      <button
                        onClick={() => cambiarEstadoPostulacion(cand, "rechazado")}
                        disabled={postulacionActualizando === cand.id_postulacion || cand.estado_postulacion === "rechazado"}
                        style={actionButtonStyle("rechazar", postulacionActualizando === cand.id_postulacion || cand.estado_postulacion === "rechazado")}
                      >
                        <XCircle size={14} /> Rechazar
                      </button>
                    </div>
                  </div>
                );
              })}
              {candidatos.length === 0 && <div style={{ color: t.textMuted, padding: 20 }}>Esta vacante aun no tiene candidatos.</div>}
            </div>
          )}
        </div>
      )}

      {candidatoSeleccionado && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setCandidatoSeleccionado(null)} style={backButtonStyle}><ArrowLeft size={16} /> Volver a Candidatos</button>
            <h2 style={{ color: t.textPrimary, margin: 0, fontSize: 18 }}>Perfil Profesional de {candidatoSeleccionado.nombre_completo}</h2>
            <EstadoPostulacion estado={candidatoSeleccionado.estado_postulacion} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 1fr) 2fr", gap: 20, alignItems: "start" }}>
            <div style={{ ...sectionStyle, display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={{ margin: 0, color: t.textPrimary, fontSize: 18 }}>{candidatoSeleccionado.nombre_completo}</h3>
              <div style={iconRowStyle}><Mail size={16} style={{ color: t.accent }} /> <span>{candidatoSeleccionado.correo}</span></div>
              <div style={iconRowStyle}><Phone size={16} style={{ color: t.accent }} /> <span>{candidatoSeleccionado.telefono}</span></div>
              {candidatoSeleccionado.cv_url && <a href={candidatoSeleccionado.cv_url} target="_blank" rel="noreferrer" style={cvLinkStyle}><FileText size={16} /> Ver CV</a>}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => cambiarEstadoPostulacion(candidatoSeleccionado, "aceptado")}
                  disabled={postulacionActualizando === candidatoSeleccionado.id_postulacion || candidatoSeleccionado.estado_postulacion === "aceptado"}
                  style={actionButtonStyle("aceptar", postulacionActualizando === candidatoSeleccionado.id_postulacion || candidatoSeleccionado.estado_postulacion === "aceptado")}
                >
                  <CheckCircle size={14} /> Aceptar
                </button>
                <button
                  onClick={() => cambiarEstadoPostulacion(candidatoSeleccionado, "rechazado")}
                  disabled={postulacionActualizando === candidatoSeleccionado.id_postulacion || candidatoSeleccionado.estado_postulacion === "rechazado"}
                  style={actionButtonStyle("rechazar", postulacionActualizando === candidatoSeleccionado.id_postulacion || candidatoSeleccionado.estado_postulacion === "rechazado")}
                >
                  <XCircle size={14} /> Rechazar
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Section icon={Users} title="Resumen Profesional">{candidatoSeleccionado.resumen_profesional}</Section>
              <Section icon={Briefcase} title="Experiencia Laboral">{candidatoSeleccionado.experiencia}</Section>
              <Section icon={GraduationCap} title="Educacion y Certificaciones">{candidatoSeleccionado.educacion}</Section>
              <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}><Code size={16} /> Habilidades</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {String(candidatoSeleccionado.habilidades || "").split(",").filter(Boolean).map((hab) => (
                    <span key={hab} style={{ background: t.bgElevated, border: `1px solid ${t.border}`, color: t.textPrimary, padding: "4px 10px", borderRadius: 6, fontSize: 12 }}>{hab.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bloque especial "Entrevista con IA" ──
              Va debajo de todo el perfil. Si el candidato YA hizo la
              entrevista real (candidatoSeleccionado.entrevista_realizada,
              calculado en el backend a partir de `chabots`), se muestra
              un estado fijo "Entrevista completada" con la calificacion
              y ya NO se ofrece el boton de mandarla de nuevo.
              Si todavia no la ha hecho, se mantiene exactamente el mismo
              flujo de "Mandar entrevista" que ya existia (mismo hook,
              mismo endpoint solicitar_entrevista.php, mismos estados
              entrevistaEnviando / entrevistasEnviadas). */}
          <div style={entrevistaSectionStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={entrevistaIconWrapStyle}>
                <Mic size={18} color="#fff" />
              </div>
              <div>
                <strong style={{ color: t.textPrimary, fontSize: 14, display: "block" }}>
                  Entrevista con IA
                </strong>
                <span style={{ color: t.textMuted, fontSize: 12 }}>
                  {candidatoSeleccionado.entrevista_realizada
                    ? `${candidatoSeleccionado.nombre_completo} ya completo la entrevista de este proceso.`
                    : `Invita a ${candidatoSeleccionado.nombre_completo} a realizar la entrevista real de este proceso.`}
                </span>
              </div>
            </div>

            {candidatoSeleccionado.entrevista_realizada ? (
              <span style={entrevistaCompletadaBadgeStyle}>
                <CheckCircle size={15} />
                Entrevista completada
                {candidatoSeleccionado.puntuacion_entrevista != null
                  ? ` · ${candidatoSeleccionado.puntuacion_entrevista}/10`
                  : ""}
              </span>
            ) : (
              <button
                onClick={() => mandarEntrevista(candidatoSeleccionado)}
                disabled={
                  entrevistaEnviando === candidatoSeleccionado.id_postulacion ||
                  entrevistasEnviadas.has(candidatoSeleccionado.id_postulacion)
                }
                style={entrevistaBtnStyle(
                  entrevistaEnviando === candidatoSeleccionado.id_postulacion ||
                  entrevistasEnviadas.has(candidatoSeleccionado.id_postulacion)
                )}
              >
                <Mic size={15} />
                {entrevistasEnviadas.has(candidatoSeleccionado.id_postulacion)
                  ? "Entrevista enviada"
                  : entrevistaEnviando === candidatoSeleccionado.id_postulacion
                  ? "Enviando..."
                  : "Mandar entrevista"}
              </button>
            )}
          </div>
        </div>
      )}
      <BubleChat/>
    </PortalLayout>
  );
}

function TableCard({ children }) {
  return <div style={{ background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>{children}</div>;
}

function Section({ icon: Icon, title, children }) {
  return (
    <div style={sectionStyle}>
      <h4 style={sectionTitleStyle}><Icon size={16} /> {title}</h4>
      <p style={{ color: t.textSecondary, margin: 0, lineHeight: "1.5", fontSize: 14, whiteSpace: "pre-line" }}>{children}</p>
    </div>
  );
}

function Estado({ estado }) {
  const active = estado === "activa";
  return <span style={{ padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: active ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: active ? "#10b981" : "#ef4444" }}>{estado}</span>;
}

function EstadoPostulacion({ estado }) {
  const normalized = String(estado || "pendiente").toLowerCase();
  const styles = {
    aceptado: { bg: "rgba(16,185,129,0.16)", color: "#34d399", border: "rgba(16,185,129,0.35)", text: "Aceptado" },
    rechazado: { bg: "rgba(239,68,68,0.16)", color: "#f87171", border: "rgba(239,68,68,0.35)", text: "Rechazado" },
    pendiente: { bg: "rgba(245,158,11,0.14)", color: "#fbbf24", border: "rgba(245,158,11,0.32)", text: "Pendiente" },
    revision: { bg: "rgba(99,102,241,0.16)", color: "#a5b4fc", border: "rgba(99,102,241,0.35)", text: "Revision" },
  };
  const current = styles[normalized] || styles.pendiente;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", border: `1px solid ${current.border}`, background: current.bg, color: current.color, padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
      {current.text}
    </span>
  );
}

// NUEVO: badge que se muestra en la lista de candidatos cuando el
// postulante ya realizo la entrevista real (candidato.entrevista_realizada
// viene del backend, calculado a partir de la tabla `chabots`).
function EntrevistaBadge({ puntuacion }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      border: "1px solid rgba(16,185,129,0.35)",
      background: "rgba(16,185,129,0.16)",
      color: "#34d399",
      padding: "3px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
    }}>
      <Mic size={11} /> Entrevista realizada{puntuacion != null ? ` · ${puntuacion}/10` : ""}
    </span>
  );
}

const buttonStyle = (disabled) => ({ background: disabled ? t.bgElevated : t.gradient, color: disabled ? t.textMuted : "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 12 });
const actionButtonStyle = (type, disabled = false) => {
  const variants = {
    perfil: { background: t.accentSoft, color: t.accent, border: "transparent" },
    aceptar: { background: "rgba(16,185,129,0.14)", color: "#34d399", border: "rgba(16,185,129,0.35)" },
    rechazar: { background: "rgba(239,68,68,0.14)", color: "#f87171", border: "rgba(239,68,68,0.35)" },
  };
  const v = variants[type] || variants.perfil;

  return {
    background: disabled ? t.bgElevated : v.background,
    color: disabled ? t.textMuted : v.color,
    border: `1px solid ${disabled ? t.border : v.border}`,
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    opacity: disabled ? 0.7 : 1,
  };
};
const backButtonStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, color: t.textPrimary, borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 };
const cardStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 };
const cardStyleDestacado = { ...cardStyle, border: `2px solid ${t.accent}`, background: t.accentSoft, boxShadow: `0 0 0 3px ${t.accentGlow}` };
const badgeIAStyle = { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: t.accent, background: "#fff", padding: "3px 8px", borderRadius: 20, marginBottom: 6 };
const infoBadgeStyle = { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textSecondary };
const sectionStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 };
const iconRowStyle = { display: "flex", alignItems: "center", gap: 10, color: t.textSecondary, fontSize: 14 };
const cvLinkStyle = { textDecoration: "none", background: t.gradient, color: "#fff", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 };
const sectionTitleStyle = { display: "flex", alignItems: "center", gap: 8, color: t.accent, margin: "0 0 10px 0", fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${t.border}`, paddingBottom: 6 };

// ── Estilos del bloque especial "Entrevista con IA" (ya existian) ──
const entrevistaSectionStyle = {
  background: t.bgSurface,
  border: `1px solid ${t.accentBorder}`,
  borderRadius: 14,
  padding: "18px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  boxShadow: `0 0 0 3px ${t.accentGlow}`,
};
const entrevistaIconWrapStyle = {
  width: 40,
  height: 40,
  borderRadius: 12,
  flexShrink: 0,
  background: t.gradient,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 4px 14px ${t.accentGlow}`,
};
const entrevistaBtnStyle = (disabled) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "11px 20px",
  borderRadius: 10,
  border: "none",
  fontSize: 13,
  fontWeight: 700,
  color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  background: disabled ? t.bgElevated : t.gradient,
  boxShadow: disabled ? "none" : `0 6px 16px ${t.accentGlow}`,
  opacity: disabled ? 0.7 : 1,
  whiteSpace: "nowrap",
  transition: "transform 0.15s ease, filter 0.15s ease",
});

// NUEVO: estilo del estado fijo "Entrevista completada" que reemplaza
// al boton "Mandar entrevista" cuando el postulante ya la hizo.
const entrevistaCompletadaBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "11px 20px",
  borderRadius: 10,
  border: "1px solid rgba(16,185,129,0.35)",
  background: "rgba(16,185,129,0.16)",
  color: "#34d399",
  fontSize: 13,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

function safeDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-MX");
}