// src/pages/Admin/UsuarioPerfil.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, FileText, Globe, Award, Accessibility,
  Building2, Briefcase, PauseCircle, PlayCircle, RefreshCw, User,
} from 'lucide-react';

import { Badge, Button, ErrorBanner } from '../../assets/Componentes/Admin/UI';
import { useUsuarioAcciones, useUsuarioDetalle } from '../../assets/Hook/Admin/useDomain';
import { confirmSuspend, confirmAction, successAlert, errorAlert } from '../../assets/Componentes/Admin/alerts';

const ESTADO_BADGE = { activo: 'success', suspendido: 'danger', inactivo: 'default' };
const ROL_BADGE = { administrador: 'purple', reclutador: 'info', postulante: 'default' };

function nombreCompleto(user) {
  return `${user?.nombres ?? ''} ${user?.apellidos ?? ''}`.trim() || 'Sin nombre';
}

function initials(user) {
  const first = user?.nombres?.charAt(0) ?? 'U';
  const last = user?.apellidos?.charAt(0) ?? '';
  return `${first}${last}`.toUpperCase();
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

function InfoField({ label, value, icon: Icon, link }) {
  const display = value || '-';
  return (
    <div className="flex items-start gap-3 min-w-0">
      {Icon && <Icon size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />}
      <div className="min-w-0">
        <p className="text-slate-400 text-xs">{label}</p>
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

function TextBlock({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white text-sm leading-relaxed">{value || '-'}</p>
    </div>
  );
}

export default function UsuarioPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useUsuarioDetalle(id);
  const { suspender, reactivar } = useUsuarioAcciones();
  const [actionLoading, setActionLoading] = useState(null);

  const detalle = data?.data ?? {};
  const usuario = detalle.usuario;
  const postulante = detalle.postulante;
  const reclutador = detalle.reclutador;
  const discapacidades = detalle.discapacidades ?? [];
  const certificaciones = detalle.certificaciones ?? [];
  const postulaciones = detalle.postulaciones ?? [];
  const vacantes = detalle.vacantes ?? [];

  const isPostulante = usuario?.rol === 'postulante';
  const isReclutador = usuario?.rol === 'reclutador';

  const runAction = async ({ type, request, title, text }) => {
    setActionLoading(type);
    try {
      await request();
      await refetch();
      successAlert(title, text);
    } catch {
      errorAlert('Error', 'No se pudo completar la acción.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspender = async () => {
    const name = nombreCompleto(usuario);
    const ok = await confirmSuspend(name);
    if (!ok) return;
    runAction({
      type: 'suspender',
      request: () => suspender(usuario.id_usuario),
      title: 'Suspendido',
      text: `${name} ha sido suspendido.`,
    });
  };

  const handleReactivar = async () => {
    const name = nombreCompleto(usuario);
    const ok = await confirmAction({
      title: '¿Reactivar usuario?',
      html: `<span>Se restaurará el acceso de <strong style="color:#fff">${name}</strong>.</span>`,
      confirmText: 'Reactivar',
      confirmColor: '#16a34a',
      icon: 'question',
    });
    if (!ok) return;
    runAction({
      type: 'reactivar',
      request: () => reactivar(usuario.id_usuario),
      title: '¡Reactivado!',
      text: `${name} puede acceder nuevamente.`,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="w-9 h-9 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/usuarios')}>
          <ArrowLeft size={16} /> Volver
        </Button>
        <ErrorBanner message={error || 'No se encontró el usuario solicitado.'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/admin/usuarios')}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Volver a Usuarios
      </button>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-violet-500/20 border-2 border-violet-500/40 flex items-center justify-center text-violet-300 text-2xl font-bold flex-shrink-0 overflow-hidden">
          {usuario.foto_perfil ? (
            <img src={usuario.foto_perfil} alt="" className="w-full h-full object-cover" />
          ) : (
            initials(usuario)
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{nombreCompleto(usuario)}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant={ROL_BADGE[usuario.rol] ?? 'default'}>{usuario.rol}</Badge>
            <Badge variant={ESTADO_BADGE[usuario.estado] ?? 'default'}>{usuario.estado}</Badge>
            <span className="text-slate-500 text-xs">Desde {safeDate(usuario.fecha_registro)}</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw size={14} /> Actualizar
          </Button>
          {usuario.estado === 'activo' ? (
            <Button variant="danger" size="sm" loading={actionLoading === 'suspender'} onClick={handleSuspender}>
              <PauseCircle size={14} /> Suspender
            </Button>
          ) : (
            <Button variant="success" size="sm" loading={actionLoading === 'reactivar'} onClick={handleReactivar}>
              <PlayCircle size={14} /> Reactivar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <User size={16} className="text-violet-400" /> Información personal
          </h2>
          <div className="space-y-4">
            <InfoField label="Correo electrónico" value={usuario.correo} icon={Mail} link={`mailto:${usuario.correo}`} />
            <InfoField label="Teléfono" value={usuario.telefono} icon={Phone} />
            <InfoField label="Fecha de registro" value={safeDate(usuario.fecha_registro, { dateStyle: 'long' })} />
          </div>
        </section>

        {isReclutador && (
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-violet-400" /> Reclutador
            </h2>
            <div className="space-y-4">
              <InfoField label="Puesto" value={reclutador?.puesto} />
              <InfoField label="Empresa" value={reclutador?.nombre_empresas} icon={Building2} />
              <InfoField label="Correo empresa" value={reclutador?.correo_empresa} icon={Mail} />
            </div>
          </section>
        )}

        {isPostulante && (
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Accessibility size={16} className="text-violet-400" /> Discapacidades
            </h2>
            {discapacidades.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay discapacidades registradas.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {discapacidades.map((item) => (
                  <Badge key={item.id_discapacidad ?? item.nombre ?? item} variant="purple">
                    {item.nombre ?? item}
                  </Badge>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {isPostulante && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Perfil profesional</h2>
            <div className="space-y-4">
              <TextBlock label="Descripción de discapacidad" value={postulante?.descripcion_discapacidad} />
              <TextBlock label="Experiencia laboral" value={postulante?.experiencia_laboral} />
              <TextBlock label="Habilidades" value={postulante?.habilidades} />
              <div>
                <p className="text-slate-400 text-xs mb-1">Esfuerzo físico máximo</p>
                <Badge variant="info">{postulante?.esfuerzo_fisico_maximo || '-'}</Badge>
              </div>
              <div className="flex gap-3 flex-wrap">
                {postulante?.cv_url && (
                  <a href={withProtocol(postulante.cv_url)} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm"><FileText size={13} /> Ver CV</Button>
                  </a>
                )}
                {postulante?.portafolio_url && (
                  <a href={withProtocol(postulante.portafolio_url)} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm"><Globe size={13} /> Portafolio</Button>
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Award size={16} className="text-violet-400" /> Certificaciones
            </h2>
            {certificaciones.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay certificaciones registradas.</p>
            ) : (
              <ul className="space-y-3">
                {certificaciones.map((cert) => (
                  <li key={cert.id_certificacion ?? cert.id} className="bg-slate-700/30 rounded-xl p-3">
                    <p className="text-white text-sm font-medium">{cert.nombre_certificacion ?? cert.nombre}</p>
                    <p className="text-slate-400 text-xs">{cert.institucion}</p>
                    <p className="text-slate-500 text-xs mt-1">{safeDate(cert.fecha_emision)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isPostulante && (
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-violet-400" /> Postulaciones recientes
            </h2>
            {postulaciones.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay postulaciones recientes.</p>
            ) : (
              <ul className="space-y-2">
                {postulaciones.map((p) => (
                  <li key={p.id_postulacion} className="bg-slate-700/30 rounded-xl px-3 py-2.5">
                    <p className="text-white text-sm font-medium">{p.titulo_puesto}</p>
                    <p className="text-slate-400 text-xs">{p.empresa || '-'} · {safeDate(p.fecha_postulacion)}</p>
                    <Badge variant="info">{p.estado}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {isReclutador && (
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-violet-400" /> Vacantes recientes
            </h2>
            {vacantes.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay vacantes recientes.</p>
            ) : (
              <ul className="space-y-2">
                {vacantes.map((v) => (
                  <li key={v.id_vacante} className="bg-slate-700/30 rounded-xl px-3 py-2.5">
                    <p className="text-white text-sm font-medium">{v.titulo_puesto}</p>
                    <p className="text-slate-400 text-xs">{v.modalidad || '-'} · {safeDate(v.fecha_publicacion)}</p>
                    <Badge variant={v.estado === 'activa' ? 'success' : 'default'}>{v.estado}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
