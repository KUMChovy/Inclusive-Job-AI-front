// src/pages/Admin/VacanteDetalle.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Monitor, Building2, User, Accessibility, XCircle, Trash2 } from 'lucide-react';
import { Badge, Button } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';

const MOCK_VACANTE = {
  id: 1,
  titulo: 'Desarrollador Frontend',
  descripcion: 'Buscamos un desarrollador frontend con experiencia en React y Tailwind CSS para unirse a nuestro equipo de producto.',
  requisitos: '• 2+ años de experiencia en React\n• Conocimiento de accesibilidad web\n• Experiencia con herramientas de diseño\n• Inglés intermedio',
  modalidad: 'Remoto',
  salario_min: 15000,
  salario_max: 25000,
  estado: 'activa',
  fecha_publicacion: '2026-05-10',
  fecha_cierre: '2026-06-10',
  empresa: 'Tech Solutions SA',
  reclutador: 'María López',
  discapacidades: ['Visual', 'Auditiva', 'Motriz'],
  postulaciones: [
    { id: 1, postulante: 'Ana García Torres', estado: 'pendiente', fecha: '2026-05-12' },
    { id: 2, postulante: 'Luis Martínez', estado: 'entrevista', fecha: '2026-05-14' },
    { id: 3, postulante: 'Carmen Ruiz', estado: 'aceptado', fecha: '2026-05-15' },
  ],
};

const DISCAPACIDADES_ALL = ['Visual', 'Auditiva', 'Motriz', 'Intelectual', 'Psicosocial'];
const ESTADO_BADGE = { pendiente: 'warning', entrevista: 'info', aceptado: 'success', rechazado: 'danger' };

const POSTULACIONES_COLS = [
  { key: 'postulante', label: 'Postulante' },
  { key: 'estado', label: 'Estado', render: (v) => <Badge variant={ESTADO_BADGE[v]}>{v}</Badge> },
  { key: 'fecha', label: 'Fecha', render: (v) => new Date(v).toLocaleDateString('es-MX') },
];

export default function VacanteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const v = MOCK_VACANTE;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/admin/vacantes')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} /> Volver a Vacantes
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">{v.titulo}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={v.estado === 'activa' ? 'success' : 'default'}>{v.estado}</Badge>
            <Badge variant="info">{v.modalidad}</Badge>
            <span className="text-slate-500 text-xs">Publicada: {new Date(v.fecha_publicacion).toLocaleDateString('es-MX')}</span>
            <span className="text-slate-500 text-xs">Cierre: {new Date(v.fecha_cierre).toLocaleDateString('es-MX')}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {v.estado === 'activa' && (
            <Button variant="secondary" size="sm"><XCircle size={14} /> Cerrar</Button>
          )}
          <Button variant="danger" size="sm"><Trash2 size={14} /> Eliminar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Descripción */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">Descripción</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{v.descripcion}</p>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">Requisitos</h2>
            <pre className="text-slate-300 text-sm leading-relaxed font-sans whitespace-pre-wrap">{v.requisitos}</pre>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Postulaciones ({v.postulaciones.length})</h2>
            <Table columns={POSTULACIONES_COLS} data={v.postulaciones} caption="Postulaciones recibidas" />
          </section>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Detalles</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign size={15} className="text-slate-400" />
                <div>
                  <p className="text-slate-400 text-xs">Salario</p>
                  <p className="text-white text-sm">${v.salario_min?.toLocaleString()} – ${v.salario_max?.toLocaleString()} MXN</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Monitor size={15} className="text-slate-400" />
                <div>
                  <p className="text-slate-400 text-xs">Modalidad</p>
                  <p className="text-white text-sm">{v.modalidad}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 size={15} className="text-slate-400" />
                <div>
                  <p className="text-slate-400 text-xs">Empresa</p>
                  <p className="text-white text-sm">{v.empresa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={15} className="text-slate-400" />
                <div>
                  <p className="text-slate-400 text-xs">Reclutador</p>
                  <p className="text-white text-sm">{v.reclutador}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Accessibility size={16} className="text-violet-400" /> Compatibilidad
            </h2>
            <ul className="space-y-2">
              {DISCAPACIDADES_ALL.map((d) => {
                const compatible = v.discapacidades.includes(d);
                return (
                  <li key={d} className={`flex items-center gap-2 text-sm ${compatible ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${compatible ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    {d}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}