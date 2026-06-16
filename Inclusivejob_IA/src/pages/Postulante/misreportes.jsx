import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
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

const POSTULACIONES = [
  {
    id: 1,
    vacante: 'Desarrollador Frontend',
    empresa: 'Tech Solutions SA',
    modalidad: 'Remoto',
    estado: 'entrevista',
    fecha: '2026-05-18',
  },
  {
    id: 2,
    vacante: 'Diseñador UX/UI',
    empresa: 'CreativeHub CDMX',
    modalidad: 'Híbrido',
    estado: 'pendiente',
    fecha: '2026-05-20',
  },
  {
    id: 3,
    vacante: 'QA Engineer',
    empresa: 'DataCorp MX',
    modalidad: 'Presencial',
    estado: 'aceptado',
    fecha: '2026-05-21',
  },
];

const ESTADO_STYLE = {
  pendiente: {
    bg: '#fef3c7',
    text: '#92400e',
    border: '#fde68a',
  },

  entrevista: {
    bg: '#ede9fe',
    text: '#5b21b6',
    border: '#c4b5fd',
  },

  aceptado: {
    bg: '#d1fae5',
    text: '#065f46',
    border: '#6ee7b7',
  },
};

function Badge({ estado }) {
  const s = ESTADO_STYLE[estado];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: '999px',
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {estado}
    </span>
  );
}

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

function SectionHead({ title, action, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 20px',
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '15px',
          color: t.textPrimary,
        }}
      >
        {title}
      </h2>

      <button
        onClick={onAction}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: t.accent,
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        {action}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default function PostulanteDashboard() {
  const navigate = useNavigate();

  return (
    <PortalLayout
      theme={t}
      navItems={postulantNav}
      user={MOCK_USER}
      pageTitle="Reportes realizados"
    >

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >

        {/* HERO */}

        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',

            background:
              'linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#0ea5e9 100%)',

            padding: '40px',

            color: '#fff',

            minHeight: '220px',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >

          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,.08)',
              top: '-80px',
              right: '-60px',
              filter: 'blur(70px)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'rgba(14,165,233,.25)',
              bottom: '-60px',
              left: '35%',
              filter: 'blur(70px)',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >

            <p
              style={{
                margin: '0 0 10px',
                fontSize: '15px',
                opacity: .85,
              }}
            >
              Seguimiento de procesos
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: '46px',
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Reportes realizadas
            </h1>

            <p
              style={{
                marginTop: '18px',
                fontSize: '16px',
                opacity: .88,
                maxWidth: '700px',
                lineHeight: 1.6,
              }}
            >
              Consulta los reportes realizados por ti a vacantes con informacion dudosa.
            </p>

          </div>

        </div>

        {/* CARD */}

        <Card>

          <SectionHead
            title="Mis postulaciones"
            action="Ver todas"
            onAction={() =>
              navigate('/postulante/postulaciones')
            }
          />

          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}
          >

            {POSTULACIONES.map((p, i) => (

              <li
                key={p.id}
                style={{
                  padding: '22px',

                  borderBottom:
                    i < POSTULACIONES.length - 1
                      ? `1px solid ${t.border}`
                      : 'none',
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >

                  <div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: '20px',
                        color: t.textPrimary,
                      }}
                    >
                      {p.vacante}
                    </h3>

                    <p
                      style={{
                        margin: '8px 0',
                        color: t.textMuted,
                      }}
                    >
                      {p.empresa}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: t.textMuted,
                      }}
                    >

                      <MapPin size={14} />

                      {p.modalidad}

                      •

                      {new Date(
                        p.fecha
                      ).toLocaleDateString(
                        'es-MX',
                        {
                          day: 'numeric',
                          month: 'short',
                        }
                      )}

                    </div>

                  </div>

                  <Badge estado={p.estado} />

                </div>

              </li>

            ))}

          </ul>

        </Card>

      </div>

    </PortalLayout>
  );
}