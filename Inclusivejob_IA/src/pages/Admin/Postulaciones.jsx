// src/pages/Admin/Postulaciones.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { PageHeader, Badge, Button, SearchBar, FilterTabs } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import { useSearch, usePagination } from '../../assets/Hook/Admin/useApi';

const MOCK_POSTULACIONES = [
  { id: 1, postulante: 'Ana García Torres', vacante: 'Desarrollador Frontend', empresa: 'Tech Solutions SA', estado: 'pendiente', fecha_postulacion: '2026-05-12' },
  { id: 2, postulante: 'Carlos Mendoza', vacante: 'Analista de Datos', empresa: 'DataCorp MX', estado: 'entrevista', fecha_postulacion: '2026-05-13' },
  { id: 3, postulante: 'María Hernández', vacante: 'Diseñador UX/UI', empresa: 'CreativeHub CDMX', estado: 'aceptado', fecha_postulacion: '2026-05-14' },
  { id: 4, postulante: 'José Torres', vacante: 'QA Engineer', empresa: 'Tech Solutions SA', estado: 'rechazado', fecha_postulacion: '2026-05-10' },
  { id: 5, postulante: 'Patricia Sánchez', vacante: 'Soporte Técnico', empresa: 'HelpDesk Pro', estado: 'pendiente', fecha_postulacion: '2026-05-15' },
];

const ESTADO_BADGE = {
  pendiente: 'warning', entrevista: 'info', aceptado: 'success', rechazado: 'danger',
};

const FILTROS = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'entrevista', label: 'En entrevista' },
  { value: 'aceptado', label: 'Aceptadas' },
  { value: 'rechazado', label: 'Rechazadas' },
];

export default function Postulaciones() {
  const navigate = useNavigate();
  const { query, setQuery, debouncedQuery } = useSearch();
  const { page, goToPage, reset } = usePagination(1, 10);
  const [filtro, setFiltro] = useState('todas');

  const filtered = useMemo(() => {
    let list = MOCK_POSTULACIONES;
    if (filtro !== 'todas') list = list.filter((p) => p.estado === filtro);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.postulante.toLowerCase().includes(q) ||
          p.vacante.toLowerCase().includes(q) ||
          p.empresa.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filtro, debouncedQuery]);

  const LIMIT = 10;
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const COLS = [
    { key: 'postulante', label: 'Postulante', render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'vacante', label: 'Vacante' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'estado', label: 'Estado', render: (v) => <Badge variant={ESTADO_BADGE[v]}>{v}</Badge> },
    { key: 'fecha_postulacion', label: 'Fecha', render: (v) => new Date(v).toLocaleDateString('es-MX') },
    {
      key: 'acciones', label: 'Acciones', render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/postulaciones/${row.id}`)} aria-label="Ver detalle">
          <Eye size={14} />
        </Button>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gestión de Postulaciones"
        description="Visualiza todas las postulaciones del sistema"
        action={<span className="text-slate-400 text-sm">{filtered.length} postulaciones</span>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={query}
          onChange={(v) => { setQuery(v); reset(); }}
          placeholder="Buscar postulante, vacante o empresa..."
          className="sm:w-72"
        />
        <FilterTabs options={FILTROS} value={filtro} onChange={(v) => { setFiltro(v); reset(); }} />
      </div>

      <Table columns={COLS} data={paginated} loading={false} emptyMessage="No se encontraron postulaciones." caption="Postulaciones del sistema" />
      <Pagination total={filtered.length} page={page} limit={LIMIT} onPageChange={goToPage} />
    </div>
  );
}