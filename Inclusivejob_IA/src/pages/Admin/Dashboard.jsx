
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, Building2, FileText, AlertTriangle,
  CheckCircle, XCircle, UserCheck, UserCog, TrendingUp,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Swal from 'sweetalert2';

import { StatCard, Badge, Button, PageHeader } from '../../assets/Componentes/Admin/UI';
import Table from '../../assets/Componentes/Admin/Table';

// ── Hook de animación numérica (CountUp sin dep. extra) ─────
function useCountUp(end, duration = 1400, start = 0) {
  const [count, setCount] = useState(start);
  const frameRef = useRef(null);

  useEffect(() => {
    if (end === null || end === undefined) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easing: easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, start]);

  return count;
}

// ── StatCard con número animado ──────────────────────────────
function AnimatedStatCard({ label, value, rawValue, icon, color, trend }) {
  const animatedValue = useCountUp(rawValue ?? 0);
  const displayValue = rawValue >= 1000
    ? animatedValue.toLocaleString('es-MX')
    : animatedValue;

  return (
    <StatCard
      label={label}
      value={displayValue}
      icon={icon}
      color={color}
      trend={trend}
    />
  );
}

// ── Datos Mock ───────────────────────────────────────────────
const MOCK_STATS = {
  total_usuarios: 1248,
  total_postulantes: 834,
  total_reclutadores: 127,
  total_empresas: 215,
  empresas_pendientes: 12,
  vacantes_activas: 98,
  vacantes_cerradas: 243,
  postulaciones_realizadas: 3421,
  reportes_recibidos: 7,
};

const CHART_DATA = [
  { mes: 'Dic', vacantes: 18, usuarios: 45, postulaciones: 120 },
  { mes: 'Ene', vacantes: 24, usuarios: 62, postulaciones: 180 },
  { mes: 'Feb', vacantes: 31, usuarios: 78, postulaciones: 240 },
  { mes: 'Mar', vacantes: 27, usuarios: 91, postulaciones: 210 },
  { mes: 'Abr', vacantes: 42, usuarios: 115, postulaciones: 320 },
  { mes: 'May', vacantes: 38, usuarios: 98, postulaciones: 280 },
];

const MOCK_VACANTES = [
  { id: 1, titulo: 'Desarrollador Frontend', empresa: 'Tech Solutions SA', modalidad: 'Remoto', estado: 'activa', fecha_publicacion: '2026-05-10' },
  { id: 2, titulo: 'Analista de Datos', empresa: 'DataCorp MX', modalidad: 'Híbrido', estado: 'activa', fecha_publicacion: '2026-05-12' },
  { id: 3, titulo: 'Diseñador UX/UI', empresa: 'CreativeHub', modalidad: 'Presencial', estado: 'activa', fecha_publicacion: '2026-05-15' },
  { id: 4, titulo: 'Soporte Técnico', empresa: 'HelpDesk Pro', modalidad: 'Remoto', estado: 'cerrada', fecha_publicacion: '2026-05-01' },
];

const MOCK_EMPRESAS_PENDIENTES = [
  { id: 1, nombre_empresa: 'Innovatech MX', correo_empresa: 'contacto@innovatech.mx', fecha_registro: '2026-05-20' },
  { id: 2, nombre_empresa: 'Grupo Empresarial Norte', correo_empresa: 'rrhh@genorte.com', fecha_registro: '2026-05-19' },
  { id: 3, nombre_empresa: 'Soluciones Integrales SA', correo_empresa: 'admin@sisa.mx', fecha_registro: '2026-05-18' },
];

// ── Tooltip personalizado del chart ──────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600/50 rounded-xl p-3 shadow-xl">
      <p className="text-slate-300 text-xs font-semibold mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-slate-400 capitalize">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Columnas tabla últimas vacantes ──────────────────────────
const VACANTES_COLS = [
  {
    key: 'titulo', label: 'Título',
    render: (v) => <span className="font-medium text-white">{v}</span>,
  },
  { key: 'empresa', label: 'Empresa' },
  {
    key: 'modalidad', label: 'Modalidad',
    render: (v) => <Badge variant="info">{v}</Badge>,
  },
  {
    key: 'estado', label: 'Estado',
    render: (v) => <Badge variant={v === 'activa' ? 'success' : 'default'}>{v}</Badge>,
  },
  {
    key: 'fecha_publicacion', label: 'Fecha',
    render: (v) => new Date(v).toLocaleDateString('es-MX'),
  },
];

// ── KPIs config ──────────────────────────────────────────────
const KPIS = (s) => [
  { label: 'Total usuarios',         rawValue: s.total_usuarios,           icon: Users,         color: 'violet', trend: 8  },
  { label: 'Postulantes',            rawValue: s.total_postulantes,         icon: UserCheck,     color: 'blue'             },
  { label: 'Reclutadores',           rawValue: s.total_reclutadores,        icon: UserCog,       color: 'cyan'             },
  { label: 'Empresas',               rawValue: s.total_empresas,            icon: Building2,     color: 'emerald', trend: 3 },
  { label: 'Empresas pendientes',    rawValue: s.empresas_pendientes,       icon: AlertTriangle, color: 'amber'            },
  { label: 'Vacantes activas',       rawValue: s.vacantes_activas,          icon: Briefcase,     color: 'emerald'          },
  { label: 'Vacantes cerradas',      rawValue: s.vacantes_cerradas,         icon: XCircle,       color: 'red'              },
  { label: 'Postulaciones',          rawValue: s.postulaciones_realizadas,  icon: FileText,      color: 'violet', trend: 12 },
  { label: 'Reportes',               rawValue: s.reportes_recibidos,        icon: AlertTriangle, color: 'amber'            },
];

// ── Componente principal ─────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const stats = MOCK_STATS;
  const [empresasPendientes, setEmpresasPendientes] = useState(MOCK_EMPRESAS_PENDIENTES);

  const handleAprobar = async (empresa) => {
    const result = await Swal.fire({
      title: '¿Aprobar empresa?',
      html: `<span style="color:#94a3b8">Se aprobará a <strong style="color:#fff">${empresa.nombre_empresa}</strong> y podrá publicar vacantes.</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#475569',
      borderRadius: '16px',
      customClass: {
        popup: 'swal-rounded',
      },
    });

    if (result.isConfirmed) {
      // await useEmpresaAcciones().aprobar(empresa.id); // API real
      setEmpresasPendientes((prev) => prev.filter((e) => e.id !== empresa.id));
      Swal.fire({
        title: '¡Aprobada!',
        text: `${empresa.nombre_empresa} ha sido aprobada.`,
        icon: 'success',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#7c3aed',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Dashboard"
        description="Resumen general de la plataforma Inclusive Job IA"
      />

      {/* ── KPI Grid ── */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">Indicadores clave</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {KPIS(stats).map((kpi) => (
            <AnimatedStatCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </section>

      {/* ── Gráfica + Empresas pendientes ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Recharts AreaChart */}
        <section
          aria-labelledby="chart-heading"
          className="xl:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <h2 id="chart-heading" className="text-white font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-violet-400" />
              Actividad mensual
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
                Vacantes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                Usuarios
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                Postulaciones
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVacantes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPostulaciones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="vacantes"
                name="Vacantes"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#colorVacantes)"
                dot={{ fill: '#7c3aed', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#7c3aed' }}
              />
              <Area
                type="monotone"
                dataKey="usuarios"
                name="Usuarios"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#colorUsuarios)"
                dot={{ fill: '#22d3ee', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#22d3ee' }}
              />
              <Area
                type="monotone"
                dataKey="postulaciones"
                name="Postulaciones"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#colorPostulaciones)"
                dot={{ fill: '#34d399', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#34d399' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Empresas pendientes */}
        <section
          aria-labelledby="pending-heading"
          className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5"
        >
          <h2 id="pending-heading" className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" />
            Empresas pendientes
            <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {empresasPendientes.length}
            </span>
          </h2>

          {empresasPendientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle size={32} className="text-emerald-400 mb-2" />
              <p className="text-emerald-400 text-sm font-medium">¡Todo al día!</p>
              <p className="text-slate-500 text-xs mt-1">No hay empresas pendientes</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {empresasPendientes.map((emp) => (
                <li
                  key={emp.id}
                  className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-3 hover:border-slate-500/50 transition-colors"
                >
                  <p className="text-white text-sm font-semibold truncate">{emp.nombre_empresa}</p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">{emp.correo_empresa}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(emp.fecha_registro).toLocaleDateString('es-MX')}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAprobar(emp)}
                      className="flex-1"
                    >
                      <CheckCircle size={13} />
                      Aprobar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/empresas/${emp.id}`)}
                    >
                      Ver
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ── Últimas vacantes ── */}
      <section aria-labelledby="vacantes-heading" className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 id="vacantes-heading" className="text-white font-semibold">
            Últimas vacantes
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/vacantes')}>
            Ver todas →
          </Button>
        </div>
        <Table
          columns={VACANTES_COLS}
          data={MOCK_VACANTES}
          caption="Últimas vacantes publicadas"
        />
      </section>
    </div>
  );
}