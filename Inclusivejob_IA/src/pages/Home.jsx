import React from "react";
import fondo from "../assets/img/Designer (21).png";
import icono from "../assets/img/perfil.png";
import img1 from "../assets/img/Designer (17).png";
import img2 from "../assets/img/Designer1.png";
import fondo2 from "../assets/img/Designer20.png";
import fondo3 from "../assets/img/203361.png";
import fondo4 from "../assets/img/fondoQ.png";
import fondo5 from "../assets/img/fondoQ1.png";



function Reveal({ children, delay = 0, className = "" }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(45px)",
        transition: `opacity 700ms ease, transform 700ms ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}


export default function Home() {
  const [active, setActive] = React.useState(null);
  const data = [
    {
      icon: "🤖",
      title: "IA Inteligente",
      desc: "Relaciona habilidades con vacantes ideales automáticamente."
    },
    {
      icon: "🏢",
      title: "Empresas y Servicios",
      desc: "Accede a empresas verificadas y oportunidades confiables."
    },
    {
      icon: "💬",
      title: "Chat integrado",
      desc: "Comunicación directa entre reclutadores y postulantes."
    },
    {
      icon: "📄",
      title: "Perfil profesional",
      desc: "Muestra tu experiencia, CV y certificaciones."
    }
  ];


  return (
    <div className="w-screen min-h-screen bg-gray-100 overflow-x-hidden relative left-1/2 -ml-[50vw]">

      {/* NAVBAR */}
      <header className="w-full bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4">

          <div className="flex items-center gap-3">
            <img
              src="/logo.webp"
              alt="Logo InclusiveJobIA"
              className="w-10 h-10 object-contain bg-white rounded p-1"
            />

            <h1 className="text-xl font-semibold">InclusiveJobIA</h1>
          </div>

          <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
            <span className="hover:opacity-70 cursor-pointer">Inicio</span>
            <span className="hover:opacity-70 cursor-pointer">Evaluaciones</span>
            <span className="hover:opacity-70 cursor-pointer">Puestos</span>
            <a href="#quienes" className="hover:opacity-70 cursor-pointer">Quienes somos</a>
          </nav>

          <span className="italic text-sm opacity-80 hidden md:block">
            “Demostrando que nada realmente te detiene.”
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">






        {/* HERO */}
        <section className="relative w-screen left-1/2 -ml-[50vw] min-h-[620px] flex items-center overflow-hidden">

          {/* IMAGEN DE FONDO */}
          <div className="absolute inset-0">
            <img
              src={fondo4}
              alt="Fondo de inclusión laboral"
              className="w-full h-full object-cover object-center"
            />

            {/* OVERLAY OSCURO */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* DEGRADADO EXTRA PARA MEJOR LEGIBILIDAD */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </div>

          {/* CONTENIDO */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <Reveal className="max-w-xl text-white">

              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 text-sm font-medium mb-6">
                Plataforma inclusiva con IA
              </span>

              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Encuentra empleo{" "}
                <span className="text-indigo-300">
                  sin barreras
                </span>
              </h2>

              <p className="text-white/85 mb-8 text-lg leading-relaxed">
                Plataforma inclusiva que conecta personas con discapacidad y adultos mayores
                con oportunidades laborales reales utilizando inteligencia artificial.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-indigo-700 hover:bg-indigo-600 transition text-white px-7 py-3 rounded-xl shadow-lg font-medium">
                  Iniciar sesión
                </button>

                <button className="bg-white/10 border border-white/30 backdrop-blur hover:bg-white/20 transition text-white px-7 py-3 rounded-xl font-medium">
                  Crear cuenta
                </button>
              </div>

            </Reveal>
          </div>

        </section>





        {/* QUIENES SOMOS */}
        <section
          id="quienes"
          className="relative py-24 w-screen left-1/2 -ml-[50vw] bg-slate-950 overflow-hidden"
        >
          {/* DECORACIÓN DE FONDO */}
          <div className="absolute -top-32 -right-24 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-120px] -left-24 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>

          {/* LÍNEA DECORATIVA SUPERIOR */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"></div>

          {/* CONTENIDO */}
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

              {/* TEXTO IZQUIERDO */}
              <Reveal>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/15 text-indigo-200 text-sm font-medium mb-5">
                  Sobre nosotros
                </span>

                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  ¿Quiénes somos?
                </h3>

                <p className="text-gray-300 text-lg leading-relaxed">
                  InclusiveJobIA nace para eliminar las barreras en la búsqueda de empleo,
                  ofreciendo una plataforma accesible, segura y adaptada a las necesidades
                  de cada usuario.
                </p>
              </Reveal>

              {/* CARD DERECHA */}
              <Reveal delay={180} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-200 flex items-center justify-center text-2xl mb-5">
                  🤝
                </div>

                <h4 className="text-xl font-semibold text-white mb-4">
                  Conectamos talento con empresas inclusivas
                </h4>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Nuestra plataforma utiliza tecnología e inteligencia artificial para
                  acercar oportunidades laborales reales a personas que buscan un empleo
                  digno, accesible y compatible con sus habilidades.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-2xl font-bold text-white">IA</p>
                    <p className="text-xs text-gray-300 mt-1">Compatibilidad</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-2xl font-bold text-white">+Acceso</p>
                    <p className="text-xs text-gray-300 mt-1">Inclusión</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-2xl font-bold text-white">Seguro</p>
                    <p className="text-xs text-gray-300 mt-1">Confianza</p>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>


        {/* VALOR / PROPÓSITO */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 py-14 max-w-6xl mx-auto px-4">

          {/* TEXTO */}
          <Reveal className="max-w-md text-center md:text-left">
            <h3 className="text-3xl font-bold text-indigo-800 mb-4">
              Inclusión real en el mercado laboral
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed">
              Utilizamos tecnología e inteligencia artificial para mejorar la
              compatibilidad entre postulantes y empresas, reduciendo la desigualdad
              de oportunidades y promoviendo un entorno laboral más justo.
            </p>
          </Reveal>

          {/* IMAGEN */}
          <Reveal delay={180} className="flex justify-center">

            <div className="w-64 h-64 rounded-full border border-indigo-200 bg-white flex items-center justify-center">

              <img
                src={img2}
                alt="valor"
                className="w-44 h-44 object-contain"
              />

            </div>

          </Reveal>

        </section>



        {/* CTA + FUNCIONALIDADES */}
        <section
          className="relative py-24 w-screen left-1/2 -ml-[50vw] bg-slate-950 overflow-hidden"
        >
          {/* DECORACIÓN DE FONDO */}
          <div className="absolute -top-32 -left-24 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-120px] -right-24 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

          {/* LÍNEA DECORATIVA SUPERIOR */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"></div>

          {/* LÍNEA DECORATIVA INFERIOR */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>

          {/* CONTENIDO */}
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

              {/* IZQUIERDA */}
              <Reveal>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/15 text-indigo-200 text-sm font-medium mb-5">
                  Comienza ahora
                </span>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Empieza tu camino laboral hoy mismo
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  Descubre oportunidades inclusivas y conecta con empresas que valoran
                  tu talento, tus habilidades y tu experiencia.
                </p>


              </Reveal>

              {/* DERECHA */}
              <Reveal delay={180} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-200 flex items-center justify-center text-2xl">
                    🚀
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Funcionalidades principales
                    </h3>
                    <p className="text-sm text-gray-400">
                      Herramientas pensadas para facilitar tu búsqueda.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {data.map((item, i) => {
                    const isOpen = active === i;

                    return (
                      <div
                        key={i}
                        onClick={() => setActive(isOpen ? null : i)}
                        className={`group border rounded-2xl p-4 cursor-pointer transition-all duration-300 ${isOpen
                          ? "bg-white/15 border-indigo-300/40 shadow-xl"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-4">

                          <div className="flex items-center gap-4">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition ${isOpen
                                ? "bg-indigo-500/25 text-indigo-100"
                                : "bg-white/10 text-indigo-200"
                                }`}
                            >
                              {item.icon}
                            </div>

                            <span className="text-white font-medium">
                              {item.title}
                            </span>
                          </div>

                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                              ? "rotate-90 bg-indigo-500/20 text-indigo-200"
                              : "bg-white/10 text-gray-400 group-hover:text-white"
                              }`}
                          >
                            →
                          </span>

                        </div>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                          <p className="text-sm text-gray-300 leading-relaxed pl-[60px]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

            </div>
          </div>
        </section>



        {/* COMO FUNCIONA */}
        <section className="py-20 text-center">

          <div className="max-w-7xl mx-auto px-6">

            {/* TITULO */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800">
                ¿Cómo funciona InclusiveJobIA?
              </h2>
              <p className="text-gray-600 mt-3">
                Descubre cómo nuestra plataforma conecta talento con oportunidades.
              </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  step: "01",
                  icon: "👤",
                  title: "Crea tu perfil",
                  items: [
                    "Agrega tus habilidades",
                    "Sube tu experiencia",
                    "Completa tu CV",
                    "Personaliza tu perfil"
                  ]
                },
                {
                  step: "02",
                  icon: "🤖",
                  title: "IA analiza tu perfil",
                  items: [
                    "Analiza tus habilidades",
                    "Relaciona vacantes",
                    "Detecta oportunidades",
                    "Optimiza tu búsqueda"
                  ]
                },
                {
                  step: "03",
                  icon: "📩",
                  title: "Postúlate fácilmente",
                  items: [
                    "Envía solicitudes",
                    "Contacta empresas",
                    "Recibe respuestas",
                    "Da seguimiento"
                  ]
                }
              ].map((item, i) => (


                <Reveal
                  key={i}
                  delay={i * 140}
                  className="bg-white p-7 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition text-left"
                >


                  {/* ENCABEZADO */}
                  <div className="flex items-center justify-between mb-4">

                    {/* ICONO */}
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xl">
                      {item.icon}
                    </div>

                    {/* PASO */}
                    <span className="text-sm font-semibold text-indigo-500">
                      {item.step}
                    </span>

                  </div>

                  {/* TITULO */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {item.title}
                  </h3>

                  {/* LISTA */}
                  <ul className="space-y-2 text-sm text-gray-600">

                    {item.items.map((list, index) => (
                      <li key={index} className="flex items-center gap-2">

                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        {list}

                      </li>
                    ))}

                  </ul>

                </Reveal>

              ))}

            </div>

          </div>

        </section>



        <section className="relative py-10 w-screen left-1/2 -ml-[50vw]">

          {/* FONDO */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={fondo}
              alt="fondo"
              className="w-full h-full object-cover object-center rounded-xl"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* ESTILOS LOCALES */}
          <style>
            {`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}
          </style>

          {/* CONTENIDO */}
          <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

            {/* IZQUIERDA - COMENTARIOS */}
            <Reveal className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg h-[420px] overflow-y-auto no-scrollbar relative">

              <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
                Lo que dicen nuestros usuarios
              </h2>

              <div className="flex flex-col gap-10 px-2">

                {[
                  {
                    img: icono,
                    text: "Esta plataforma me ayudó a encontrar un empleo adaptado a mis necesidades.",
                    user: "Usuario"
                  },
                  {
                    img: icono,
                    text: "La experiencia fue muy inclusiva y fácil de usar.",
                    user: "Postulante"
                  },
                  {
                    img: icono,
                    text: "Excelente sistema de IA para encontrar candidatos ideales.",
                    user: "Reclutador"
                  }
                ].map((item, i) => (
                  <div key={i} className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">

                    <div className="absolute -top-8 left-6">
                      <div className="w-14 h-14 rounded-full overflow-hidden shadow border-2 border-white">
                        <img src={item.img} className="w-full  p-3 rounded-xl h-full object-cover" />
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-6 leading-relaxed">
                      “{item.text}”
                    </p>

                    <p className="text-sm font-semibold text-gray-800 mt-4 text-right">
                      - {item.user}
                    </p>

                  </div>
                ))}

              </div>

              {/* FADE */}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl"></div>

            </Reveal>

            {/* DERECHA - FORMULARIO */}
            <Reveal delay={180} className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg h-[420px] flex flex-col justify-between">

              <div>
                <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
                  Comparte tu experiencia
                </h2>

                <form className="flex flex-col gap-5">

                  {/* INPUT */}
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="p-3 rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />

                  {/* TEXTAREA */}
                  <textarea
                    placeholder="Escribe tu comentario..."
                    rows="5"
                    className="p-3 rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                  ></textarea>

                </form>
              </div>

              {/* BOTÓN */}
              <button className="mt-4 bg-indigo-800 text-white py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all">
                Enviar comentario
              </button>

            </Reveal>

          </div>

        </section>





      </main>

      {/* FOOTER */}
      <footer className="bg-indigo-900 text-indigo-100">

        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* COLUMNA 1 - INFO */}
          <div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded"></div>

              <h1 className="text-lg font-bold text-white">
                InclusiveJobIA
              </h1>
            </div>

            <p className="text-sm text-indigo-200">
              Plataforma enfocada en la inclusión laboral, conectando talento
              con oportunidades mediante inteligencia artificial.
            </p>

            {/* REDES */}
            <div className="flex gap-4 mt-5">

              <div className="bg-white/20 p-2 rounded-full cursor-pointer hover:bg-white/30 transition">
                👍
              </div>

              <div className="bg-white/20 p-2 rounded-full cursor-pointer hover:bg-white/30 transition">
                💼
              </div>

            </div>

          </div>

          {/* COLUMNA 2 - CONTACTO */}
          <div>

            <h3 className="text-white font-semibold mb-4">Contáctanos</h3>

            <ul className="space-y-3 text-sm text-indigo-200">

              <li className="flex items-center gap-2">
                📧 <span>contacto@inclusivejobia.com</span>
              </li>

              <li className="flex items-center gap-2">
                📱 <span>+52 55 0000 0000</span>
              </li>

              <li className="flex items-center gap-2">
                📍 <span>Ciudad de México, México</span>
              </li>

            </ul>

          </div>

          {/* COLUMNA 3 - FORMULARIO */}
          <div>

            <h3 className="text-white font-semibold mb-4">Mantente informado</h3>

            <p className="text-sm text-indigo-200 mb-4">
              Recibe noticias y actualizaciones de nuestra plataforma.
            </p>

            <form className="flex flex-col gap-3">

              <input
                type="email"
                placeholder="Ingresa tu correo"
                className="rounded-full px-5 py-3 bg-indigo-800 border border-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:border-white"
              />

              <button className="rounded-full bg-white text-indigo-900 px-6 py-3 font-medium hover:bg-indigo-100 transition">
                Enviar
              </button>

            </form>

          </div>

        </div>

        {/* PARTE INFERIOR */}
        <div className="border-t border-indigo-800 py-6 px-6">

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-sm text-indigo-300 gap-4">

            <p>© 2026 InclusiveJobIA. Todos los derechos reservados.</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <span className="hover:text-white cursor-pointer transition">Términos</span>
              <span className="hover:text-white cursor-pointer transition">Privacidad</span>
              <span className="hover:text-white cursor-pointer transition">Blog</span>
            </div>

          </div>

        </div>

      </footer>


    </div>
  );
}
