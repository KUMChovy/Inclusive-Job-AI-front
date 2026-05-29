// src/pages/Admin/Vacantes.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, XCircle, Trash2 } from 'lucide-react';
import { PageHeader, Badge, Button, SearchBar, FilterTabs, Select } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import { useSearch, usePagination } from '../../assets/Hook/Admin/useApi';
import { confirmDelete, confirmAction, successAlert, errorAlert } from '../../assets/Componentes/Admin/alerts';

const MOCK_VACANTES = [
  { id: 1, titulo: 'Desarrollador Frontend', empresa: 'Tech Solutions SA',  modalidad: 'Remoto',     salario_min: 15000, salario_max: 25000, estado: 'activa',   fecha_publicacion: '2026-05-10' },
  { id: 2, titulo: 'Analista de Datos',       empresa: 'DataCorp MX',        modalidad: 'Híbrido',    salario_min: 18000, salario_max: 30000, estado: 'activa',   fecha_publicacion: '2026-05-12' },
  { id: 3, titulo: 'Diseñador UX/UI',         empresa: 'CreativeHub CDMX',   modalidad: 'Presencial', salario_min: 12000, salario_max: 20000, estado: 'activa',   fecha_publicacion: '2026-05-15' },
  { id: 4, titulo: 'Soporte Técnico',         empresa: 'HelpDesk Pro',       modalidad: 'Remoto',     salario_min: 10000, salario_max: 14000, estado: 'cerrada',  fecha_publicacion: '2026-05-01' },
  { id: 5, titulo: 'QA Engineer',             empresa: 'Tech Solutions SA',  modalidad: 'Híbrido',    salario_min: 20000, salario_max: 32000, estado: 'activa',   fecha_publicacion: '2026-05-08' },
  { id: 6, titulo: 'PM de Producto',          empresa: 'DataCorp MX',        modalidad: 'Presencial', salario_min: 25000, salario_max: 40000, estado: 'eliminada',fecha_publicacion: '2026-04-20' },
];

const ESTADO_BADGE = { activa: 'success', cerrada: 'default', eliminada: 'danger' };

const FILTROS = [
  { value: 'todas', label: 'Todas' },
  { value: 'activa',    label: 'Activas'    },
  { value: 'cerrada',   label: 'Cerradas'   },
  { value: 'eliminada', label: 'Eliminadas' },
];

const MODALIDADES = [
  { value: 'todas',       label: 'Todas las modalidades' },
  { value: 'Remoto',      label: 'Remoto'      },
  { value: 'Híbrido',     label: 'Híbrido'     },
  { value: 'Presencial',  label: 'Presencial'  },
];

export default function Vacantes() {
  const navigate = useNavigate();
  const { query, setQuery, debouncedQuery } = useSearch();
  const { page, goToPage, reset } = usePagination(1, 10);
  const [filtro, setFiltro]       = useState('todas');
  const [modalidad, setModalidad] = useState('todas');
  const [vacantes, setVacantes]   = useState(MOCK_VACANTES);
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = useMemo(() => {
    let list = vacantes;
    if (filtro !== 'todas')    list = list.filter((v) => v.estado === filtro);
    if (modalidad !== 'todas') list = list.filter((v) => v.modalidad === modalidad);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter((v) => v.titulo.toLowerCase().includes(q) || v.empresa.toLowerCase().includes(q));
    }
    return list;
  }, [vacantes, filtro, modalidad, debouncedQuery]);

  const LIMIT = 10;
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const updateEstado = (id, estado) =>
    setVacantes((prev) => prev.map((v) => v.id === id ? { ...v, estado } : v));

  const handleCerrar = async (row) => {
    const ok = await confirmAction({
      title: 'Cerrar vacante',
      html: `<span>La vacante <strong style="color:#fff">"${row.titulo}"</strong> dejará de recibir postulaciones.</span>`,
      confirmText: 'Cerrar vacante',
      confirmColor: '#475569',
      icon: 'warning',
    });
    if (!ok) return;
    setActionLoading(row.id);
    try {
      updateEstado(row.id, 'cerrada');
      await successAlert('Vacante cerrada', `"${row.titulo}" ya no recibe postulaciones.`);
    } catch {
      await errorAlert('Error', 'No se pudo cerrar la vacante.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEliminar = async (row) => {
    const ok = await confirmDelete(`"${row.titulo}"`);
    if (!ok) return;
    setActionLoading(row.id);
    try {
      setVacantes((prev) => prev.filter((v) => v.id !== row.id));
      await successAlert('Eliminada', `La vacante ha sido eliminada.`);
    } catch {
      await errorAlert('Error', 'No se pudo eliminar la vacante.');
    } finally {
      setActionLoading(null);
    }
  };

  const COLS = [
    { key: 'titulo',   label: 'Título', sortable: true, render: (v) => <span className="font-medium text-white">{v}</span> },
    { key: 'empresa',  label: 'Empresa' },
    { key: 'modalidad',label: 'Modalidad', render: (v) => <Badge variant="info">{v}</Badge> },
    { key: 'salario',  label: 'Salario',   render: (_, row) => `$${row.salario_min?.toLocaleString()} – $${row.salario_max?.toLocaleString()}` },
    { key: 'estado',   label: 'Estado',    render: (v) => <Badge variant={ESTADO_BADGE[v]}>{v}</Badge> },
    { key: 'fecha_publicacion', label: 'Publicación', render: (v) => new Date(v).toLocaleDateString('es-MX') },
    {
      key: 'acciones', label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/vacantes/${row.id}`)} aria-label="Ver">
            <Eye size={14} />
          </Button>
          {row.estado === 'activa' && (
            <Button variant="secondary" size="sm" loading={actionLoading === row.id} onClick={() => handleCerrar(row)} aria-label="Cerrar">
              <XCircle size={14} />
            </Button>
          )}
          <Button variant="danger" size="sm" loading={actionLoading === row.id} onClick={() => handleEliminar(row)} aria-label="Eliminar">
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <PageHeader
        title="Gestión de Vacantes"
        description="Visualiza y administra todas las vacantes publicadas"
        action={<span className="text-slate-400 text-sm">{filtered.length} vacantes</span>}
      />

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <SearchBar value={query} onChange={(v) => { setQuery(v); reset(); }} placeholder="Buscar por título o empresa..." className="sm:w-72" />
        <FilterTabs options={FILTROS} value={filtro} onChange={(v) => { setFiltro(v); reset(); }} />
        <Select value={modalidad} onChange={(v) => { setModalidad(v); reset(); }} options={MODALIDADES} className="sm:w-48" />
      </div>

      <Table columns={COLS} data={paginated} loading={false} emptyMessage="No se encontraron vacantes." caption="Vacantes registradas" />
      <Pagination total={filtered.length} page={page} limit={LIMIT} onPageChange={goToPage} />
    </div>
  );
}