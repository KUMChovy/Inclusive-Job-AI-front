import React, { useState, useEffect, useRef } from "react";
import Verificacion from "./Verificacion";
import { errorAlert, successAlert } from "../assets/Componentes/Admin/alerts";
import {useGoogleDomain}  from "../assets/Hook/Google/useDomain";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";

/* ================= BARRA DE FUERZA ================= */

const StrengthBar = ({ password }) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8)    score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password))    score++;
  if (/[\W_]/.test(password)) score++;
  const labels = ["", "Muy débil", "Débil", "Regular", "Buena", "Fuerte"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
  return (
    <div style={{ marginBottom: 2 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: i <= score ? colors[score] : "#e2e8f0",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: colors[score], fontWeight: 600 }}>{labels[score]}</span>
    </div>
  );
};

/* ================= MODAL CONTRASEÑA ================= */

const PasswordModal = ({ isPostulante, onConfirm, userId, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;

  const theme = isPostulante
    ? { border: "#bfdbfe", btn: "linear-gradient(135deg,#4f46e5,#2563eb)" }
    : { border: "#93c5fd", btn: "linear-gradient(135deg,#1e3a8a,#3730a3)" };

const handleConfirm = async () => {
  if (loading) return;

  if (!passwordRegex.test(password)) {
    setError("Mínimo 8 caracteres...");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const result = await onConfirm(password, userId);

    if (!result || result.success === false) {
      throw new Error(result?.message || "No se pudo actualizar la contraseña");
    }

    // 1. cerrar modal primero
    onClose?.();

    // 2. esperar a que React pinte el cierre
    requestAnimationFrame(async () => {
      if (result.triggerSuccess) {
        await successAlert(
          "Registro exitoso",
          "Bienvenido a InclusiJob IA",
          theme
        );
      }
    });

  } catch (err) {
    setError(err.message || "Error al actualizar contraseña");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={ms.overlay}>
      <div style={{ ...ms.card, border: `1px solid ${theme.border}` }}>

        <div style={{ ...ms.iconRing, borderColor: theme.border }}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: 34, height: 34, objectFit: "contain" }}
          />
        </div>

        <h2 style={ms.title}>Completa tu registro</h2>

        <p style={ms.subtitle}>
          Debes crear una contraseña para poder activar tu cuenta.
          No podrás continuar hasta completarlo.
        </p>

        <div style={ms.inputWrapper}>
          <input
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Nueva contraseña"
            maxLength={64}
            value={password}
            disabled={loading}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            style={{
              ...ms.input,
              borderColor: error ? "#dc2626" : theme.border,
              opacity: loading ? 0.7 : 1,
            }}
          />

          <button
            type="button"
            style={ms.eyeBtn}
            disabled={loading}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <StrengthBar password={password} />

        {error && <p style={ms.errorText}>{error}</p>}

        <p style={ms.hint}>
          Mínimo 8 caracteres · mayúscula · minúscula · número · símbolo
        </p>

        <button
          type="button"
          disabled={loading}
          style={{
            ...ms.confirmBtn,
            background: theme.btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handleConfirm}
        >
          {loading ? "Guardando..." : "Completar registro"}
        </button>
      </div>
    </div>
  );
};

const ms = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  },
  card: {
    position: "relative", width: "100%", maxWidth: 440,
    background: "rgba(255,255,255,0.88)", backdropFilter: "blur(24px)",
    borderRadius: 32, padding: "48px 40px 40px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
    display: "flex", flexDirection: "column", gap: 14,
    fontFamily: "Poppins, sans-serif",
  },
  closeBtn: {
    position: "absolute", top: 18, right: 20,
    background: "transparent", border: "none",
    fontSize: 18, cursor: "pointer", color: "#94a3b8", padding: 4,
  },
  iconRing: {
    alignSelf: "center", width: 64, height: 64, borderRadius: "50%",
    border: "2px solid", background: "rgba(255,255,255,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  title: { margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", textAlign: "center" },
  subtitle: { margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.6, textAlign: "center" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  input: {
    flex: 1, height: 54, borderRadius: 16, padding: "0 48px 0 18px",
    fontSize: 15, border: "2px solid", outline: "none",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "border-color 0.2s",
    fontFamily: "Poppins, sans-serif",
  },
  eyeBtn: {
    position: "absolute", right: 14,
    background: "transparent", border: "none",
    cursor: "pointer", fontSize: 18, padding: 0,
  },
  errorText: { margin: 0, fontSize: 13, color: "#dc2626", fontWeight: 500 },
  hint: { margin: 0, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 },
  confirmBtn: {
    marginTop: 6, height: 54, border: "none", borderRadius: 16,
    color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
    boxShadow: "0 10px 25px rgba(37,99,235,0.22)",
  },
};

/* ================= REGISTRO ================= */

const Registro = () => {
  const [mode, setMode] = useState("postulante");
  const [isMobile, setIsMobile] = useState(false);
  const { registrarConGoogle, completarPassword } = useGoogleDomain();
  const googleBtnRef = useRef(null);

  const [form, setForm] = useState({
    nombres: "",
    correo: "",
    password: "",
    telefono: ""
  });

  const [mostrarVerificacion, setMostrarVerificacion] = useState(false);
  const [correoRegistrado, setCorreoRegistrado] = useState("");
  const [codigoRegistro, setCodigoRegistro] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [alertThemeSnapshot, setAlertThemeSnapshot] = useState(null);
  const [googleUserId, setGoogleUserId] = useState(null);

  const isPostulante = mode === "postulante";
  const theme = isPostulante ? postulante : reclutador;
  const alertTheme = buildRegistroAlertTheme(isPostulante);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const update = () => { setIsMobile(mq.matches); };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const validar = () => {
    const { nombres, correo, password, telefono } = form;
    const nombreRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]{3,60}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!nombreRegex.test(nombres)) return "Nombre inválido";
    if (!emailRegex.test(correo)) return "Correo inválido";
    if (!passwordRegex.test(password)) return "Contraseña débil";
    if (!telefonoRegex.test(telefono)) return "Teléfono inválido";
    return null;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validar();
    if (error) {
      await errorAlert("Datos inválidos", error, alertTheme);
      return;
    }
    try {
      const endpoint = isPostulante
        ? "http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/reg_pos.php"
        : "http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Reclutador/reg_reclu.php";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      console.log("Respuesta API:", data);
      if (data.success) {
        setCorreoRegistrado(form.correo);
        setCodigoRegistro(data.codigo);
        await successAlert("Código enviado", "Revisa tu correo para completar el registro.", alertTheme);
        setMostrarVerificacion(true);
      } else {
        await errorAlert("No se pudo registrar", data.message || "Error en registro", alertTheme);
      }
    } catch (err) {
      console.error(err);
      await errorAlert("Error de conexión", "No se pudo conectar con el servidor.", alertTheme);
    }
  };

  const dispararGooglePopup = () => {
    const btn = googleBtnRef.current?.querySelector("div[role=button], button");
    if (btn) btn.click();
  };

  return (
    <div
      style={{
        ...styles.container,
        background: theme.background,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* ================= LEFT ================= */}
      <div style={{ ...styles.leftSide, width: isMobile ? "100%" : "45%" }}>

        {/* SWITCH */}
        <div style={{ ...styles.switchWrapper, background: theme.switchBg }}>
          <div
            style={{
              ...styles.switchIndicator,
              transform: isPostulante ? "translateX(0%)" : "translateX(100%)",
            }}
          />
          <button onClick={() => setMode("postulante")} style={styles.switchBtn}>
            Postulante
          </button>
          <button onClick={() => setMode("reclutador")} style={styles.switchBtn}>
            Reclutador
          </button>
        </div>

        {/* CARD */}
        <div style={{ ...styles.card, width: isMobile ? "88%" : 520 }}>

          {/* LOGO */}
          <div style={styles.logoRow}>
            <div style={styles.logoWrapper}>
              <div style={styles.logoGlow} />
              <img src="/logo.webp" alt="InclusiJob IA" style={styles.logo} />
            </div>
            <a href="/" style={styles.backBtn}>← Inicio</a>
          </div>

          {/* TITLES */}
          <h1 style={{ ...styles.title, color: theme.title }}>Crear cuenta</h1>
          <p style={styles.subtitle}>Únete a InclusiJobIA</p>

          {/* FORM */}
          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombres"
              placeholder="Nombre completo"
              maxLength={60}
              value={form.nombres}
              onChange={handleChange}
              style={{ ...styles.input, border: `2px solid ${theme.border}` }}
            />
            <input
              type="email"
              autoComplete="email"
              name="correo"
              placeholder="Correo electrónico"
              maxLength={100}
              value={form.correo}
              onChange={handleChange}
              style={{ ...styles.input, border: `2px solid ${theme.border}` }}
            />
            <input
              type="password"
              autoComplete="new-password"
              name="password"
              placeholder="Contraseña"
              maxLength={128}
              value={form.password}
              onChange={handleChange}
              style={{ ...styles.input, border: `2px solid ${theme.border}` }}
            />
            <input
              type="tel"
              autoComplete="tel"
              name="telefono"
              placeholder="Teléfono"
              maxLength={15}
              value={form.telefono}
              onChange={handleChange}
              style={{ ...styles.input, border: `2px solid ${theme.border}` }}
            />

            {/* REGISTER */}
            <button
              type="submit"
              style={{ ...styles.registerBtn, background: theme.button }}
            >
              Registrarse
            </button>

            {/* DIVIDER */}
            <div style={styles.divider}>
              <div style={styles.line}></div>
              <span style={styles.dividerText}>o continuar con</span>
              <div style={styles.line}></div>
            </div>

            {/* GOOGLE — botón oculto + botón visual tuyo */}
            <div ref={googleBtnRef} style={{ display: "none" }}>
              <GoogleLogin
                ux_mode="popup"
                auto_select={false}
                cancel_on_tap_outside={true}
onSuccess={async (credentialResponse) => {
  const data = await registrarConGoogle({
    credential: credentialResponse.credential,
    tipo: mode,
  });

  if (data.requiere_password) {
    setGoogleUserId(data.id_usuario || data.id);   // 👈 ESTE ES EL ID REAL
    setShowPasswordModal(true);
  } else {
    await errorAlert("Error", data.message, alertTheme);
  }
}}
                onError={() => {
                  errorAlert("Error", "No se pudo iniciar sesión con Google", alertTheme);
                }}
              />
            </div>

            <button
              type="button"
              onClick={dispararGooglePopup}
              style={{
                ...styles.googleBtn,
                border: `2px solid ${theme.border}`,
              }}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                style={{ width: 24, height: 24 }}
              />
              Continuar con Google
            </button>

            {/* LOGIN */}
            <p style={styles.loginText}>
              ¿Ya tienes cuenta?{" "}
              <a href="/login" style={styles.loginLink}>inicia sesion</a>
            </p>
          </form>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      {!isMobile && (
        <div style={{ ...styles.rightSide, width: "55%" }}>
          <div style={{ ...styles.bigCircle, background: theme.circle }}></div>
          <div style={{ ...styles.ball, width: 120, height: 120, top: 80, left: 60 }}></div>
          <div style={{ ...styles.ball, width: 80, height: 80, bottom: 100, right: 120 }}></div>
          <div style={{ ...styles.ball, width: 50, height: 50, top: 180, right: 180 }}></div>
          <img src={theme.image} alt="Inclusión" style={styles.image} />
          <div style={styles.rightContent}>
            <h2 style={styles.rightTitle}>
              Inclusión que genera{" "}
              <span style={styles.highlight}>oportunidades</span>
            </h2>
            <p style={styles.rightText}>
              Conectamos talento diverso con empresas comprometidas usando inteligencia artificial.
            </p>
          </div>
        </div>
      )}

      {/* ================= MODAL CONTRASEÑA GOOGLE ================= */}
      {showPasswordModal && googleUserId && (
  <PasswordModal
    isPostulante={isPostulante}
    userId={googleUserId}
    onClose={() => {
      setShowPasswordModal(false);
      setGoogleUserId(null);
    }}
onConfirm={async (password, userId) => {
  const res = await completarPassword({
    id_usuario: userId,
    password
  });

  if (!res.success) {
    return { success: false, message: res.message };
  }

  return {
    success: true,
    triggerSuccess: true
  };
}}
  />
)}

      {/* ================= MODAL DE VERIFICACIÓN ================= */}
      {mostrarVerificacion && (
        <Verificacion
          correoUsuario={correoRegistrado}
          codigoInicial={codigoRegistro}
          autoAbrir={true}
          onClose={() => setMostrarVerificacion(false)}
        />
      )}
    </div>
  );
};

/* ================= THEMES ================= */

function buildRegistroAlertTheme(isPostulante) {
  return isPostulante
    ? {
        bgSurface: "#f8fbff", textPrimary: "#0f172a", textSecondary: "#475569",
        textMuted: "#94a3b8", border: "rgba(37,99,235,0.16)", accent: "#2563eb",
        accentHover: "#1d4ed8", success: "#16a34a", danger: "#dc2626",
      }
    : {
        bgSurface: "#f8fbff", textPrimary: "#0f172a", textSecondary: "#475569",
        textMuted: "#818cf8", border: "rgba(55,48,163,0.18)", accent: "#3730a3",
        accentHover: "#1e3a8a", success: "#16a34a", danger: "#dc2626",
      };
}

const postulante = {
  background: "linear-gradient(135deg,#eef4ff,#dbeafe)",
  switchBg: "linear-gradient(135deg,#4f46e5,#2563eb)",
  button: "linear-gradient(135deg,#4f46e5,#2563eb)",
  border: "#bfdbfe",
  title: "#0f172a",
  circle: "linear-gradient(135deg,#bfdbfe,#60a5fa)",
  image: "/inclu2.png",
};

const reclutador = {
  background: "linear-gradient(135deg,#eef4ff,#c7d2fe)",
  switchBg: "linear-gradient(135deg,#1e3a8a,#3730a3)",
  button: "linear-gradient(135deg,#1e3a8a,#3730a3)",
  border: "#93c5fd",
  title: "#0f172a",
  circle: "linear-gradient(135deg,#60a5fa,#2563eb)",
  image: "/inclu3.png",
};

/* ================= STYLES ================= */

const styles = {
  container: {
    width: "100%", minHeight: "100vh", display: "flex",
    overflow: "hidden", fontFamily: "Poppins, sans-serif",
  },
  leftSide: {
    display: "flex", flexDirection: "column", justifyContent: "center",
    alignItems: "center", gap: 35, padding: 40, boxSizing: "border-box", zIndex: 5,
  },
  rightSide: {
    position: "relative", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", overflow: "hidden", padding: 30,
  },
  bigCircle: {
    position: "absolute", width: 900, height: 900,
    borderRadius: "50%", opacity: 0.22, filter: "blur(10px)",
  },
  ball: {
    position: "absolute", borderRadius: "50%",
    background: "linear-gradient(135deg,#2563eb,#60a5fa)",
    opacity: 0.25, filter: "blur(2px)",
  },
  image: {
    width: "85%", maxWidth: 650, objectFit: "contain", zIndex: 3,
    filter: "drop-shadow(0 20px 40px rgba(37,99,235,0.15))",
  },
  rightContent: { textAlign: "center", marginTop: 20, maxWidth: 550, zIndex: 3 },
  rightTitle: {
    fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800,
    color: "#0f172a", marginBottom: 15,
  },
  highlight: { color: "#4f46e5" },
  rightText: { color: "#64748b", fontSize: 18, lineHeight: 1.6 },
  switchWrapper: {
    width: "100%", maxWidth: 390, height: 72, borderRadius: 999,
    display: "flex", position: "relative", padding: 6, overflow: "hidden",
    boxShadow: "0 10px 30px rgba(37,99,235,0.18)",
  },
  switchIndicator: {
    position: "absolute", width: "50%", height: "calc(100% - 12px)",
    background: "rgba(255,255,255,0.22)", borderRadius: 999,
    top: 6, left: 6, transition: "0.4s ease", backdropFilter: "blur(8px)",
  },
  switchBtn: {
    flex: 1, border: "none", background: "transparent",
    color: "#fff", fontWeight: 700, cursor: "pointer", zIndex: 2, fontSize: 18,
  },
  card: {
    width: "100%", maxWidth: 520, background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 40, padding: "50px 45px", boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  },
  logoRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", width: "100%", marginBottom: 10,
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
    borderRadius: 999, background: "rgba(255,255,255,0.72)", backdropFilter: "blur(10px)",
    border: "1.5px solid #bfdbfe", color: "#1e3a8a", fontWeight: 600, fontSize: 14,
    textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.08)",
    transition: "0.2s ease", whiteSpace: "nowrap",
  },
  logoWrapper: { position: "relative", width: 130, height: 130, marginBottom: 10 },
  logoGlow: {
    position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(96,165,250,0.45), transparent 70%)",
    filter: "blur(15px)",
  },
  logo: {
    width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%",
    position: "relative", zIndex: 2, boxShadow: "0 10px 30px rgba(37,99,235,0.18)",
  },
  title: { fontSize: "clamp(38px, 8vw, 64px)", fontWeight: 900, lineHeight: 1, marginBottom: 12 },
  subtitle: { color: "#64748b", fontSize: 20, marginBottom: 35 },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  input: {
    minHeight: 58, height: "auto", borderRadius: 18, padding: "0 22px",
    fontSize: 16, outline: "none", background: "rgba(255,255,255,0.82)",
    transition: "0.3s ease", boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
  },
  registerBtn: {
    minHeight: 58, border: "none", borderRadius: 18, color: "#fff",
    fontWeight: 700, fontSize: 18, cursor: "pointer", marginTop: 10,
    boxShadow: "0 10px 25px rgba(37,99,235,0.22)",
  },
  divider: { display: "flex", alignItems: "center", gap: 10, marginTop: 5 },
  line: { flex: 1, height: 1, background: "#cbd5e1" },
  dividerText: { color: "#64748b", fontSize: 14 },
  googleBtn: {
    width: "100%", height: 64, borderRadius: 18,
    background: "rgba(255,255,255,0.92)", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 12,
    fontWeight: 600, cursor: "pointer", fontSize: 16,
    transition: "0.3s ease", boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  loginText: { textAlign: "center", marginTop: 10, color: "#64748b", fontSize: 15 },
  loginLink: { color: "#4f46e5", fontWeight: 700, cursor: "pointer" },
};

export default Registro;
