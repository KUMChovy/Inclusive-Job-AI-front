// src/pages/Admin/Empresas.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { PageHeader, Badge, Button, SearchBar, FilterTabs } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import { useSearch, usePagination } from '../../assets/Hook/Admin/useApi';
import { confirmApprove, confirmReject, confirmSuspend, successAlert, errorAlert } from '../../assets/Componentes/Admin/alerts';

const MOCK_EMPRESAS = [
  { id: 1, nombre_empresa: 'Tech Solutions SA',      correo_empresa: 'info@techsol.mx',        telefono: '55-1234-5678', sitio_web: 'techsol.mx',      estado_validacion: 'aprobada',   fecha_registro: '2026-01-15' },
  { id: 2, nombre_empresa: 'DataCorp MX',             correo_empresa: 'rrhh@datacorp.mx',        telefono: '55-9876-5432', sitio_web: 'datacorp.mx',      estado_validacion: 'aprobada',   fecha_registro: '2026-02-03' },
  { id: 3, nombre_empresa: 'Innovatech MX',           correo_empresa: 'contacto@innovatech.mx',  telefono: '55-4567-8901', sitio_web: 'innovatech.mx',    estado_validacion: 'pendiente',  fecha_registro: '2026-05-20' },
  { id: 4, nombre_empresa: 'Grupo Empresarial Norte', correo_empresa: 'rrhh@genorte.com',        telefono: '81-2345-6789', sitio_web: 'genorte.com',      estado_validacion: 'pendiente',  fecha_registro: '2026-05-19' },
  { id: 5, nombre_empresa: 'CreativeHub CDMX',        correo_empresa: 'hola@creativehub.mx',     telefono: '55-3456-7890', sitio_web: 'creativehub.mx',   estado_validacion: 'rechazada',  fecha_registro: '2026-03-11' },
  { id: 6, nombre_empresa: 'HelpDesk Pro',            correo_empresa: 'admin@helpdesk.pro',      telefono: '55-6789-0123', sitio_web: 'helpdesk.pro',     estado_validacion: 'suspendida', fecha_registro: '2026-04-01' },
];

const ESTADO_BADGE = { aprobada: 'success', pendiente: 'warning', rechazada: 'danger', suspendida: 'default' };

const FILTROS = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobada', label: 'Aprobadas' },
  { value: 'rechazada', label: 'Rechazadas' },
  { value: 'suspendida', label: 'Suspendidas' },
];

export default function Empresas() {
  const navigate = useNavigate();
  const { query, setQuery, debouncedQuery } = useSearch();
  const { page, goToPage, reset } = usePagination(1, 10);
  const [filtro, setFiltro] = useState('todas');
  const [empresas, setEmpresas] = useState(MOCK_EMPRESAS);
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = useMemo(() => {
    let list = empresas;
    if (filtro !== 'todas') list = list.filter((e) => e.estado_validacion === filtro);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (e) => e.nombre_empresa.toLowerCase().includes(q) || e.correo_empresa.toLowerCase().includes(q),
      );
    }
    return list;
  }, [empresas, filtro, debouncedQuery]);

  const LIMIT = 10;
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const updateEstado = (id, nuevoEstado) =>
    setEmpresas((prev) => prev.map((e) => e.id === id ? { ...e, estado_validacion: nuevoEstado } : e));

  const handleAprobar = async (row) => {
    const ok = await confirmApprove(row.nombre_empresa);
    if (!ok) return;
    setActionLoading(row.id);
    try {
      // await apiAprobar(row.id); // API real
      updateEstado(row.id, 'aprobada');
      await successAlert('¡Aprobada!', `${row.nombre_empresa} ya puede operar en la plataforma.`);
    } catch {
      await errorAlert('Error', 'No se pudo aprobar la empresa.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRechazar = async (row) => {
    const ok = await confirmReject(row.nombre_empresa);
    if (!ok) return;
    setActionLoading(row.id);
    try {
      updateEstado(row.id, 'rechazada');
      await successAlert('Rechazada', `${row.nombre_empresa} ha sido rechazada.`);
    } catch {
      await errorAlert('Error', 'No se pudo rechazar la empresa.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspender = async (row) => {
    const ok = await confirmSuspend(row.nombre_empresa);
    if (!ok) return;
    setActionLoading(row.id);
    try {
      updateEstado(row.id, 'suspendida');
      await successAlert('Suspendida', `${row.nombre_empresa} ha sido suspendida.`);
    } catch {
      await errorAlert('Error', 'No se pudo suspender la empresa.');
    } finally {
      setActionLoading(null);
    }
  };

  const COLS = [
    { key: 'nombre_empresa',    label: 'Empresa',    sortable: true, render: (v) => <span className="font-medium text-white">{v}</span> },
    { key: 'correo_empresa',    label: 'Correo' },
    { key: 'telefono',          label: 'Teléfono' },
    { key: 'sitio_web',         label: 'Sitio web',  render: (v) => <a href={`https://${v}`} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline text-xs">{v}</a> },
    { key: 'estado_validacion', label: 'Estado',     render: (v) => <Badge variant={ESTADO_BADGE[v]}>{v}</Badge> },
    { key: 'fecha_registro',    label: 'Registro',   render: (v) => new Date(v).toLocaleDateString('es-MX') },
    {
      key: 'acciones', label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/empresas/${row.id}`)} aria-label="Ver detalle">
            <Eye size={14} />
          </Button>
          {row.estado_validacion === 'pendiente' && (
            <Button variant="success" size="sm" loading={actionLoading === row.id} onClick={() => handleAprobar(row)} aria-label="Aprobar">
              <CheckCircle size={14} />
            </Button>
          )}
          {row.estado_validacion !== 'rechazada' && (
            <Button variant="danger" size="sm" loading={actionLoading === row.id} onClick={() => handleRechazar(row)} aria-label="Rechazar">
              <XCircle size={14} />
            </Button>
          )}
          {row.estado_validacion === 'aprobada' && (
            <Button variant="secondary" size="sm" loading={actionLoading === row.id} onClick={() => handleSuspender(row)} aria-label="Suspender">
              <PauseCircle size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <PageHeader
        title="Gestión de Empresas"
        description="Administra y valida las empresas registradas en la plataforma"
        action={<div className="flex items-center gap-2 text-slate-400 text-sm"><Building2 size={16} />{filtered.length} empresas</div>}
      />

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <SearchBar value={query} onChange={(v) => { setQuery(v); reset(); }} placeholder="Buscar empresa o correo..." className="sm:w-72" />
        <FilterTabs options={FILTROS} value={filtro} onChange={(v) => { setFiltro(v); reset(); }} />
      </div>

      <Table columns={COLS} data={paginated} loading={false} emptyMessage="No se encontraron empresas." caption="Lista de empresas" />
      <Pagination total={filtered.length} page={page} limit={LIMIT} onPageChange={goToPage} />
    </div>
  );
}