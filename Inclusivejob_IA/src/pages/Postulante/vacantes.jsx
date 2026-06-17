import { useMemo, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Accessibility,
  MapPin,
  Briefcase,
  ChevronRight,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  Bookmark,
  Calendar,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { postulantTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { postulantNav } from '../../assets/Componentes/Portal/navItems';

// ── Mock user ──────────────────────────────────────────────
const MOCK_USER = {
  nombre: 'Ana García Torres',
  rol: 'Postulante',
  discapacidades: ['Visual'],
  completado: 72,
};

// ── Vacantes disponibles ───────────────────────────────────
const VACANTES_RECOMENDADAS = [
  {
    id: 1,
    titulo_puesto: 'Frontend React Developer',
    empresa: 'Innovatech MX',
    salario_min: 18000,
    salario_max: 28000,
    modalidad: 'Remoto',
    match: 96,
    discapacidades: ['Visual', 'Auditiva'],
    estado: 'Activa',
    fecha_publicacion: '2026-06-01',
    fecha_cierre: '2026-06-30',
    descripcion_puesto:
      'Buscamos un desarrollador Frontend con experiencia en React para integrarse a nuestro equipo de producto. Serás responsable de construir interfaces accesibles, colaborar con el equipo de diseño y mantener componentes reutilizables de alto rendimiento. El rol es 100% remoto con horario flexible orientado a resultados.',
    requisitos: [
      '2+ años de experiencia con React y ecosistema (Hooks, Context, React Router)',
      'Conocimiento de accesibilidad web (WCAG 2.1 nivel AA)',
      'Manejo de TypeScript y herramientas de testing (Jest, React Testing Library)',
      'Inglés intermedio para lectura de documentación técnica',
      'Capacidad para trabajar de forma autónoma y comunicar avances',
    ],
  },
  {
    id: 2,
    titulo_puesto: 'Tester Automatizado',
    empresa: 'SoftQA CDMX',
    salario_min: 14000,
    salario_max: 20000,
    modalidad: 'Híbrido',
    match: 88,
    discapacidades: ['Visual', 'Motriz'],
    estado: 'Activa',
    fecha_publicacion: '2026-06-02',
    fecha_cierre: '2026-07-02',
    descripcion_puesto:
      'Buscamos un Tester Automatizado para unirse a nuestro equipo de QA. Serás responsable de diseñar, desarrollar y mantener scripts de prueba automatizados para garantizar la calidad del software.',
    requisitos: [
      '1+ año de experiencia en pruebas automatizadas',
      'Conocimiento de Selenium, Cypress o herramientas similares',
      'Experiencia con metodologías ágiles (Scrum, Kanban)',
      'Habilidad para documentar casos de prueba de forma clara',
    ],
  },
  {
    id: 3,
    titulo_puesto: 'Analista de Datos Jr.',
    empresa: 'DataWave México',
    salario_min: 16000,
    salario_max: 22000,
    modalidad: 'Remoto',
    match: 81,
    discapacidades: ['Visual'],
    estado: 'Activa',
    fecha_publicacion: '2026-06-03',
    fecha_cierre: '2026-07-03',
    descripcion_puesto:
      'Únete a DataWave como Analista de Datos Jr. Apoyarás en la recopilación, limpieza y análisis de datos para generar insights que respalden la toma de decisiones del negocio.',
    requisitos: [
      'Conocimientos en SQL y manejo de bases de datos',
      'Experiencia básica con Python o R para análisis de datos',
      'Manejo de herramientas de visualización (Power BI, Tableau)',
      'Atención al detalle y pensamiento analítico',
    ],
  },
  {
    id: 4,
    titulo_puesto: 'Soporte Técnico Nivel 1',
    empresa: 'HelpDesk Solutions',
    salario_min: 13000,
    salario_max: 18000,
    modalidad: 'Remoto',
    match: 90,
    discapacidades: ['Auditiva', 'Motriz'],
    estado: 'Activa',
    fecha_publicacion: '2026-06-04',
    fecha_cierre: '2026-06-25',
    descripcion_puesto:
      'Brinda soporte técnico de primer nivel a usuarios internos y externos. Resolverás incidencias, darás seguimiento a tickets y escalarás casos complejos al equipo especializado.',
    requisitos: [
      'Experiencia previa en soporte técnico o help desk',
      'Conocimientos de sistemas operativos Windows y macOS',
      'Habilidades de comunicación escrita y verbal',
      'Disponibilidad para turnos rotativos',
    ],
  },
  {
    id: 5,
    titulo_puesto: 'Auxiliar Administrativo',
    empresa: 'Servicios Empresariales Roma',
    salario_min: 10000,
    salario_max: 14000,
    modalidad: 'Presencial',
    match: 74,
    discapacidades: ['Motriz'],
    estado: 'Activa',
    fecha_publicacion: '2026-06-05',
    fecha_cierre: '2026-06-20',
    descripcion_puesto:
      'Apoya las labores administrativas del área contable y de recursos humanos. Gestionarás documentación, agendarás citas y darás seguimiento a trámites internos.',
    requisitos: [
      'Manejo de paquetería Office (Word, Excel, Outlook)',
      'Organización y gestión del tiempo',
      'Experiencia mínima de 6 meses en puestos similares',
      'Residencia en CDMX o zona metropolitana',
    ],
  },
  {
    id: 6,
    titulo_puesto: 'Diseñador UX/UI Jr.',
    empresa: 'CreativeHub CDMX',
    salario_min: 15000,
    salario_max: 21000,
    modalidad: 'Híbrido',
    match: 84,
    discapacidades: ['Visual', 'Cognitiva'],
    estado: 'Activa',
    fecha_publicacion: '2026-06-06',
    fecha_cierre: '2026-07-06',
    descripcion_puesto:
      'Diseña experiencias digitales centradas en el usuario para productos web y móvil. Colaborarás con equipos de producto y desarrollo para crear flujos intuitivos y accesibles.',
    requisitos: [
      'Dominio de Figma o Adobe XD',
      'Conocimientos de principios de diseño accesible',
      'Portafolio con proyectos de UX/UI',
      'Disposición para recibir y dar retroalimentación constructiva',
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────
function formatFecha(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}

function formatSalario(min, max) {
  const fmt = (n) => `$${Number(n).toLocaleString('es-MX')}`;
  return `${fmt(min)} – ${fmt(max)} MXN`;
}

// ── Sub-componentes ────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${t.border}`,
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(15,23,41,0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ title, sub, action, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        borderBottom: `1px solid ${t.border}`,
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: t.textPrimary }}>
          {title}
        </h2>
        {sub && (
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: t.textMuted }}>
            {sub}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            color: t.accent,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: '6px',
          }}
        >
          {action} <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

function MatchBadge({ match }) {
  const color = match >= 90 ? '#059669' : match >= 80 ? '#2563eb' : '#7c3aed';
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        fontSize: '12px',
        fontWeight: 700,
        color,
        background: `${color}10`,
        border: `1px solid ${color}25`,
        padding: '3px 9px',
        borderRadius: '999px',
      }}
    >
      <Star size={11} style={{ fill: color }} />
      {match}% match
    </span>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? t.accentBorder : t.border}`,
        background: active ? t.accentSoft : '#fff',
        color: active ? t.accent : t.textSecondary,
        borderRadius: '999px',
        padding: '7px 12px',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

// ── Modal Detalle Vacante ──────────────────────────────────
function ModalVacante({ vacante, onClose }) {
  if (!vacante) return null;

   useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);



  const [toast, setToast] = useState(null); // 'guardado' | 'postulado' | null

const mostrarToast = (tipo) => {
  setToast(tipo);
  setTimeout(() => setToast(null), 3200);
};

  const matchColor =
    vacante.match >= 90 ? '#059669' : vacante.match >= 80 ? '#2563eb' : '#7c3aed';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,41,0.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          position: 'relative',
          width: '100%',
          maxWidth: '640px',
          border: `1px solid ${t.border}`,
          boxShadow: '0 20px 60px rgba(15,23,41,0.18)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #0ea5e9 100%)',
            padding: '24px 24px 20px',
            flexShrink: 0,
          }}
        >
          {/* Fila top: ícono + título + cerrar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Briefcase size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    margin: '0 0 4px',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1.2,
                    letterSpacing: '-0.4px',
                  }}
                >
                  {vacante.titulo_puesto}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Briefcase size={11} />
                  {vacante.empresa}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            >
              <MapPin size={10} />
              {vacante.modalidad}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                background: `${matchColor}cc`,
                color: '#fff',
                border: `1px solid ${matchColor}50`,
              }}
            >
              <Star size={10} style={{ fill: '#fff' }} />
              {vacante.match}% match
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

          {/* Salario + estado */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 2px',
                    fontSize: '11px',
                    color: '#2563eb',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Rango salarial
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#1e40af',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {formatSalario(vacante.salario_min, vacante.salario_max)}
                </p>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: vacante.estado === 'Activa' ? '#d1fae5' : '#fee2e2',
                  color: vacante.estado === 'Activa' ? '#065f46' : '#991b1b',
                  border: `1px solid ${vacante.estado === 'Activa' ? '#6ee7b7' : '#fca5a5'}`,
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: vacante.estado === 'Activa' ? '#059669' : '#dc2626',
                    animation: vacante.estado === 'Activa' ? 'pulseDot 2s ease-in-out infinite' : 'none',
                  }}
                />
                {vacante.estado}
              </span>
            </div>
          </div>

          {/* Info grid: publicación · cierre · modalidad */}
          <div style={{ marginBottom: '20px' }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                paddingBottom: '6px',
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              Información general
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
              }}
            >
              {[
                { label: 'Publicación', value: formatFecha(vacante.fecha_publicacion), icon: Calendar },
                { label: 'Cierre', value: formatFecha(vacante.fecha_cierre), icon: Calendar },
                { label: 'Modalidad', value: vacante.modalidad, icon: MapPin },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  style={{
                    background: '#f8fafc',
                    border: `1px solid ${t.border}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: '11px',
                      color: '#9ca3af',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Icon size={11} />
                    {label}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '20px' }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                paddingBottom: '6px',
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              Descripción del puesto
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
              {vacante.descripcion_puesto}
            </p>
          </div>

          {/* Requisitos */}
          <div style={{ marginBottom: '20px' }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                paddingBottom: '6px',
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              Requisitos
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(Array.isArray(vacante.requisitos)
                ? vacante.requisitos
                : vacante.requisitos?.split('\n').filter(Boolean) ?? []
              ).map((req, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#374151',
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: t.accent,
                      flexShrink: 0,
                      marginTop: '5px',
                    }}
                  />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Accesibilidad */}
          {vacante.discapacidades?.length > 0 && (
            <div>
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  paddingBottom: '6px',
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                Adaptaciones de accesibilidad disponibles
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {vacante.discapacidades.map((d) => (
                  <span
                    key={d}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: t.accent,
                      background: t.accentSoft,
                      border: `1px solid ${t.accentBorder}`,
                      padding: '3px 9px',
                      borderRadius: '6px',
                      fontWeight: 600,
                    }}
                  >
                    <Accessibility size={10} />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${t.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            background: '#fff',
          }}
        >
          <button
            style={{
              background: '#fff',
              color: t.textSecondary,
              border: `1px solid ${t.border}`,
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Bookmark size={14} />
            Guardar
          </button>
          <button
            style={{
              flex: 1,
              background: t.gradient,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: `0 4px 14px ${t.accentGlow}`,
            }}
          >
            <CheckCircle size={14} />
            Postularme a esta vacante
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%,100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>


      {toast && (
  <div style={{
    position: 'absolute',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    borderRadius: '14px',
    border: `1px solid ${t.border}`,
    boxShadow: '0 8px 32px rgba(15,23,41,0.18)',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '260px',
    zIndex: 10,
    animation: 'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
  }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: toast === 'postulado' ? '#d1fae5' : '#eff6ff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <CheckCircle size={18} color={toast === 'postulado' ? '#059669' : '#2563eb'} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827' }}>
        {toast === 'postulado' ? '¡Postulación enviada!' : '¡Vacante guardada!'}
      </p>
      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
        {toast === 'postulado' ? 'La empresa recibirá tu perfil pronto' : 'La encontrarás en tu lista de guardados'}
      </p>
    </div>
  </div>
)}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────
export default function Vacantes() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [modalidad, setModalidad] = useState('Todas');
  const [orden, setOrden] = useState('match');
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);

  const modalidades = ['Todas', 'Remoto', 'Híbrido', 'Presencial'];

  const vacantesFiltradas = useMemo(() => {
    let data = [...VACANTES_RECOMENDADAS];

    if (modalidad !== 'Todas') {
      data = data.filter((v) => v.modalidad === modalidad);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (v) =>
          v.titulo_puesto.toLowerCase().includes(q) ||
          v.empresa.toLowerCase().includes(q) ||
          v.modalidad.toLowerCase().includes(q)
      );
    }

    if (orden === 'match') data.sort((a, b) => b.match - a.match);
    if (orden === 'recientes') data.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));

    return data;
  }, [search, modalidad, orden]);

  const mejorMatch = vacantesFiltradas.length
    ? Math.max(...vacantesFiltradas.map((v) => v.match))
    : 0;

  return (
    <PortalLayout
      theme={t}
      navItems={postulantNav}
      user={MOCK_USER}
      pageTitle="Vacantes"
      notifications={3}
      headerActions={
        <button
          onClick={() => navigate('/postulante/postulaciones')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: t.gradient,
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 4px 14px ${t.accentGlow}`,
          }}
        >
          <CheckCircle size={14} />
          Mis postulaciones
        </button>
      }
    >
      {/* ── Animaciones ── */}
      <style>{`
        @keyframes floatBlob {
          0%,100%{transform:translate(0,0) scale(1)}
          50%{transform:translate(15px,-20px) scale(1.05)}
        }
        .hero-blob {
          position:absolute;
          border-radius:50%;
          filter:blur(60px);
          pointer-events:none;
          animation:floatBlob 10s ease-in-out infinite;
        }
      `}</style>

      {/* ── Modal ── */}
      {vacanteSeleccionada && (
        <ModalVacante
          vacante={vacanteSeleccionada}
          onClose={() => setVacanteSeleccionada(null)}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* ── Hero ── */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #0ea5e9 100%)',
            padding: '32px 28px',
            color: '#fff',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div className="hero-blob" style={{ width: '300px', height: '300px', background: 'rgba(255,255,255,0.08)', top: '-80px', right: '-60px', animationDelay: '0s' }} />
          <div className="hero-blob" style={{ width: '200px', height: '200px', background: 'rgba(14,165,233,0.25)', bottom: '-60px', left: '30%', animationDelay: '3s' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8, fontWeight: 500 }}>
              Oportunidades laborales inclusivas
            </p>
            <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Vacantes compatibles con tu perfil
            </h1>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.82, maxWidth: '720px', lineHeight: 1.5 }}>
              Explora oportunidades recomendadas según tus habilidades, experiencia y necesidades de accesibilidad.
            </p>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '14px 16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              maxWidth: '520px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Search size={16} style={{ color: '#fff', opacity: 0.85 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar puesto, empresa o modalidad..."
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#fff', fontSize: '13px' }}
            />
          </div>
        </div>

        {/* ── KPIs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
          {[
            { label: 'Vacantes encontradas', value: vacantesFiltradas.length, icon: Briefcase, color: '#2563eb' },
            { label: 'Mejor compatibilidad', value: `${mejorMatch}%`, icon: Star, color: '#059669' },
            { label: 'Vacantes remotas', value: vacantesFiltradas.filter((v) => v.modalidad === 'Remoto').length, icon: Sparkles, color: '#0ea5e9' },
            { label: 'Filtros activos', value: modalidad === 'Todas' ? 0 : 1, icon: Clock, color: '#7c3aed' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: '#fff',
                border: `1px solid ${t.border}`,
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 1px 4px rgba(15,23,41,0.05)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: `${s.color}12`,
                  border: `1px solid ${s.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <s.icon size={19} style={{ color: s.color }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '30px', fontWeight: 800, color: t.textPrimary, letterSpacing: '-1.5px', lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: t.textSecondary }}>
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filtros ── */}
        <Card>
          <SectionHead title="Filtrar vacantes" sub="Encuentra oportunidades según modalidad y compatibilidad" />
          <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {modalidades.map((m) => (
              <FilterButton key={m} active={modalidad === m} onClick={() => setModalidad(m)}>
                {m}
              </FilterButton>
            ))}
            <FilterButton active={orden === 'match'} onClick={() => setOrden('match')}>
              Mayor compatibilidad
            </FilterButton>
            <FilterButton active={orden === 'recientes'} onClick={() => setOrden('recientes')}>
              Más recientes
            </FilterButton>
          </div>
        </Card>

        {/* ── Vacantes ── */}
        <Card>
          <SectionHead
            title="Vacantes recomendadas para ti"
            sub="Basadas en tu perfil y discapacidades registradas"
          />

          {vacantesFiltradas.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0' }}>
              {vacantesFiltradas.map((v, i) => (
                <div
                  key={v.id}
                  style={{
                    padding: '20px',
                    borderRight: i < vacantesFiltradas.length - 1 ? `1px solid ${t.border}` : 'none',
                    borderBottom: `1px solid ${t.border}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = t.bgElevated)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setVacanteSeleccionada(v)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: t.accentSoft,
                        border: `1px solid ${t.accentBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Briefcase size={16} style={{ color: t.accent }} />
                    </div>
                    <MatchBadge match={v.match} />
                  </div>

                  <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: t.textPrimary, lineHeight: 1.3 }}>
                    {v.titulo_puesto}
                  </h3>

                  <p style={{ margin: '0 0 10px', fontSize: '12px', color: t.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={11} />
                    {v.empresa}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        color: t.textMuted,
                        background: t.bgElevated,
                        border: `1px solid ${t.border}`,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <MapPin size={10} />
                      {v.modalidad}
                    </span>

                    {v.discapacidades.map((d) => (
                      <span
                        key={d}
                        style={{
                          fontSize: '11px',
                          color: t.accent,
                          background: t.accentSoft,
                          border: `1px solid ${t.accentBorder}`,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Accessibility size={9} />
                        {d}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: t.textPrimary }}>
                      {formatSalario(v.salario_min, v.salario_max)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: t.accent, fontWeight: 600 }}>
                      Ver detalle <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '42px 20px', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: t.accentSoft,
                  border: `1px solid ${t.accentBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <Search size={22} style={{ color: t.accent }} />
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: t.textPrimary, fontWeight: 700 }}>
                No encontramos vacantes
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: t.textMuted }}>
                Intenta cambiar los filtros o buscar otra palabra clave.
              </p>
            </div>
          )}
        </Card>
      </div>
    </PortalLayout>
  );
}