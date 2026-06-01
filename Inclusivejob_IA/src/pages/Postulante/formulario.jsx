import React from "react";
import { postulantTheme } from '../../assets/Componentes/Portal/portalTheme';



export default function Formulario() {
  const [active, setActive] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [openSection, setOpenSection] = React.useState(0);
  const t = postulantTheme;
  const c = {
    bgPage: "#F8FBFF",
    bgSoft: "#EFF6FF",
    bgSurface: "#FFFFFF",
    bgElevated: "#F8FBFF",

    accent: "#2563EB",
    accent2: "#0EA5E9",
    accentSoft: "rgba(37, 99, 235, 0.08)",
    accentBorder: "rgba(37, 99, 235, 0.22)",
    accentGlow: "rgba(37, 99, 235, 0.18)",

    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#64748B",
    border: "#DBEAFE",

    gradient: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        background: `linear-gradient(180deg, ${t.bgElevated} 0%, ${t.accentSoft} 100%)`,
      }}
    >

      {/* FORMULARIO */}

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          padding: '70px 18px',
          display: 'flex',
          alignItems: 'center',
          fontFamily:
            "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "linear-gradient(180deg, #F8FBFF 0%, #EFF6FF 35%, #93C5FD 65%, #203361 100%)",
        }}
      >


        {/* CÍRCULOS DECORATIVOS DEL FONDO */}
        {/* CÍRCULOS DECORATIVOS DEL FONDO */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {/* CÍRCULO GRANDE SUPERIOR DERECHO */}
          <div
            style={{
              position: 'absolute',
              top: '-140px',
              right: '-120px',
              width: '390px',
              height: '390px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.20)',
              filter: 'blur(1px)',
            }}
          />

          {/* CÍRCULO GRANDE IZQUIERDO */}
          <div
            style={{
              position: 'absolute',
              top: '190px',
              left: '-170px',
              width: '350px',
              height: '350px',
              borderRadius: '999px',
              background: 'rgba(14, 165, 233, 0.13)',
              border: '1px solid rgba(14, 165, 233, 0.22)',
            }}
          />

          {/* HALO CENTRAL DIFUMINADO */}
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '620px',
              height: '620px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.07)',
              filter: 'blur(18px)',
              opacity: 0.75,
            }}
          />

          {/* CÍRCULO INFERIOR DERECHO */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '55px',
              width: '240px',
              height: '240px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.08)',
              border: `1px solid ${t.accentBorder}`,
            }}
          />

          {/* CÍRCULO INFERIOR CENTRAL */}
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              left: '35%',
              width: '340px',
              height: '340px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.65)',
              border: `1px solid ${t.accentBorder}`,
            }}
          />

          {/* CÍRCULO PEQUEÑO SUPERIOR IZQUIERDO */}
          <div
            style={{
              position: 'absolute',
              top: '95px',
              left: '90px',
              width: '82px',
              height: '82px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.07)',
              border: '1px solid rgba(37, 99, 235, 0.18)',
            }}
          />

          {/* CÍRCULO PEQUEÑO MEDIO DERECHO */}
          <div
            style={{
              position: 'absolute',
              top: '42%',
              right: '13%',
              width: '96px',
              height: '96px',
              borderRadius: '999px',
              background: 'rgba(14, 165, 233, 0.09)',
              border: '1px solid rgba(14, 165, 233, 0.18)',
            }}
          />

          {/* CÍRCULO OUTLINE GRANDE */}
          <div
            style={{
              position: 'absolute',
              top: '52%',
              left: '8%',
              width: '190px',
              height: '190px',
              borderRadius: '999px',
              background: 'transparent',
              border: '1px solid rgba(37, 99, 235, 0.14)',
            }}
          />

          {/* CÍRCULO OUTLINE PEQUEÑO */}
          <div
            style={{
              position: 'absolute',
              bottom: '32%',
              right: '28%',
              width: '64px',
              height: '64px',
              borderRadius: '999px',
              background: 'transparent',
              border: '1px solid rgba(14, 165, 233, 0.20)',
            }}
          />

          {/* CÍRCULO MINI 1 */}
          <div
            style={{
              position: 'absolute',
              top: '28%',
              left: '24%',
              width: '28px',
              height: '28px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.18)',
            }}
          />

          {/* CÍRCULO MINI 2 */}
          <div
            style={{
              position: 'absolute',
              bottom: '18%',
              left: '16%',
              width: '38px',
              height: '38px',
              borderRadius: '999px',
              background: 'rgba(14, 165, 233, 0.16)',
            }}
          />

          {/* CÍRCULO MINI 3 */}
          <div
            style={{
              position: 'absolute',
              top: '18%',
              right: '34%',
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.12)',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '520px',
            height: '520px',
            borderRadius: '999px',
            background: t.accentSoft,
            opacity: 0.35,
            filter: 'blur(10px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '210px',
            left: '-150px',
            width: '320px',
            height: '320px',
            borderRadius: '999px',
            background: "rgba(14, 165, 233, 0.12)",
            border: "1px solid rgba(14, 165, 233, 0.22)",
            opacity: 0.55,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            right: '70px',
            width: '220px',
            height: '220px',
            borderRadius: '999px',
            background: t.accentSoft,
            border: `1px solid ${t.accentBorder}`,
            opacity: 0.65,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-130px',
            left: '32%',
            width: '300px',
            height: '300px',
            borderRadius: '999px',
            background: t.bgSurface,
            border: `1px solid ${t.accentBorder}`,
            opacity: 0.45,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1050px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >

          {/* ENCABEZADO */}
          <div
            style={{
              background: "linear-gradient(135deg, #2448C7 0%, #2563EB 45%, #0EA5E9 100%)",
              borderRadius: '26px',
              padding: '34px',
              boxShadow: '0 24px 60px rgba(37, 99, 235, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              color: '#fff',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-80px',
                right: '-70px',
                width: '240px',
                height: '240px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.16)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-70px',
                width: '230px',
                height: '230px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.10)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  marginBottom: '16px',
                }}
              >
                ✨ Evaluación inicial
              </span>

              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(32px, 4vw, 46px)',
                  lineHeight: 1.1,
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '-1px',
                }}
              >
                Evaluación de Perfil
              </h1>

              <p
                style={{
                  margin: '14px 0 0',
                  maxWidth: '760px',
                  fontSize: '15px',
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.86)',
                }}
              >
                Ayúdanos a conocer tus necesidades, habilidades y experiencia profesional
                para recomendarte oportunidades laborales más compatibles contigo.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginTop: '24px',
                }}
              >
                {['Accesibilidad', 'Experiencia', 'Habilidades', 'Perfil profesional'].map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.14)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
            }}
          >
            {[

              {
                label: 'Experiencia',
                value: 'Valorada',
                desc: 'Tomamos en cuenta tu trayectoria'
              },


              {
                label: 'Perfil laboral',
                value: 'Inicial',
                desc: 'Datos clave para conocer tus necesidades'
              },
              {
                label: 'Ajustes requeridos',
                value: 'Personalizados',
                desc: 'Información para adaptar oportunidades'
              },

            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(37, 99, 235, 0.14)',
                  borderRadius: '18px',
                  padding: '18px',
                  boxShadow: '0 12px 30px rgba(37, 99, 235, 0.08)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#64748B',
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </p>

                <h3
                  style={{
                    margin: '6px 0 4px',
                    fontSize: '24px',
                    color: '#0F172A',
                    fontWeight: 900,
                  }}
                >
                  {item.value}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#64748B',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {[
              {
                icon: '♿',
                title: 'Sobre la discapacidad',
                desc: 'Información necesaria para adaptar oportunidades laborales a tus necesidades.',
                content: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                    {/* Pregunta 1 */}
                    <div>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '14px',
                          fontWeight: 750,
                          color: t.textPrimary,
                        }}
                      >
                        ¿Cuál es tu tipo de discapacidad?
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {[
                          'Motriz',
                          'Visual',
                          'Auditiva',
                          'Cognitiva',
                          'Psicosocial',
                          'Otra',
                          'Prefiero no decirlo',
                        ].map((op) => (
                          <label
                            key={op}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '14px 15px',
                              borderRadius: '14px',
                              border: `1px solid ${t.border}`,
                              background: t.bgElevated,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              color: t.textSecondary,
                              fontSize: '13px',
                              fontWeight: 500,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = t.accent;
                              e.currentTarget.style.background = t.accentSoft;
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = t.border;
                              e.currentTarget.style.background = t.bgElevated;
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <input
                              type="radio"
                              name="tipoDiscapacidad"
                              style={{
                                accentColor: t.accent,
                              }}
                            />
                            <span>{op}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta 2 */}
                    <div>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '14px',
                          fontWeight: 750,
                          color: t.textPrimary,
                        }}
                      >
                        ¿En qué consiste tu discapacidad y requieres ajustes en tu entorno de trabajo?
                      </p>

                      <textarea
                        name="descripcionDiscapacidad"
                        rows="5"
                        placeholder="Describe brevemente tu situación y los ajustes que consideras necesarios..."
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '15px',
                          borderRadius: '14px',
                          border: `1px solid ${t.border}`,
                          background: t.bgElevated,
                          color: t.textPrimary,
                          fontSize: '13.5px',
                          outline: 'none',
                          resize: 'none',
                          lineHeight: 1.6,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = t.accent;
                          e.currentTarget.style.boxShadow = `0 0 0 4px ${t.accentGlow}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = t.border;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Pregunta 3 */}
                    <div>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '14px',
                          fontWeight: 750,
                          color: t.textPrimary,
                        }}
                      >
                        ¿Puedes realizar esfuerzo físico?
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {['Sí', 'Con algunas limitaciones', 'No'].map((op) => (
                          <label
                            key={op}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '14px 15px',
                              borderRadius: '14px',
                              border: `1px solid ${t.border}`,
                              background: t.bgElevated,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              color: t.textSecondary,
                              fontSize: '13px',
                              fontWeight: 500,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = t.accent;
                              e.currentTarget.style.background = t.accentSoft;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = t.border;
                              e.currentTarget.style.background = t.bgElevated;
                            }}
                          >
                            <input
                              type="radio"
                              name="esfuerzoFisico"
                              style={{
                                accentColor: t.accent,
                              }}
                            />
                            <span>{op}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                icon: '💼',
                title: 'Perfil profesional',
                desc: 'Información sobre tu experiencia, habilidades y presentación profesional.',
                content: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                    {/* Pregunta 1 */}
                    <div>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '14px',
                          fontWeight: 750,
                          color: t.textPrimary,
                        }}
                      >
                        ¿Cuántos años tienes de experiencia y en qué?
                      </p>

                      <textarea
                        name="experiencia"
                        rows="4"
                        placeholder="Ejemplo: Tengo 2 años de experiencia en atención al cliente, ventas o soporte técnico..."
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '15px',
                          borderRadius: '14px',
                          border: `1px solid ${t.border}`,
                          background: t.bgElevated,
                          color: t.textPrimary,
                          fontSize: '13.5px',
                          outline: 'none',
                          resize: 'none',
                          lineHeight: 1.6,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = t.accent;
                          e.currentTarget.style.boxShadow = `0 0 0 4px ${t.accentGlow}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = t.border;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Pregunta 2 */}
                    <div>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '14px',
                          fontWeight: 750,
                          color: t.textPrimary,
                        }}
                      >
                        ¿Cuáles son tus habilidades?
                      </p>

                      <textarea
                        name="habilidades"
                        rows="4"
                        placeholder="Ejemplo: Comunicación, manejo de computadora, trabajo en equipo, organización, atención al cliente..."
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '15px',
                          borderRadius: '14px',
                          border: `1px solid ${t.border}`,
                          background: t.bgElevated,
                          color: t.textPrimary,
                          fontSize: '13.5px',
                          outline: 'none',
                          resize: 'none',
                          lineHeight: 1.6,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = t.accent;
                          e.currentTarget.style.boxShadow = `0 0 0 4px ${t.accentGlow}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = t.border;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Pregunta 3 */}
                    <div>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '14px',
                          fontWeight: 750,
                          color: t.textPrimary,
                        }}
                      >
                        Ingresa foto de perfil profesional
                      </p>

                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          minHeight: '185px',
                          boxSizing: 'border-box',
                          border: `2px dashed ${t.accentBorder}`,
                          background: t.accentSoft,
                          borderRadius: '18px',
                          cursor: 'pointer',
                          padding: '26px',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = t.accent;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = `0 14px 35px ${t.accentGlow}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = t.accentBorder;
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '16px',
                            background: t.bgSurface,
                            border: `1px solid ${t.accentBorder}`,
                            color: t.accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px',
                            marginBottom: '12px',
                          }}
                        >
                          📷
                        </div>

                        <p
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: 700,
                            color: t.textPrimary,
                          }}
                        >
                          Haz clic para subir una imagen
                        </p>

                        <p
                          style={{
                            margin: '5px 0 0',
                            fontSize: '12px',
                            color: t.textMuted,
                          }}
                        >
                          Formatos recomendados: JPG, PNG o WEBP
                        </p>

                        <input
                          type="file"
                          name="fotoPerfil"
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                ),
              },
            ].map((section, index) => {
              const isOpen = openSection === index;

              return (
                <div
                  key={section.title}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* HEADER DEL ACORDEÓN */}
                  <button
                    type="button"
                    onClick={() => setOpenSection(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '18px',
                      cursor: 'pointer',
                      background: isOpen
                        ? `linear-gradient(135deg, ${t.accentSoft}, ${t.bgSurface})`
                        : t.bgSurface,
                      border: `1px solid ${isOpen ? t.accentBorder : t.border}`,
                      borderRadius: '22px',
                      padding: '20px',
                      textAlign: 'left',
                      transition: 'all 0.25s ease',
                      boxShadow: isOpen
                        ? `0 18px 40px ${t.accentGlow}`
                        : '0 10px 28px rgba(15, 23, 42, 0.04)',

                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <span
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '15px',
                          background: t.accentSoft,
                          border: `1px solid ${t.accentBorder}`,
                          color: t.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          flexShrink: 0,
                        }}
                      >
                        {section.icon}
                      </span>

                      <div>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: 800,
                            color: t.textPrimary,
                          }}
                        >
                          {section.title}
                        </h2>

                        <p
                          style={{
                            margin: '4px 0 0',
                            fontSize: '12.5px',
                            color: t.textSecondary,
                            lineHeight: 1.5,
                          }}
                        >
                          {section.desc}
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '999px',
                        background: isOpen
                          ? `linear-gradient(135deg, ${t.accentSoft}, ${t.bgSurface})`
                          : t.bgElevated,
                        border: `1px solid ${isOpen ? t.accentBorder : t.border}`,
                        color: isOpen ? t.accent : t.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        boxShadow: isOpen
                          ? '0 18px 40px rgba(37, 99, 235, 0.18)'
                          : '0 12px 30px rgba(15, 23, 42, 0.05)',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* CONTENIDO */}
                  <div
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      maxHeight: isOpen ? '1300px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                      transition: 'all 0.45s ease',
                      paddingTop: isOpen ? '14px' : '0px',
                    }}
                  >
                    <div
                      style={{
                        background: t.bgSurface,
                        border: `1px solid ${t.border}`,
                        borderRadius: '18px',
                        padding: '22px',
                        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      {section.content}
                    </div>
                  </div>
                </div>
              );
            })}


            {/* BOTÓN FINAL */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(37, 99, 235, 0.14)',
                borderRadius: '22px',
                padding: '0',
                textAlign: 'center',
                marginTop: '10px',
                boxShadow: '0 16px 40px rgba(37, 99, 235, 0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '8px',
                  background: 'linear-gradient(90deg, #2448C7 0%, #2563EB 45%, #0EA5E9 100%)',
                }}
              />

              <div style={{ padding: '26px' }}>
                <p
                  style={{
                    margin: '0 auto 18px',
                    maxWidth: '720px',
                    fontSize: '13.5px',
                    lineHeight: 1.7,
                    color: '#475569',
                  }}
                >
                  Al enviar esta evaluación, podremos crear un perfil más completo y
                  recomendar oportunidades laborales más compatibles contigo.
                </p>

                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #2448C7 0%, #2563EB 50%, #0EA5E9 100%)',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '13px 28px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 14px 30px rgba(37, 99, 235, 0.32)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 18px 40px rgba(37, 99, 235, 0.38)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 14px 30px rgba(37, 99, 235, 0.32)';
                  }}
                >
                  Enviar evaluación
                  <span>→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>


    </div>

  );
}