import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, DollarSign, Monitor, Building2,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
import { Badge, Button, ErrorBanner } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';

const API = 'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Reclutador/mostrar_vacante_detalle.php';

const VACANTE_BADGE = {
  activa: 'success',
  cerrada: 'default',
  eliminada: 'danger',
};

const POSTULACION_BADGE = {
  pendiente: 'warning',
  entrevista: 'info',
  aceptado: 'success',
  rechazada: 'danger',
};

function safeDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-MX');
}

function formatSalary(vacante) {
  if (!vacante) return '-';
  const min = vacante.salario_min ? `$${Number(vacante.salario_min).toLocaleString('es-MX')}` : null;
  const max = vacante.salario_max ? `$${Number(vacante.salario_max).toLocaleString('es-MX')}` : null;
  if (min && max) return `${min} - ${max} MXN`;
  return `${min || max || '-'}${min || max ? ' MXN' : ''}`;
}

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

  const [vacante, setVacante] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        const res = await fetch(`${API}?id=${id}`);
        const data = await res.json();
        if (data.ok) {
          setVacante(data.data.vacante);
          setPostulaciones(data.data.postulaciones ?? []);
        } else {
          setError(data.mensaje || 'No se encontró la vacante.');
        }
      } catch {
        setError('Error de conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

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
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Volver
          </Button>
          <ErrorBanner message={error || 'Vacante no encontrada.'} />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme={t} navItems={reclutadorNav}>
      <div className="space-y-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        {/* Encabezado */}
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

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-3">Descripción</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {vacante.descripcion_puesto || 'Sin descripción registrada.'}
              </p>
            </section>

            <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-3">Requisitos</h2>
              <pre className="text-slate-300 text-sm leading-relaxed font-sans whitespace-pre-wrap">
                {vacante.requisitos || 'Sin requisitos registrados.'}
              </pre>
            </section>

            <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4">
                Postulaciones ({postulaciones.length})
              </h2>
              <Table
                columns={postulacionesColumns}
                data={postulaciones}
                emptyMessage="Esta vacante aún no tiene postulaciones."
                caption="Postulaciones recibidas"
              />
            </section>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4">Detalles</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign size={15} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-xs">Salario</p>
                    <p className="text-white text-sm">{formatSalary(vacante)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor size={15} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-xs">Modalidad</p>
                    <p className="text-white text-sm">{vacante.modalidad || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 size={15} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-xs">Empresa</p>
                    <p className="text-white text-sm">{vacante.nombre_empresa || '-'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </PortalLayout>
  );
}