// src/pages/Admin/Empresas.jsx
// Conectado al backend PHP real — empresas.php

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Eye, CheckCircle, XCircle,
  PauseCircle, PlayCircle, RefreshCw,
} from 'lucide-react';

import {
  PageHeader, Badge, Button,
  SearchBar, FilterTabs, ErrorBanner,
} from '../../assets/Componentes/Admin/UI';
import Table      from '../../assets/Componentes/Admin/Table';
import Pagination from '../../assets/Componentes/Admin/Pagination';
import Modal, { ModalFooter } from '../../assets/Componentes/Admin/Modal';

import { useSearch, usePagination } from '../../assets/Hook/Admin/useApi';
import { useEmpresas, useEmpresaAcciones } from '../../assets/Hook/Admin/useDomain';
import {
  confirmApprove, confirmSuspend, confirmAction,
  successAlert, errorAlert,
} from '../../assets/Componentes/Admin/alerts';

// ── Mapeo estado_validacion (int) → label + badge ────────────
const ESTADO_MAP = {
  0: { label: 'Pendiente',  variant: 'warning'  },
  1: { label: 'Aprobada',   variant: 'success'  },
  2: { label: 'Rechazada',  variant: 'danger'   },
  3: { label: 'Suspendida', variant: 'default'  },
};

const FILTROS = [
  { value: 'todas',  label: 'Todas'      },
  { value: '0',      label: 'Pendientes' },
  { value: '1',      label: 'Aprobadas'  },
  { value: '2',      label: 'Rechazadas' },
  { value: '3',      label: 'Suspendidas'},
];

const LIMITE = 15;

export default function Empresas() {
  const navigate = useNavigate();

  // ── Filtros / búsqueda / paginación ──────────────────────
  const { query, setQuery, debouncedQuery } = useSearch(400);
  const { page, goToPage, reset }           = usePagination(1, LIMITE);
  const [filtro, setFiltro]                 = useState('todas');

  // ── Modal rechazo ──────────────────────────────────────
  const [rejectModal, setRejectModal] = useState({ open: false, empresa: null });
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  // ── Construir query string para el hook ──────────────────
  const buildParams = useCallback(() => {
    const p = new URLSearchParams();
    if (filtro !== 'todas') p.set('estado', filtro);
    if (debouncedQuery)     p.set('buscar', debouncedQuery);
    p.set('pagina', String(page));
    p.set('limite', String(LIMITE));
    return '&' + p.toString();
  }, [filtro, debouncedQuery, page]);

  // ── Datos del backend ─────────────────────────────────────
  const { data, loading, error, refetch } = useEmpresas(buildParams());

  const empresas = data?.data?.empresas ?? [];
  const total    = data?.data?.total ?? 0;

  // ── Acciones ──────────────────────────────────────────────
  const { aprobar, rechazar, suspender, reactivar } = useEmpresaAcciones();
  const [accionId, setAccionId] = useState(null); // para spinner por fila

  // ── Aprobar ───────────────────────────────────────────────
  const handleAprobar = async (row) => {
    const ok = await confirmApprove(row.nombre_empresas);
    if (!ok) return;
    setAccionId(row.id_empresas);
    try {
      await aprobar(row.id_empresas);
      await refetch();
      successAlert('¡Aprobada!', `${row.nombre_empresas} ya puede operar en la plataforma.`);
    } catch {
      errorAlert('Error', 'No se pudo aprobar la empresa. Intenta de nuevo.');
    } finally {
      setAccionId(null);
    }
  };

  // ── Rechazar (con modal y motivo) ─────────────────────────
  const openRejectModal = (row) => {
    setMotivoRechazo('');
    setRejectModal({ open: true, empresa: row });
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) return;
    setRejectLoading(true);
    try {
      await rechazar(rejectModal.empresa.id_empresas, motivoRechazo);
      await refetch();
      setRejectModal({ open: false, empresa: null });
      successAlert('Rechazada', `${rejectModal.empresa.nombre_empresas} ha sido rechazada.`);
    } catch {
      errorAlert('Error', 'No se pudo rechazar la empresa.');
    } finally {
      setRejectLoading(false);
    }
  };

  // ── Suspender ──────────────────────────────────────────────
  const handleSuspender = async (row) => {
    const ok = await confirmSuspend(row.nombre_empresas);
    if (!ok) return;
    setAccionId(row.id_empresas);
    try {
      await suspender(row.id_empresas);
      await refetch();
      successAlert('Suspendida', `${row.nombre_empresas} ha sido suspendida.`);
    } catch {
      errorAlert('Error', 'No se pudo suspender la empresa.');
    } finally {
      setAccionId(null);
    }
  };

  // ── Reactivar (reutiliza endpoint aprobar) ─────────────────
  const handleReactivar = async (row) => {
    const ok = await confirmAction({
      title: '¿Reactivar empresa?',
      html: `<span>Se restaurará el acceso de <strong style="color:#fff">${row.nombre_empresas}</strong>.</span>`,
      confirmText: 'Reactivar',
      confirmColor: '#16a34a',
      icon: 'question',
    });
    if (!ok) return;
    setAccionId(row.id_empresas);
    try {
      await reactivar(row.id_empresas);
      await refetch();
      successAlert('¡Reactivada!', `${row.nombre_empresas} puede operar nuevamente.`);
    } catch {
      errorAlert('Error', 'No se pudo reactivar la empresa.');
    } finally {
      setAccionId(null);
    }
  };

  // ── Columnas ──────────────────────────────────────────────
  const COLS = [
    {
      key: 'nombre_empresas', label: 'Empresa', sortable: true,
      render: (v) => <span className="font-semibold text-white">{v}</span>,
    },
    { key: 'correo_empresa', label: 'Correo' },
    { key: 'telefono_empresa', label: 'Teléfono' },
    {
      key: 'sitio_web', label: 'Sitio web',
      render: (v) => v
        ? <a href={`https://${v}`} target="_blank" rel="noopener noreferrer"
             className="text-violet-400 hover:underline text-xs">{v}</a>
        : '—',
    },
    {
      key: 'total_reclutadores', label: 'Reclutadores',
      render: (v) => <span className="text-slate-300">{v}</span>,
    },
    {
      key: 'total_vacantes', label: 'Vacantes',
      render: (v) => <span className="text-slate-300">{v}</span>,
    },
    {
      key: 'estado_validacion', label: 'Estado',
      render: (v) => {
        const e = ESTADO_MAP[v] ?? ESTADO_MAP[0];
        return <Badge variant={e.variant}>{e.label}</Badge>;
      },
    },
    {
      key: 'fecha_registro', label: 'Registro',
      render: (v) => v ? new Date(v).toLocaleDateString('es-MX') : '—',
    },
    {
      key: 'acciones', label: 'Acciones',
      render: (_, row) => {
        const isLoading = accionId === row.id_empresas;
        const estado    = row.estado_validacion;
        return (
          <div className="flex items-center gap-1 flex-wrap">
            {/* Ver detalle */}
            <Button
              variant="ghost" size="sm"
              onClick={() => navigate(`/admin/empresas/${row.id_empresas}`)}
              aria-label="Ver detalle"
            >
              <Eye size={14} />
            </Button>

            {/* Aprobar — solo pendientes */}
            {estado === 0 && (
              <Button
                variant="success" size="sm"
                loading={isLoading} onClick={() => handleAprobar(row)}
                aria-label="Aprobar"
              >
                <CheckCircle size={14} />
              </Button>
            )}

            {/* Rechazar — pendientes y aprobadas */}
            {(estado === 0 || estado === 1) && (
              <Button
                variant="danger" size="sm"
                loading={isLoading} onClick={() => openRejectModal(row)}
                aria-label="Rechazar"
              >
                <XCircle size={14} />
              </Button>
            )}

            {/* Suspender — solo aprobadas */}
            {estado === 1 && (
              <Button
                variant="secondary" size="sm"
                loading={isLoading} onClick={() => handleSuspender(row)}
                aria-label="Suspender"
              >
                <PauseCircle size={14} />
              </Button>
            )}

            {/* Reactivar — rechazadas o suspendidas */}
            {(estado === 2 || estado === 3) && (
              <Button
                variant="success" size="sm"
                loading={isLoading} onClick={() => handleReactivar(row)}
                aria-label="Reactivar"
              >
                <PlayCircle size={14} />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-5 w-full">

      <PageHeader
        title="Gestión de Empresas"
        description="Administra y valida las empresas registradas en la plataforma"
        action={
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <Building2 size={15} /> {total} empresas
            </span>
            <Button
              variant="ghost" size="sm"
              onClick={refetch} disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Cargando…' : 'Actualizar'}
            </Button>
          </div>
        }
      />

      {/* Error banner */}
      <ErrorBanner message={error} />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <SearchBar
          value={query}
          onChange={(v) => { setQuery(v); reset(); }}
          placeholder="Buscar por nombre, correo o dirección…"
          className="sm:w-80"
        />
        <FilterTabs
          options={FILTROS}
          value={filtro}
          onChange={(v) => { setFiltro(v); reset(); }}
        />
      </div>

      {/* Tabla */}
      <Table
        columns={COLS}
        data={empresas}
        loading={loading}
        emptyMessage="No se encontraron empresas con los filtros aplicados."
        caption="Lista de empresas"
      />

      {/* Paginación */}
      <Pagination
        total={total}
        page={page}
        limit={LIMITE}
        onPageChange={goToPage}
      />

      {/* ── Modal: motivo de rechazo ── */}
      <Modal
        open={rejectModal.open}
        onClose={() => setRejectModal({ open: false, empresa: null })}
        title={`Rechazar empresa`}
        size="sm"
      >
        <p className="text-slate-300 text-sm mb-4">
          Estás rechazando a{' '}
          <strong className="text-white">{rejectModal.empresa?.nombre_empresas}</strong>.
          Ingresa el motivo (opcional pero recomendado):
        </p>

        <textarea
          value={motivoRechazo}
          onChange={(e) => setMotivoRechazo(e.target.value)}
          rows={3}
          placeholder="Ej: La información proporcionada es incompleta o inválida…"
          className="w-full bg-slate-700 border border-slate-600 text-white text-sm
                     rounded-lg px-3 py-2 outline-none focus:border-violet-500
                     transition-colors placeholder-slate-500 resize-none"
        />

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setRejectModal({ open: false, empresa: null })}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={rejectLoading}
            onClick={handleRechazar}
          >
            <XCircle size={14} /> Confirmar rechazo
          </Button>
        </ModalFooter>
      </Modal>

    </div>
  );
}
