import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Flag, RefreshCw, X } from 'lucide-react';
import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
import { Button, ErrorBanner, PageHeader, SearchBar } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import BubleChat from "../Reclutador/ChatBot.jsx";
import { useReportesReclutador } from '../../assets/Hook/Reclutador/useDomain';

const LIMITE = 15;

export default function ReportesMios() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useReportesReclutador();
  const [reportes, setReportes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [modalReporte, setModalReporte] = useState(null);

  useEffect(() => {
    if (data?.data) setReportes(data.data);
  }, [data]);

  const reportesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return reportes.filter((reporte) => (
      [
        reporte.vacante,
        reporte.usuario_nombre,
        reporte.correo,
        reporte.motivo,
        reporte.fecha_reporte,
      ]
        .join(' ')
        .toLowerCase()
        .includes(texto)
    ));
  }, [busqueda, reportes]);

  const total = reportesFiltrados.length;
  const datosPagina = reportesFiltrados.slice((page - 1) * LIMITE, page * LIMITE);

  const columns = [
    {
      key: 'vacante',
      label: 'Vacante',
      render: (_, row) => <span className="text-white font-medium">{row.vacante}</span>,
    },
    {
      key: 'usuario',
      label: 'Usuario reportante',
      render: (_, row) => (
        <div className="min-w-0">
          <p className="text-sm text-slate-300 truncate">{row.usuario_nombre}</p>
          <p className="text-xs text-slate-500 truncate">{row.correo}</p>
        </div>
      ),
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (_, row) => <span className="text-sm text-slate-300 line-clamp-2 max-w-xs">{row.motivo}</span>,
    },
    {
      key: 'fecha_vacante',
      label: 'Fecha publicacion',
      render: (_, row) => safeDate(row.fecha_publicacion),
    },
    {
      key: 'fecha_reporte',
      label: 'Fecha reporte',
      render: (_, row) => safeDate(row.fecha_reporte),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/reclutador/vacantes/${row.id_vacante}`)}
          >
            <Eye size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setModalReporte(row)}>
            <Flag size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PortalLayout theme={t} navItems={reclutadorNav}>
      <div className="space-y-5 w-full">
        <PageHeader
          title="Reportes de Vacantes"
          description="Modera las vacantes reportadas por usuarios de la plataforma"
          action={(
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Flag size={15} />
                {total} reportes
              </span>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                <RefreshCw size={14} />
                Actualizar
              </Button>
            </div>
          )}
        />
        <ErrorBanner message={error} />
        <SearchBar
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por vacante, usuario o motivo..."
          className="sm:w-96"
        />
        <Table
          columns={columns}
          data={datosPagina}
          loading={loading}
          emptyMessage={busqueda ? 'No se encontraron coincidencias' : 'No hay reportes disponibles'}
        />
        <Pagination total={total} page={page} limit={LIMITE} onPageChange={setPage} />
      </div>

      {modalReporte && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setModalReporte(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Flag size={15} className="text-violet-400" />
                Detalle del reporte
              </h2>
              <button
                type="button"
                onClick={() => setModalReporte(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <DetailBlock label="Vacante">{modalReporte.vacante}</DetailBlock>
              <DetailBlock label="Motivo">{modalReporte.motivo}</DetailBlock>
              <DetailBlock label="Reportado por">
                <span>{modalReporte.usuario_nombre}</span>
                <span className="text-slate-500 text-xs block mt-1">{modalReporte.correo}</span>
              </DetailBlock>
              <DetailBlock label="Fecha del reporte">{safeDate(modalReporte.fecha_reporte)}</DetailBlock>
            </div>
          </div>
        </div>
      )}
      <BubleChat/>
    </PortalLayout>
  );
}

function DetailBlock({ label, children }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-slate-300 text-sm">{children}</p>
    </div>
  );
}

function safeDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
