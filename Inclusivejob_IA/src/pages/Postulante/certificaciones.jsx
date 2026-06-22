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
        boxShadow: '0 1px 4px rgba(15,23,41,.05)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({
  title,
  sub,
  action,
  onAction,
}) {
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
              margin: '4px 0 0',
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
            gap: '4px',
            alignItems: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
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

function ActionBtn({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: '10px',
        border: `1px solid ${t.border}`,
        background: '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
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
      pageTitle="Capacitaciones"
    >

      <style>{`

        .cards-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        .cert-row{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
        }

        .cert-btns{
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        @media(max-width:900px){

          .cards-grid{
            grid-template-columns:1fr;
          }

          .cert-row{
            flex-direction:column;
            gap:14px;
          }

          .cert-btns{
            flex-direction:row;
          }

        }

      `}</style>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
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

            marginBottom: '28px',

            display: 'flex',
            alignItems: 'center',
          }}
        >

          <div
            style={{
              position: 'absolute',
              width: '340px',
              height: '340px',
              borderRadius: '50%',
              background:
                'rgba(255,255,255,.08)',

              top: '-90px',
              right: '-80px',

              filter: 'blur(70px)',
            }}
          />

          <div
            style={{
              position: 'absolute',

              width: '250px',
              height: '250px',

              borderRadius: '50%',

              background:
                'rgba(14,165,233,.25)',

              left: '35%',
              bottom: '-90px',

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
                margin: 0,
                opacity: .85,
              }}
            >
              Perfil profesional
            </p>

            <h1
              style={{
                margin: '10px 0',

                fontSize: '44px',

                fontWeight: 800,

                lineHeight: 1.1,
              }}
            >
              CV y capacitaciones
            </h1>

            <p
              style={{
                maxWidth: '700px',

                fontSize: '16px',

                opacity: .9,

                lineHeight: 1.6,
              }}
            >
              Mantén actualizado tu currículum y agrega
              certificaciones para destacar frente a
              reclutadores.
            </p>

          </div>

        </div>

        {/* GRID */}

        <div className="cards-grid">

          {/* CV */}

          <Card>

          <SectionHead
          title="Mi CV"
          />

          <div
          style={{
          padding:'20px',
          borderBottom:
          `1px solid ${t.border}`,
          }}
          >

          <iframe

          title="Vista previa CV"

          src=
          'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/cv.php'

          style={{

          width:'100%',

          height:'420px',

          border:'none',

          borderRadius:'12px',

          background:'#f8f9fb',

          }}

          >

          </iframe>

          </div>


          <div
          style={{
          padding:'18px',

          display:'flex',

          justifyContent:'center',

          gap:'10px',
          }}
          >

          <ActionBtn

          icon={
          <Eye size={13}/>
          }

          label="Ver CV"

          onClick={()=>

          window.open(

          'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/cv.php',

          '_blank'

          )

          }

          />


          <ActionBtn

          icon={
          <Pencil size={13}/>
          }

          label="Editar CV"

          onClick={()=>

          navigate(
          '/postulante/cv/editar'
          )

          }

          />

          </div>

          </Card>

          {/* CERTIFICACIONES */}

          <Card>

            <SectionHead
              title="Mis certificaciones"
              sub={`${CERTIFICACIONES.length} registradas`}
              action="Añadir"
            />

            <ul
              style={{
                margin: 0,
                padding:
                  '10px 20px 16px',

                listStyle: 'none',
              }}
            >

              {CERTIFICACIONES.map(
                (c) => (

                  <li
                    key={c.id}
                    style={{
                      padding:
                        '14px 0',

                      borderBottom:
                        `1px solid ${t.border}`,
                    }}
                  >

                    <div className="cert-row">

                      <div>

                        <div
                          style={{
                            display:
                              'flex',

                            gap: '8px',

                            alignItems:
                              'center',
                          }}
                        >

                          <Award
                            size={14}
                            color={
                              t.accent
                            }
                          />

                          <strong>
                            {c.nombre}
                          </strong>

                        </div>

                        <p>
                          {c.emisor}
                        </p>

                        <small>
                          {c.fecha}
                        </small>

                      </div>

                      <div className="cert-btns">

                        <ActionBtn
                          icon={
                            <Eye size={11} />
                          }
                          label="Ver"
                          onClick={() =>
                            navigate(
                              `/postulante/certificaciones/${c.id}`
                            )
                          }
                        />

                        <ActionBtn
                          icon={
                            <Pencil size={11} />
                          }
                          label="Editar"
                          onClick={() =>
                            navigate(
                              `/postulante/certificaciones/${c.id}/editar`
                            )
                          }
                        />

                      </div>

                    </div>

                  </li>

                )
              )}

            </ul>

          </Card>

        </div>

      </div>

    </PortalLayout>
  );
}