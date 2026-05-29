
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PortalSidebar from './PortalSidebar';
import PortalHeader from './PortalHeader';

export default function PortalLayout({
  theme,
  navItems = [],
  user = {},
  children,
  pageTitle,
  headerActions,
  notifications = 0,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = theme;

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
        user={user}
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
          user={user}
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