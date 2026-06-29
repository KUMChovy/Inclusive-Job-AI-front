import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Eye,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
import { reclutadorTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import {
  useGuardarVacanteReclutador,
  useReclutadorDashboard,
} from '../../assets/Hook/Reclutador/useDomain';

const INITIAL_FORM = {
  titulo_puesto: '',
  descripcion_puesto: '',
  requisitos: '',
  modalidad: '',
  salario_min: '',
  salario_max: '',
  estado: 'activa',
  fecha_publicacion: '',
  fecha_cierre: '',
};

const ESTADO_COLOR = {
  activa: { bg: 'rgba(16,185,129,0.12)', text: '#6ee7b7', border: 'rgba(16,185,129,0.3)' },
  cerrada: { bg: 'rgba(100,116,139,0.12)', text: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
  pendiente: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  entrevista: { bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc', border: 'rgba(99,102,241,0.3)' },
  aceptado: { bg: 'rgba(16,185,129,0.12)', text: '#6ee7b7', border: 'rgba(16,185,129,0.3)' },
  rechazado: { bg: 'rgba(239,68,68,0.12)', text: '#fca5a5', border: 'rgba(239,68,68,0.3)' },
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '6px',
  borderRadius: '10px',
  border: `1px solid ${t.border}`,
  background: t.bgElevated,
  color: t.textPrimary,
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};

function useCountUp(end, duration = 1200) {
  const [v, setV] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setV(Math.floor(e * end));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [end, duration]);

  return v;
}

function StatCard({ label, value, icon: Icon, color }) {
  const animated = useCountUp(value);

  return (
    <div
      style={{
        background: t.bgSurface,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.accentBorder;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={19} style={{ color }} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: t.textPrimary, letterSpacing: '-1px', lineHeight: 1 }}>
          {animated.toLocaleString()}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: t.textSecondary }}>{label}</p>
      </div>
    </div>
  );
}

function Badge({ estado }) {
  const c = ESTADO_COLOR[estado] || ESTADO_COLOR.pendiente;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 600,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {estado}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: '16px', overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${t.border}` }}>
      <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: t.textPrimary }}>{title}</h2>
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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={{ background: t.bgElevated, border: `1px solid ${t.accentBorder}`, borderRadius: '10px', padding: '10px 14px', fontSize: '12px' }}>
      <p style={{ margin: '0 0 6px', color: t.textMuted, fontWeight: 600 }}>{label}</p>
      {payload.map((e) => (
        <p key={e.dataKey} style={{ margin: '2px 0', color: e.color }}>
          {e.name}: <strong style={{ color: t.textPrimary }}>{e.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function ReclutadorDashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useReclutadorDashboard();
  const { guardarVacante, loading: guardandoVacante } = useGuardarVacanteReclutador();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const currentUser = data?.user ?? {};
  const currentEmpresa = data?.empresa ?? {};
  const empresaAprobada = Boolean(
    data?.empresa && (currentEmpresa.aprobada ?? currentEmpresa.estado === 'aprobada')
  );

  const stats = [
    { label: 'Vacantes activas', value: Number(data?.stats?.vacantes_activas ?? 0), icon: Briefcase, color: '#7c3aed' },
    { label: 'Candidatos totales', value: Number(data?.stats?.candidatos_totales ?? 0), icon: Users, color: '#8b5cf6' },
    { label: 'Postulaciones hoy', value: Number(data?.stats?.postulaciones_hoy ?? 0), icon: TrendingUp, color: '#6d28d9' },
    { label: 'Reportes activos', value: Number(data?.stats?.reportes_activos ?? 0), icon: AlertTriangle, color: '#f59e0b' },
  ];
  const chartData = data?.chart ?? [];
  const vacantesRecientes = data?.vacantes_recientes ?? [];
  const candidatosRecientes = data?.candidatos_recientes ?? [];

  const resetForm = () => setFormData(INITIAL_FORM);

  const guardarNuevaVacante = async () => {
    if (!empresaAprobada) {
      alert('No puedes publicar vacantes. Tu empresa se encuentra pendiente de aprobacion.');
      return;
    }

    try {
      const resultado = await guardarVacante(formData);

      if (!resultado?.success) {
        alert(resultado?.message || 'Error al guardar vacante');
        return;
      }

      resetForm();
      setShowModal(false);
      await refetch();
      alert('Vacante publicada con exito');
    } catch (err) {
      console.error('Error al guardar vacante:', err);
      alert(err.message || 'Error de conexion con el servidor');
    }
  };

  return (
    <PortalLayout
      theme={t}
      navItems={reclutadorNav}
      user={currentUser}
      pageTitle="Dashboard"
      notifications={stats[3].value}
      headerActions={
        empresaAprobada && (
          <button
            onClick={() => setShowModal(true)}
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
            }}
          >
            <Plus size={15} />
            Nueva vacante
          </button>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {loading && (
          <Card>
            <div style={{ padding: '18px 20px', color: t.textSecondary, fontSize: '13px', fontWeight: 600 }}>
              Cargando tu dashboard...
            </div>
          </Card>
        )}

        {error && (
          <div style={{ padding: '14px 20px', borderRadius: '14px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span>No se pudo cargar tu dashboard: {error}</span>
            <button onClick={refetch} style={{ border: '1px solid rgba(239,68,68,0.35)', background: t.bgSurface, color: '#fca5a5', borderRadius: '8px', padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        )}

        {!empresaAprobada && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>Empresa pendiente de validacion</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#92400e' }}>Registra y espera que el administrador valide tu empresa para publicar vacantes.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/reclutador/empresa')}
              style={{ background: '#f59e0b', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#1c1917', fontSize: '13px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
            >
              Ver empresa
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: t.accentSoft, border: `2px solid ${t.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: t.accent }}>
            {(currentUser.nombre || 'Reclutador').split(' ').slice(0, 2).map((w) => w[0]).join('')}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: t.textPrimary, letterSpacing: '-0.3px' }}>
              Bienvenido, {(currentUser.nombre || 'Reclutador').split(' ')[0]}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: t.textSecondary }}>
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
              {' - '}<span style={{ color: t.accent }}>{currentEmpresa.nombre || 'Sin empresa registrada'}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="xl:!grid-cols-[1fr_340px]">
          <Card>
            <SectionHeader title="Actividad de la semana" action="Ver analitica" />
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {[{ label: 'Postulaciones', color: '#7c3aed' }, { label: 'Vistas', color: '#4f46e5' }].map((l) => (
                  <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: t.textSecondary }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                    {l.label}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gPost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gVistas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: t.accentBorder }} />
                  <Area type="monotone" dataKey="postulaciones" name="Postulaciones" stroke="#7c3aed" strokeWidth={2} fill="url(#gPost)" dot={false} />
                  <Area type="monotone" dataKey="vistas" name="Vistas" stroke="#4f46e5" strokeWidth={2} fill="url(#gVistas)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Candidatos recientes" action="Ver todos" onAction={() => navigate('/reclutador/candidatos')} />
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {candidatosRecientes.length > 0 ? candidatosRecientes.map((c, i) => (
                <li key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: i < candidatosRecientes.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: t.accentSoft, border: `1px solid ${t.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: t.accent }}>
                    {c.nombre.split(' ').map((w) => w[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: t.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nombre}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: t.textMuted }}>{c.vacante} - {c.tiempo}</p>
                  </div>
                  <Badge estado={c.estado} />
                </li>
              )) : (
                <li style={{ padding: '16px 20px', color: t.textMuted, fontSize: '13px' }}>
                  Aun no hay candidatos recientes.
                </li>
              )}
            </ul>
          </Card>
        </div>

        <Card>
          <SectionHeader title="Mis vacantes" action="Gestionar" onAction={() => navigate('/reclutador/vacantes')} />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {['Vacante', 'Postulaciones', 'Vistas', 'Dias activa', 'Estado', ''].map((h) => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', color: t.textMuted, fontWeight: 600, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vacantesRecientes.length > 0 ? vacantesRecientes.map((v, i) => (
                  <tr key={v.id} style={{ borderBottom: i < vacantesRecientes.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <td style={{ padding: '13px 20px', color: t.textPrimary, fontWeight: 600 }}>{v.titulo}</td>
                    <td style={{ padding: '13px 20px', color: t.textSecondary }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={13} style={{ color: t.accent }} />{v.postulaciones}</span>
                    </td>
                    <td style={{ padding: '13px 20px', color: t.textSecondary }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={13} style={{ color: '#4f46e5' }} />{v.vistas}</span>
                    </td>
                    <td style={{ padding: '13px 20px', color: t.textSecondary }}>{v.dias}d</td>
                    <td style={{ padding: '13px 20px' }}><Badge estado={v.estado} /></td>
                    <td style={{ padding: '13px 20px' }}>
                      <button onClick={() => navigate(`/reclutador/vacantes/${v.id}`)} style={{ background: t.accentSoft, border: `1px solid ${t.accentBorder}`, borderRadius: '7px', padding: '5px 12px', color: t.accent, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Ver</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '18px 20px', color: t.textMuted }}>
                      Aun no tienes vacantes registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ width: '900px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ marginTop: 0, color: t.textPrimary, fontWeight: 700, marginBottom: '20px' }}>Nueva Vacante</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={{ color: t.textSecondary }}>Titulo del puesto</label>
                <input type="text" value={formData.titulo_puesto} onChange={(e) => setFormData({ ...formData, titulo_puesto: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={{ color: t.textSecondary }}>Descripcion del puesto</label>
                <textarea rows="4" value={formData.descripcion_puesto} onChange={(e) => setFormData({ ...formData, descripcion_puesto: e.target.value })} style={textareaStyle} />
              </div>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={{ color: t.textSecondary }}>Requisitos</label>
                <textarea rows="4" value={formData.requisitos} onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })} style={textareaStyle} />
              </div>
              <div>
                <label style={{ color: t.textSecondary }}>Modalidad</label>
                <select value={formData.modalidad} onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })} style={inputStyle}>
                  <option value="">Seleccione</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Hibrido">Hibrido</option>
                </select>
              </div>
              <div>
                <label style={{ color: t.textSecondary }}>Estado</label>
                <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} style={inputStyle}>
                  <option value="activa">Activa</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>
              <div>
                <label style={{ color: t.textSecondary }}>Salario minimo</label>
                <input type="number" value={formData.salario_min} onChange={(e) => setFormData({ ...formData, salario_min: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: t.textSecondary }}>Salario maximo</label>
                <input type="number" value={formData.salario_max} onChange={(e) => setFormData({ ...formData, salario_max: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: t.textSecondary }}>Fecha publicacion</label>
                <input type="date" value={formData.fecha_publicacion} onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: t.textSecondary }}>Fecha cierre</label>
                <input type="date" value={formData.fecha_cierre} onChange={(e) => setFormData({ ...formData, fecha_cierre: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                style={{ background: t.bgElevated, border: `1px solid ${t.border}`, color: t.textSecondary, borderRadius: '10px', padding: '10px 16px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={guardarNuevaVacante}
                disabled={guardandoVacante}
                style={{ background: t.gradient, border: 'none', color: '#fff', borderRadius: '10px', padding: '10px 16px', cursor: guardandoVacante ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: guardandoVacante ? 0.7 : 1 }}
              >
                {guardandoVacante ? 'Guardando...' : 'Guardar Vacante'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
