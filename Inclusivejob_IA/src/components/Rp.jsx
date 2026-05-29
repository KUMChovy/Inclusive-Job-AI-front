import { useState } from "react";

export default function Rp() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleEnviar = () => {
    if (!email.trim()) {
      alert("Por favor ingresa tu correo electrónico.");
      return;
    }

    alert(`Se ha enviado un correo de recuperación a ${email}`);
    setEmail("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
      >
        ¿Olvidaste tu contraseña?
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                📧
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                Recuperar contraseña
              </h2>

              <p className="mt-2 text-gray-500 text-sm">
                Ingresa tu correo electrónico y te enviaremos las instrucciones
                para restablecer tu contraseña.
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleEnviar}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}