// src/pages/Admin/UsuarioPerfil.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, FileText, Globe, Award, Accessibility, Building2, Briefcase, PauseCircle, PlayCircle } from 'lucide-react';
import { Badge, Button } from '../../assets/Componentes/Admin/UI';

const MOCK_USUARIO = {
  id: 1,
  nombres: 'Ana',
  apellidos: 'García Torres',
  correo: 'ana.garcia@email.com',
  telefono: '55-1234-5678',
  foto_perfil: null,
  rol: 'postulante',
  estado: 'activo',
  fecha_registro: '2026-01-10',
  postulante: {
    descripcion_discapacidad: 'Discapacidad visual parcial, uso de lectores de pantalla.',
    experiencia_laboral: '3 años como desarrolladora web en empresas de tecnología.',
    habilidades: 'React, JavaScript, Tailwind CSS, accesibilidad web, NVDA, JAWS.',
    esfuerzo_fisico_maximo: 'ligero',
    cv_url: 'https://example.com/cv-ana.pdf',
    portafolio_url: 'https://ana.dev',
    discapacidades: ['Visual'],
    certificaciones: [
      { id: 1, nombre_certificacion: 'React Developer', institucion: 'Meta', fecha_emision: '2025-06-01' },
      { id: 2, nombre_certificacion: 'Accesibilidad Web WCAG 2.1', institucion: 'W3C', fecha_emision: '2025-09-15' },
    ],
  },
};

const ESTADO_BADGE = { activo: 'success', suspendido: 'danger', inactivo: 'default' };
const ROL_BADGE = { administrador: 'purple', reclutador: 'info', postulante: 'default' };

function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />}
      <div>
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-white text-sm">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function UsuarioPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const u = MOCK_USUARIO;
  const isPostulante = u.rol === 'postulante';
  const isReclutador = u.rol === 'reclutador';
  const initials = `${u.nombres.charAt(0)}${u.apellidos.charAt(0)}`;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/admin/usuarios')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} /> Volver a Usuarios
      </button>

      {/* Profile header */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-violet-500/20 border-2 border-violet-500/40 flex items-center justify-center text-violet-300 text-2xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{u.nombres} {u.apellidos}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant={ROL_BADGE[u.rol]}>{u.rol}</Badge>
            <Badge variant={ESTADO_BADGE[u.estado]}>{u.estado}</Badge>
            <span className="text-slate-500 text-xs">Desde {new Date(u.fecha_registro).toLocaleDateString('es-MX')}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {u.estado === 'activo'
            ? <Button variant="danger" size="sm"><PauseCircle size={14} /> Suspender</Button>
            : <Button variant="success" size="sm"><PlayCircle size={14} /> Reactivar</Button>
          }
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información personal */}
        <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Información personal</h2>
          <div className="space-y-4">
            <InfoField label="Correo electrónico" value={u.correo} icon={Mail} />
            <InfoField label="Teléfono" value={u.telefono} icon={Phone} />
          </div>
        </section>

        {/* Si es postulante */}
        {isPostulante && u.postulante && (
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Accessibility size={16} className="text-violet-400" /> Discapacidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {u.postulante.discapacidades.map((d) => (
                <Badge key={d} variant="purple">{d}</Badge>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Postulante extended */}
      {isPostulante && u.postulante && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Perfil profesional</h2>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-xs mb-1">Experiencia laboral</p>
                <p className="text-white text-sm leading-relaxed">{u.postulante.experiencia_laboral}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Habilidades</p>
                <p className="text-white text-sm leading-relaxed">{u.postulante.habilidades}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Esfuerzo físico máximo</p>
                <Badge variant="info">{u.postulante.esfuerzo_fisico_maximo}</Badge>
              </div>
              <div className="flex gap-3">
                {u.postulante.cv_url && (
                  <a href={u.postulante.cv_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm"><FileText size={13} /> Ver CV</Button>
                  </a>
                )}
                {u.postulante.portafolio_url && (
                  <a href={u.postulante.portafolio_url} target="_blank" rel="noopener noreferrer">
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
            <ul className="space-y-3">
              {u.postulante.certificaciones.map((cert) => (
                <li key={cert.id} className="bg-slate-700/30 rounded-xl p-3">
                  <p className="text-white text-sm font-medium">{cert.nombre_certificacion}</p>
                  <p className="text-slate-400 text-xs">{cert.institucion}</p>
                  <p className="text-slate-500 text-xs mt-1">{new Date(cert.fecha_emision).toLocaleDateString('es-MX')}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}