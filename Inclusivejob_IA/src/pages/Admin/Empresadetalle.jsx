// src/pages/Admin/EmpresaDetalle.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, Mail, Phone, MapPin, CheckCircle, XCircle,
  PauseCircle, PlayCircle, User, Briefcase, RefreshCw, AlertTriangle,
} from 'lucide-react';

import { Badge, Button, ErrorBanner } from '../../assets/Componentes/Admin/UI';
import Modal, { ModalFooter } from '../../assets/Componentes/Admin/Modal';
import { useEmpresaAcciones, useEmpresaDetalle } from '../../assets/Hook/Admin/useDomain';
import {
  confirmApprove, confirmSuspend, confirmAction,
  successAlert, errorAlert,
} from '../../assets/Componentes/Admin/alerts';

const ESTADO_MAP = {
  0: { label: 'Pendiente', variant: 'warning' },
  1: { label: 'Aprobada', variant: 'success' },
  2: { label: 'Rechazada', variant: 'danger' },
  3: { label: 'Suspendida', variant: 'default' },
};

function estadoInfo(value) {
  return ESTADO_MAP[Number(value)] ?? ESTADO_MAP[0];
}

function safeDate(value, options = {}) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-MX', options);
}

function withProtocol(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function InfoRow({ icon: Icon, label, value, link }) {
  const display = value || '-';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/40 last:border-0">
      <div className="text-slate-400 mt-0.5"><Icon size={16} /></div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs mb-0.5">{label}</p>
        {link && value ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline text-sm break-all">
            {display}
          </a>
        ) : (
          <p className="text-white text-sm break-words">{display}</p>
        )}
      </div>
    </div>
  );
}

export default function EmpresaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useEmpresaDetalle(id);
  const { aprobar, rechazar, suspender, reactivar } = useEmpresaAcciones();

  const [accionLoading, setAccionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const detalle = data?.data ?? {};
  const empresa = detalle.empresa;
  const reclutadores = detalle.reclutadores ?? [];
  const vacantes = detalle.vacantes ?? [];
  const estado = Number(empresa?.estado_validacion ?? 0);
  const estadoActual = estadoInfo(estado);

  const runAction = async ({ name, request, successTitle, successText }) => {
    setAccionLoading(name);
    try {
      await request();
      await refetch();
      await successAlert(successTitle, successText);
    } catch {
      errorAlert('Error', 'No se pudo completar la acción. Intenta de nuevo.');
    } finally {
      setAccionLoading(null);
    }
  };

  const handleAprobar = async () => {
    const ok = await confirmApprove(empresa.nombre_empresas);
    if (!ok) return;
    runAction({
      name: 'aprobar',
      request: () => aprobar(empresa.id_empresas),
      successTitle: '¡Aprobada!',
      successText: `${empresa.nombre_empresas} ya puede operar en la plataforma.`,
    });
  };

  const handleSuspender = async () => {
    const ok = await confirmSuspend(empresa.nombre_empresas);
    if (!ok) return;
    runAction({
      name: 'suspender',
      request: () => suspender(empresa.id_empresas),
      successTitle: 'Suspendida',
      successText: `${empresa.nombre_empresas} ha sido suspendida.`,
    });
  };

  const handleReactivar = async () => {
    const ok = await confirmAction({
      title: '¿Reactivar empresa?',
      html: `<span>Se restaurará el acceso de <strong style="color:#fff">${empresa.nombre_empresas}</strong>.</span>`,
      confirmText: 'Reactivar',
      confirmColor: '#16a34a',
      icon: 'question',
    });
    if (!ok) return;
    runAction({
      name: 'reactivar',
      request: () => reactivar(empresa.id_empresas),
      successTitle: '¡Reactivada!',
      successText: `${empresa.nombre_empresas} puede operar nuevamente.`,
    });
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) return;
    setAccionLoading('rechazar');
    try {
      await rechazar(empresa.id_empresas, motivoRechazo);
      setRejectModal(false);
      setMotivoRechazo('');
      await refetch();
      await successAlert('Rechazada', `${empresa.nombre_empresas} ha sido rechazada.`);
    } catch {
      errorAlert('Error', 'No se pudo rechazar la empresa.');
    } finally {
      setAccionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="w-9 h-9 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !empresa) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/empresas')}>
          <ArrowLeft size={16} /> Volver
        </Button>
        <ErrorBanner message={error || 'No se encontró la empresa solicitada.'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/admin/empresas')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors"
          aria-label="Volver a empresas"
        >
          <ArrowLeft size={16} /> Volver a Empresas
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">{empresa.nombre_empresas}</h1>
            <div className="mt-1">
              <Badge variant={estadoActual.variant}>{estadoActual.label}</Badge>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCw size={14} /> Actualizar
            </Button>

            {estado === 0 && (
              <Button variant="success" size="sm" loading={accionLoading === 'aprobar'} onClick={handleAprobar}>
                <CheckCircle size={14} /> Aprobar
              </Button>
            )}

            {(estado === 0 || estado === 1) && (
              <Button variant="danger" size="sm" loading={accionLoading === 'rechazar'} onClick={() => setRejectModal(true)}>
                <XCircle size={14} /> Rechazar
              </Button>
            )}

            {estado === 1 && (
              <Button variant="secondary" size="sm" loading={accionLoading === 'suspender'} onClick={handleSuspender}>
                <PauseCircle size={14} /> Suspender
              </Button>
            )}

            {(estado === 2 || estado === 3) && (
              <Button variant="success" size="sm" loading={accionLoading === 'reactivar'} onClick={handleReactivar}>
                <PlayCircle size={14} /> Reactivar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Datos generales</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {empresa.descripcion || 'Sin descripción registrada.'}
            </p>
            <InfoRow icon={MapPin} label="Dirección" value={empresa.direccion} />
            <InfoRow icon={Mail} label="Correo" value={empresa.correo_empresa} link={`mailto:${empresa.correo_empresa}`} />
            <InfoRow icon={Phone} label="Teléfono" value={empresa.telefono_empresa} />
            <InfoRow icon={Globe} label="Sitio web" value={empresa.sitio_web} link={withProtocol(empresa.sitio_web)} />
          </section>

          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User size={16} className="text-violet-400" />
              Reclutadores ({reclutadores.length})
            </h2>

            {reclutadores.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay reclutadores registrados para esta empresa.</p>
            ) : (
              <ul className="space-y-3" role="list">
                {reclutadores.map((r) => {
                  const nombre = `${r.nombres ?? ''} ${r.apellidos ?? ''}`.trim() || 'Sin nombre';
                  return (
                    <li key={r.id_reclutador} className="flex items-center gap-3 bg-slate-700/30 rounded-xl p-3">
                      <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-sm flex-shrink-0">
                        {nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{nombre}</p>
                        <p className="text-slate-400 text-xs truncate">{r.puesto || 'Sin puesto'}</p>
                        <p className="text-slate-500 text-xs truncate">{r.correo || '-'}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Información de registro
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-xs mb-1">Estado de validación</p>
                <Badge variant={estadoActual.variant}>{estadoActual.label}</Badge>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Fecha de registro</p>
                <p className="text-white text-sm">
                  {safeDate(empresa.fecha_registro_empres, { dateStyle: 'long' })}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-violet-400" />
              Vacantes ({vacantes.length})
            </h2>

            {vacantes.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay vacantes recientes para esta empresa.</p>
            ) : (
              <ul className="space-y-2" role="list">
                {vacantes.map((v) => (
                  <li
                    key={v.id_vacante}
                    className="flex items-center justify-between gap-3 bg-slate-700/30 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-slate-700/50 transition-colors"
                    onClick={() => navigate(`/admin/vacantes/${v.id_vacante}`)}
                  >
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{v.titulo_puesto}</p>
                      <p className="text-slate-400 text-xs truncate">
                        {v.modalidad || '-'} · {safeDate(v.fecha_publicacion)}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {Number(v.total_postulaciones ?? 0)} postulaciones
                      </p>
                    </div>
                    <Badge variant={v.estado === 'activa' ? 'success' : 'default'}>{v.estado}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <Modal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        title="Rechazar empresa"
        size="sm"
      >
        <p className="text-slate-300 text-sm mb-4">
          Estás rechazando a <strong className="text-white">{empresa.nombre_empresas}</strong>.
          Ingresa el motivo:
        </p>

        <textarea
          value={motivoRechazo}
          onChange={(e) => setMotivoRechazo(e.target.value)}
          rows={3}
          placeholder="Ej: La información proporcionada es incompleta o inválida..."
          className="w-full bg-slate-700 border border-slate-600 text-white text-sm
                     rounded-lg px-3 py-2 outline-none focus:border-violet-500
                     transition-colors placeholder-slate-500 resize-none"
        />

        <ModalFooter>
          <Button variant="ghost" onClick={() => setRejectModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={accionLoading === 'rechazar'}
            disabled={!motivoRechazo.trim()}
            onClick={handleRechazar}
          >
            <XCircle size={14} /> Confirmar rechazo
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
