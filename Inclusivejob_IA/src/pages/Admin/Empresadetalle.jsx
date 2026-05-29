// src/pages/Admin/EmpresaDetalle.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Mail, Phone, MapPin, CheckCircle, XCircle, PauseCircle, User, Briefcase } from 'lucide-react';
import { Badge, Button, PageHeader } from '../../assets/Componentes/Admin/UI';

// ── Mock data ───────────────────────────────────────────────
const MOCK_EMPRESA = {
  id: 1,
  nombre_empresa: 'Tech Solutions SA',
  descripcion: 'Empresa líder en desarrollo de software a medida y consultoría tecnológica con más de 10 años de experiencia en el mercado mexicano.',
  direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX',
  telefono: '55-1234-5678',
  correo_empresa: 'info@techsol.mx',
  sitio_web: 'techsol.mx',
  estado_validacion: 'aprobada',
  fecha_registro: '2026-01-15',
  reclutadores: [
    { id: 1, nombre: 'María López', correo: 'mlopez@techsol.mx', puesto: 'Gerente de Recursos Humanos' },
    { id: 2, nombre: 'Carlos Ramírez', correo: 'cramirez@techsol.mx', puesto: 'Reclutador Senior' },
  ],
  vacantes: [
    { id: 1, titulo: 'Desarrollador Frontend', modalidad: 'Remoto', estado: 'activa' },
    { id: 2, titulo: 'QA Engineer', modalidad: 'Híbrido', estado: 'activa' },
    { id: 3, titulo: 'DevOps Engineer', modalidad: 'Presencial', estado: 'cerrada' },
  ],
};

const ESTADO_BADGE = {
  aprobada: 'success', pendiente: 'warning', rechazada: 'danger', suspendida: 'default',
};

function InfoRow({ icon: Icon, label, value, link }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/40 last:border-0">
      <div className="text-slate-400 mt-0.5"><Icon size={16} /></div>
      <div>
        <p className="text-slate-400 text-xs mb-0.5">{label}</p>
        {link
          ? <a href={link} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline text-sm">{value}</a>
          : <p className="text-white text-sm">{value}</p>
        }
      </div>
    </div>
  );
}

export default function EmpresaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  // En producción: const { data, loading } = useEmpresaDetalle(id);
  const empresa = MOCK_EMPRESA;

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/admin/empresas')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors"
          aria-label="Volver a empresas"
        >
          <ArrowLeft size={16} /> Volver a Empresas
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">{empresa.nombre_empresa}</h1>
            <div className="mt-1">
              <Badge variant={ESTADO_BADGE[empresa.estado_validacion]}>{empresa.estado_validacion}</Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {empresa.estado_validacion === 'pendiente' && (
              <Button variant="success" size="sm"><CheckCircle size={14} /> Aprobar</Button>
            )}
            <Button variant="danger" size="sm"><XCircle size={14} /> Rechazar</Button>
            <Button variant="secondary" size="sm"><PauseCircle size={14} /> Suspender</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos generales */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Datos generales</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{empresa.descripcion}</p>
            <InfoRow icon={MapPin} label="Dirección" value={empresa.direccion} />
            <InfoRow icon={Mail} label="Correo" value={empresa.correo_empresa} link={`mailto:${empresa.correo_empresa}`} />
            <InfoRow icon={Phone} label="Teléfono" value={empresa.telefono} />
            <InfoRow icon={Globe} label="Sitio web" value={empresa.sitio_web} link={`https://${empresa.sitio_web}`} />
          </section>

          {/* Reclutadores */}
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User size={16} className="text-violet-400" />
              Reclutadores ({empresa.reclutadores.length})
            </h2>
            <ul className="space-y-3" role="list">
              {empresa.reclutadores.map((r) => (
                <li key={r.id} className="flex items-center gap-3 bg-slate-700/30 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-sm flex-shrink-0">
                    {r.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{r.nombre}</p>
                    <p className="text-slate-400 text-xs">{r.puesto}</p>
                    <p className="text-slate-500 text-xs">{r.correo}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Info adicional + Vacantes */}
        <div className="space-y-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Información de registro</h2>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-xs">Estado de validación</p>
                <Badge variant={ESTADO_BADGE[empresa.estado_validacion]}>{empresa.estado_validacion}</Badge>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Fecha de registro</p>
                <p className="text-white text-sm">{new Date(empresa.fecha_registro).toLocaleDateString('es-MX', { dateStyle: 'long' })}</p>
              </div>
            </div>
          </section>

          {/* Vacantes */}
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-violet-400" />
              Vacantes ({empresa.vacantes.length})
            </h2>
            <ul className="space-y-2" role="list">
              {empresa.vacantes.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between bg-slate-700/30 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-slate-700/50 transition-colors"
                  onClick={() => navigate(`/admin/vacantes/${v.id}`)}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{v.titulo}</p>
                    <p className="text-slate-400 text-xs">{v.modalidad}</p>
                  </div>
                  <Badge variant={v.estado === 'activa' ? 'success' : 'default'}>{v.estado}</Badge>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}