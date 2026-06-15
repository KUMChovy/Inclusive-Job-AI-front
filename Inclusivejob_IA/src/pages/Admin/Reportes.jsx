// src/pages/Admin/Reportes.jsx
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Flag, RefreshCw, Trash2, X } from 'lucide-react';

import {
  PageHeader, Badge, Button, SearchBar, FilterTabs, ErrorBanner,
} from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import { useSearch, usePagination } from '../../assets/Hook/Admin/useApi';
import { useReporteAcciones, useReportes } from '../../assets/Hook/Admin/useDomain';
import {
  confirmDelete, confirmAction, successAlert, errorAlert,
} from '../../assets/Componentes/Admin/alerts';

const LIMITE = 15;

const ESTADO_BADGE = {
  activa: 'success',
  cerrada: 'default',
  eliminada: 'danger',
};

const FILTROS = [
  { value: 'todas', label: 'Todas' },
  { value: 'activa', label: 'Activas' },
  { value: 'cerrada', label: 'Cerradas' },
  { value: 'eliminada', label: 'Eliminadas' },
];

function safeDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-MX');
}

function getReporteId(row) {
  return row.id_reporte ?? row.id;
}

function getVacanteId(row) {
  return row.id_vacante;
}

function getVacante(row) {
  return row.vacante ?? row.titulo_puesto ?? 'Sin titulo';
}

function getEmpresa(row) {
  return row.empresa ?? row.nombre_empresas ?? '-';
}

function getUsuario(row) {
  return row.usuario ?? row.correo ?? '-';
}

export default function Reportes() {
  const navigate = useNavigate();
  const { query, setQuery, debouncedQuery } = useSearch(400);
  const { page, goToPage, reset } = usePagination(1, LIMITE);
  const [filtro, setFiltro] = useState('todas');
  const [actionLoading, setActionLoading] = useState(null);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filtro !== 'todas') params.set('estado', filtro);
    if (debouncedQuery) params.set('buscar', debouncedQuery);
    params.set('pagina', String(page));
    params.set('limite', String(LIMITE));
    return `&${params.toString()}`;
  }, [debouncedQuery, filtro, page]);

  const { data, loading, error, refetch } = useReportes(buildParams());
  const { ignorar, eliminarVacante } = useReporteAcciones();

  const payload = data?.data ?? data ?? {};
  const reportes = payload.reportes ?? (Array.isArray(payload) ? payload : []);
  const total = Number(payload.total ?? reportes.length);

  const handleIgnorar = async (row) => {
    const id = getReporteId(row);
    const vacante = getVacante(row);

    const ok = await confirmAction({
      title: 'Ignorar reporte',
      html: `<span>El reporte sobre <strong style="color:#fff">"${vacante}"</strong> sera descartado. La vacante permanecera activa.</span>`,
      confirmText: 'Ignorar',
      confirmColor: '#475569',
      icon: 'info',
    });
    if (!ok) return;

    setActionLoading(id);
    try {
      await ignorar(id);
      await refetch();
      successAlert('Reporte ignorado', 'El reporte fue descartado.');
    } catch {
      errorAlert('Error', 'No se pudo ignorar el reporte.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEliminarVacante = async (row) => {
    const id = getReporteId(row);
    const vacante = getVacante(row);

    const ok = await confirmDelete(`la vacante "${vacante}"`);
    if (!ok) return;

    setActionLoading(id);
    try {
      await eliminarVacante(id);
      await refetch();
      successAlert('Vacante eliminada', `"${vacante}" fue eliminada de la plataforma.`);
    } catch {
      errorAlert('Error', 'No se pudo eliminar la vacante.');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: 'vacante',
      label: 'Vacante',
      render: (_, row) => <span className="text-white font-medium">{getVacante(row)}</span>,
    },
    {
      key: 'empresa',
      label: 'Empresa',
      render: (_, row) => getEmpresa(row),
    },
    {
      key: 'usuario',
      label: 'Usuario reportante',
      render: (_, row) => (
        <div className="min-w-0">
          <p className="text-sm text-slate-300 truncate">{row.usuario_nombre || '-'}</p>
          <p className="text-xs text-slate-500 truncate">{getUsuario(row)}</p>
        </div>
      ),
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (value) => (
        <span className="text-sm text-slate-300 line-clamp-2 max-w-xs" title={value}>
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'estado_vacante',
      label: 'Estado vacante',
      render: (value) => <Badge variant={ESTADO_BADGE[value] ?? 'default'}>{value || '-'}</Badge>,
    },
    {
      key: 'fecha_reporte',
      label: 'Fecha',
      render: (value) => safeDate(value),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => {
        const id = getReporteId(row);
        const isLoading = actionLoading === id;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              title="Ver vacante"
              onClick={() => navigate(`/admin/vacantes/${getVacanteId(row)}`)}
              aria-label="Ver vacante"
            >
              <Eye size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Ignorar reporte"
              loading={isLoading}
              onClick={() => handleIgnorar(row)}
              aria-label="Ignorar reporte"
            >
              <X size={14} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              title="Eliminar vacante"
              loading={isLoading}
              onClick={() => handleEliminarVacante(row)}
              aria-label="Eliminar vacante"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <PageHeader
        title="Reportes de Vacantes"
        description="Modera las vacantes reportadas por usuarios de la plataforma"
        action={(
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <Flag size={15} /> {total} reportes
            </span>
            <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Cargando...' : 'Actualizar'}
            </Button>
          </div>
        )}
      />

      <ErrorBanner message={error} />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={query}
          onChange={(value) => { setQuery(value); reset(); }}
          placeholder="Buscar por vacante, empresa, usuario o motivo..."
          className="sm:w-96"
        />
        <FilterTabs
          options={FILTROS}
          value={filtro}
          onChange={(value) => { setFiltro(value); reset(); }}
        />
      </div>

      <Table
        columns={columns}
        data={reportes}
        loading={loading}
        emptyMessage="No hay reportes de vacantes con los filtros aplicados."
        caption="Reportes de vacantes"
      />

      <Pagination
        total={total}
        page={page}
        limit={LIMITE}
        onPageChange={goToPage}
      />
    </div>
  );
}
