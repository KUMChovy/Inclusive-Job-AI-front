import React, { useState, useEffect } from "react";

const Registro = () => {
  const [mode, setMode] = useState("postulante");
  const [isMobile, setIsMobile] = useState(false);

  const isPostulante = mode === "postulante";

  const theme = isPostulante ? postulante : reclutador;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");

    const update = () => {
      setIsMobile(mq.matches);
    };

    update();

    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        background: theme.background,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* ================= LEFT ================= */}

      <div
        style={{
          ...styles.leftSide,
          width: isMobile ? "100%" : "45%",
        }}
      >
        {/* SWITCH */}

        <div
          style={{
            ...styles.switchWrapper,
            background: theme.switchBg,
          }}
        >
          <div
            style={{
              ...styles.switchIndicator,
              transform: isPostulante
                ? "translateX(0%)"
                : "translateX(100%)",
            }}
          />

          <button
            onClick={() => setMode("postulante")}
            style={styles.switchBtn}
          >
            Postulante
          </button>

          <button
            onClick={() => setMode("reclutador")}
            style={styles.switchBtn}
          >
            Reclutador
          </button>
        </div>

        {/* CARD */}

        <div
          style={{
            ...styles.card,
            width: isMobile ? "88%" : 520,
          }}
        >
          {/* LOGO */}

          <div style={styles.logoRow}>
            <div style={styles.logoWrapper}>
              <div style={styles.logoGlow} />
              <img src="/logo.webp" alt="InclusiJob IA" style={styles.logo} />
            </div>
            <a href="/" style={styles.backBtn}>
              ← Inicio
            </a>
          </div>

          {/* TITLES */}

          <h1
            style={{
              ...styles.title,
              color: theme.title,
            }}
          >
            Crear cuenta
          </h1>

          <p style={styles.subtitle}>
            Únete a InclusiJobIA
          </p>

          {/* FORM */}

          <form style={styles.form}>
            <input
              type="text"
              placeholder="Nombre completo"
              style={{
                ...styles.input,
                border: `2px solid ${theme.border}`,
              }}
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              style={{
                ...styles.input,
                border: `2px solid ${theme.border}`,
              }}
            />

            <input
              type="password"
              placeholder="Contraseña"
              style={{
                ...styles.input,
                border: `2px solid ${theme.border}`,
              }}
            />

            <input
              type="tel"
              placeholder="Teléfono"
              style={{
                ...styles.input,
                border: `2px solid ${theme.border}`,
              }}
            />

            {/* REGISTER */}

            <button
              style={{
                ...styles.registerBtn,
                background: theme.button,
              }}
            >
              Registrarse
            </button>

            {/* DIVIDER */}

            <div style={styles.divider}>
              <div style={styles.line}></div>

              <span style={styles.dividerText}>
                o continuar con
              </span>

              <div style={styles.line}></div>
            </div>

            {/* GOOGLE */}

            <button
              type="button"
              style={{
                ...styles.googleBtn,
                border: `2px solid ${theme.border}`,
              }}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                style={{
                  width: 24,
                  height: 24,
                }}
              />

              Continuar con Google
            </button>

            {/* LOGIN */}

            <p style={styles.loginText}>
              ¿Ya tienes cuenta?{" "}
              <a href="/login" style={styles.loginLink}>
                inicia sesion
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* ================= RIGHT ================= */}

      {!isMobile && (
        <div
          style={{
            ...styles.rightSide,
            width: "55%",
          }}
        >
          {/* CIRCLE BG */}

          <div
            style={{
              ...styles.bigCircle,
              background: theme.circle,
            }}
          ></div>

          {/* FLOATING BALLS */}

          <div
            style={{
              ...styles.ball,
              width: 120,
              height: 120,
              top: 80,
              left: 60,
            }}
          ></div>

          <div
            style={{
              ...styles.ball,
              width: 80,
              height: 80,
              bottom: 100,
              right: 120,
            }}
          ></div>

          <div
            style={{
              ...styles.ball,
              width: 50,
              height: 50,
              top: 180,
              right: 180,
            }}
          ></div>

          {/* IMAGE */}

          <img
            src={theme.image}
            alt="Inclusión"
            style={styles.image}
          />

          {/* TEXT */}

          <div style={styles.rightContent}>
            <h2 style={styles.rightTitle}>
              Inclusión que genera{" "}
              <span style={styles.highlight}>
                oportunidades
              </span>
            </h2>

            <p style={styles.rightText}>
              Conectamos talento diverso con empresas
              comprometidas usando inteligencia artificial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= THEMES ================= */

const postulante = {
  background:
    "linear-gradient(135deg,#eef4ff,#dbeafe)",

  switchBg:
    "linear-gradient(135deg,#4f46e5,#2563eb)",

  button:
    "linear-gradient(135deg,#4f46e5,#2563eb)",

  border: "#bfdbfe",

  title: "#0f172a",

  circle:
    "linear-gradient(135deg,#bfdbfe,#60a5fa)",

  image: "/inclu2.png",
};

const reclutador = {
  background:
    "linear-gradient(135deg,#eef4ff,#c7d2fe)",

  switchBg:
    "linear-gradient(135deg,#1e3a8a,#3730a3)",

  button:
    "linear-gradient(135deg,#1e3a8a,#3730a3)",

  border: "#93c5fd",

  title: "#0f172a",

  circle:
    "linear-gradient(135deg,#60a5fa,#2563eb)",

  image: "/inclu3.png",
};

/* ================= STYLES ================= */

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
  },

  leftSide: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 35,
    padding: 40,
    boxSizing: "border-box",
    zIndex: 5,
  },

  /* RIGHT */

  rightSide: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 30,
  },

  bigCircle: {
    position: "absolute",
    width: 900,
    height: 900,
    borderRadius: "50%",
    opacity: 0.22,
    filter: "blur(10px)",
  },

  ball: {
    position: "absolute",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#2563eb,#60a5fa)",
    opacity: 0.25,
    filter: "blur(2px)",
  },

  image: {
    width: "85%",
    maxWidth: 650,
    objectFit: "contain",
    zIndex: 3,

    filter:
      "drop-shadow(0 20px 40px rgba(37,99,235,0.15))",
  },

  rightContent: {
    textAlign: "center",
    marginTop: 20,
    maxWidth: 550,
    zIndex: 3,
  },

  rightTitle: {
    fontSize: "clamp(28px, 5vw, 44px)",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 15,
  },

  highlight: {
    color: "#4f46e5",
  },

  rightText: {
    color: "#64748b",
    fontSize: 18,
    lineHeight: 1.6,
  },

  /* SWITCH */

  switchWrapper: {
    width: "100%",
    maxWidth: 390,
    height: 72,
    borderRadius: 999,
    display: "flex",
    position: "relative",
    padding: 6,
    overflow: "hidden",

    boxShadow:
      "0 10px 30px rgba(37,99,235,0.18)",
  },

  switchIndicator: {
    position: "absolute",
    width: "50%",
    height: "calc(100% - 12px)",
    background: "rgba(255,255,255,0.22)",
    borderRadius: 999,
    top: 6,
    left: 6,
    transition: "0.4s ease",
    backdropFilter: "blur(8px)",
  },

  switchBtn: {
    flex: 1,
    border: "none",
    background: "transparent",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    zIndex: 2,
    fontSize: 18,
  },

  /* CARD */

  card: {

    width: "100%",
    maxWidth: 520,

    background: "rgba(255,255,255,0.72)",

    backdropFilter: "blur(20px)",

    border: "1px solid rgba(255,255,255,0.35)",

    borderRadius: 40,

    padding: "50px 45px",

    boxShadow:
      "0 20px 50px rgba(0,0,0,0.08)",
  },

  /* LOGO */

    logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },

  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(10px)",
    border: "1.5px solid #bfdbfe",
    color: "#1e3a8a",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(37,99,235,0.08)",
    transition: "0.2s ease",
    whiteSpace: "nowrap",
  },

  logoWrapper: {
    position: "relative",
    width: 130,
    height: 130,
    marginBottom: 10,
  },

  logoGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",

    background:
      "radial-gradient(circle, rgba(96,165,250,0.45), transparent 70%)",

    filter: "blur(15px)",
  },

  logo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    position: "relative",
    zIndex: 2,

    boxShadow:
      "0 10px 30px rgba(37,99,235,0.18)",
  },

  /* TITLES */

  title: {
    fontSize: "clamp(38px, 8vw, 64px)",
    fontWeight: 900,
    lineHeight: 1,
    marginBottom: 12,
  },

  subtitle: {
    color: "#64748b",
    fontSize: 20,
    marginBottom: 35,
  },

  /* FORM */

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  input: {
    minHeight: 58,

    height: "auto",

    borderRadius: 18,

    padding: "0 22px",

    fontSize: 16,

    outline: "none",

    background: "rgba(255,255,255,0.82)",

    transition: "0.3s ease",

    boxShadow:
      "0 4px 10px rgba(0,0,0,0.03)",
  },

  registerBtn: {
    minHeight: 58,

    border: "none",

    borderRadius: 18,

    color: "#fff",

    fontWeight: 700,

    fontSize: 18,

    cursor: "pointer",

    marginTop: 10,

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.22)",
  },

  /* DIVIDER */

  divider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },

  line: {
    flex: 1,
    height: 1,
    background: "#cbd5e1",
  },

  dividerText: {
    color: "#64748b",
    fontSize: 14,
  },

  /* GOOGLE */

  googleBtn: {
    height: 64,

    borderRadius: 18,

    background: "rgba(255,255,255,0.92)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    gap: 12,

    fontWeight: 600,

    cursor: "pointer",

    fontSize: 16,

    transition: "0.3s ease",

    boxShadow:
      "0 4px 10px rgba(0,0,0,0.04)",
  },

  /* LOGIN */

  loginText: {
    textAlign: "center",
    marginTop: 10,
    color: "#64748b",
    fontSize: 15,
  },

  loginLink: {
    color: "#4f46e5",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Registro;