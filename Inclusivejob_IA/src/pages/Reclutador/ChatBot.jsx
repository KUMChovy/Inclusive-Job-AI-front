import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([
    {
      tipo: "bot",
      texto: "👋 Hola, ¿cómo puedo ayudarte?",
    },
  ]);

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;

    setMensajes((prev) => [
      ...prev,
      { tipo: "usuario", texto: mensaje },
      {
        tipo: "bot",
        texto: "Gracias por tu mensaje. Te responderé pronto.",
      },
    ]);

    setMensaje("");
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition z-50"
      >
        💬
      </button>

      {/* Ventana del chat */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">

          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
            <div>
              <h2 className="font-semibold">Asistente Virtual</h2>
              <p className="text-xs text-blue-100">En línea</p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-xl hover:opacity-80"
            >
              ×
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {mensajes.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.tipo === "usuario"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.tipo === "usuario"
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-700"
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && enviarMensaje()
              }
              className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={enviarMensaje}
              className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}