import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReclutadorChat } from "../../assets/Hook/Reclutador/useDomain";

// Sugerencias rapidas que se muestran solo al inicio de la conversacion.
const SUGERENCIAS = [
  "¿Cuáles son los mejores postulantes para mi vacante activa?",
  "¿Cómo filtro candidatos por habilidades o discapacidad?",
  "¿Cómo publico una nueva vacante?",
  "¿Cómo reviso los reportes de mis vacantes?",
];

const MENSAJE_BIENVENIDA = {
  tipo: "bot",
  texto:
    "👋 ¡Hola! Soy el asistente de Inclusive Job.\n\nPuedo ayudarte a:\n• Encontrar los mejores postulantes para tus vacantes\n• Resolver dudas sobre el uso del sistema\n• Orientarte en procesos de reclutamiento\n\n¿En qué te ayudo hoy?",
};

/*
|--------------------------------------------------------------------------
| Store del chat (fuera del componente)
|--------------------------------------------------------------------------
| ChatBot.jsx se importa y se monta en varias paginas (Dashboard,
| Vacantes, etc). Cada vez que navegas entre paginas, React desmonta
| el componente viejo y monta uno nuevo, asi que un useState normal
| perderia la conversacion.
|
| Guardando "open" y "mensajes" en estas variables de modulo (fuera del
| componente), el estado sobrevive a esos montajes/desmontajes mientras
| la pestaña del navegador siga abierta. Si el usuario recarga la
| pagina (F5) o cierra la pestaña, se reinicia (comportamiento normal
| de memoria en JS). Si mas adelante quieres que sobreviva tambien a
| un F5, se puede respaldar en sessionStorage.
*/
let chatStore = {
  open: false,
  mensajes: [MENSAJE_BIENVENIDA],
};
const listeners = new Set();

function setChatStore(updater) {
  chatStore = typeof updater === "function" ? updater(chatStore) : { ...chatStore, ...updater };
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return chatStore;
}

export default function ChatBot() {
  // Estado compartido entre paginas (persiste al navegar)
  const { open, mensajes } = useSyncExternalStore(subscribe, getSnapshot);

  // Estado local: solo el texto que se esta escribiendo en el input,
  // no necesita persistir entre paginas.
  const [mensaje, setMensaje] = useState("");

  const { enviarMensaje, loading } = useReclutadorChat();
  const scrollRef = useRef(null);

  const esInicioConversacion = mensajes.length === 1;

  const setOpen = (value) =>
    setChatStore((prev) => ({
      ...prev,
      open: typeof value === "function" ? value(prev.open) : value,
    }));

  const setMensajes = (value) =>
    setChatStore((prev) => ({
      ...prev,
      mensajes: typeof value === "function" ? value(prev.mensajes) : value,
    }));

  // Auto-scroll al ultimo mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes, loading, open]);

  const enviar = async (texto) => {
    const contenido = texto.trim();
    if (!contenido || loading) return;

    setMensajes((prev) => [...prev, { tipo: "usuario", texto: contenido }]);
    setMensaje("");

    try {
      const respuesta = await enviarMensaje(contenido);
      setMensajes((prev) => [
        ...prev,
        { tipo: "bot", texto: respuesta || "No obtuve respuesta, intenta de nuevo." },
      ]);
    } catch (err) {
      setMensajes((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto: err?.message || "Ocurrió un error al contactar al asistente.",
          error: true,
        },
      ]);
    }
  };

  const handleEnviar = () => enviar(mensaje);
  const handleSugerencia = (texto) => enviar(texto);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition z-50 flex items-center justify-center text-2xl"
      >
        {open ? "×" : "💬"}
      </button>

      {/* Ventana del chat */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold leading-tight">Chatbot InclusiveJob</h2>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    loading ? "bg-yellow-300" : "bg-green-300"
                  }`}
                />
                {loading ? "Escribiendo…" : "En línea"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xl hover:opacity-80 shrink-0"
            >
              ×
            </button>
          </div>

          {/* Mensajes */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3"
          >
            {mensajes.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.tipo === "usuario" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.tipo === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line leading-relaxed shadow-sm ${
                    msg.tipo === "usuario"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : msg.error
                      ? "bg-red-50 border border-red-200 text-red-600 rounded-bl-sm"
                      : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}

            {/* Sugerencias rapidas: solo aparecen al inicio de la conversacion */}
            {esInicioConversacion && !loading && (
              <div className="flex flex-col gap-2 pt-1 pl-8">
                {SUGERENCIAS.map((sugerencia) => (
                  <button
                    key={sugerencia}
                    onClick={() => handleSugerencia(sugerencia)}
                    className="text-left text-sm px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                  >
                    {sugerencia}
                  </button>
                ))}
              </div>
            )}

            {/* Indicador de "escribiendo" mientras espera respuesta */}
            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs shrink-0">
                  🤖
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-gray-200 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={mensaje}
              disabled={loading}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
              className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />

            <button
              onClick={handleEnviar}
              disabled={loading || !mensaje.trim()}
              className="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}