import { useEffect, useState } from "react";
import PortalLayout from "../../assets/Componentes/Portal/PortalLayout";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";
import { reclutadorNav } from "../../assets/Componentes/Portal/navItems";
import { Users, Eye, ArrowLeft, Mail, Phone, FileText, Briefcase, GraduationCap, Code } from "lucide-react";

const API_CANDIDATOS = "http://localhost/backInclusive/back-inclusiveJob/Modelo/Reclutador/candidatos.php";

export default function Candidatos() {
  const [vacantes, setVacantes] = useState([]);
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar lista inicial de vacantes con su número de candidatos
  const fetchVacantesCandidatos = async () => {
    try {
      const res = await fetch(`${API_CANDIDATOS}?accion=listar_por_vacante`);
      const data = await res.json();
      setVacantes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener candidatos por vacante:", error);
    }
  };

  useEffect(() => {
    fetchVacantesCandidatos();
  }, []);

  // Cargar los candidatos de una vacante elegida
  const verDetalleCandidatos = async (vacante) => {
    setLoading(true);
    setVacanteSeleccionada(vacante);
    try {
      const res = await fetch(`${API_CANDIDATOS}?accion=detalles_candidatos&id_vacante=${vacante.id_vacante}`);
      const data = await res.json();
      setCandidatos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener detalles de candidatos:", error);
    } finally {
      setLoading(false);
    }
  };

  const regresarAListado = () => {
    setVacanteSeleccionada(null);
    setCandidatos([]);
    setCandidatoSeleccionado(null);
    fetchVacantesCandidatos();
  };

  const regresarACandidatos = () => {
    setCandidatoSeleccionado(null);
  };

  return (
    <PortalLayout
      theme={t}
      navItems={reclutadorNav}
      pageTitle="Seguimiento de Candidatos"
    >
      {/* ─────────────────────────────────────────────────────────────
          FASE 1: TABLA GENERAL DE VACANTES CON CONTEOS
         ───────────────────────────────────────────────────────────── */}
      {!vacanteSeleccionada && !candidatoSeleccionado && (
        <div
          style={{
            background: t.bgSurface,
            border: `1px solid ${t.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}`, background: t.bgElevated }}>
                {["Vacante", "Modalidad", "Estado", "Candidatos Postulados", "Acción"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: 14, fontSize: 13, color: t.textMuted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vacantes.map((v) => (
                <tr key={v.id_vacante} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: 14, color: t.textPrimary, fontWeight: 600 }}>
                    {v.titulo_puesto}
                  </td>
                  <td style={{ padding: 14, color: t.textSecondary }}>{v.modalidad}</td>
                  <td style={{ padding: 14 }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: v.estado === "activa" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                      color: v.estado === "activa" ? "#10b981" : "#ef4444",
                    }}>
                      {v.estado}
                    </span>
                  </td>
                  <td style={{ padding: 14, color: t.textPrimary, fontWeight: 700 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Users size={16} style={{ color: t.accent }} />
                      <span style={{ color: v.total_candidatos > 0 ? t.textPrimary : t.textMuted }}>
                        {v.total_candidatos} {v.total_candidatos === 1 ? 'candidato' : 'candidatos'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: 14 }}>
                    <button
                      onClick={() => verDetalleCandidatos(v)}
                      disabled={v.total_candidatos === 0}
                      style={{
                        background: v.total_candidatos === 0 ? t.bgElevated : t.gradient,
                        color: v.total_candidatos === 0 ? t.textMuted : "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 8,
                        cursor: v.total_candidatos === 0 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontWeight: 600,
                        fontSize: 12
                      }}
                    >
                      <Eye size={14} />
                      Ver lista ({v.total_candidatos})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FASE 2: LISTA DE CANDIDATOS ASOCIADOS A LA VACANTE
         ───────────────────────────────────────────────────────────── */}
      {vacanteSeleccionada && !candidatoSeleccionado && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={regresarAListado} style={backButtonStyle}>
              <ArrowLeft size={16} /> Volver a Vacantes
            </button>
            <div>
              <h2 style={{ color: t.textPrimary, margin: 0, fontSize: 18 }}>
                Candidatos para: <span style={{ color: t.accent }}>{vacanteSeleccionada.titulo_puesto}</span>
              </h2>
            </div>
          </div>

          {loading ? (
            <div style={{ color: t.textMuted, textAlign: "center", padding: 20 }}>Cargando candidatos...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {candidatos.map((cand) => (
                <div key={cand.id_postulacion} style={cardStyle}>
                  <div>
                    <h4 style={{ color: t.textPrimary, margin: 0, fontSize: 16, fontWeight: 600 }}>
                      {cand.nombre_completo}
                    </h4>
                    <p style={{ fontSize: 12, color: t.textMuted, margin: "4px 0" }}>
                      Postulado el: {new Date(cand.fecha_postulacion).toLocaleDateString()}
                    </p>
                    <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                      <span style={infoBadgeStyle}><Mail size={12} /> {cand.correo}</span>
                      <span style={infoBadgeStyle}><Phone size={12} /> {cand.telefono}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCandidatoSeleccionado(cand)}
                    style={{
                      background: t.accentSoft,
                      color: t.accent,
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Ver Perfil Completo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FASE 3: VISTA DE PERFIL COMPLETO (DETALLE INDIVIDUAL)
         ───────────────────────────────────────────────────────────── */}
      {candidatoSeleccionado && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={regresarACandidatos} style={backButtonStyle}>
              <ArrowLeft size={16} /> Volver a Candidatos
            </button>
            <h2 style={{ color: t.textPrimary, margin: 0, fontSize: 18 }}>
              Perfil Profesional de {candidatoSeleccionado.nombre_completo}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>
            {/* Columna Izquierda: Contacto y Enlaces */}
            <div style={{ ...sectionStyle, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 10 }}>
                <h3 style={{ margin: 0, color: t.textPrimary, fontSize: 18 }}>{candidatoSeleccionado.nombre_completo}</h3>
                <span style={{ fontSize: 12, color: t.textMuted }}>Candidato disponible</span>
              </div>
              
              <div style={iconRowStyle}><Mail size={16} style={{ color: t.accent }} /> <span>{candidatoSeleccionado.correo}</span></div>
              <div style={iconRowStyle}><Phone size={16} style={{ color: t.accent }} /> <span>{candidatoSeleccionado.telefono}</span></div>
              
              {candidatoSeleccionado.cv_url && (
                <a href={candidatoSeleccionado.cv_url} target="_blank" rel="noreferrer" style={cvLinkStyle}>
                  <FileText size={16} /> Descargar / Ver CV Adjunto
                </a>
              )}
            </div>

            {/* Columna Derecha: Hoja de Vida, Experiencia y Formación */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Resumen */}
              <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}><Users size={16} /> Resumen Profesional</h4>
                <p style={{ color: t.textSecondary, margin: 0, lineHeight: "1.5", fontSize: 14 }}>{candidatoSeleccionado.resumen_profesional}</p>
              </div>

              {/* Experiencia */}
              <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}><Briefcase size={16} /> Experiencia Laboral</h4>
                <p style={{ color: t.textSecondary, margin: 0, lineHeight: "1.5", fontSize: 14, whiteSpace: "pre-line" }}>{candidatoSeleccionado.experiencia}</p>
              </div>

              {/* Educación */}
              <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}><GraduationCap size={16} /> Educación y Certificaciones</h4>
                <p style={{ color: t.textSecondary, margin: 0, lineHeight: "1.5", fontSize: 14, whiteSpace: "pre-line" }}>{candidatoSeleccionado.educacion}</p>
              </div>

              {/* Habilidades */}
              <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}><Code size={16} /> Habilidades</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  {candidatoSeleccionado.habilidades.split(",").map((hab, idx) => (
                    <span key={idx} style={{
                      background: t.bgElevated,
                      border: `1px solid ${t.border}`,
                      color: t.textPrimary,
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 12
                    }}>
                      {hab.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

// Estilos rápidos en constantes para mantener limpio el diseño
const backButtonStyle = {
  background: t.bgSurface,
  border: `1px solid ${t.border}`,
  color: t.textPrimary,
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  fontWeight: 600
};

const cardStyle = {
  background: t.bgSurface,
  border: `1px solid ${t.border}`,
  borderRadius: 12,
  padding: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const infoBadgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  color: t.textSecondary
};

const sectionStyle = {
  background: t.bgSurface,
  border: `1px solid ${t.border}`,
  borderRadius: 14,
  padding: 18
};

const iconRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: t.textSecondary,
  fontSize: 14
};

const cvLinkStyle = {
  textDecoration: "none",
  background: t.gradient,
  color: "#fff",
  padding: "10px",
  borderRadius: 8,
  textAlign: "center",
  fontSize: 13,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  marginTop: 10
};

const sectionTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: t.accent,
  margin: "0 0 10px 0",
  fontSize: 15,
  fontWeight: 600,
  borderBottom: `1px solid ${t.border}`,
  paddingBottom: 6
};