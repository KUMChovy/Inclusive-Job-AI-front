import React from "react";

export default function Verificacion() {
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-white flex items-center justify-center px-4 py-10">

      {/* BOTÓN PARA ABRIR MODAL */}
      <button
        onClick={() => setOpenModal(true)}
        className="bg-indigo-800 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-[1.03] transition-all font-semibold"
      >
        Verificación
      </button>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6">

          {/* ESTILOS LOCALES */}
          <style>
            {`
              @keyframes fadeModal {
                0% {
                  opacity: 0;
                }
                100% {
                  opacity: 1;
                }
              }

              @keyframes scaleSoft {
                0% {
                  opacity: 0;
                  transform: translateY(10px) scale(0.97);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @keyframes softFloatSmall {
                0%, 100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-3px);
                }
              }
            `}
          </style>

          {/* FONDO DEL MODAL TRANSPARENTE */}
          <div
            onClick={() => setOpenModal(false)}
            className="absolute inset-0 bg-indigo-950/35 backdrop-blur-md"
            style={{
              animation: "fadeModal 0.25s ease-out both",
            }}
          ></div>

          {/* HALO DETRÁS DE LA CARD */}
          <div className="absolute w-[520px] h-[520px] bg-white/20 rounded-full blur-3xl"></div>

          {/* CARD PRINCIPAL DEL MODAL */}
          <div
            className="relative z-10 w-full max-w-md bg-white/75 backdrop-blur-2xl rounded-3xl shadow-[0_30px_80px_rgba(30,27,75,0.35)] border border-white/70 p-8 overflow-hidden"
            style={{
              animation: "scaleSoft 0.35s ease-out both",
            }}
          >

            {/* BOTÓN CERRAR */}
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/70 text-gray-500 hover:text-indigo-800 hover:bg-indigo-50/80 transition flex items-center justify-center shadow-sm"
            >
              ✕
            </button>

            {/* DECORACIONES INTERNAS */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-100/70 rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-50/70 rounded-full"></div>

            <div className="relative z-10">

              {/* LOGO TEMPORAL */}
              <div className="flex flex-col items-center text-center mb-8">

                <div className="w-16 h-16 bg-white/75 backdrop-blur-md rounded-2xl shadow-md border border-white/80 flex items-center justify-center p-2 mb-4">
                  <span className="text-indigo-800 font-bold text-xl">
                    IJ
                  </span>
                </div>

                {/* ICONO DECORATIVO */}
                <div
                  className="w-12 h-12 bg-indigo-100/80 text-indigo-700 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm ring-4 ring-white/50"
                  style={{
                    animation: "softFloatSmall 5s ease-in-out infinite",
                  }}
                >
                  ✉️
                </div>

                <h1 className="text-2xl font-bold text-indigo-900">
                  Verifica tu correo
                </h1>

                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  Hemos enviado un código de verificación a tu correo electrónico.
                  Ingresa el código para activar tu cuenta.
                </p>
              </div>

              {/* CORREO MOSTRADO */}
              <div className="bg-indigo-50/70 backdrop-blur-md border border-white/70 rounded-2xl p-4 mb-6 text-center shadow-sm">
                <p className="text-xs text-gray-500 mb-1">
                  Código enviado a:
                </p>

                <p className="text-sm font-semibold text-indigo-800">
                  usuario@correo.com
                </p>
              </div>

              {/* INPUTS DEL CÓDIGO */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
                  Código de verificación
                </label>

                <div className="flex justify-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <input
                      key={item}
                      type="text"
                      maxLength="1"
                      className="w-11 h-12 sm:w-12 sm:h-12 text-center text-lg font-bold rounded-xl border border-white/80 bg-white/65 backdrop-blur-md text-indigo-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition shadow-sm hover:border-indigo-300"
                    />
                  ))}
                </div>
              </div>

              {/* BOTÓN VERIFICAR */}
              <button className="w-full bg-gradient-to-r from-indigo-800 to-indigo-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold">
                Verificar correo
              </button>

              {/* REENVIAR */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  ¿No recibiste el código?
                </p>

                <button className="text-indigo-700 text-sm font-semibold hover:text-indigo-900 hover:underline mt-1 transition">
                  Reenviar código
                </button>
              </div>

              {/* CAMBIAR CORREO */}
              <div className="mt-6 border-t border-white/70 pt-5 text-center">
                <button className="text-sm text-gray-500 hover:text-indigo-700 transition">
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