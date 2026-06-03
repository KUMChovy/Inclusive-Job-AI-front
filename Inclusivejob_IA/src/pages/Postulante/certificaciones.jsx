import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  Eye,
  Pencil,
  Award,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';
import { postulantTheme as t } from '../../assets/Componentes/Portal/portalTheme';
import { postulantNav } from '../../assets/Componentes/Portal/navItems';

const MOCK_USER = {
  nombre: 'Luis',
  rol: 'Postulante',
  discapacidades: ['Visual'],
  completado: 100,
};

const CERTIFICACIONES = [
  {
    id: 1,
    nombre: 'React Developer Certification',
    emisor: 'Meta',
    fecha: '2025-03-10',
  },
  {
    id: 2,
    nombre: 'UX Design Fundamentals',
    emisor: 'Google',
    fecha: '2025-01-20',
  },
  {
    id: 3,
    nombre: 'Accesibilidad Web (WCAG)',
    emisor: 'W3C',
    fecha: '2024-11-05',
  },
];

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
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 700,
            color: t.textPrimary,
          }}
        >
          {title}
        </h2>

        {sub && (
          <p
            style={{
              margin: '2px 0 0',
              fontSize: '12px',
              color: t.textMuted,
            }}
          >
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
          }}
        >
          {action}
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 12px',
        borderRadius: '8px',
        border: `1px solid ${t.border}`,
        background: '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
        color: t.textPrimary,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export default function PostulanteDashboard() {
  const navigate = useNavigate();

  return (
    <PortalLayout
      theme={t}
      navItems={postulantNav}
      user={MOCK_USER}
      pageTitle="Certificaciones"
    >
      {/* ── Estilos responsive ── */}
      <style>{`
        .cert-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .cert-item-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .cert-item-btns {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-end;
        }
        @media (max-width: 640px) {
          .cert-grid {
            grid-template-columns: 1fr;
          }
          .cert-item-row {
            flex-direction: column;
            gap: 10px;
          }
          .cert-item-btns {
            flex-direction: row;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* ── Bienvenida ── */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: t.textPrimary }}>
          Hola, {MOCK_USER.nombre.split(' ')[0]} 👋
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: t.textMuted }}>
          Aquí tienes el CV que subiste y tus certificaciones.
        </p>
      </div>

      {/* ── Grid principal ── */}
      <div className="cert-grid">

        {/* ── Card CV ── */}
        <Card>
          <SectionHead title="Mi CV" />

          {/* Vista previa CV */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}` }}>
            <div
              style={{
                width: '100%',
                height: '220px',
                borderRadius: '10px',
                border: `1px solid ${t.border}`,
                background: '#f8f9fb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: t.textMuted,
                overflow: 'hidden',
              }}
            >
              {/* Reemplaza esto con: <img src={tuImagen} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
              <FileText size={36} color={t.textMuted} />
              <span style={{ fontSize: '12px' }}>Vista previa del CV</span>
            </div>
          </div>

          {/* Botones CV — centrados */}
          <div style={{ padding: '14px 20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <ActionBtn
              icon={<Eye size={13} />}
              label="Ver CV"
              onClick={() => navigate('/postulante/cv')}
            />
            <ActionBtn
              icon={<Pencil size={13} />}
              label="Editar CV"
              onClick={() => navigate('/postulante/cv/editar')}
            />
          </div>
        </Card>

        {/* ── Card Certificaciones ── */}
        <Card>
          <SectionHead
            title="Mis certificaciones"
            sub={`${CERTIFICACIONES.length} registradas`}
            action="Añadir"
          />

          <ul style={{ margin: 0, padding: '8px 20px 16px', listStyle: 'none' }}>
            {CERTIFICACIONES.map((c) => (
              <li
                key={c.id}
                style={{
                  padding: '12px 0',
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                <div className="cert-item-row">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={13} color={t.accent} />
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: t.textPrimary }}>
                        {c.nombre}
                      </p>
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: t.textMuted }}>
                      {c.emisor}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: t.textMuted }}>
                      {c.fecha}
                    </p>
                  </div>
                  <div className="cert-item-btns">
                    <ActionBtn
                      icon={<Eye size={11} />}
                      label="Ver"
                      onClick={() => navigate(`/postulante/certificaciones/${c.id}`)}
                    />
                    <ActionBtn
                      icon={<Pencil size={11} />}
                      label="Editar"
                      onClick={() => navigate(`/postulante/certificaciones/${c.id}/editar`)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

      </div>
    </PortalLayout>
  );
}