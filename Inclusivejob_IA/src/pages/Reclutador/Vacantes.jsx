import { useEffect, useMemo, useState } from 'react';
import { Accessibility, ArrowRight, Edit, FileText, Loader2, MapPin, Plus, RefreshCw, Search, Sparkles, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react';
import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
import { confirmDelete, errorAlert, successAlert } from '../../assets/Componentes/Admin/alerts';
import { useDiscapacidadesReclutador, useGuardarVacanteReclutador, useMejorarRedaccionReclutador, useVacantesReclutador } from '../../assets/Hook/Reclutador/useDomain';
import BubleChat from "../Reclutador/ChatBot.jsx";

const INITIAL_FORM = {
  titulo_puesto: '',
  descripcion_puesto: '',
  requisitos: '',
  modalidad: 'Presencial',
  salario_min: '',
  salario_max: '',
  estado: 'activa',
  discapacidades: [],
};

export default function VacantesReclutador() {
  const { data, loading, error, refetch } = useVacantesReclutador();
  const { data: discapacidadesData, loading: loadingDiscapacidades, error: errorDiscapacidades } = useDiscapacidadesReclutador();
  const { guardarVacante, editarVacante, actualizarEstadoVacante, eliminarVacante, loading: saving } = useGuardarVacanteReclutador();
  const { mejorarTexto } = useMejorarRedaccionReclutador();

  const [vacantes, setVacantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [filtroModalidad, setFiltroModalidad] = useState('Todas las modalidades');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacante, setEditingVacante] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Estado de IA: independiente por campo (titulo_puesto / descripcion_puesto / requisitos)
  const [iaLoading, setIaLoading] = useState({});
  const [iaSugerencias, setIaSugerencias] = useState({});

  useEffect(() => {
    if (data?.data) setVacantes(data.data);
  }, [data]);

  const catalogoDiscapacidades = useMemo(() => {
    const payload = discapacidadesData?.data;
    if (Array.isArray(payload)) return payload;
    return payload?.discapacidades ?? [];
  }, [discapacidadesData]);

  const handleOpenModal = (vacante = null) => {
    setEditingVacante(vacante);
    setFormData(vacante ? {
      titulo_puesto: vacante.titulo_puesto || '',
      descripcion_puesto: vacante.descripcion_puesto || '',
      requisitos: vacante.requisitos || '',
      modalidad: vacante.modalidad || 'Presencial',
      salario_min: vacante.salario_min || '',
      salario_max: vacante.salario_max || '',
      estado: vacante.estado || 'activa',
      discapacidades: getVacanteDiscapacidadIds(vacante),
    } : INITIAL_FORM);
    setIaSugerencias({});
    setIsModalOpen(true);
  };

  const handleGuardarVacante = async (e) => {
    e.preventDefault();
    const payload = editingVacante
      ? { ...formData, id_vacante: editingVacante.id_vacante }
      : formData;

    try {
      const result = editingVacante ? await editarVacante(payload) : await guardarVacante(payload);
      if (!result?.success) throw new Error(result?.message || 'No se pudo guardar la vacante.');
      setIsModalOpen(false);
      setEditingVacante(null);
      setFormData(INITIAL_FORM);
      setIaSugerencias({});
      await refetch();
      await successAlert(
        editingVacante ? 'Vacante actualizada' : 'Vacante publicada',
        editingVacante ? 'Los cambios se guardaron correctamente.' : 'La vacante se guardo correctamente.',
        t
      );
    } catch (err) {
      await errorAlert('Error al guardar', err.message || 'No se pudo conectar con el servidor.', t);
    }
  };

  const toggleEstado = async (id_vacante, estadoActual) => {
    const nuevoEstado = estadoActual === 'activa' ? 'pausada' : 'activa';
    setVacantes((prev) => prev.map((v) => v.id_vacante === id_vacante ? { ...v, estado: nuevoEstado } : v));

    try {
      await actualizarEstadoVacante({ id_vacante, estado: nuevoEstado });
      await successAlert('Estado actualizado', `La vacante ahora esta ${nuevoEstado}.`, t);
    } catch (err) {
      setVacantes((prev) => prev.map((v) => v.id_vacante === id_vacante ? { ...v, estado: estadoActual } : v));
      await errorAlert('Error al actualizar', err.message || 'No se pudo actualizar el estado.', t);
    }
  };

  const handleEliminar = async (id_vacante) => {
    const vacante = vacantes.find((v) => v.id_vacante === id_vacante);
    const ok = await confirmDelete(vacante?.titulo_puesto ? `la vacante "${vacante.titulo_puesto}"` : 'esta vacante', t);
    if (!ok) return;

    try {
      await eliminarVacante(id_vacante);
      setVacantes((prev) => prev.filter((v) => v.id_vacante !== id_vacante));
      await successAlert('Vacante eliminada', 'La vacante fue eliminada correctamente.', t);
    } catch (err) {
      await errorAlert('Error al eliminar', err.message || 'No se pudo eliminar la vacante.', t);
    }
  };

  // ── IA: mejorar redacción de un campo ──────────────────────
  const handleMejorarIA = async (campo) => {
    setIaLoading((prev) => ({ ...prev, [campo]: true }));
    setIaSugerencias((prev) => ({ ...prev, [campo]: null }));

    try {
      const data = await mejorarTexto({
        campo,
        texto: formData[campo] || '',
        contexto: {
          titulo_puesto: formData.titulo_puesto,
          descripcion_puesto: formData.descripcion_puesto,
          requisitos: formData.requisitos,
          modalidad: formData.modalidad,
        },
      });
      setIaSugerencias((prev) => ({ ...prev, [campo]: data }));
    } catch (err) {
      await errorAlert('No se pudo mejorar el texto', err.message || 'Intenta de nuevo en unos segundos.', t);
    } finally {
      setIaLoading((prev) => ({ ...prev, [campo]: false }));
    }
  };

  const handleAplicarIA = (campo, texto) => {
    setFormData((prev) => ({ ...prev, [campo]: texto }));
    setIaSugerencias((prev) => ({ ...prev, [campo]: null }));
  };

  const vacantesFiltradas = useMemo(() => {
    return vacantes.filter((vacante) => {
      const titulo = String(vacante.titulo_puesto || '').toLowerCase();
      const cumpleBusqueda = titulo.includes(busqueda.toLowerCase());
      const cumpleEstado = filtroEstado === 'Todas'
        || (filtroEstado === 'Activas' && vacante.estado === 'activa')
        || (filtroEstado === 'Pausadas' && vacante.estado === 'pausada');
      const cumpleModalidad = filtroModalidad === 'Todas las modalidades' || vacante.modalidad === filtroModalidad;
      return cumpleBusqueda && cumpleEstado && cumpleModalidad;
    });
  }, [busqueda, filtroEstado, filtroModalidad, vacantes]);

  if (loading && vacantes.length === 0) {
    return (
      <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Vacantes">
        <div className="min-h-[320px] flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
          <p className="text-slate-400 mt-4">Sincronizando vacantes...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme={t} navItems={reclutadorNav} pageTitle="Vacantes">
      {/* Animaciones para el asistente de IA */}
      <style>{`
        @keyframes iaFadeSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ia-suggestion-panel { animation: iaFadeSlide 0.22s ease-out; }

        @keyframes iaShimmer {
          from { transform: translateX(-120%); }
          to { transform: translateX(220%); }
        }
        .ia-btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: translateX(-120%);
        }
        .ia-btn:hover .ia-btn-shimmer::after {
          animation: iaShimmer 0.9s ease;
        }
      `}</style>

      <div className="p-1 font-sans text-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestion de Vacantes</h1>
            <p className="text-slate-400 text-sm mt-0.5">Visualiza y administra tus vacantes publicadas</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition">
              <Plus className="h-4 w-4" /> Publicar vacante
            </button>
            <button onClick={refetch} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition">
              <RefreshCw className="h-4 w-4" /> Actualizar
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        {errorDiscapacidades && <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">No se pudo cargar el catalogo de discapacidades: {errorDiscapacidades}</div>}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por titulo..." className="w-full bg-[#131926] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
            </div>
            <select value={filtroModalidad} onChange={(e) => setFiltroModalidad(e.target.value)} className="bg-[#131926] border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500">
              <option>Todas las modalidades</option>
              <option>Presencial</option>
              <option>Remoto</option>
              <option>Hibrido</option>
            </select>
          </div>
          <div className="bg-[#131926] p-1 rounded-lg border border-slate-800/60 flex items-center">
            {['Todas', 'Activas', 'Pausadas'].map((tab) => (
              <button key={tab} onClick={() => setFiltroEstado(tab)} className={`px-4 py-1.5 rounded-md text-xs font-medium transition ${filtroEstado === tab ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#131926] rounded-xl shadow-xl border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#182032] border-b border-slate-800 text-slate-400 font-bold text-xs uppercase">
                  {['Titulo', 'Modalidad', 'Discapacidad', 'Salario', 'Estado', 'Publicacion', 'Acciones'].map((h) => <th key={h} className="px-6 py-4">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {vacantesFiltradas.map((vacante) => (
                  <tr key={vacante.id_vacante} className="hover:bg-[#172033]/40 transition">
                    <td className="px-6 py-4 font-semibold text-white">{vacante.titulo_puesto}</td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-blue-950/60 text-blue-400"><MapPin className="h-3.5 w-3.5" />{vacante.modalidad}</span></td>
                    <td className="px-6 py-4"><DiscapacidadBadges discapacidades={vacante.discapacidades} /></td>
                    <td className="px-6 py-4 text-slate-300">{formatPrecio(vacante.salario_min)} - {formatPrecio(vacante.salario_max)}</td>
                    <td className="px-6 py-4"><Estado estado={vacante.estado} /></td>
                    <td className="px-6 py-4 text-slate-400">{safeDate(vacante.fecha_publicacion)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleEstado(vacante.id_vacante, vacante.estado)} className="text-slate-500 hover:text-purple-400 p-1.5">
                          {vacante.estado === 'activa' ? <ToggleRight className="h-6 w-6 text-purple-500" /> : <ToggleLeft className="h-6 w-6" />}
                        </button>
                        <button onClick={() => handleOpenModal(vacante)} className="text-slate-500 hover:text-amber-400 p-1.5" title="Editar"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleEliminar(vacante.id_vacante)} className="text-slate-500 hover:text-red-400 p-1.5" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {vacantesFiltradas.length === 0 && <div className="text-center py-12 text-slate-500 font-medium">No se encontraron registros.</div>}
        </div>

        {isModalOpen && (
          <VacanteModal
            editingVacante={editingVacante}
            formData={formData}
            setFormData={setFormData}
            discapacidades={catalogoDiscapacidades}
            loadingDiscapacidades={loadingDiscapacidades}
            saving={saving}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleGuardarVacante}
            iaLoading={iaLoading}
            iaSugerencias={iaSugerencias}
            onMejorarIA={handleMejorarIA}
            onAplicarIA={handleAplicarIA}
          />
        )}
      </div>
      <BubleChat/>
    </PortalLayout>
  );
}

function VacanteModal({ editingVacante, formData, setFormData, discapacidades, loadingDiscapacidades, saving, onClose, onSubmit, iaLoading, iaSugerencias, onMejorarIA, onAplicarIA }) {
  const toggleDiscapacidad = (id) => {
    const current = formData.discapacidades ?? [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    setFormData({ ...formData, discapacidades: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#131926] border border-slate-800 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#182032]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><FileText className="h-5 w-5 text-purple-500" />{editingVacante ? 'Editar Vacante' : 'Publicar Nueva Vacante'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          <CampoConIA
            campo="titulo_puesto"
            label="Titulo del puesto *"
            tipo="input"
            value={formData.titulo_puesto}
            onChange={(value) => setFormData({ ...formData, titulo_puesto: value })}
            required
            loading={iaLoading?.titulo_puesto}
            sugerencia={iaSugerencias?.titulo_puesto}
            onMejorar={() => onMejorarIA('titulo_puesto')}
            onAplicar={(texto) => onAplicarIA('titulo_puesto', texto)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Modalidad" value={formData.modalidad} onChange={(value) => setFormData({ ...formData, modalidad: value })} options={['Presencial', 'Remoto', 'Hibrido']} />
            <Select label="Estado" value={formData.estado} onChange={(value) => setFormData({ ...formData, estado: value })} options={['activa', 'pausada']} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Salario minimo" type="number" value={formData.salario_min} onChange={(value) => setFormData({ ...formData, salario_min: value })} />
            <Input label="Salario maximo" type="number" value={formData.salario_max} onChange={(value) => setFormData({ ...formData, salario_max: value })} />
          </div>
          <DiscapacidadSelector
            discapacidades={discapacidades}
            selected={formData.discapacidades ?? []}
            loading={loadingDiscapacidades}
            onToggle={toggleDiscapacidad}
          />

          <CampoConIA
            campo="descripcion_puesto"
            label="Descripcion"
            tipo="textarea"
            value={formData.descripcion_puesto}
            onChange={(value) => setFormData({ ...formData, descripcion_puesto: value })}
            loading={iaLoading?.descripcion_puesto}
            sugerencia={iaSugerencias?.descripcion_puesto}
            onMejorar={() => onMejorarIA('descripcion_puesto')}
            onAplicar={(texto) => onAplicarIA('descripcion_puesto', texto)}
          />

          <CampoConIA
            campo="requisitos"
            label="Requisitos"
            tipo="textarea"
            rows={2}
            value={formData.requisitos}
            onChange={(value) => setFormData({ ...formData, requisitos: value })}
            loading={iaLoading?.requisitos}
            sugerencia={iaSugerencias?.requisitos}
            onMejorar={() => onMejorarIA('requisitos')}
            onAplicar={(texto) => onAplicarIA('requisitos', texto)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-400 hover:text-white">Cancelar</button>
            <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-medium px-6 py-2 rounded-lg">
              {saving ? 'Guardando...' : editingVacante ? 'Guardar Cambios' : 'Publicar Ahora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Campo de texto con asistente de IA integrado ──────────────
function CampoConIA({ campo, label, tipo, value, onChange, required = false, rows = 3, loading, sugerencia, onMejorar, onAplicar }) {
  const Campo = tipo === 'textarea' ? Textarea : Input;

  return (
    <div>
      <div className="flex items-center justify-end mb-1.5">
        <button
          type="button"
          onClick={onMejorar}
          disabled={loading}
          className="ia-btn group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-600/15 via-fuchsia-600/10 to-purple-600/15 px-3 py-1.5 text-xs font-semibold text-purple-300 transition-all duration-300 hover:border-purple-400/60 hover:text-purple-100 hover:shadow-[0_0_18px_-3px_rgba(192,132,252,0.55)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          <span className="ia-btn-shimmer pointer-events-none absolute inset-0 overflow-hidden" />
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="relative">Pensando…</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="relative">Mejorar con IA</span>
            </>
          )}
        </button>
      </div>

      <Campo label={label} value={value} onChange={onChange} required={required} rows={rows} />

      {sugerencia && (
        <div className="ia-suggestion-panel relative mt-2.5 rounded-xl border border-purple-800/40 bg-gradient-to-b from-purple-950/25 via-[#0f1320] to-[#0b0f19] p-3.5 space-y-2.5 shadow-[0_4px_24px_-8px_rgba(147,51,234,0.35)]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-400">
            <Sparkles className="h-3 w-3" />
            Sugerencias de la IA
          </div>

          {sugerencia.nota && (
            <p className="text-xs text-purple-300/80 italic leading-relaxed">{sugerencia.nota}</p>
          )}

          {/* Sugerencia principal, destacada */}
          <div className="relative rounded-lg border border-purple-500/50 bg-[#0b0f19] p-3 pt-4">
            <span className="absolute -top-2.5 left-3 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Recomendado
            </span>
            <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">{sugerencia.texto_mejorado}</p>
            <button
              type="button"
              onClick={() => onAplicar(sugerencia.texto_mejorado)}
              className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-purple-500 hover:shadow-[0_0_12px_-2px_rgba(168,85,247,0.6)]"
            >
              Usar esta versión <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Alternativas, más discretas */}
          {sugerencia.sugerencias?.map((alt, i) => (
            <div key={i} className="rounded-lg border border-slate-800 bg-[#0b0f19]/60 p-3 transition hover:border-slate-700">
              <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">{alt}</p>
              <button
                type="button"
                onClick={() => onAplicar(alt)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-slate-200"
              >
                Usar esta versión <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DiscapacidadSelector({ discapacidades, selected, loading, onToggle }) {
  return (
    <fieldset className="border border-slate-800 rounded-lg p-4 bg-[#0b0f19]">
      <legend className="px-2 text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
        <Accessibility className="h-4 w-4 text-purple-400" /> Discapacidad
      </legend>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando catalogo...</div>
      ) : discapacidades.length === 0 ? (
        <p className="text-sm text-slate-500 py-2">No hay discapacidades registradas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {discapacidades.map((item) => {
            const id = getDiscapacidadId(item);
            const checked = selected.includes(id);
            return (
              <label key={id} className={`flex items-start gap-3 rounded-lg border px-3 py-2 cursor-pointer transition ${checked ? 'border-purple-500/70 bg-purple-500/10 text-white' : 'border-slate-800 bg-[#111827] text-slate-300 hover:border-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(id)}
                  className="mt-1 h-4 w-4 accent-purple-600"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{getDiscapacidadNombre(item)}</span>
                  {item.descripcion && <span className="block text-xs text-slate-500 mt-0.5 line-clamp-2">{item.descripcion}</span>}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

function DiscapacidadBadges({ discapacidades = [] }) {
  if (!discapacidades.length) return <span className="text-slate-500 text-xs">Sin asignar</span>;
  return (
    <div className="flex flex-wrap gap-1.5 max-w-xs">
      {discapacidades.map((item) => (
        <span key={getDiscapacidadId(item)} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-950/60 text-purple-300 border border-purple-900/50">
          {getDiscapacidadNombre(item)}
        </span>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', required = false }) {
  return <label className="block text-xs font-bold uppercase text-slate-400 mb-1">{label}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" /></label>;
}

function Select({ label, value, onChange, options }) {
  return <label className="block text-xs font-bold uppercase text-slate-400 mb-1">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function Textarea({ label, value, onChange, rows = 3 }) {
  return <label className="block text-xs font-bold uppercase text-slate-400 mb-1">{label}<textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-purple-500" /></label>;
}

function Estado({ estado }) {
  const active = estado === 'activa';
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${active ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/50 text-amber-400 border-amber-900/50'}`}>{estado}</span>;
}

function getDiscapacidadId(item) {
  return Number(item?.id_tipo_discapacidad ?? item?.id_discapacidad ?? item?.id ?? item) || 0;
}

function getDiscapacidadNombre(item) {
  return item?.nombre_discapacidad ?? item?.nombre ?? item?.tipo ?? String(item ?? '');
}

function getVacanteDiscapacidadIds(vacante) {
  if (Array.isArray(vacante?.discapacidad_ids)) {
    return vacante.discapacidad_ids.map(Number).filter(Boolean);
  }
  if (Array.isArray(vacante?.discapacidades)) {
    return vacante.discapacidades.map(getDiscapacidadId).filter(Boolean);
  }
  return [];
}

function formatPrecio(num) {
  if (!num) return '$0';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
}

function safeDate(value) {
  if (!value) return 'S/F';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'S/F' : date.toLocaleDateString('es-MX');
}