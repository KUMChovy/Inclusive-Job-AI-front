import { useEffect, useState } from "react";
import { AlertCircle, Building, CheckCircle, Clock, FileText, Globe, MapPin, Save } from "lucide-react";
import PortalLayout from "../../assets/Componentes/Portal/PortalLayout";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";
import { reclutadorNav } from "../../assets/Componentes/Portal/navItems";
import { useActualizarEmpresaReclutador, useEmpresaReclutador } from "../../assets/Hook/Reclutador/useDomain";

const INITIAL_COMPANY = {
  nombre_empresa: "",
  rfc_empresa: "",
  sitio_web: "",
  descripcion_empresa: "",
  direccion_empresa: "",
  empresa_validada: 0,
};

export default function MiEmpresa() {
  const { data, loading, error } = useEmpresaReclutador();
  const { actualizarEmpresa, loading: isSaving } = useActualizarEmpresaReclutador();
  const [companyData, setCompanyData] = useState(INITIAL_COMPANY);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    if (data?.data) setCompanyData((prev) => ({ ...prev, ...data.data }));
  }, [data]);

  useEffect(() => {
    if (error) setMensaje({ texto: error, tipo: "error" });
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });

    try {
      const result = await actualizarEmpresa(companyData);
      setCompanyData((prev) => ({ ...prev, empresa_validada: result.data?.empresa_validada ?? prev.empresa_validada }));
      setMensaje({
        texto: result.data?.cambio_nombre
          ? "Informacion guardada. La empresa queda pendiente de validacion."
          : "Datos corporativos actualizados correctamente.",
        tipo: result.data?.cambio_nombre ? "warning" : "success",
      });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000);
    } catch (err) {
      setMensaje({ texto: err.message || "No se pudieron actualizar los datos corporativos.", tipo: "error" });
    }
  };

  if (loading) {
    return (
      <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Mi Empresa">
        <div style={{ color: t.textMuted, textAlign: "center", padding: 40 }}>Cargando datos corporativos...</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Mi Empresa">
      <div style={{ maxWidth: 850, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        <StatusCard companyData={companyData} />
        {mensaje.texto && <Message message={mensaje} />}

        <form onSubmit={handleSubmit} style={panelStyle}>
          <h3 style={panelTitleStyle}><Building size={18} /> Perfil e identidad de la empresa</h3>
          <div style={gridStyle}>
            <Field label="Nombre comercial o razon social *">
              <input name="nombre_empresa" value={companyData.nombre_empresa || ""} onChange={handleChange} required style={inputStyle} />
            </Field>
            <Field label="RFC">
              <IconInput icon={FileText}>
                <input name="rfc_empresa" value={companyData.rfc_empresa || ""} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} />
              </IconInput>
            </Field>
            <Field label="Sitio web">
              <IconInput icon={Globe}>
                <input type="url" name="sitio_web" value={companyData.sitio_web || ""} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} />
              </IconInput>
            </Field>
            <Field label="Direccion corporativa">
              <IconInput icon={MapPin}>
                <input name="direccion_empresa" value={companyData.direccion_empresa || ""} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} />
              </IconInput>
            </Field>
            <Field label="Sobre la empresa" wide>
              <textarea name="descripcion_empresa" value={companyData.descripcion_empresa || ""} onChange={handleChange} rows={5} style={textareaStyle} />
            </Field>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button type="submit" disabled={isSaving} style={{ ...btnSaveStyle, opacity: isSaving ? 0.7 : 1 }}>
              <Save size={16} /> {isSaving ? "Guardando..." : "Actualizar datos"}
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}

function StatusCard({ companyData }) {
  if (!companyData.nombre_empresa?.trim()) {
    return <CardStatus color="#f59e0b" icon={AlertCircle} title="Empresa sin registrar" text="Ingresa tus datos corporativos para iniciar el alta." />;
  }
  if (Number(companyData.empresa_validada) === 1) {
    return <CardStatus color="#10b981" icon={CheckCircle} title="Organizacion validada" text="Tu cuenta puede publicar vacantes." />;
  }
  return <CardStatus color="#3b82f6" icon={Clock} title="Validacion en curso" text="El equipo administrativo esta revisando tus datos comerciales." />;
}

function CardStatus({ color, icon: Icon, title, text }) {
  return (
    <div style={{ ...statusCardBase, background: `${color}14`, border: `1px solid ${color}`, color }}>
      <Icon size={24} />
      <div>
        <h4 style={{ margin: 0, fontSize: 15 }}>{title}</h4>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: t.textSecondary }}>{text}</p>
      </div>
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label style={{ ...inputGroupStyle, gridColumn: wide ? "1 / -1" : undefined }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

function IconInput({ icon: Icon, children }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <Icon size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
      {children}
    </div>
  );
}

function Message({ message }) {
  const color = message.tipo === "success" ? "#10b981" : message.tipo === "warning" ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ ...alertBoxStyle, background: `${color}20`, border: `1px solid ${color}`, color }}>
      <AlertCircle size={18} />
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message.texto}</span>
    </div>
  );
}

const statusCardBase = { display: "flex", alignItems: "center", gap: 16, padding: 18, borderRadius: 12, boxSizing: "border-box" };
const panelStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 20 };
const panelTitleStyle = { display: "flex", alignItems: "center", gap: 8, margin: 0, fontSize: 16, fontWeight: 600, color: t.accent, borderBottom: `1px solid ${t.border}`, paddingBottom: 12 };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 };
const inputGroupStyle = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 13, fontWeight: 600, color: t.textSecondary };
const inputStyle = { background: t.bgSurface, border: `1px solid ${t.border}`, color: t.textPrimary, borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };
const textareaStyle = { ...inputStyle, fontFamily: "inherit", lineHeight: "1.5", resize: "vertical" };
const btnSaveStyle = { background: t.gradient, color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" };
const alertBoxStyle = { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, width: "100%", boxSizing: "border-box" };
