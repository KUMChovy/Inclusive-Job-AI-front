import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Accessibility,
  MapPin,
  Briefcase,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { postulantTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { postulantNav } from '../../assets/Componentes/Portal/navItems';
import ChatBubble from '../../components/ChatBot';

// ── URL del backend ────────────────────────────────────────
const API_BASE = "http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante";

// ── Helpers ────────────────────────────────────────────────
function formatFecha(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}

function formatSalario(min, max) {
  const fmt = (n) => `$${Number(n).toLocaleString('es-MX')}`;
  if (!min && !max) return 'Salario a convenir';
  if (!max) return `Desde ${fmt(min)} MXN`;
  if (!min) return `Hasta ${fmt(max)} MXN`;
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

//modal de reporte
function ModalReporte({ vacante, onClose, onReportado }) {
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const motivosSugeridos = [
    'Información falsa o engañosa',
    'Oferta discriminatoria',
    'Requisitos no relacionados con el puesto',
    'Empresa o contacto sospechoso',
    'Contenido inapropiado',
  ];

  const handleEnviar = async () => {
    if (!motivo.trim()) { setError('Por favor describe el motivo del reporte.'); return; }
    setEnviando(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/reportes.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_vacante: vacante.id_vacante, motivo: motivo.trim() }),
      });
      const json = await res.json();
      if (json.ok) {
        onReportado(vacante.id_vacante);
        onClose();
      } else {
        setError(json.msg ?? 'No se pudo enviar el reporte.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.55)',
      zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '500px',
        border: `1px solid ${t.border}`, boxShadow: '0 20px 60px rgba(15,23,41,0.22)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)', padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={20} color="#fff" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                  Reportar vacante
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  {vacante.titulo_puesto}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Sugerencias */}
          <div>
            <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Motivos frecuentes
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {motivosSugeridos.map((s) => (
                <button key={s} onClick={() => setMotivo(s)} style={{
                  border: `1px solid ${motivo === s ? '#fca5a5' : t.border}`,
                  background: motivo === s ? '#fef2f2' : '#f8fafc',
                  color: motivo === s ? '#dc2626' : t.textSecondary,
                  borderRadius: '8px', padding: '6px 12px',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Describe el problema <span style={{ color: '#dc2626' }}>*</span>
            </p>
            <textarea
              value={motivo}
              onChange={(e) => { setMotivo(e.target.value); setError(''); }}
              placeholder="Explica brevemente por qué reportas esta vacante..."
              maxLength={500}
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: `1px solid ${error ? '#fca5a5' : t.border}`,
                borderRadius: '12px', padding: '12px 14px',
                fontSize: '13px', color: '#374151', lineHeight: 1.6,
                outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                background: '#fff',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {error
                ? <p style={{ margin: 0, fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>⚠ {error}</p>
                : <span />
              }
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{motivo.length}/500</p>
            </div>
          </div>

          {/* Advertencia */}
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '10px', padding: '10px 14px',
            display: 'flex', gap: '8px', alignItems: 'flex-start',
          }}>
            <AlertTriangle size={14} style={{ color: '#d97706', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ margin: 0, fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
              Los reportes son revisados por nuestro equipo. El uso indebido puede resultar en la suspensión de tu cuenta.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, background: '#f8fafc', color: t.textSecondary,
            border: `1px solid ${t.border}`, borderRadius: '12px',
            padding: '12px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}>
            Cancelar
          </button>
          <button onClick={handleEnviar} disabled={enviando} style={{
            flex: 2,
            background: enviando ? '#9ca3af' : 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
            color: '#fff', border: 'none', borderRadius: '12px',
            padding: '12px 20px', fontSize: '13px', fontWeight: 700,
            cursor: enviando ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            boxShadow: enviando ? 'none' : '0 4px 14px rgba(220,38,38,0.35)',
          }}>
            {enviando
              ? <><span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Enviando...</>
              : <><AlertTriangle size={14} /> Enviar reporte</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Detalle Vacante ──────────────────────────────────
function ModalVacante({ vacante, onClose, onAbrirReporte, onPostularse }) {
  if (!vacante) return null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [toast, setToast] = useState(null); // 'postulado' | 'reportado' | null

  const mostrarToast = (tipo) => {
    setToast(tipo);
    setTimeout(() => setToast(null), 3200);
  };

  const handlePostularse = async () => {
    try {
      const res = await fetch(`${API_BASE}/postulaciones.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_vacante: vacante.id_vacante }),
      });
      const json = await res.json();
      if (json.ok) {
        onPostularse(vacante.id_vacante);
        mostrarToast('postulado');
      } else {
        mostrarToast('error');
      }
    } catch {
      mostrarToast('error');
    }
  };

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
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Briefcase size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    margin: '0 0 4px', fontSize: '20px', fontWeight: 800,
                    color: '#fff', lineHeight: 1.2, letterSpacing: '-0.4px',
                  }}
                >
                  {vacante.titulo_puesto}
                </h2>
                <p
                  style={{
                    margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                >
                  <Briefcase size={11} />
                  {vacante.empresa ?? 'Empresa'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff', flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Badge modalidad */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                background: 'rgba(255,255,255,0.18)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            >
              <MapPin size={10} />
              {vacante.modalidad}
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

          {/* Salario + estado */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '12px', padding: '14px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
              }}
            >
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Rango salarial
                </p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1e40af', letterSpacing: '-0.5px' }}>
                  {formatSalario(vacante.salario_min, vacante.salario_max)}
                </p>
              </div>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                  background: vacante.estado === 'activa' ? '#d1fae5' : '#fee2e2',
                  color: vacante.estado === 'activa' ? '#065f46' : '#991b1b',
                  border: `1px solid ${vacante.estado === 'activa' ? '#6ee7b7' : '#fca5a5'}`,
                }}
              >
                <span
                  style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: vacante.estado === 'activa' ? '#059669' : '#dc2626',
                    animation: vacante.estado === 'activa' ? 'pulseDot 2s ease-in-out infinite' : 'none',
                  }}
                />
                {vacante.estado === 'activa' ? 'Activa' : vacante.estado}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '6px', borderBottom: `1px solid ${t.border}` }}>
              Información general
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Publicación', value: formatFecha(vacante.fecha_publicacion), icon: Calendar },
                { label: 'Cierre',      value: formatFecha(vacante.fecha_cierre),      icon: Calendar },
                { label: 'Modalidad',   value: vacante.modalidad,                      icon: MapPin   },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  style={{ background: '#f8fafc', border: `1px solid ${t.border}`, borderRadius: '12px', padding: '12px 14px' }}
                >
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon size={11} /> {label}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          {vacante.descripcion_puesto && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '6px', borderBottom: `1px solid ${t.border}` }}>
                Descripción del puesto
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                {vacante.descripcion_puesto}
              </p>
            </div>
          )}

          {/* Requisitos */}
          {vacante.requisitos?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '6px', borderBottom: `1px solid ${t.border}` }}>
                Requisitos
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(Array.isArray(vacante.requisitos)
                  ? vacante.requisitos
                  : vacante.requisitos.split('\n').filter(Boolean)
                ).map((req, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#374151', lineHeight: 1.4 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.accent, flexShrink: 0, marginTop: '5px' }} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Accesibilidad */}
          {vacante.discapacidades?.length > 0 && (
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '6px', borderBottom: `1px solid ${t.border}` }}>
                Adaptaciones de accesibilidad disponibles
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {vacante.discapacidades.map((d) => (
                  <span
                    key={d}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '11px', color: t.accent, background: t.accentSoft,
                      border: `1px solid ${t.accentBorder}`, padding: '3px 9px',
                      borderRadius: '6px', fontWeight: 600,
                    }}
                  >
                    <Accessibility size={10} /> {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '16px 24px', borderTop: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', gap: '10px',
          flexShrink: 0, background: '#fff',
        }}>
          {vacante.reportada ? (
            <>
              <div style={{
                flex: 1, background: '#fef2f2', color: '#dc2626',
                border: '1px solid #fca5a5', borderRadius: '12px',
                padding: '12px 20px', fontSize: '13px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <AlertTriangle size={14} /> Reportada
              </div>
              <button disabled style={{
                flex: 1, background: '#f1f5f9', color: '#94a3b8',
                border: '1px solid #e2e8f0', borderRadius: '12px',
                padding: '12px 20px', fontSize: '13px', fontWeight: 700,
                cursor: 'not-allowed', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
              }}>
                <CheckCircle size={14} /> Postularme
              </button>
            </>
          ) : vacante.postulada ? (
            <>
              <button disabled style={{
                flex: 1, background: '#f1f5f9', color: '#94a3b8',
                border: '1px solid #e2e8f0', borderRadius: '12px',
                padding: '12px 20px', fontSize: '13px', fontWeight: 700,
                cursor: 'not-allowed', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
              }}>
                <AlertTriangle size={14} /> Reportar
              </button>
              <div style={{
                flex: 1, background: '#d1fae5', color: '#065f46',
                border: '1px solid #6ee7b7', borderRadius: '12px',
                padding: '12px 20px', fontSize: '13px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <CheckCircle size={14} /> Postulado
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => onAbrirReporte(vacante)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  padding: '12px 20px', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 14px rgba(220,38,38,0.35)',
                }}
              >
                <AlertTriangle size={14} /> Reportar
              </button>
              <button
                onClick={handlePostularse}
                style={{
                  flex: 1, background: t.gradient, color: '#fff', border: 'none',
                  borderRadius: '12px', padding: '12px 20px', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                  boxShadow: `0 4px 14px ${t.accentGlow}`,
                }}
              >
                <CheckCircle size={14} /> Postularme a esta vacante
              </button>
            </>
          )}
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div style={{
            position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
            background: '#fff', borderRadius: '14px', border: `1px solid ${t.border}`,
            boxShadow: '0 8px 32px rgba(15,23,41,0.18)', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: '12px', minWidth: '260px',
            zIndex: 10, animation: 'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: toast === 'reportado' ? '#fee2e2' : '#d1fae5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {toast === 'reportado'
                ? <AlertTriangle size={18} color="#dc2626" />
                : <CheckCircle   size={18} color="#059669" />
              }
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                {toast === 'reportado' ? '¡Reporte enviado!' : '¡Postulación enviada!'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
                {toast === 'reportado'
                  ? 'Revisaremos esta vacante a la brevedad'
                  : 'La empresa recibirá tu perfil pronto'}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────
export default function Vacantes() {
  const navigate = useNavigate();

  const [vacantes,            setVacantes]            = useState([]);
  const [cargando,            setCargando]            = useState(true);
  const [error,               setError]               = useState('');
  const [search,              setSearch]              = useState('');
  const [modalidad,           setModalidad]           = useState('Todas');
  const [orden,               setOrden]               = useState('recientes');
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);

  const [vacanteParaReportar, setVacanteParaReportar] = useState(null);
  const marcarReportada = useCallback((idVacante) => {
    setVacantes((prev) =>
      prev.map((v) => v.id_vacante === idVacante ? { ...v, reportada: true } : v)
    );
    setVacanteSeleccionada((prev) =>
      prev?.id_vacante === idVacante ? { ...prev, reportada: true } : prev
    );
  }, []);

  const marcarPostulada = useCallback((idVacante) => {
  setVacantes((prev) =>
    prev.map((v) => v.id_vacante === idVacante ? { ...v, postulada: true } : v)
  );
  setVacanteSeleccionada((prev) =>
    prev?.id_vacante === idVacante ? { ...prev, postulada: true } : prev
  );
}, []);

  const modalidades = ['Todas', 'Remota', 'Híbrida', 'Presencial'];

  useEffect(() => {
    const cargarVacantes = async () => {
      try {
        const res  = await fetch(`${API_BASE}/obtener_vacantes.php`, {
          method:      'GET',
          credentials: 'include',
        });
        const json = await res.json();

        if (!json.auth) {
          window.location.href = '/login';
          return;
        }

        setVacantes(json.vacantes ?? []);
      } catch {
        setError('No se pudieron cargar las vacantes. Verifica tu conexión.');
      } finally {
        setCargando(false);
      }
    };

    cargarVacantes();
  }, []);

  const vacantesFiltradas = useMemo(() => {
    let data = [...vacantes];

    if (modalidad !== 'Todas') {
      data = data.filter((v) => v.modalidad === modalidad);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (v) =>
          v.titulo_puesto.toLowerCase().includes(q) ||
          (v.empresa ?? '').toLowerCase().includes(q) ||
          v.modalidad.toLowerCase().includes(q)
      );
    }

    if (orden === 'recientes') {
      data.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
    } else if (orden === 'salario') {
      data.sort((a, b) => (b.salario_max ?? 0) - (a.salario_max ?? 0));
    }

    return data;
  }, [vacantes, search, modalidad, orden]);

  if (cargando) {
    return (
      <PortalLayout theme={t} navItems={postulantNav} user={{ nombre: '', rol: 'Postulante' }} pageTitle="Vacantes">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #DBEAFE', borderTopColor: '#2563EB', animation: 'spin 0.9s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>Cargando vacantes...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      theme={t}
      navItems={postulantNav}
      user={{ nombre: '', rol: 'Postulante' }}
      pageTitle="Vacantes"
      headerActions={
        <button
          onClick={() => navigate('/postulante/postulaciones')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: t.gradient, border: 'none', borderRadius: '10px',
            padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', boxShadow: `0 4px 14px ${t.accentGlow}`,
          }}
        >
          <CheckCircle size={14} />
          Mis postulaciones
        </button>
      }
    >
      <style>{`
        @keyframes floatBlob { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(15px,-20px) scale(1.05)} }
        .hero-blob { position:absolute; border-radius:50%; filter:blur(60px); pointer-events:none; animation:floatBlob 10s ease-in-out infinite; }
      `}</style>

      {vacanteSeleccionada && (
        <ModalVacante
          vacante={vacanteSeleccionada}
          onClose={() => setVacanteSeleccionada(null)}
          onAbrirReporte={(v) => setVacanteParaReportar(v)}
          onPostularse={marcarPostulada}
        />
      )}
      {vacanteParaReportar && (
        <ModalReporte
          vacante={vacanteParaReportar}
          onClose={() => setVacanteParaReportar(null)}
          onReportado={marcarReportada}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>

        {/* ── Hero ── */}
        <div
          style={{
            position: 'relative', borderRadius: '20px', overflow: 'hidden',
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #0ea5e9 100%)',
            padding: '32px 28px', color: '#fff', minHeight: '160px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px',
          }}
        >
          <div className="hero-blob" style={{ width: '300px', height: '300px', background: 'rgba(255,255,255,0.08)', top: '-80px', right: '-60px' }} />
          <div className="hero-blob" style={{ width: '200px', height: '200px', background: 'rgba(14,165,233,0.25)', bottom: '-60px', left: '30%', animationDelay: '3s' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8, fontWeight: 500 }}>
              Oportunidades laborales inclusivas
            </p>
            <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Vacantes compatibles con tu perfil
            </h1>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.82, maxWidth: '720px', lineHeight: 1.5 }}>
              Mostramos únicamente vacantes adaptadas a tu discapacidad registrada.
            </p>
          </div>

          <div
            style={{
              position: 'relative', zIndex: 1,
              background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
              padding: '14px 16px', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)', maxWidth: '520px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <Search size={16} style={{ color: '#fff', opacity: 0.85, flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar puesto o modalidad..."
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#fff', fontSize: '13px' }}
            />
          </div>
        </div>

        {/* ── KPIs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
          {[
            { label: 'Vacantes encontradas',  value: vacantesFiltradas.length,                                             icon: Briefcase, color: '#2563eb' },
            { label: 'Vacantes remotas',      value: vacantesFiltradas.filter((v) => v.modalidad === 'Remota').length,     icon: Sparkles,  color: '#0ea5e9' },
            { label: 'Vacantes híbridas',     value: vacantesFiltradas.filter((v) => v.modalidad === 'Híbrida').length,    icon: Clock,     color: '#7c3aed' },
            { label: 'Vacantes presenciales', value: vacantesFiltradas.filter((v) => v.modalidad === 'Presencial').length, icon: MapPin,    color: '#059669' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: '#fff', border: `1px solid ${t.border}`, borderRadius: '16px',
                padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
                boxShadow: '0 1px 4px rgba(15,23,41,0.05)',
              }}
            >
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: `${s.color}12`, border: `1px solid ${s.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
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

        {/* ── Error ── */}
        {error && (
          <div style={{ padding: '14px 20px', borderRadius: '14px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', fontSize: '14px', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Filtros ── */}
        <Card>
          <SectionHead title="Filtrar vacantes" sub="Filtra por modalidad u ordena los resultados" />
          <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {modalidades.map((m) => (
              <FilterButton key={m} active={modalidad === m} onClick={() => setModalidad(m)}>
                {m}
              </FilterButton>
            ))}
            <div style={{ width: '1px', height: '20px', background: t.border, margin: '0 4px' }} />
            <FilterButton active={orden === 'recientes'} onClick={() => setOrden('recientes')}>
              Más recientes
            </FilterButton>
            <FilterButton active={orden === 'salario'} onClick={() => setOrden('salario')}>
              Mayor salario
            </FilterButton>
          </div>
        </Card>

        {/* ── Lista de vacantes ── */}
        <Card>
          <SectionHead
            title="Vacantes compatibles con tu discapacidad"
            sub={`${vacantesFiltradas.length} resultado${vacantesFiltradas.length !== 1 ? 's' : ''} encontrado${vacantesFiltradas.length !== 1 ? 's' : ''}`}
          />

          {vacantesFiltradas.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0' }}>
              {vacantesFiltradas.map((v, i) => (
                <div
                  key={v.id_vacante}
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
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: t.accentSoft, border: `1px solid ${t.accentBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Briefcase size={16} style={{ color: t.accent }} />
                    </div>
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px',
                        background: v.estado === 'activa' ? '#d1fae5' : '#fee2e2',
                        color: v.estado === 'activa' ? '#065f46' : '#991b1b',
                        border: `1px solid ${v.estado === 'activa' ? '#6ee7b7' : '#fca5a5'}`,
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: v.estado === 'activa' ? '#059669' : '#dc2626' }} />
                      {v.estado === 'activa' ? 'Activa' : v.estado}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: t.textPrimary, lineHeight: 1.3 }}>
                    {v.titulo_puesto}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', marginTop: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px', color: t.textMuted, background: t.bgElevated,
                        border: `1px solid ${t.border}`, padding: '2px 8px', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', gap: '3px',
                      }}
                    >
                      <MapPin size={10} /> {v.modalidad}
                    </span>
                    {(v.discapacidades ?? []).map((d) => (
                      <span
                        key={d}
                        style={{
                          fontSize: '11px', color: t.accent, background: t.accentSoft,
                          border: `1px solid ${t.accentBorder}`, padding: '2px 8px',
                          borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px',
                        }}
                      >
                        <Accessibility size={9} /> {d}
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

                  {v.fecha_cierre && (
                    <p style={{ margin: '10px 0 0', fontSize: '11px', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} /> Cierra: {formatFecha(v.fecha_cierre)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '42px 20px', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px', height: '54px', borderRadius: '16px',
                  background: t.accentSoft, border: `1px solid ${t.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                }}
              >
                <Search size={22} style={{ color: t.accent }} />
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: t.textPrimary, fontWeight: 700 }}>
                No encontramos vacantes
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: t.textMuted }}>
                {vacantes.length === 0
                  ? 'No hay vacantes activas compatibles con tu discapacidad registrada.'
                  : 'Intenta cambiar los filtros o buscar otra palabra clave.'}
              </p>
            </div>
          )}
        </Card>
      </div>
      <ChatBubble/>
    </PortalLayout>
  );
}