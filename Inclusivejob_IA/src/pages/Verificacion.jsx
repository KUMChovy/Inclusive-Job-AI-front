import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

// EmailJS config - reemplaza con tus datos
const EMAILJS_SERVICE_ID  = "service_m28i25a";
const EMAILJS_TEMPLATE_ID = "template_2e0bv8e";
const EMAILJS_PUBLIC_KEY  = "KqSVFeZM9Y4NA0sHN";

// ─────────────────────────────────────────────────────────────
//  Ajusta esta URL base a donde vivas tu backend PHP
// ─────────────────────────────────────────────────────────────
const API_BASE = "http://localhost/back-inclusiveJob/Modelo/Postulante";

export default function Verificacion({ correoUsuario = "" }) {
  const [openModal, setOpenModal]   = useState(false);
  const [digitos,   setDigitos]     = useState(["", "", "", "", "", ""]);
  const [cargando,  setCargando]    = useState(false);
  const [mensaje,   setMensaje]     = useState({ texto: "", tipo: "" }); // tipo: "ok" | "error"
  const [enviado,   setEnviado]     = useState(false);   // true cuando ya se envió el código
  const [reenvio,   setReenvio]     = useState(false);   // bloqueo temporal de reenvío
  const inputsRef = useRef([]);

  // Correo a usar: el que llega por prop o uno de prueba
  const correo = correoUsuario || "rimekotwo@gmail.com";

  // ── Abrir modal y enviar código automáticamente ────────────
  const abrirModal = async () => {
    setOpenModal(true);
    setDigitos(["", "", "", "", "", ""]);
    setMensaje({ texto: "", tipo: "" });
    await enviarCodigo();
  };

  // ── Enviar / Reenviar código via PHP + EmailJS ───────────────
  const enviarCodigo = async () => {
    if (reenvio) return;
    setCargando(true);
    setMensaje({ texto: "", tipo: "" });

    try {
      // 1. PHP genera el código y lo guarda en la BD
      const res  = await fetch(`${API_BASE}/enviar_codigo.php`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ correo }),
      });
      const data = await res.json();

      if (!data.success) {
        setMensaje({ texto: data.mensaje || "No se pudo generar el código.", tipo: "error" });
        return;
      }

      // 2. EmailJS envía el correo con el código recibido
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: correo,
          codigo:   data.codigo,
        },
        EMAILJS_PUBLIC_KEY
      );

      setEnviado(true);
      setMensaje({ texto: "Código enviado. Revisa tu correo.", tipo: "ok" });
      setReenvio(true);
      setTimeout(() => setReenvio(false), 60_000);

    } catch {
      setMensaje({ texto: "Error de red. Verifica tu conexión.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  // ── Manejo de inputs del código ────────────────────────────
  const handleChange = (index, value) => {
    // Solo números
    if (!/^\d?$/.test(value)) return;

    const nuevo = [...digitos];
    nuevo[index] = value;
    setDigitos(nuevo);

    // Auto-avanzar al siguiente input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digitos[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pegado = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const nuevo  = ["", "", "", "", "", ""];
    pegado.split("").forEach((c, i) => { nuevo[i] = c; });
    setDigitos(nuevo);
    // Mover foco al último dígito pegado
    const ultimo = Math.min(pegado.length, 5);
    inputsRef.current[ultimo]?.focus();
  };

  // ── Verificar código ───────────────────────────────────────
  const verificarCodigo = async () => {
    const codigo = digitos.join("");
    if (codigo.length < 6) {
      setMensaje({ texto: "Ingresa los 6 dígitos del código.", tipo: "error" });
      return;
    }

    setCargando(true);
    setMensaje({ texto: "", tipo: "" });

    try {
      const res  = await fetch(`${API_BASE}/verificar_codigo.php`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ correo, codigo }),
      });
      const data = await res.json();

      if (data.success) {
        setMensaje({ texto: data.mensaje, tipo: "ok" });
        // Esperar 2 s y cerrar / redirigir
        setTimeout(() => {
          setOpenModal(false);
          // window.location.href = "/login"; // Descomenta para redirigir
        }, 2000);
      } else {
        setMensaje({ texto: data.mensaje || "Código incorrecto.", tipo: "error" });
        setDigitos(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch {
      setMensaje({ texto: "Error de red. Verifica tu conexión.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  // ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-white flex items-center justify-center px-4 py-10">

      {/* BOTÓN ABRIR MODAL */}
      <button
        onClick={abrirModal}
        className="bg-indigo-800 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-[1.03] transition-all font-semibold"
      >
        Verificación
      </button>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6">

          <style>{`
            @keyframes fadeModal  { from { opacity:0 } to { opacity:1 } }
            @keyframes scaleSoft  { from { opacity:0; transform:translateY(10px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
            @keyframes softFloat  { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-3px) } }
          `}</style>

          {/* Overlay */}
          <div
            onClick={() => setOpenModal(false)}
            className="absolute inset-0 bg-indigo-950/35 backdrop-blur-md"
            style={{ animation: "fadeModal .25s ease-out both" }}
          />

          {/* Halo */}
          <div className="absolute w-[520px] h-[520px] bg-white/20 rounded-full blur-3xl pointer-events-none" />

          {/* Card */}
          <div
            className="relative z-10 w-full max-w-md bg-white/75 backdrop-blur-2xl rounded-3xl shadow-[0_30px_80px_rgba(30,27,75,0.35)] border border-white/70 p-8 overflow-hidden"
            style={{ animation: "scaleSoft .35s ease-out both" }}
          >
            {/* Cerrar */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/70 text-gray-500 hover:text-indigo-800 hover:bg-indigo-50/80 transition flex items-center justify-center shadow-sm"
            >✕</button>

            {/* Decoraciones */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-100/70 rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-50/70 rounded-full pointer-events-none" />

            <div className="relative z-10">

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-white/75 backdrop-blur-md rounded-2xl shadow-md border border-white/80 overflow-hidden mb-4">
                  <img src="/logo.webp" alt="Logo" className="w-full h-full object-cover" />
                </div>

                <div
                  className="w-12 h-12 bg-indigo-100/80 text-indigo-700 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm ring-4 ring-white/50"
                  style={{ animation: "softFloat 5s ease-in-out infinite" }}
                >✉️</div>

                <h1 className="text-2xl font-bold text-indigo-900">Verifica tu correo</h1>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  Hemos enviado un código de verificación a tu correo electrónico.
                  Ingresa el código para activar tu cuenta.
                </p>
              </div>

              {/* Correo */}
              <div className="bg-indigo-50/70 backdrop-blur-md border border-white/70 rounded-2xl p-4 mb-6 text-center shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Código enviado a:</p>
                <p className="text-sm font-semibold text-indigo-800">{correo}</p>
              </div>

              {/* Mensaje de estado */}
              {mensaje.texto && (
                <div className={`mb-4 px-4 py-3 rounded-xl text-sm text-center font-medium transition-all ${
                  mensaje.tipo === "ok"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {mensaje.tipo === "ok" ? "✅ " : "⚠️ "}{mensaje.texto}
                </div>
              )}

              {/* Inputs del código */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
                  Código de verificación
                </label>

                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {digitos.map((d, i) => (
                    <input
                      key={i}
                      ref={el => inputsRef.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={d}
                      onChange={e => handleChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      disabled={cargando}
                      className="w-11 h-12 sm:w-12 sm:h-12 text-center text-lg font-bold rounded-xl border border-white/80 bg-white/65 backdrop-blur-md text-indigo-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition shadow-sm hover:border-indigo-300 disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              {/* Botón verificar */}
              <button
                onClick={verificarCodigo}
                disabled={cargando || digitos.join("").length < 6}
                className="w-full bg-gradient-to-r from-indigo-800 to-indigo-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {cargando ? "Verificando…" : "Verificar correo"}
              </button>

              {/* Reenviar */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">¿No recibiste el código?</p>
                <button
                  onClick={enviarCodigo}
                  disabled={reenvio || cargando}
                  className="text-indigo-700 text-sm font-semibold hover:text-indigo-900 hover:underline mt-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {reenvio ? "Reenviar disponible en 60 s" : "Reenviar código"}
                </button>
              </div>

              {/* Cambiar correo */}
              <div className="mt-6 border-t border-white/70 pt-5 text-center">
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-sm text-gray-500 hover:text-indigo-700 transition"
                >
                  Cambiar correo electrónico
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}