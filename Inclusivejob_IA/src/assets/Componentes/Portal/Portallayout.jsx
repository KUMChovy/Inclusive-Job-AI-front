
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PortalSidebar from './PortalSidebar';
import PortalHeader from './PortalHeader';
import { normalizarUsuarioSesion } from '../../Hook/Sesion/apiSesion';
import { useSesion } from '../../Hook/Sesion/useSesion';

const EMPTY_USER = {};

export default function PortalLayout({
  theme,
  navItems = [],
  user = EMPTY_USER,
  children,
  pageTitle,
  headerActions,
  notifications = 0,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = theme;
  const allowedRoles = useMemo(() => {
    const ruta = location.pathname.toLowerCase();
    if (ruta.startsWith('/postulante')) return ['postulante'];
    if (ruta.startsWith('/reclutador')) return ['reclutador'];
    return [];
  }, [location.pathname]);
  const {
    user: sessionUser,
    loading: checkingSession,
    allowed,
  } = useSesion({ allowedRoles, fallbackUser: user, required: true });
  const currentUser = useMemo(() => normalizarUsuarioSesion(sessionUser || {}, user), [user, sessionUser]);

  useEffect(() => {
    if (!checkingSession && !allowed) {
      navigate('/login', { replace: true });
    }
  }, [allowed, checkingSession, navigate]);

  if (checkingSession || !allowed) {
    return (
      <div style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: t.bg,
        color: t.textSecondary,
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
      }}>
        Validando sesion...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100svh',
      width: '100%',
      background: t.bg,
      color: t.textPrimary,
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    }}>
      {/* Google Fonts — Plus Jakarta Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
        input[type=search]::-webkit-search-cancel-button { display: none; }
        ::placeholder { color: ${t.textMuted}; }
      `}</style>

      {/* Sidebar */}
      <PortalSidebar
        theme={t}
        navItems={navItems}
        user={currentUser}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Zona de contenido */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100svh',
        marginLeft: 0,
        paddingLeft: 0,
        transition: 'padding-left 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
        className={collapsed ? 'lg:!pl-[68px]' : 'lg:!pl-[256px]'}
      >
        <PortalHeader
          theme={t}
          onMobileMenuOpen={() => setMobileOpen(true)}
          title={pageTitle}
          actions={headerActions}
          notifications={notifications}
        />

        <main
          id="main-content"
          role="main"
          aria-label="Contenido principal"
          style={{
            flex: 1,
            padding: '24px 20px',
            width: '100%',
            overflowX: 'hidden',
          }}
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
