import { useEffect, useRef, useState } from "react";
import { AlertCircle, Briefcase, Building, Camera, CheckCircle, Clock, Mail, Phone, Save, ShieldAlert, User } from "lucide-react";
import PortalLayout from "../../assets/Componentes/Portal/PortalLayout";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";
import { reclutadorNav } from "../../assets/Componentes/Portal/navItems";
import BubleChat from "../Reclutador/ChatBot.jsx";
import { useActualizarPerfilReclutador, usePerfilReclutador } from "../../assets/Hook/Reclutador/useDomain";
import { resolveAssetUrl } from "../../assets/Hook/Sesion/apiSesion";

const INITIAL_FORM = {
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  foto_perfil: "",
  empresa: "",
  puesto: "",
  sector: "No especificado",
  empresa_validada: 0,
};

export default function PerfilReclutador() {
  const { data, loading, error } = usePerfilReclutador();
  const { actualizarPerfil, loading: isSaving } = useActualizarPerfilReclutador();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const fotoInputRef = useRef(null);

  useEffect(() => {
    if (data?.data) setFormData((prev) => ({ ...prev, ...data.data }));
  }, [data]);

  useEffect(() => {
    if (error) setMensaje({ texto: error, tipo: "error" });
  }, [error]);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMensaje({ texto: "Formato no valido. Usa JPG, PNG o WEBP.", tipo: "error" });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMensaje({ texto: "La imagen no debe superar 5 MB.", tipo: "error" });
      e.target.value = "";
      return;
    }

    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });

    try {
      const payload = new FormData();
      payload.append("nombres", formData.nombres || "");
      payload.append("apellidos", formData.apellidos || "");
      payload.append("telefono", formData.telefono || "");
      payload.append("empresa", formData.empresa || "");
      payload.append("puesto", formData.puesto || "");
      payload.append("sector", formData.sector || "No especificado");
      if (fotoFile) payload.append("fotoPerfil", fotoFile);

      const result = await actualizarPerfil(payload);
      setFormData((prev) => ({
        ...prev,
        empresa_validada: result.data?.empresa_validada ?? prev.empresa_validada,
        foto_perfil: result.data?.foto_perfil ?? prev.foto_perfil,
      }));
      setFotoFile(null);
      if (fotoInputRef.current) fotoInputRef.current.value = "";
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
        setFotoPreview("");
      }
      setMensaje({
        texto: result.data?.cambio_empresa
          ? "Perfil guardado. Tu nueva empresa queda pendiente de validacion."
          : "Perfil actualizado con exito.",
        tipo: result.data?.cambio_empresa ? "warning" : "success",
      });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000);
    } catch (err) {
      setMensaje({ texto: err.message || "No se pudo actualizar el perfil.", tipo: "error" });
    }
  };

  const nombreCompleto = `${formData.nombres ?? ""} ${formData.apellidos ?? ""}`.trim() || "Reclutador";
  const fotoActual = fotoPreview || resolveAssetUrl(formData.foto_perfil);

  const renderEmpresaBadge = () => {
    if (!formData.empresa?.trim()) {
      return <StatusBadge color="#f59e0b" icon={AlertCircle} text="Empresa sin registrar" />;
    }
    if (Number(formData.empresa_validada) === 1) {
      return <StatusBadge color="#10b981" icon={CheckCircle} text="Empresa validada" />;
    }
    return <StatusBadge color="#3b82f6" icon={Clock} text="Pendiente de validacion" />;
  };

  if (loading) {
    return (
      <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Mi Perfil">
        <div style={{ color: t.textMuted, textAlign: "center", padding: 40 }}>Cargando datos de reclutador...</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      theme={t}
      navItems={reclutadorNav}
      pageTitle="Mi Perfil"
      user={{ nombre: nombreCompleto, rol: "Reclutador", avatar: fotoActual, foto_perfil: fotoActual }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {Number(formData.empresa_validada) !== 1 && (
          <div style={{ ...alertStyle, background: "rgba(239,68,68,0.08)", border: "1px dashed #ef4444", color: "#f87171", alignItems: "flex-start" }}>
            <ShieldAlert size={20} />
            <div>
              <strong>Empresa no validada</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: t.textSecondary }}>
                Registra tu organizacion y espera la validacion administrativa para publicar vacantes.
              </p>
            </div>
          </div>
        )}

        {mensaje.texto && <Message message={mensaje} />}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}><User size={18} /> Informacion personal</h3>
            <div style={photoRowStyle}>
              <div style={avatarStyle}>
                {fotoActual ? (
                  <img
                    src={fotoActual}
                    alt={`Foto de perfil de ${nombreCompleto}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span style={{ ...avatarFallbackStyle, display: fotoActual ? "none" : "flex" }}>
                  {getInitials(nombreCompleto)}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  style={btnPhotoStyle}
                >
                  <Camera size={14} /> {formData.foto_perfil ? "Cambiar foto" : "Subir foto"}
                </button>
                <span style={{ fontSize: 11, color: t.textMuted }}>JPG, PNG o WEBP · max 5 MB</span>
                {fotoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(fotoPreview);
                      setFotoPreview("");
                      setFotoFile(null);
                      if (fotoInputRef.current) fotoInputRef.current.value = "";
                    }}
                    style={btnClearPhotoStyle}
                  >
                    Quitar seleccion
                  </button>
                )}
              </div>
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFotoChange}
                style={{ display: "none" }}
              />
            </div>
            <div style={gridStyle}>
              <Field label="Nombre(s) *">
                <input name="nombres" value={formData.nombres || ""} onChange={handleChange} required style={inputStyle} />
              </Field>
              <Field label="Apellido(s) *">
                <input name="apellidos" value={formData.apellidos || ""} onChange={handleChange} required style={inputStyle} />
              </Field>
              <Field label="Correo electronico">
                <div style={{ ...inputStyle, background: t.bgElevated, color: t.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={14} /> {formData.correo || ""}
                </div>
              </Field>
              <Field label="Telefono de contacto">
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Phone size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
                  <input name="telefono" value={formData.telefono || ""} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} />
                </div>
              </Field>
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <h3 style={sectionTitleStyle}><Building size={18} /> Informacion corporativa</h3>
              {renderEmpresaBadge()}
            </div>
            <div style={gridStyle}>
              <Field label="Empresa / Organizacion *">
                <input name="empresa" value={formData.empresa || ""} onChange={handleChange} required style={inputStyle} />
              </Field>
              <Field label="Puesto o cargo">
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Briefcase size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
                  <input name="puesto" value={formData.puesto || ""} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} />
                </div>
              </Field>
              <Field label="Sector industrial">
                <select name="sector" value={formData.sector || "No especificado"} onChange={handleChange} style={inputStyle}>
                  <option value="No especificado">Selecciona un sector</option>
                  <option value="Tecnologia e Informatica">Tecnologia e Informatica</option>
                  <option value="Servicios Generales / Limpieza">Servicios Generales / Limpieza</option>
                  <option value="Atencion al Cliente / Ventas">Atencion al Cliente / Ventas</option>
                  <option value="Logistica y Distribucion">Logistica y Distribucion</option>
                  <option value="Salud y Cuidado">Salud y Cuidado</option>
                  <option value="Educacion">Educacion</option>
                </select>
              </Field>
            </div>
          </section>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={isSaving} style={{ ...btnSaveStyle, opacity: isSaving ? 0.7 : 1 }}>
              <Save size={16} /> {isSaving ? "Guardando..." : "Guardar perfil"}
            </button>
          </div>
        </form>
      </div>
      <BubleChat/>
    </PortalLayout>
  );
}

function Field({ label, children }) {
  return (
    <label style={inputGroupStyle}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

function StatusBadge({ color, icon: Icon, text }) {
  return (
    <span style={{ ...badgeStyle, color, border: `1px solid ${color}`, background: `${color}24` }}>
      <Icon size={14} /> {text}
    </span>
  );
}

function Message({ message }) {
  const color = message.tipo === "success" ? "#10b981" : message.tipo === "warning" ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ ...alertStyle, background: `${color}20`, border: `1px solid ${color}`, color }}>
      {message.tipo === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message.texto}</span>
    </div>
  );
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "R";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

const sectionStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 };
const sectionTitleStyle = { display: "flex", alignItems: "center", gap: 8, margin: 0, fontSize: 16, fontWeight: 600, color: t.accent };
const photoRowStyle = { display: "flex", alignItems: "center", gap: 16, padding: 14, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 12, flexWrap: "wrap" };
const avatarStyle = { width: 72, height: 72, borderRadius: "50%", background: t.accentSoft, border: `2px solid ${t.accentBorder}`, color: t.accent, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 22, fontWeight: 700, flexShrink: 0 };
const avatarFallbackStyle = { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 };
const inputGroupStyle = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 13, fontWeight: 600, color: t.textSecondary };
const inputStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, color: t.textPrimary, borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };
const btnSaveStyle = { background: t.gradient, color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" };
const btnPhotoStyle = { background: t.accentSoft, color: t.accent, border: `1px solid ${t.accentBorder}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", width: "fit-content" };
const btnClearPhotoStyle = { background: "transparent", border: "none", color: "#ef4444", fontSize: 11, padding: 0, cursor: "pointer", textAlign: "left", width: "fit-content" };
const alertStyle = { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, width: "100%", boxSizing: "border-box" };
const badgeStyle = { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600 };
