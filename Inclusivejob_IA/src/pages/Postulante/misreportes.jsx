import { useEffect, useState } from 'react';

import {
  MapPin,
  Eye,
  X,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';

import {
  postulantTheme as t,
} from '../../assets/Componentes/Portal/portalTheme';

import {
  postulantNav,
} from '../../assets/Componentes/Portal/navItems';

const MOCK_USER = {
  nombre: 'Luis',
  rol: 'Postulante',
};

function Card({ children }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${t.border}`,
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(15,23,41,.05)',
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ title }) {
  return (
    <div
      style={{
        padding: '18px 22px',
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 700,
          color: t.textPrimary,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ───────────────────────────────
   MODAL (RESPETA EL ORIGINAL)
─────────────────────────────── */
function ModalReporte({ reporte, onClose }) {
  if (!reporte) return null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

        {/* HEADER estilo original */}
        <div
          style={{
            background:
              'linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#0ea5e9 100%)',
            padding: '24px 24px 20px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: '0 0 3px',
                  fontSize: '19px',
                  fontWeight: 500,
                  color: '#fff',
                }}
              >
                Detalle del reporte
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {reporte.vacante}
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* BADGES estilo original */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            >
              <MapPin size={10} /> {reporte.modalidad}
            </span>

            <span
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            >
              📅 {new Date(reporte.fecha).toLocaleDateString('es-MX')}
            </span>
          </div>
        </div>

        {/* BODY estilo original */}
        <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1 }}>

          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '16px',
            }}
          >
            <p
              style={{
                margin: '0 0 2px',
                fontSize: '11px',
                color: '#2563eb',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Motivo del reporte
            </p>

            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: '#1e40af',
                lineHeight: 1.5,
              }}
            >
              {reporte.motivo}
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: `1px solid ${t.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              border: `1px solid ${t.border}`,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

export default function PostulanteDashboard() {

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // ✅ estado del modal
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  async function cargarReportes() {
    try {
      const res = await fetch(
        'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/reportes.php'
      );

      const data = await res.json();

      if (data.ok) {
        setReportes(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const reportesFiltrados = reportes.filter((r) => {
    const texto = `
      ${r.vacante || ''}
      ${r.modalidad || ''}
      ${r.motivo || ''}
      ${r.fecha || ''}
    `.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <PortalLayout
      theme={t}
      navItems={postulantNav}
      user={MOCK_USER}
      pageTitle="Reportes realizados"
    >

      {/* MODAL INYECTADO */}
      {reporteSeleccionado && (
        <ModalReporte
          reporte={reporteSeleccionado}
          onClose={() => setReporteSeleccionado(null)}
        />
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div style={{
          borderRadius: '24px',
          padding: '40px',
          color: '#fff',
          background: 'linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#0ea5e9 100%)',
          minHeight: '220px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <p style={{ margin: '0 0 8px', opacity: .85 }}>
            Seguimiento de reportes
          </p>

          <h1 style={{ margin: 0, fontSize: '44px', fontWeight: 800 }}>
            Reportes realizados
          </h1>

          <p style={{ marginTop: '16px', maxWidth: '700px', lineHeight: 1.6 }}>
            Consulta los reportes que realizaste sobre vacantes.
          </p>
        </div>

        <Card>
          <SectionHead title="Mis reportes" />

          <div style={{ padding: '20px 22px', borderBottom: `1px solid ${t.border}` }}>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por vacante, ubicación o motivo..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                outline: 'none',
                fontSize: '14px',
                color: t.textPrimary,
                background: '#fff',
              }}
            />
          </div>

          {loading ? (
            <div style={{ padding: '30px' }}>Cargando reportes...</div>
          ) : reportesFiltrados.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: t.textMuted }}>
              {busqueda ? 'No se encontraron reportes' : 'Sin reportes realizados'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['VACANTE', 'UBICACIÓN', 'MOTIVO', 'FECHA', 'ACCIONES'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '18px 22px',
                          textAlign: 'left',
                          fontSize: '13px',
                          letterSpacing: '1px',
                          fontWeight: 600,
                          color: t.textMuted,
                          borderBottom: `1px solid ${t.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {reportesFiltrados.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: i < reportesFiltrados.length - 1
                          ? `1px solid ${t.border}`
                          : 'none',
                      }}
                    >
                      <td style={{ padding: '22px' }}>
                        <div style={{ fontWeight: 600, fontSize: '18px', color: t.textPrimary }}>
                          {r.vacante}
                        </div>
                      </td>

                      <td style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: t.textMuted }}>
                          <MapPin size={14} />
                          {r.modalidad}
                        </div>
                      </td>

                      <td style={{ padding: '22px', maxWidth: '350px' }}>
                        <div
                          style={{
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: t.textPrimary,
                          }}
                        >
                          {r.motivo}
                        </div>
                      </td>

                      <td style={{ padding: '22px', whiteSpace: 'nowrap' }}>
                        {new Date(r.fecha).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                    <td style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>

                        {/* VER REPORTE */}
                        <button
                        onClick={() => setReporteSeleccionado(r)}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: `1px solid ${t.border}`,
                            background: '#fff',
                            borderRadius: '10px',
                            cursor: 'pointer',
                        }}
                        >
                        <Eye size={16} color={t.accent} />
                        </button>

                        {/* EDITAR REPORTE */}
                        <button
                        onClick={() => console.log('Editar reporte', r.id)}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: `1px solid #93c5fd`,
                            background: '#eff6ff',
                            borderRadius: '10px',
                            cursor: 'pointer',
                        }}
                        >
                        ✏️
                        </button>

                        {/* DESHACER / ELIMINAR REPORTE */}
                        <button
                        onClick={() => console.log('Eliminar reporte', r.id)}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: `1px solid #fecaca`,
                            background: '#fff5f5',
                            borderRadius: '10px',
                            cursor: 'pointer',
                        }}
                        >
                        <X size={16} color="#dc2626" />
                        </button>

                    </div>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

    </PortalLayout>
  );
}