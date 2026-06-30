import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, DollarSign, Monitor } from 'lucide-react';
import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
import { Badge, Button, ErrorBanner } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import { useDetalleVacanteReclutador } from '../../assets/Hook/Reclutador/useDomain';

const VACANTE_BADGE = {
  activa: 'success',
  pausada: 'warning',
  cerrada: 'default',
  eliminada: 'danger',
};

const POSTULACION_BADGE = {
  pendiente: 'warning',
  entrevista: 'info',
  aceptado: 'success',
  rechazada: 'danger',
};

const postulacionesColumns = [
  {
    key: 'postulante',
    label: 'Postulante',
    render: (_, row) => (
      <div className="min-w-0">
        <p className="text-sm text-slate-300">{row.postulante}</p>
        <p className="text-xs text-slate-500">{row.correo}</p>
      </div>
    ),
  },
  {
    key: 'estado',
    label: 'Estado',
    render: (value) => <Badge variant={POSTULACION_BADGE[value] ?? 'default'}>{value || '-'}</Badge>,
  },
  {
    key: 'fecha_postulacion',
    label: 'Fecha',
    render: (value) => safeDate(value),
  },
];

export default function VacanteDetalleReclutador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useDetalleVacanteReclutador(id);
  const vacante = data?.data?.vacante ?? null;
  const postulaciones = data?.data?.postulaciones ?? [];

  if (loading) {
    return (
      <PortalLayout theme={t} navItems={reclutadorNav}>
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="w-9 h-9 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PortalLayout>
    );
  }

  if (error || !vacante) {
    return (
      <PortalLayout theme={t} navItems={reclutadorNav}>
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Volver</Button>
          <ErrorBanner message={error || 'Vacante no encontrada.'} />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme={t} navItems={reclutadorNav}>
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Volver
        </button>

        <div>
          <h1 className="text-xl font-bold text-white">{vacante.titulo_puesto}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={VACANTE_BADGE[vacante.estado] ?? 'default'}>{vacante.estado || '-'}</Badge>
            <Badge variant="info">{vacante.modalidad || '-'}</Badge>
            <span className="text-slate-500 text-xs">Publicada: {safeDate(vacante.fecha_publicacion)}</span>
            <span className="text-slate-500 text-xs">Cierre: {safeDate(vacante.fecha_cierre)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Panel title="Descripcion">
              <p className="text-slate-300 text-sm leading-relaxed">{vacante.descripcion_puesto || 'Sin descripcion registrada.'}</p>
            </Panel>
            <Panel title="Requisitos">
              <pre className="text-slate-300 text-sm leading-relaxed font-sans whitespace-pre-wrap">{vacante.requisitos || 'Sin requisitos registrados.'}</pre>
            </Panel>
            <Panel title={`Postulaciones (${postulaciones.length})`}>
              <Table columns={postulacionesColumns} data={postulaciones} emptyMessage="Esta vacante aun no tiene postulaciones." caption="Postulaciones recibidas" />
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Detalles">
              <Detail icon={DollarSign} label="Salario" value={formatSalary(vacante)} />
              <Detail icon={Monitor} label="Modalidad" value={vacante.modalidad || '-'} />
              <Detail icon={Building2} label="Empresa" value={vacante.nombre_empresa || '-'} />
            </Panel>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

function Panel({ title, children }) {
  return (
    <section className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <h2 className="text-white font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 mb-4 last:mb-0">
      <Icon size={15} className="text-slate-400" />
      <div>
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-white text-sm">{value}</p>
      </div>
    </div>
  );
}

function safeDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-MX');
}

function formatSalary(vacante) {
  const min = vacante.salario_min ? `$${Number(vacante.salario_min).toLocaleString('es-MX')}` : null;
  const max = vacante.salario_max ? `$${Number(vacante.salario_max).toLocaleString('es-MX')}` : null;
  if (min && max) return `${min} - ${max} MXN`;
  return `${min || max || '-'}${min || max ? ' MXN' : ''}`;
}
