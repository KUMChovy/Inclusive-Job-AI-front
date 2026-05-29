// src/pages/Admin/Usuarios.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, PauseCircle, PlayCircle } from 'lucide-react';
import { PageHeader, Badge, Button, SearchBar, FilterTabs } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import { useSearch, usePagination } from '../../assets/Hook/Admin/useApi';
import { confirmSuspend, confirmAction, successAlert, errorAlert } from '../../assets/Componentes/Admin/alerts';

const MOCK_USUARIOS = [
  { id: 1, nombres: 'Ana',      apellidos: 'García Torres',    correo: 'ana.garcia@email.com',    rol: 'postulante',     estado: 'activo',     fecha_registro: '2026-01-10' },
  { id: 2, nombres: 'Carlos',   apellidos: 'Ramírez López',    correo: 'carlos.rl@empresa.mx',    rol: 'reclutador',     estado: 'activo',     fecha_registro: '2026-01-15' },
  { id: 3, nombres: 'María',    apellidos: 'Hernández Díaz',   correo: 'mhernandez@email.com',    rol: 'postulante',     estado: 'activo',     fecha_registro: '2026-02-03' },
  { id: 4, nombres: 'Luis',     apellidos: 'Martínez Pérez',   correo: 'lmartinez@corp.mx',       rol: 'reclutador',     estado: 'suspendido', fecha_registro: '2026-02-20' },
  { id: 5, nombres: 'José',     apellidos: 'López Morales',    correo: 'jlopez@admin.mx',         rol: 'administrador',  estado: 'activo',     fecha_registro: '2025-12-01' },
  { id: 6, nombres: 'Patricia', apellidos: 'Sánchez Ruiz',     correo: 'patricia.sr@email.com',   rol: 'postulante',     estado: 'inactivo',   fecha_registro: '2026-03-11' },
];

const ROL_BADGE    = { administrador: 'purple', reclutador: 'info', postulante: 'default' };
const ESTADO_BADGE = { activo: 'success', suspendido: 'danger', inactivo: 'default' };

const FILTROS_ROL = [
  { value: 'todos', label: 'Todos' },
  { value: 'administrador', label: 'Admins' },
  { value: 'reclutador', label: 'Reclutadores' },
  { value: 'postulante', label: 'Postulantes' },
];

const FILTROS_ESTADO = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'suspendido', label: 'Suspendidos' },
  { value: 'inactivo', label: 'Inactivos' },
];

export default function Usuarios() {
  const navigate = useNavigate();
  const { query, setQuery, debouncedQuery } = useSearch();
  const { page, goToPage, reset } = usePagination(1, 10);
  const [rolFiltro, setRolFiltro]       = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [usuarios, setUsuarios]         = useState(MOCK_USUARIOS);
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = useMemo(() => {
    let list = usuarios;
    if (rolFiltro !== 'todos')    list = list.filter((u) => u.rol === rolFiltro);
    if (estadoFiltro !== 'todos') list = list.filter((u) => u.estado === estadoFiltro);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (u) => `${u.nombres} ${u.apellidos}`.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q),
      );
    }
    return list;
  }, [usuarios, rolFiltro, estadoFiltro, debouncedQuery]);

  const LIMIT = 10;
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const updateEstado = (id, estado) =>
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, estado } : u));

  const handleSuspender = async (row) => {
    const ok = await confirmSuspend(`${row.nombres} ${row.apellidos}`);
    if (!ok) return;
    setActionLoading(row.id);
    try {
      updateEstado(row.id, 'suspendido');
      await successAlert('Suspendido', `${row.nombres} ${row.apellidos} ha sido suspendido.`);
    } catch {
      await errorAlert('Error', 'No se pudo suspender al usuario.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivar = async (row) => {
    const ok = await confirmAction({
      title: '¿Reactivar usuario?',
      html: `<span>Se restaurará el acceso de <strong style="color:#fff">${row.nombres} ${row.apellidos}</strong>.</span>`,
      confirmText: 'Reactivar',
      confirmColor: '#16a34a',
      icon: 'question',
    });
    if (!ok) return;
    setActionLoading(row.id);
    try {
      updateEstado(row.id, 'activo');
      await successAlert('¡Reactivado!', `${row.nombres} ${row.apellidos} puede acceder nuevamente.`);
    } catch {
      await errorAlert('Error', 'No se pudo reactivar al usuario.');
    } finally {
      setActionLoading(null);
    }
  };

  const COLS = [
    {
      key: 'nombre_completo', label: 'Nombre completo',
      render: (_, row) => <span className="text-white font-medium">{row.nombres} {row.apellidos}</span>,
    },
    { key: 'correo', label: 'Correo' },
    { key: 'rol',    label: 'Rol',    render: (v) => <Badge variant={ROL_BADGE[v]}>{v}</Badge> },
    { key: 'estado', label: 'Estado', render: (v) => <Badge variant={ESTADO_BADGE[v]}>{v}</Badge> },
    { key: 'fecha_registro', label: 'Registro', render: (v) => new Date(v).toLocaleDateString('es-MX') },
    {
      key: 'acciones', label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/usuarios/${row.id}`)} aria-label="Ver perfil">
            <Eye size={14} />
          </Button>
          {row.estado === 'activo' ? (
            <Button variant="danger" size="sm" loading={actionLoading === row.id} onClick={() => handleSuspender(row)} aria-label="Suspender">
              <PauseCircle size={14} />
            </Button>
          ) : (
            <Button variant="success" size="sm" loading={actionLoading === row.id} onClick={() => handleReactivar(row)} aria-label="Reactivar">
              <PlayCircle size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra los usuarios registrados en la plataforma"
        action={<span className="text-slate-400 text-sm">{filtered.length} usuarios</span>}
      />

      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={(v) => { setQuery(v); reset(); }} placeholder="Buscar por nombre o correo..." className="sm:w-72" />
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <FilterTabs options={FILTROS_ROL}    value={rolFiltro}    onChange={(v) => { setRolFiltro(v);    reset(); }} />
          <FilterTabs options={FILTROS_ESTADO} value={estadoFiltro} onChange={(v) => { setEstadoFiltro(v); reset(); }} />
        </div>
      </div>

      <Table columns={COLS} data={paginated} loading={false} emptyMessage="No se encontraron usuarios." caption="Usuarios registrados" />
      <Pagination total={filtered.length} page={page} limit={LIMIT} onPageChange={goToPage} />
    </div>
  );
}