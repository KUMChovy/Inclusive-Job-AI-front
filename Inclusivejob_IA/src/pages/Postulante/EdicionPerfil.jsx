import { useState, useEffect, useRef } from "react";

const TABS = ["info", "skills", "edu", "accesibilidad"];
const TAB_LABELS = { info: "Yo", skills: "Skills", edu: "Estudios", accesibilidad: "Accesibilidad" };

const DISCAPACIDADES = ["Visual", "Auditiva", "Motriz", "Cognitiva", "Psicosocial", "Múltiple", "Prefiero no decirlo"];
const DISC_ICONS = { Visual: "👁", Auditiva: "👂", Motriz: "🦽", Cognitiva: "🧠", Psicosocial: "💙", Múltiple: "♿", "Prefiero no decirlo": "🔒" };
const APOYOS = ["Trabajo remoto", "Horario flexible", "Lector de pantalla", "Intérprete LSM", "Sin escaleras", "Lectura fácil", "Tiempo extra"];

function getInitials(name) {
  const parts = name.trim().split(" ");
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PerfilPostulante() {
  const [perfil, setPerfil] = useState({
    nombre: "Juan Carlos Martínez López",
    rol: "Desarrollador Web Frontend",
    email: "juan.martinez@email.com",
    tel: "+52 55 1234 5678",
    ciudad: "Ciudad de México",
    bio: "Me llamo Juan Carlos, soy dev frontend con experiencia en React y Firebase. Me gusta construir interfaces bonitas y funcionales, y aprendo rápido con nuevas tecnologías.",
    skills: ["React", "JavaScript", "HTML", "CSS", "Firebase", "MySQL", "Git", "GitHub"],
    carrera: "Ingeniería en Sistemas Computacionales",
    uni: "Universidad Tecnológica",
    periodo: "2021–2025",
    discapacidad: ["Visual"],
    porcentaje: "40%",
    certificado: true,
    apoyos: ["Trabajo remoto", "Lector de pantalla"],
    nota: "Uso NVDA como lector de pantalla y me manejo perfecto con teclado. Sin problema para trabajar remoto.",
  });

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("info");
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);

  const editRef = useRef(null);
  const headRef = useRef(null);
  const modalRef = useRef(null);

  // Focus trap + Escape
  useEffect(() => {
    if (!open) return;
    setTimeout(() => headRef.current?.focus(), 50);

    function handleKey(e) {
      if (e.key === "Escape") { cerrar(); return; }
      if (e.key !== "Tab") return;
      const els = modalRef.current?.querySelectorAll(
        'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!els?.length) return;
      if (e.shiftKey && document.activeElement === els[0]) {
        e.preventDefault(); els[els.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === els[els.length - 1]) {
        e.preventDefault(); els[0].focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function abrir() {
    setDraft({ ...perfil, skills: [...perfil.skills], discapacidad: [...perfil.discapacidad], apoyos: [...perfil.apoyos] });
    setTab("info");
    setOpen(true);
  }

  function cerrar() {
    setOpen(false);
    setTimeout(() => editRef.current?.focus(), 50);
  }

  function guardar() {
    setPerfil(draft);
    cerrar();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function addSkill() {
    const v = newSkill.trim();
    if (v && !draft.skills.includes(v)) setDraft((d) => ({ ...d, skills: [...d.skills, v] }));
    setNewSkill("");
  }

  function delSkill(i) {
    setDraft((d) => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }));
  }

  function togDisc(x) {
    setDraft((d) => ({
      ...d,
      discapacidad: d.discapacidad.includes(x)
        ? d.discapacidad.filter((v) => v !== x)
        : [...d.discapacidad, x],
    }));
  }

  function togApoyo(x) {
    setDraft((d) => ({
      ...d,
      apoyos: d.apoyos.includes(x)
        ? d.apoyos.filter((v) => v !== x)
        : [...d.apoyos, x],
    }));
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 font-sans">

      {/* Toast */}
      <div aria-live="polite" aria-atomic="true">
        {saved && (
          <div role="status" className="mb-3 bg-green-50 text-green-800 text-sm px-4 py-2 rounded-2xl flex items-center gap-2 border border-green-200">
            ✓ Perfil guardado
          </div>
        )}
      </div>

      {/* CARD PRINCIPAL */}
      <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white">

        {/* HEADER */}
        <div className="bg-indigo-600 px-6 pt-8 pb-6 relative">
          <button
            ref={editRef}
            onClick={abrir}
            aria-label={`Editar perfil de ${perfil.nombre}`}
            aria-haspopup="dialog"
            className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-white transition"
          >
            ✏️ Editar
          </button>

          <div className="flex items-end gap-4">
            <div
              aria-hidden="true"
              className="w-20 h-20 rounded-2xl bg-indigo-200 text-indigo-900 flex items-center justify-center text-2xl font-bold flex-shrink-0 border-2 border-indigo-100 select-none"
            >
              {getInitials(perfil.nombre)}
            </div>
            <div className="min-w-0 pb-1">
              <h1 className="text-white font-bold text-xl leading-tight">{perfil.nombre}</h1>
              <p className="text-indigo-200 text-sm mt-0.5">{perfil.rol}</p>
            </div>
          </div>

          {/* Badges discapacidad */}
          {perfil.discapacidad.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4" aria-label="Tipo de discapacidad">
              {perfil.discapacidad.map((d) => (
                <span
                  key={d}
                  className="text-xs bg-white/20 text-white border border-white/25 px-2.5 py-1 rounded-full flex items-center gap-1"
                >
                  <span aria-hidden="true">{DISC_ICONS[d]}</span> {d}
                </span>
              ))}
              {perfil.certificado && (
                <span className="text-xs bg-green-400/25 text-green-100 border border-green-300/30 px-2.5 py-1 rounded-full">
                  ✓ Cert. SEP
                </span>
              )}
            </div>
          )}
        </div>

        {/* CONTACTO — fila horizontal */}
        <div className="border-b border-gray-100 px-6 py-3 flex flex-wrap gap-x-5 gap-y-1">
          {[["📧", "Correo", perfil.email], ["📱", "Teléfono", perfil.tel], ["📍", "Ciudad", perfil.ciudad]].map(([ic, label, val]) => (
            <span key={label} className="text-xs text-gray-500 flex items-center gap-1.5">
              <span aria-hidden="true">{ic}</span>
              <span className="sr-only">{label}: </span>
              {val}
            </span>
          ))}
        </div>

        {/* CUERPO — grid 2 columnas */}
        <div className="p-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

          <section aria-labelledby="s-bio" className="sm:col-span-2">
            <h2 id="s-bio" className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Sobre mí</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{perfil.bio}</p>
          </section>

          <section aria-labelledby="s-skills">
            <h2 id="s-skills" className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Skills</h2>
            <ul className="flex flex-wrap gap-1.5 list-none p-0" aria-label="Habilidades técnicas">
              {perfil.skills.map((s) => (
                <li key={s} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100">{s}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="s-edu">
            <h2 id="s-edu" className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Formación</h2>
            <div className="border-l-[3px] border-indigo-500 pl-3" style={{ borderRadius: 0 }}>
              <p className="text-sm font-semibold text-gray-800">{perfil.carrera}</p>
              <p className="text-xs text-gray-500 mt-0.5">{perfil.uni} · {perfil.periodo}</p>
            </div>
          </section>

          {/* Tarjeta accesibilidad */}
          {(perfil.discapacidad.length > 0 || perfil.apoyos.length > 0 || perfil.nota) && (
            <section aria-labelledby="s-acc" className="sm:col-span-2 rounded-2xl p-4 border border-purple-200 bg-purple-50">
              <h2 id="s-acc" className="text-xs font-semibold text-purple-700 uppercase tracking-widest mb-3">Accesibilidad</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {perfil.discapacidad.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-purple-600 mb-1.5">Tipo de discapacidad</p>
                    <div className="flex flex-wrap gap-1.5">
                      {perfil.discapacidad.map((d) => (
                        <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-purple-200 text-purple-900 border border-purple-300 flex items-center gap-1">
                          <span aria-hidden="true">{DISC_ICONS[d]}</span> {d}
                        </span>
                      ))}
                      {perfil.porcentaje && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-200 text-purple-900 border border-purple-300">{perfil.porcentaje}</span>
                      )}
                    </div>
                  </div>
                )}
                {perfil.apoyos.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-purple-600 mb-1.5">Apoyos que necesito</p>
                    <div className="flex flex-wrap gap-1.5">
                      {perfil.apoyos.map((a) => (
                        <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {perfil.nota && (
                  <div className="sm:col-span-2 rounded-xl p-3 bg-white border border-purple-200">
                    <p className="text-xs font-medium text-purple-600 mb-1">Nota para el empleador</p>
                    <p className="text-xs text-purple-900 leading-relaxed italic">"{perfil.nota}"</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && cerrar()}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mtitle"
            className="bg-white rounded-3xl w-full max-w-md max-h-[88vh] overflow-hidden flex flex-col border border-gray-100"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 id="mtitle" ref={headRef} tabIndex={-1} className="font-bold text-gray-800 focus:outline-none">
                Editar perfil
              </h2>
              <button
                onClick={cerrar}
                aria-label="Cerrar modal"
                className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xl"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div role="tablist" aria-label="Secciones del perfil" className="flex px-5 border-b border-gray-100">
              {TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  aria-controls={`tp-${t}`}
                  id={`tb-${t}`}
                  onClick={() => setTab(t)}
                  onKeyDown={(e) => {
                    const i = TABS.indexOf(t);
                    if (e.key === "ArrowRight") setTab(TABS[(i + 1) % TABS.length]);
                    else if (e.key === "ArrowLeft") setTab(TABS[(i - 1 + TABS.length) % TABS.length]);
                  }}
                  className={`text-xs py-3 px-2.5 border-b-2 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400 rounded-t-md ${
                    tab === t
                      ? "border-indigo-500 text-indigo-700 font-semibold"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4">

              {/* Info personal */}
              <div role="tabpanel" id="tp-info" aria-labelledby="tb-info" hidden={tab !== "info"}>
                {tab === "info" && (
                  <div className="space-y-3">
                    {[
                      ["nombre", "Nombre completo", "text"],
                      ["rol", "¿A qué te dedicas?", "text"],
                      ["email", "Correo", "email"],
                      ["tel", "Teléfono", "tel"],
                      ["ciudad", "Ciudad", "text"],
                    ].map(([k, l, t]) => (
                      <div key={k}>
                        <label htmlFor={`f-${k}`} className="text-xs font-medium text-gray-600 mb-1 block">{l}</label>
                        <input
                          id={`f-${k}`}
                          type={t}
                          autoComplete={k === "email" ? "email" : k === "tel" ? "tel" : k === "nombre" ? "name" : "off"}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                          value={draft[k]}
                          onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                        />
                      </div>
                    ))}
                    <div>
                      <label htmlFor="f-bio" className="text-xs font-medium text-gray-600 mb-1 block">Sobre mí</label>
                      <textarea
                        id="f-bio"
                        rows={3}
                        aria-describedby="bio-h"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        value={draft.bio}
                        onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                      />
                      <p id="bio-h" className="text-xs text-gray-400 mt-1">Un párrafo corto está perfecto.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div role="tabpanel" id="tp-skills" aria-labelledby="tb-skills" hidden={tab !== "skills"}>
                {tab === "skills" && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Toca × para quitar una skill.</p>
                    <ul className="flex flex-wrap gap-1.5 min-h-[36px] list-none p-0">
                      {draft.skills.map((s, i) => (
                        <li key={s} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-1">
                          {s}
                          <button
                            onClick={() => delSkill(i)}
                            aria-label={`Quitar ${s}`}
                            className="text-blue-400 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400 rounded-full ml-0.5"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <label htmlFor="ns" className="sr-only">Nueva skill</label>
                      <input
                        id="ns"
                        type="text"
                        placeholder="Ej: TypeScript"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <button
                        onClick={addSkill}
                        aria-label="Agregar skill"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 whitespace-nowrap transition"
                      >
                        + Agregar
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">También puedes presionar Enter.</p>
                  </div>
                )}
              </div>

              {/* Estudios */}
              <div role="tabpanel" id="tp-edu" aria-labelledby="tb-edu" hidden={tab !== "edu"}>
                {tab === "edu" && (
                  <div className="space-y-3">
                    {[
                      ["carrera", "Carrera o grado"],
                      ["uni", "Institución"],
                      ["periodo", "Período (ej: 2021–2025)"],
                    ].map(([k, l]) => (
                      <div key={k}>
                        <label htmlFor={`f-${k}`} className="text-xs font-medium text-gray-600 mb-1 block">{l}</label>
                        <input
                          id={`f-${k}`}
                          type="text"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          value={draft[k]}
                          onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accesibilidad */}
              <div role="tabpanel" id="tp-accesibilidad" aria-labelledby="tb-accesibilidad" hidden={tab !== "accesibilidad"}>
                {tab === "accesibilidad" && (
                  <div className="space-y-5">
                    <fieldset>
                      <legend className="text-xs font-semibold text-gray-700 mb-2">
                        ¿Qué tipo de discapacidad tienes?{" "}
                        <span className="font-normal text-gray-400">(puedes elegir varias)</span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {DISCAPACIDADES.map((op) => {
                          const sel = draft.discapacidad.includes(op);
                          return (
                            <button
                              key={op}
                              type="button"
                              role="checkbox"
                              aria-checked={sel}
                              onClick={() => togDisc(op)}
                              className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                sel
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                              }`}
                            >
                              <span aria-hidden="true">{DISC_ICONS[op]}</span> {op}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor="f-pct" className="text-xs font-semibold text-gray-700 mb-1 block">
                        Porcentaje de discapacidad{" "}
                        <span className="font-normal text-gray-400">(opcional)</span>
                      </label>
                      <input
                        id="f-pct"
                        type="text"
                        placeholder="Ej: 40%"
                        aria-describedby="pct-h"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={draft.porcentaje}
                        onChange={(e) => setDraft((d) => ({ ...d, porcentaje: e.target.value }))}
                      />
                      <p id="pct-h" className="text-xs text-gray-400 mt-1">Lo indica tu certificado del IMSS o SEP.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={draft.certificado}
                        aria-label="Tengo certificado de discapacidad"
                        onClick={() => setDraft((d) => ({ ...d, certificado: !d.certificado }))}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          draft.certificado ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"
                        }`}
                      >
                        {draft.certificado && (
                          <span aria-hidden="true" className="text-white text-xs font-bold leading-none">✓</span>
                        )}
                      </button>
                      <label
                        onClick={() => setDraft((d) => ({ ...d, certificado: !d.certificado }))}
                        className="text-sm text-gray-700 cursor-pointer select-none"
                      >
                        Tengo certificado de discapacidad (SEP / IMSS)
                      </label>
                    </div>

                    <fieldset>
                      <legend className="text-xs font-semibold text-gray-700 mb-2">
                        ¿Qué apoyos necesitas?{" "}
                        <span className="font-normal text-gray-400">(opcional)</span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {APOYOS.map((op) => {
                          const sel = draft.apoyos.includes(op);
                          return (
                            <button
                              key={op}
                              type="button"
                              role="checkbox"
                              aria-checked={sel}
                              onClick={() => togApoyo(op)}
                              className={`text-xs px-3 py-1.5 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                                sel
                                  ? "bg-teal-700 text-white border-teal-700"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                              }`}
                            >
                              {op}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor="f-nota" className="text-xs font-semibold text-gray-700 mb-1 block">
                        Nota para el empleador{" "}
                        <span className="font-normal text-gray-400">(opcional)</span>
                      </label>
                      <textarea
                        id="f-nota"
                        rows={3}
                        placeholder="Ej: Uso lector de pantalla, me manejo bien con teclado..."
                        aria-describedby="nota-h"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        value={draft.nota}
                        onChange={(e) => setDraft((d) => ({ ...d, nota: e.target.value }))}
                      />
                      <p id="nota-h" className="text-xs text-gray-400 mt-1">
                        Con tus propias palabras, lo que necesites explicar.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
              <button
                onClick={cerrar}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
