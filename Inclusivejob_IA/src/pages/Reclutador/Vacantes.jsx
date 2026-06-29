import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Eye, Edit, Trash2, MapPin, DollarSign, ToggleLeft, ToggleRight, Loader2, RefreshCw, Search, X, FileText } from 'lucide-react';

export default function VacantesReclutador() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [filtroModalidad, setFiltroModalidad] = useState('Todas las modalidades');

  // Control del Modal (Crear / Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacante, setEditingVacante] = useState(null); // null = Modo Crear, objeto = Modo Editar

  // Estado del Formulario
  const [formData, setFormData] = useState({
    titulo_puesto: '',
    descripcion_puesto: '',
    requisitos: '',
    modalidad: 'Presencial',
    salario_min: '',
    salario_max: '',
    estado: 'activa'
  });

  const API_URL = 'http://localhost/backInclusive/back-inclusiveJob/Modelo/Reclutador/vacantes.php'; 

  // READ: Obtener vacantes
  const obtenerVacantes = async () => {
    try {
      setLoading(true);
      const respuesta = await fetch(`${API_URL}?accion=listar&id_reclutador=1`);
      if (!respuesta.ok) throw new Error('Error al conectar con el servidor PHP');
      const resultado = await respuesta.json();
      if (resultado.success) setVacantes(resultado.data);
      else throw new Error(resultado.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVacantes();
  }, []);

  // Abrir Modal para crear o editar
  const handleOpenModal = (vacante = null) => {
    if (vacante) {
      setEditingVacante(vacante);
      setFormData({
        titulo_puesto: vacante.titulo_puesto,
        descripcion_puesto: vacante.descripcion_puesto || '',
        requisitos: vacante.requisitos || '',
        modalidad: vacante.modalidad,
        salario_min: vacante.salario_min,
        salario_max: vacante.salario_max,
        estado: vacante.estado
      });
    } else {
      setEditingVacante(null);
      setFormData({
        titulo_puesto: '',
        descripcion_puesto: '',
        requisitos: '',
        modalidad: 'Presencial',
        salario_min: '',
        salario_max: '',
        estado: 'activa'
      });
    }
    setIsModalOpen(true);
  };

 // CUD: Guardar (Insertar o Editar) con súper diagnóstico
  const handleGuardarVacante = async (e) => {
    e.preventDefault();
    const accion = editingVacante ? 'editar' : 'insertar';
    const payload = editingVacante ? { ...formData, id_vacante: editingVacante.id_vacante } : formData;

    try {
      const respuesta = await fetch(`${API_URL}?accion=${accion}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Clonamos la respuesta para poder leerla como texto si el JSON falla
      const respuestaClonada = respuesta.clone();
      let resultado;
      
      try {
        resultado = await respuesta.json();
      } catch (jsonErr) {
        // 🌟 SI NO ES JSON, PHP mandó un error de MySQL o un error 500 en texto
        const textoError = await respuestaClonada.text();
        throw new Error("MySQL/PHP rompió la petición. Detalles del backend:\n\n" + textoError);
      }
      
      if (resultado.success) {
        setIsModalOpen(false); // Cierra el modal
        obtenerVacantes();     // Refresca la tabla en tiempo real
      } else {
        alert("Error devuelto por el archivo PHP: " + resultado.message);
      }
    } catch (err) {
      console.error("Error completo capturado:", err);
      // 🌟 Ahora la alerta te dirá la verdad absoluta del error
      alert(err.message); 
    }
  };

  // CUD: Cambiar estado rápido (Switch)
  const toggleEstado = async (id_vacante, estadoActual) => {
    const nuevoEstado = estadoActual === 'activa' ? 'pausada' : 'activa';
    
    // Cambio visual veloz
    setVacantes(vacantes.map(v => v.id_vacante === id_vacante ? { ...v, estado: nuevoEstado } : v));

    try {
      await fetch(`${API_URL}?accion=actualizar_estado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_vacante, estado: nuevoEstado })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // CUD: Eliminar Registro definitivo
  const handleEliminar = async (id_vacante) => {
    if (window.confirm("¿Estás completamente seguro de eliminar esta vacante de la base de datos?")) {
      try {
        const respuesta = await fetch(`${API_URL}?accion=eliminar&id_vacante=${id_vacante}`);
        const resultado = await respuesta.json();
        
        if (resultado.success) {
          setVacantes(vacantes.filter(v => v.id_vacante !== id_vacante)); // Quitar de la UI
        } else {
          alert(resultado.message);
        }
      } catch (err) {
        console.error("No se pudo eliminar", err);
      }
    }
  };

  const formatPrecio = (num) => {
    if (!num) return '$0';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
  };

  // Filtrado reactivo en memoria
  const vacantesFiltradas = vacantes.filter(vacante => {
    const cumpleBusqueda = vacante.titulo_puesto.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleEstado = filtroEstado === 'Todas' || 
                         (filtroEstado === 'Activas' && vacante.estado === 'activa') ||
                         (filtroEstado === 'Cerradas' && vacante.estado === 'pausada');
    const cumpleModalidad = filtroModalidad === 'Todas las modalidades' || vacante.modalidad === filtroModalidad;
    return cumpleBusqueda && cumpleEstado && cumpleModalidad;
  });

  if (loading && vacantes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19]">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 mt-4">Sincronizando con MySQL...</p>
      </div>
    );
  }

  return (
      <PortalLayout
    theme={t}
    navItems={reclutadorNav}
    user={{
      nombre: "Carlos Ramírez",
      rol: "Reclutador"
    }}
    pageTitle="Vacantes"
  >
  
    <div className="min-h-screen bg-[#0b0f19] p-6 md:p-8 font-sans text-slate-200">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion de Vacantes</h1>
          <p className="text-slate-400 text-sm mt-0.5">Visualiza y administra todas las vacantes publicadas</p>
        </div>

        <div className="flex items-center gap-4 text-sm self-end md:self-auto">
          <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-purple-900/20">
            <Plus className="h-4 w-4" /> Publicar nueva vacante
          </button>
          <button onClick={obtenerVacantes} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition">
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por titulo..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#131926] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <select 
            value={filtroModalidad}
            onChange={(e) => setFiltroModalidad(e.target.value)}
            className="bg-[#131926] border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option>Todas las modalidades</option>
            <option>Presencial</option>
            <option>Remoto</option>
            <option>Híbrido</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="bg-[#131926] p-1 rounded-xl border border-slate-800/60 flex items-center">
          {['Todas', 'Activas', 'Cerradas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFiltroEstado(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                filtroEstado === tab ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-[#131926] rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#182032] border-b border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Modalidad</th>
                <th className="px-6 py-4">Salario</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Publicación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {vacantesFiltradas.map((vacante) => (
                <tr key={vacante.id_vacante} className="hover:bg-[#172033]/40 transition">
                  <td className="px-6 py-4 font-semibold text-white text-base">{vacante.titulo_puesto}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/60 text-blue-400 border border-blue-900/40">
                      <MapPin className="h-3.5 w-3.5" />
                      {vacante.modalidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                    {formatPrecio(vacante.salario_min)} - {formatPrecio(vacante.salario_max)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                      vacante.estado === 'activa' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/50 text-amber-400 border-amber-900/50'
                    }`}>
                      {vacante.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                    {vacante.fecha_publicacion ? new Date(vacante.fecha_publicacion).toLocaleDateString('es-MX') : 'S/F'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleEstado(vacante.id_vacante, vacante.estado)} className="text-slate-500 hover:text-purple-400 p-1.5 transition">
                        {vacante.estado === 'activa' ? <ToggleRight className="h-6 w-6 text-purple-500" /> : <ToggleLeft className="h-6 w-6" />}
                      </button>
                      <button onClick={() => handleOpenModal(vacante)} className="text-slate-500 hover:text-amber-400 p-1.5 transition" title="Editar"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleEliminar(vacante.id_vacante)} className="text-slate-500 hover:text-red-400 p-1.5 transition" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vacantesFiltradas.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-medium bg-[#131926]">No se encontraron registros.</div>
        )}
      </div>

      {/* ── MODAL FLOTANTE (CREAR / EDITAR) ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#131926] border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl text-slate-200">
            
            {/* Cabecera Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#182032]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                {editingVacante ? 'Editar Vacante Existente' : 'Publicar Nueva Vacante'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleGuardarVacante} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Título del Puesto *</label>
                <input required type="text" value={formData.titulo_puesto} onChange={(e) => setFormData({...formData, titulo_puesto: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="Ej. Desarrollador Web Full Stack"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Modalidad</label>
                  <select value={formData.modalidad} onChange={(e) => setFormData({...formData, modalidad: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500">
                    <option>Presencial</option>
                    <option>Remoto</option>
                    <option>Híbrido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Estado Inicial</label>
                  <select value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500">
                    <option value="activa">Activa</option>
                    <option value="pausada">Pausada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Salario Mínimo (MXN)</label>
                  <input type="number" value={formData.salario_min} onChange={(e) => setFormData({...formData, salario_min: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="12000"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Salario Máximo (MXN)</label>
                  <input type="number" value={formData.salario_max} onChange={(e) => setFormData({...formData, salario_max: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="18000"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Descripción del Puesto</label>
                <textarea rows="3" value={formData.descripcion_puesto} onChange={(e) => setFormData({...formData, descripcion_puesto: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="Detalla las actividades principales..."></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Requisitos</label>
                <textarea rows="2" value={formData.requisitos} onChange={(e) => setFormData({...formData, requisitos: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="Ej. 2 años de experiencia en React, PHP, SQL..."></textarea>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-medium text-slate-400 hover:text-white transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-xl transition shadow-lg shadow-purple-900/30">
                  {editingVacante ? 'Guardar Cambios' : 'Publicar Ahora'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
     </PortalLayout>
  );
}