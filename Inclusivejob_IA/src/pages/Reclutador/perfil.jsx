import { useEffect, useState } from "react";
import PortalLayout from "../../assets/Componentes/Portal/PortalLayout";
import { reclutadorTheme as t } from "../../assets/Componentes/Portal/portalTheme";
import { reclutadorNav } from "../../assets/Componentes/Portal/navItems";
import { User, Building, Mail, Phone, Briefcase, Save, CheckCircle, AlertCircle, Clock, ShieldAlert } from "lucide-react";

const API_PERFIL = "http://localhost/backInclusive/back-inclusiveJob/Modelo/Reclutador/perfil.php";

export default function PerfilReclutador() {
  const usuarioSesion = JSON.parse(localStorage.getItem("usuario")) || { id_usuario: 1 }; 

  const [formData, setFormData] = useState({
    id_usuario: usuarioSesion.id_usuario,
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    empresa: "",
    puesto: "",
    sector: "",
    empresa_validada: 0 // 0 = No validada/Pendiente, 1 = Validada
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" }); 

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await fetch(`${API_PERFIL}?accion=obtener&id_usuario=${usuarioSesion.id_usuario}`);
        const result = await res.json();
        if (result.success) {
          setFormData(result.data);
        } else {
          setMensaje({ texto: result.message, tipo: "error" });
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setMensaje({ texto: "No se pudo conectar con el servidor.", tipo: "error" });
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [usuarioSesion.id_usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });
    setIsSaving(true); 

    try {
      const res = await fetch(`${API_PERFIL}?accion=actualizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if (result.success) {
        // Actualizar el estado local con la respuesta del servidor (especialmente el estado de validación)
        setFormData(prev => ({ ...prev, empresa_validada: result.data.empresa_validada }));

        if (result.data.cambio_empresa) {
          setMensaje({ texto: "Perfil guardado. Tu nueva empresa ha sido enviada a revisión y requiere validación.", tipo: "warning" });
        } else {
          setMensaje({ texto: "¡Perfil actualizado con éxito!", tipo: "success" });
        }

        // Sincronizar la sesión en localStorage incluyendo el estado de la empresa
        const sesionActual = JSON.parse(localStorage.getItem("usuario")) || {};
        const sesionActualizada = {
          ...sesionActual,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          empresa: formData.empresa,
          puesto: formData.puesto,
          sector: formData.sector,
          empresa_validada: result.data.empresa_validada
        };
        localStorage.setItem("usuario", JSON.stringify(sesionActualizada));

        // Forzar actualización en Header/Sidebar
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          setMensaje({ texto: "", tipo: "" });
        }, 5000);

      } else {
        setMensaje({ texto: result.message, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setMensaje({ texto: "Ocurrió un error al procesar la solicitud.", tipo: "error" });
    } finally {
      setIsSaving(false); 
    }
  };

  // Función auxiliar para renderizar el Badge de estatus de la empresa
  const renderEmpresaBadge = () => {
    if (!formData.empresa.trim()) {
      return (
        <span style={{ ...badgeStyle, background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid #f59e0b" }}>
          <AlertCircle size={14} /> Empresa Sin Registrar
        </span>
      );
    }
    if (formData.empresa_validada === 1) {
      return (
        <span style={{ ...badgeStyle, background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid #10b981" }}>
          <CheckCircle size={14} /> Empresa Validada (Acceso Completo)
        </span>
      );
    }
    return (
      <span style={{ ...badgeStyle, background: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "1px solid #3b82f6" }}>
        <Clock size={14} /> Pendiente de Validación
      </span>
    );
  };

  if (loading) {
    return (
      <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Mi Perfil">
        <div style={{ color: t.textMuted, textAlign: "center", padding: 40 }}>Cargando datos de reclutador...</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Mi Perfil">
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        
        {/* REGLA DE NEGOCIO: Bloqueo Informativo si la empresa no está validada */}
        {formData.empresa_validada !== 1 && (
          <div style={{ ...alertStyle, background: "rgba(239,68,68,0.08)", border: "1px dashed #ef4444", color: "#f87171", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
              <ShieldAlert size={20} /> Acción Requerida: Empresa No Validada
            </div>
            <p style={{ margin: 0, fontSize: 13, color: t.textSecondary }}>
              Actualmente no tienes permisos para crear o publicar nuevas vacantes. Registra el nombre de tu organización y espera a que nuestro equipo administrativo valide las credenciales comerciales de tu empresa.
            </p>
          </div>
        )}

        {/* Banner de Mensajes de feedback temporal */}
        {mensaje.texto && (
          <div style={{
            ...alertStyle,
            background: mensaje.tipo === "success" ? "rgba(16,185,129,0.12)" : mensaje.tipo === "warning" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${mensaje.tipo === "success" ? "#10b981" : mensaje.tipo === "warning" ? "#f59e0b" : "#ef4444"}`,
            color: mensaje.tipo === "success" ? "#10b981" : mensaje.tipo === "warning" ? "#f59e0b" : "#ef4444"
          }}>
            {mensaje.tipo === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span style={{ fontSize: 14, fontWeight: 500 }}>{mensaje.texto}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}><User size={18} /> Información Personal</h3>
            <div style={gridStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Nombre(s) *</label>
                <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Apellido(s) *</label>
                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Correo Electrónico</label>
                <div style={{ ...inputStyle, background: t.bgElevated, color: t.textMuted, display: "flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
                  <Mail size={14} /> {formData.correo}
                </div>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Teléfono de Contacto</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Phone size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Ej: +52 55..." />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: INFORMACIÓN DE LA EMPRESA & VALIDACIÓN */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: `1px solid ${t.border}`, paddingBottom: 10, flexWrap: "wrap", gap: 10 }}>
              <h3 style={{ ...sectionTitleStyle, borderBottom: "none", paddingBottom: 0 }}><Building size={18} /> Información Corporativa</h3>
              {renderEmpresaBadge()}
            </div>

            <div style={gridStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Empresa / Organización *</label>
                <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} required style={inputStyle} placeholder="Ej: InclusiveJob Inc." />
                <span style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Nota: Cambiar el nombre de la empresa revocará la verificación actual.</span>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Puesto o Cargo</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Briefcase size={14} style={{ position: "absolute", left: 12, color: t.textMuted }} />
                  <input type="text" name="puesto" value={formData.puesto} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Ej: Talent Acquisition Manager" />
                </div>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Sector Industrial</label>
                <select name="sector" value={formData.sector} onChange={handleChange} style={selectStyle}>
                  <option value="No especificado">Selecciona un sector</option>
                  <option value="Tecnología e Informática">Tecnología e Informática</option>
                  <option value="Servicios Generales / Limpieza">Servicios Generales / Limpieza</option>
                  <option value="Atención al Cliente / Ventas">Atención al Cliente / Ventas</option>
                  <option value="Logística y Distribución">Logística y Distribución</option>
                  <option value="Salud y Cuidado">Salud y Cuidado</option>
                  <option value="Educación">Educación</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botón de Enviar Reactivo */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              {isSaving ? "Guardando perfil..." : "Guardar y Solicitar Validación"}
            </button>
          </div>

        </form>
      </div>
    </PortalLayout>
  );
}

// Estilos de UI
const sectionStyle = {
  background: t.bgSurface,
  border: `1px solid ${t.border}`,
  borderRadius: 16,
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 16
};

const sectionTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: t.accent
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

const selectStyle = {
  ...inputStyle,
  cursor: "pointer"
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

const alertStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 16px",
  borderRadius: 10,
  width: "100%",
  boxSizing: "border-box"
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  marginLeft: "auto"
};