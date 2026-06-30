import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Eye, Flag, RefreshCw } from 'lucide-react';
=======
import { Eye, Flag, RefreshCw, X } from 'lucide-react';

>>>>>>> 4243d59cebcf0fa88d0d48e2335a30247d9e5b58
import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
import { Button, ErrorBanner, PageHeader, SearchBar } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import { useReportesReclutador } from '../../assets/Hook/Reclutador/useDomain';

const LIMITE = 15;

export default function ReportesMios() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useReportesReclutador();
  const [reportes, setReportes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);

<<<<<<< HEAD
=======
  const [modalReporte, setModalReporte] = useState(null);



>>>>>>> 4243d59cebcf0fa88d0d48e2335a30247d9e5b58
  useEffect(() => {
    if (data?.data) setReportes(data.data);
  }, [data]);

  const reportesFiltrados = useMemo(() => {
    return reportes.filter((r) => [r.vacante, r.usuario_nombre, r.correo, r.motivo, r.fecha_reporte].join(' ').toLowerCase().includes(busqueda.toLowerCase()));
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
<<<<<<< HEAD
          <Button variant="ghost" size="sm" onClick={() => navigate(`/reclutador/vacantes/${row.id_vacante}`)}><Eye size={14} /></Button>
          <Button variant="ghost" size="sm" onClick={() => console.log(row.id)}><Flag size={14} /></Button>
=======

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/reclutador/vacantes/${row.id_vacante}`)}
          >
            <Eye size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalReporte(row)}
          >
            <Flag size={14} />
          </Button>

>>>>>>> 4243d59cebcf0fa88d0d48e2335a30247d9e5b58
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
              <span className="text-slate-400 text-sm flex items-center gap-1"><Flag size={15} />{total} reportes</span>
              <Button variant="ghost" size="sm" onClick={() => refetch()}><RefreshCw size={14} />Actualizar</Button>
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
        <Table columns={columns} data={datosPagina} loading={loading} emptyMessage={busqueda ? 'No se encontraron coincidencias' : 'No hay reportes disponibles'} />
        <Pagination total={total} page={page} limit={LIMITE} onPageChange={setPage} />
      </div>
<<<<<<< HEAD
=======
      {modalReporte && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setModalReporte(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Flag size={15} className="text-violet-400" /> Detalle del reporte
              </h2>
              <button
                onClick={() => setModalReporte(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-xs mb-1">Vacante</p>
                <p className="text-white text-sm font-medium">{modalReporte.vacante}</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-xs mb-1">Motivo</p>
                <p className="text-slate-300 text-sm">{modalReporte.motivo}</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-xs mb-1">Reportado por</p>
                <p className="text-slate-300 text-sm">{modalReporte.usuario_nombre}</p>
                <p className="text-slate-500 text-xs">{modalReporte.correo}</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-xs mb-1">Fecha del reporte</p>
                <p className="text-slate-300 text-sm">{safeDate(modalReporte.fecha_reporte)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
>>>>>>> 4243d59cebcf0fa88d0d48e2335a30247d9e5b58
    </PortalLayout>
  );
}

function safeDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
