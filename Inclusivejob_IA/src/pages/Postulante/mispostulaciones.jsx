import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

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

  rechazado: {
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#fca5a5',
  },
};


function Badge({ estado }) {
  const s =
    ESTADO_STYLE[estado] ||
    ESTADO_STYLE.pendiente;

  return (
    <span
      style={{
        padding: '6px 14px',
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


function SectionHead({
  title,
  action,
  onAction,
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 22px',
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '16px',
        }}
      >
        {title}
      </h2>

      <button
        onClick={onAction}
        style={{
          border: 'none',
          background: 'transparent',
          display: 'flex',
          gap: '5px',
          cursor: 'pointer',
          color: t.accent,
          fontWeight: 600,
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

  const [
    postulaciones,
    setPostulaciones,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {
    cargarPostulaciones();
  }, []);


  async function cargarPostulaciones() {
    try {
      const res = await fetch(
        'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/postulaciones.php'
      );

      const data = await res.json();

      if (data.ok) {
        setPostulaciones(data.data);
      }

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  }


  return (
    <PortalLayout
      theme={t}
      navItems={postulantNav}
      user={MOCK_USER}
      pageTitle="Mis postulaciones"
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
            borderRadius: '24px',
            padding: '40px',
            color: '#fff',
            background:
              'linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#0ea5e9 100%)',
            minHeight: '220px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >

          <p
            style={{
              margin: '0 0 8px',
              opacity: .85,
            }}
          >
            Seguimiento de procesos
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: '44px',
              fontWeight: 800,
            }}
          >
            Estado de tus postulaciones
          </h1>

          <p
            style={{
              marginTop: '16px',
              maxWidth: '700px',
              lineHeight: 1.6,
            }}
          >
            Consulta el avance de cada solicitud
            y revisa en qué etapa del proceso te encuentras.
          </p>

        </div>


        <Card>

          <SectionHead
            title="Mis postulaciones"
          />

          {
            loading

              ? (

                <div
                  style={{
                    padding: '30px',
                  }}
                >
                  Cargando postulaciones...
                </div>

              ) : (

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                  }}
                >

                  {
                    postulaciones.map((p, i) => (

                      <li
                        key={p.id}
                        style={{
                          padding: '22px',

                          borderBottom:
                            i < postulaciones.length - 1
                              ? `1px solid ${t.border}`
                              : 'none',
                        }}
                      >

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >

                          <div>

                            <h3
                              style={{
                                margin: 0,
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

                              {
                                new Date(
                                  p.fecha
                                ).toLocaleDateString(
                                  'es-MX',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                  }
                                )
                              }

                            </div>

                          </div>

                          <Badge
                            estado={p.estado}
                          />

                        </div>

                      </li>

                    ))
                  }

                </ul>

              )
          }

        </Card>

      </div>

    </PortalLayout>
  );
}