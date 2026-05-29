// src/pages/Admin/Reportes.jsx
import { useState, useMemo } from 'react';
import { X, Trash2 } from 'lucide-react';
import { PageHeader, Badge, Button, SearchBar } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import { useSearch, usePagination } from '../../assets/Hook/Admin/useApi';
import { confirmDelete, confirmAction, successAlert, errorAlert } from '../../assets/Componentes/Admin/alerts';

const MOCK_REPORTES = [
  { id: 1, vacante: 'Desarrollador Frontend', empresa: 'Tech Solutions SA', usuario: 'ana.garcia@email.com',  motivo: 'Contenido discriminatorio hacia personas con discapacidad visual',  fecha_reporte: '2026-05-20' },
  { id: 2, vacante: 'Soporte Técnico',         empresa: 'HelpDesk Pro',       usuario: 'carlos.rl@email.com',  motivo: 'Requisitos físicos excluyentes sin justificación',                   fecha_reporte: '2026-05-19' },
  { id: 3, vacante: 'Analista de Datos',       empresa: 'DataCorp MX',        usuario: 'mhernandez@email.com', motivo: 'Información de salario engañosa',                                    fecha_reporte: '2026-05-18' },
  { id: 4, vacante: 'QA Engineer',             empresa: 'Tech Solutions SA',  usuario: 'jlopez@email.com',     motivo: 'Vacante duplicada',                                                 fecha_reporte: '2026-05-17' },
];

export default function Reportes() {
  const { query, setQuery, debouncedQuery } = useSearch();
  const { page, goToPage, reset } = usePagination(1, 10);
  const [reportes, setReportes] = useState(MOCK_REPORTES);
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return reportes;
    const q = debouncedQuery.toLowerCase();
    return reportes.filter(
      (r) => r.vacante.toLowerCase().includes(q) || r.empresa.toLowerCase().includes(q) || r.usuario.toLowerCase().includes(q),
    );
  }, [reportes, debouncedQuery]);

  const LIMIT = 10;
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const removeReporte = (id) => setReportes((prev) => prev.filter((r) => r.id !== id));

  const handleIgnorar = async (row) => {
    const ok = await confirmAction({
      title: 'Ignorar reporte',
      html: `<span>El reporte sobre <strong style="color:#fff">"${row.vacante}"</strong> será descartado. La vacante permanecerá activa.</span>`,
      confirmText: 'Ignorar',
      confirmColor: '#475569',
      icon: 'info',
    });
    if (!ok) return;
    setActionLoading(row.id);
    try {
      removeReporte(row.id);
      await successAlert('Reporte ignorado', 'El reporte fue descartado.');
    } catch {
      await errorAlert('Error', 'No se pudo ignorar el reporte.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEliminarVacante = async (row) => {
    const ok = await confirmDelete(`la vacante "${row.vacante}"`);
    if (!ok) return;
    setActionLoading(row.id);
    try {
      removeReporte(row.id);
      await successAlert('Vacante eliminada', `"${row.vacante}" fue eliminada de la plataforma.`);
    } catch {
      await errorAlert('Error', 'No se pudo eliminar la vacante.');
    } finally {
      setActionLoading(null);
    }
  };

  const COLS = [
    { key: 'vacante',  label: 'Vacante',           render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'empresa',  label: 'Empresa'             },
    { key: 'usuario',  label: 'Usuario reportante', render: (v) => <span className="text-xs text-slate-400">{v}</span> },
    {
      key: 'motivo', label: 'Motivo',
      render: (v) => <span className="text-sm text-slate-300 line-clamp-2 max-w-xs" title={v}>{v}</span>,
    },
    { key: 'fecha_reporte', label: 'Fecha', render: (v) => new Date(v).toLocaleDateString('es-MX') },
    {
      key: 'acciones', label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" title="Ignorar reporte" loading={actionLoading === row.id} onClick={() => handleIgnorar(row)} aria-label="Ignorar">
            <X size={14} />
          </Button>
          <Button variant="danger" size="sm" title="Eliminar vacante" loading={actionLoading === row.id} onClick={() => handleEliminarVacante(row)} aria-label="Eliminar vacante">
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <PageHeader
        title="Reportes de Vacantes"
        description="Modera las vacantes reportadas por usuarios de la plataforma"
        action={
          reportes.length > 0 && (
            <Badge variant="warning">{reportes.length} pendientes</Badge>
          )
        }
      />

      <SearchBar
        value={query}
        onChange={(v) => { setQuery(v); reset(); }}
        placeholder="Buscar por vacante, empresa o usuario..."
        className="sm:w-96"
      />

      <Table columns={COLS} data={paginated} loading={false} emptyMessage="No hay reportes pendientes. ¡Todo en orden!" caption="Reportes de vacantes" />
      <Pagination total={filtered.length} page={page} limit={LIMIT} onPageChange={goToPage} />
    </div>
  );
}