
// ============================================================
// HEADER REUTILIZABLE PARA PORTALES (Reclutador / Postulante)
//
// Props:
//   theme           → objeto de tema
//   onMobileMenuOpen→ () => void
//   title           → string (página actual, opcional)
//   actions         → ReactNode (botones extra en el header)
//   user            → { nombre, rol }
// ============================================================

import { Menu, Bell, Search, ChevronRight } from 'lucide-react';

export default function PortalHeader({
  theme,
  onMobileMenuOpen,
  title,
  actions,
  user = {},
  notifications = 0,
}) {
  const t = theme;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        width: '100%',
        height: '64px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 20px',
        background: t.headerBg,
        borderBottom: `1px solid ${t.headerBorder}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Hamburger mobile */}
      <button
        onClick={onMobileMenuOpen}
        aria-label="Abrir menú"
        style={{
          display: 'none', // se muestra con media query vía className
          alignItems: 'center', justifyContent: 'center',
          padding: '7px', borderRadius: '8px',
          border: `1px solid ${t.border}`,
          background: 'transparent', cursor: 'pointer',
          color: t.textSecondary, flexShrink: 0,
        }}
        className="lg:!hidden !flex"
      >
        <Menu size={18} />
      </button>

      {/* Título de página */}
      {title && (
        <div className="hidden sm:flex" style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 600,
            color: t.textPrimary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </h1>
        </div>
      )}

      <div style={{ flex: 1 }} className={title ? 'sm:hidden' : ''} />

      {/* Acciones custom (botones de la página) */}
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {actions}
        </div>
      )}

      {/* Buscador — desktop */}
      <div
        className="hidden md:flex"
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          padding: '0 12px',
          height: '36px',
          borderRadius: '10px',
          border: `1px solid ${t.border}`,
          background: t.bgElevated,
          flexShrink: 0,
        }}
      >
        <Search size={14} style={{ color: t.textMuted, flexShrink: 0 }} />
        <input
          type="search"
          placeholder="Buscar..."
          aria-label="Buscar"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            color: t.textPrimary,
            width: '160px',
          }}
        />
      </div>

      {/* Notificaciones */}
      <button
        aria-label={`Notificaciones${notifications > 0 ? ` (${notifications})` : ''}`}
        style={{
          position: 'relative',
          padding: '8px',
          borderRadius: '10px',
          border: `1px solid ${t.border}`,
          background: 'transparent',
          cursor: 'pointer',
          color: t.textSecondary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Bell size={17} />
        {notifications > 0 && (
          <span style={{
            position: 'absolute', top: '5px', right: '5px',
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: t.accent,
            border: `2px solid ${t.bg}`,
          }} aria-hidden="true" />
        )}
      </button>

      {/* Avatar usuario — desktop */}
      <div
        className="hidden sm:flex"
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px 4px 4px',
          borderRadius: '10px',
          border: `1px solid ${t.border}`,
          background: t.bgElevated,
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '28px', height: '28px',
          borderRadius: '50%',
          background: t.accentSoft,
          border: `1.5px solid ${t.accentBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 700, color: t.accent,
        }}>
          {(user.nombre || 'U').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: t.textPrimary, lineHeight: 1.2 }}>
            {user.nombre?.split(' ')[0] || 'Usuario'}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: t.textMuted, lineHeight: 1.2, textTransform: 'capitalize' }}>
            {user.rol || theme.name}
          </p>
        </div>
      </div>
    </header>
  );
}