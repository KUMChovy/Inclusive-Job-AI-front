import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Code, Eye, FileText, GraduationCap, Mail, Phone, Sparkles, Users } from "lucide-react";
import PortalLayout from "../../assets/Componentes/Portal/PortalLayout";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";
import { reclutadorNav } from "../../assets/Componentes/Portal/navItems";
import BubleChat from "../Reclutador/ChatBot.jsx";
import { useCandidatosVacanteReclutador, useVacantesConCandidatosReclutador } from "../../assets/Hook/Reclutador/useDomain";

export default function Candidatos() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, refetch } = useVacantesConCandidatosReclutador();
  const { obtenerCandidatosVacante, loading } = useCandidatosVacanteReclutador();
  const [vacantes, setVacantes] = useState([]);
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [candidatoDestacado, setCandidatoDestacado] = useState(null);

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
  }, [vacantes]);

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
                          <Sparkles size={12} /> Recomendado por IA · {candidatoDestacado.porcentaje_compatibilidad}% compatible
                        </span>
                      )}
                      <h4 style={{ color: t.textPrimary, margin: 0, fontSize: 16, fontWeight: 600 }}>{cand.nombre_completo}</h4>
                      <p style={{ fontSize: 12, color: t.textMuted, margin: "4px 0" }}>Postulado el: {safeDate(cand.fecha_postulacion)}</p>
                      <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                        <span style={infoBadgeStyle}><Mail size={12} /> {cand.correo}</span>
                        <span style={infoBadgeStyle}><Phone size={12} /> {cand.telefono}</span>
                      </div>
                    </div>
                    <button onClick={() => setCandidatoSeleccionado(cand)} style={{ background: t.accentSoft, color: t.accent, border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                      Ver Perfil Completo
                    </button>
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
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 1fr) 2fr", gap: 20, alignItems: "start" }}>
            <div style={{ ...sectionStyle, display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={{ margin: 0, color: t.textPrimary, fontSize: 18 }}>{candidatoSeleccionado.nombre_completo}</h3>
              <div style={iconRowStyle}><Mail size={16} style={{ color: t.accent }} /> <span>{candidatoSeleccionado.correo}</span></div>
              <div style={iconRowStyle}><Phone size={16} style={{ color: t.accent }} /> <span>{candidatoSeleccionado.telefono}</span></div>
              {candidatoSeleccionado.cv_url && <a href={candidatoSeleccionado.cv_url} target="_blank" rel="noreferrer" style={cvLinkStyle}><FileText size={16} /> Ver CV</a>}
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

const buttonStyle = (disabled) => ({ background: disabled ? t.bgElevated : t.gradient, color: disabled ? t.textMuted : "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 12 });
const backButtonStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, color: t.textPrimary, borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 };
const cardStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 };
const cardStyleDestacado = { ...cardStyle, border: `2px solid ${t.accent}`, background: t.accentSoft, boxShadow: `0 0 0 3px ${t.accentGlow}` };
const badgeIAStyle = { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: t.accent, background: "#fff", padding: "3px 8px", borderRadius: 20, marginBottom: 6 };
const infoBadgeStyle = { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textSecondary };
const sectionStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 };
const iconRowStyle = { display: "flex", alignItems: "center", gap: 10, color: t.textSecondary, fontSize: 14 };
const cvLinkStyle = { textDecoration: "none", background: t.gradient, color: "#fff", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 };
const sectionTitleStyle = { display: "flex", alignItems: "center", gap: 8, color: t.accent, margin: "0 0 10px 0", fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${t.border}`, paddingBottom: 6 };

function safeDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-MX");
}