import { useEffect, useState } from "react";
import PortalLayout from "../../assets/Componentes/Portal/PortalLayout";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";
import { reclutadorNav } from "../../assets/Componentes/Portal/navItems";
import { Building, Globe, FileText, MapPin, Save, CheckCircle, AlertCircle, Clock, ShieldAlert } from "lucide-react";

const API_EMPRESA = "http://localhost/backInclusive/back-inclusiveJob/Modelo/Reclutador/empresa.php";

export default function MiEmpresa() {
  const usuarioSesion = JSON.parse(localStorage.getItem("usuario")) || { id_usuario: 1 };

  const [companyData, setCompanyData] = useState({
    id_usuario: usuarioSesion.id_usuario,
    nombre_empresa: "",
    rfc_empresa: "",
    sitio_web: "",
    descripcion_empresa: "",
    direccion_empresa: "",
    empresa_validada: 0
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    const cargarDatosEmpresa = async () => {
      try {
        const res = await fetch(`${API_EMPRESA}?accion=obtener&id_usuario=${usuarioSesion.id_usuario}`);
        const result = await res.json();
        if (result.success) {
          setCompanyData(result.data);
        } else {
          setMensaje({ texto: result.message, tipo: "error" });
        }
      } catch (error) {
        console.error("Error al cargar datos corporativos:", error);
        setMensaje({ texto: "Error de conexión con el servidor.", tipo: "error" });
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEmpresa();
  }, [usuarioSesion.id_usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });
    setIsSaving(true);

    try {
      const res = await fetch(`${API_EMPRESA}?accion=actualizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData)
      });
      const result = await res.json();

      if (result.success) {
        setCompanyData(prev => ({ ...prev, empresa_validada: result.data.empresa_validada }));

        if (result.data.cambio_nombre) {
          setMensaje({ texto: "Información guardada. Al cambiar el nombre corporativo, la verificación ha vuelto a estado pendiente.", tipo: "warning" });
        } else {
          setMensaje({ texto: "¡Datos corporativos actualizados correctamente!", tipo: "success" });
        }

        // Sincronizar cambios en la sesión local por si impacta en el Header/Sidebar
        const sesionActual = JSON.parse(localStorage.getItem("usuario")) || {};
        const sesionActualizada = {
          ...sesionActual,
          empresa: companyData.nombre_empresa,
          empresa_validada: result.data.empresa_validada
        };
        localStorage.setItem("usuario", JSON.stringify(sesionActualizada));
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          setMensaje({ texto: "", tipo: "" });
        }, 5000);

      } else {
        setMensaje({ texto: result.message, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al guardar datos corporativos:", error);
      setMensaje({ texto: "Ocurrió un error inesperado al procesar la solicitud.", tipo: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const renderEstatusCard = () => {
    if (!companyData.nombre_empresa.trim()) {
      return (
        <div style={{ ...statusCardBase, background: "rgba(245,158,11,0.08)", border: "1px dashed #f59e0b", color: "#f59e0b" }}>
          <AlertCircle size={24} />
          <div>
            <h4 style={{ margin: 0, fontSize: 15 }}>Empresa sin registrar</h4>
            <p style={{ margin: "4px 0 0 0", fontSize: 13, color: t.textSecondary }}>Ingresa el nombre comercial y datos fiscales de tu organización para iniciar el proceso de alta.</p>
          </div>
        </div>
      );
    }

    if (companyData.empresa_validada === 1) {
      return (
        <div style={{ ...statusCardBase, background: "rgba(16,185,129,0.08)", border: "1px solid #10b981", color: "#10b981" }}>
          <CheckCircle size={24} />
          <div>
            <h4 style={{ margin: 0, fontSize: 15 }}>Organización Validada e Inclusiva</h4>
            <p style={{ margin: "4px 0 0 0", fontSize: 13, color: t.textSecondary }}>Tu cuenta posee permisos activos. Puedes publicar vacantes sin restricciones en el sistema.</p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ ...statusCardBase, background: "rgba(59,130,246,0.08)", border: "1px solid #3b82f6", color: "#3b82f6" }}>
        <Clock size={24} />
        <div>
          <h4 style={{ margin: 0, fontSize: 15 }}>Validación en curso</h4>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: t.textSecondary }}>Nuestro equipo de administración está revisando los datos comerciales. La creación de vacantes se activará al concluir la aprobación.</p>
        </div>
      </div>
    );
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
        
        {/* Tarjeta Dinámica de Estatus Operativo */}
        {renderEstatusCard()}

        {/* Feedback temporal */}
        {mensaje.texto && (
          <div style={{
            ...alertBoxStyle,
            background: mensaje.tipo === "success" ? "rgba(16,185,129,0.12)" : mensaje.tipo === "warning" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${mensaje.tipo === "success" ? "#10b981" : mensaje.tipo === "warning" ? "#f59e0b" : "#ef4444"}`,
            color: mensaje.tipo === "success" ? "#10b981" : mensaje.tipo === "warning" ? "#f59e0b" : "#ef4444"
          }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{mensaje.texto}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={panelStyle}>
          <h3 style={panelTitleStyle}><Building size={18} /> Perfil e Identidad de la Empresa</h3>
          
          <div style={gridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nombre Comercial o Razón Social *</label>
              <input type="text" name="nombre_empresa" value={companyData.nombre_empresa} onChange={handleChange} required style={inputStyle} placeholder="Ej: Tech Solutions S.A." />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Identificación Fiscal / RFC</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <FileText size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
                <input type="text" name="rfc_empresa" value={companyData.rfc_empresa} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Ej: TSO120405ABC" />
              </div>
            </div>

            <div style={{ ...inputGroupStyle, gridColumn: "span 2" }}>
              <label style={labelStyle}>Sitio Web de la Organización</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Globe size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
                <input type="url" name="sitio_web" value={companyData.sitio_web} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Ej: https://miempresa.com" />
              </div>
            </div>

            <div style={{ ...inputGroupStyle, gridColumn: "span 2" }}>
              <label style={labelStyle}>Dirección Física Corporativa</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <MapPin size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
                <input type="text" name="direccion_empresa" value={companyData.direccion_empresa} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Ej: Av. Juárez #123, Col. Centro" />
              </div>
            </div>

            <div style={{ ...inputGroupStyle, gridColumn: "span 2" }}>
              <label style={labelStyle}>Sobre la Empresa (Descripción para Candidatos)</label>
              <textarea 
                name="descripcion_empresa" 
                value={companyData.descripcion_empresa} 
                onChange={handleChange} 
                rows={5} 
                style={textareaStyle} 
                placeholder="Describe la misión de la empresa, su cultura laboral inclusiva y por qué los profesionales deberían postularse a tus ofertas de empleo..."
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button 
              type="submit" 
              disabled={isSaving}
              style={{
                ...btnSaveStyle,
                opacity: isSaving ? 0.7 : 1,
                cursor: isSaving ? "not-allowed" : "pointer"
              }}
            >
              <Save size={16} /> 
              {isSaving ? "Guardando datos..." : "Actualizar Datos Corporativos"}
            </button>
          </div>
        </form>

      </div>
    </PortalLayout>
  );
}

// Estilos específicos de la interfaz "Mi Empresa"
const statusCardBase = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: 18,
  borderRadius: 14,
  boxSizing: "border-box"
};

const panelStyle = {
  background: t.bgSurface,
  border: `1px solid ${t.border}`,
  borderRadius: 16,
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 20
};

const panelTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: t.accent,
  borderBottom: `1px solid ${t.border}`,
  paddingBottom: 12
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: t.textSecondary
};

const inputStyle = {
  background: t.bgSurface,
  border: `1px solid ${t.border}`,
  color: t.textPrimary,
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box"
};

const textareaStyle = {
  ...inputStyle,
  fontFamily: "inherit",
  lineHeight: "1.5",
  resize: "vertical"
};

const btnSaveStyle = {
  background: t.gradient,
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 4px 12px rgba(147, 51, 234, 0.2)"
};

const alertBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 16px",
  borderRadius: 10,
  width: "100%",
  boxSizing: "border-box"
};