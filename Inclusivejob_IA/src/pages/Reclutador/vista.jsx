// ================================================================
// TEMPLATE PUTOS
// ================================================================

// ================================================================

import { useState } from 'react';
// ↓ 1. Importa el Layout genérico
import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';

// ↓ 2. Elige UNO de los dos temas según el rol:
import { reclutadorTheme } from '../../assets/Componentes/Portal/portalTheme';
// import { postulantTheme }  from '../../assets/Componentes/Portal/portalTheme';

// ↓ 3. Elige el menú de navegación segun el rol:
import { reclutadorNav } from '../../assets/Componentes/Portal/navItems';
// import { postulantNav } from '../../assets/Componentes/Portal/navItems';

// ↓ 4. Iconos de Lucide es la que ocupe para los iconos bonitos
import { Plus, Search } from 'lucide-react';

// ================================================================
// Asigna el tema a "t" para escribir t.accent, t.textPrimary, etc.
// estos son los estilos 

// ================================================================
const t = reclutadorTheme;
// const t = postulantTheme;

// ================================================================
// COMPONENTE PRINCIPAL le cambian el nomrbre ala funcion weyes 
// ================================================================
export default function vista() {
  // ── Tu estado local ──────────────────────────────────────────
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Datos del usuario (reemplaza con tu auth context) es lo del login ────────
  const user = { nombre: 'Carlos Ramírez', rol: 'Reclutador' };

  return (
    /*
     * PortalLayout acepta estas props:
     *
     * theme          → OBLIGATORIO. El tema del portal (t).
     * navItems       → OBLIGATORIO. Array de items del nav.
     * user           → { nombre, rol } — aparece en sidebar y header.
     * pageTitle      → Texto del título en el header.
     * notifications  → Número de notificaciones (punto rojo en campana) --- chance y se elimina jaja .
     * headerActions  → ReactNode — botones extra a la derecha del header si los ocupan xd .
     *
     * El contenido de tu vista va como children dentro del layout.
     */
    <PortalLayout
      theme={t}
      navItems={reclutadorNav}      // ← o postulantNav
      user={user}
      pageTitle="Nombre de mi vista"
      notifications={0}
      headerActions={
        // Botón de acción principal en el header (opcional)
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: t.gradient,
            border: 'none', borderRadius: '10px',
            padding: '8px 16px', color: '#fff',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 4px 14px ${t.accentGlow}`,
          }}
        >
          <Plus size={14} /> Acción principal
        </button>
      }
    >
      {/* ============================================================
          Contenido aqui 
          Solo necesitan agregar tus secciones y componentes.
          ============================================================ */}

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Encabezado de página ──────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: t.textPrimary, letterSpacing: '-0.4px' }}>
              Título de la sección
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: t.textSecondary }}>
              Descripción breve de esta vista.
            </p>
          </div>
        </div>

        {/* ── Ejemplo: Card básica ──────────────────────────────── */}
        {/*
          Usa t.bgSurface para el fondo de cards.
          Usa t.border para los bordes.
          Usa t.textPrimary / t.textSecondary / t.textMuted para textos.
          Usa t.accent para el color de acento (links, íconos activos, etc.)
        */}
        <div style={{
          background: t.bgSurface,            // ← fondo de la card
          border: `1px solid ${t.border}`,    // ← borde sutil
          borderRadius: '16px',
          padding: '20px',
          color: t.textPrimary,               // ← color de texto principal
        }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: t.textPrimary }}>
            Mi card de ejemplo
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: t.textSecondary }}>
            Contenido de la card. Usa <code>t.textSecondary</code> para textos secundarios.
          </p>
        </div>

        {/* ── Ejemplo: Botón de acción ──────────────────────────── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>

          {/* Botón primario */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: t.gradient, border: 'none', borderRadius: '10px',
            padding: '9px 18px', color: '#fff',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>
            <Plus size={14} /> Botón primario
          </button>

          {/* Botón secundario */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: t.accentSoft,
            border: `1px solid ${t.accentBorder}`,
            borderRadius: '10px', padding: '9px 18px',
            color: t.accent, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>
            <Search size={14} /> Botón secundario
          </button>

          {/* Botón ghost */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'transparent',
            border: `1px solid ${t.border}`,
            borderRadius: '10px', padding: '9px 18px',
            color: t.textSecondary, fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}>
            Botón ghost
          </button>
        </div>

        {/* ── Ejemplo: Badge / Chip ────────────────────────────── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Badge de acento */}
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: t.accentSoft, color: t.accent, border: `1px solid ${t.accentBorder}` }}>
            Activo
          </span>
          {/* Badge de éxito */}
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>
            Aprobado
          </span>
          {/* Badge de advertencia */}
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(245,158,11,0.25)' }}>
            Pendiente
          </span>
          {/* Badge de error */}
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.25)' }}>
            Rechazado
          </span>
        </div>

        {/* ── Ejemplo: Input ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '400px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: t.textSecondary }}>
            Etiqueta del campo
          </label>
          <input
            type="text"
            placeholder="Escribe aquí..."
            style={{
              height: '40px', padding: '0 12px',
              background: t.bgElevated,
              border: `1px solid ${t.border}`,
              borderRadius: '10px',
              color: t.textPrimary, fontSize: '13.5px', outline: 'none',
              // En :focus agrega: borderColor: t.accent, boxShadow: `0 0 0 3px ${t.accentGlow}`
            }}
          />
        </div>

        {/* ── Aquí va tu implementación real ───────────────────── */}
        {/* borra desde arriba hasta aquí y pon tu contenido     */}

      </div>
    </PortalLayout>
  );
}

// ================================================================
// CÓMO REGISTRAR TU RUTA EN App.jsx
// ================================================================
//
// 1. Importa tu componente al inicio del App.jsx:
//
//    import NombreDeTuVista from './pages/Reclutador/NombreDeTuVista';
//
// 2. Agrega la ruta dentro del bloque correspondiente:
//
//    <Route path="/reclutador" element={<RequireAuth><ReclutadorLayout /></RequireAuth>}>
//
//      <Route path="nombre-ruta" element={<NombreDeTuVista />} />
//    </Route>
//
// 3. Agrega el item al navItems.js si necesitas que aparezca en el menú:
//
//    // En src/assets/Componentes/Portal/navItems.js
//    import { TuIcono } from 'lucide-react';
//
//    export const reclutadorNav = [
//      ...itemsExistentes,
//      { to: '/reclutador/nombre-ruta', label: 'Mi Vista', icon: TuIcono },
//    ];
//
