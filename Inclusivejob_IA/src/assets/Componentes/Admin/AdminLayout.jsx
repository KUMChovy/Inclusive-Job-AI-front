// src/assets/Componentes/Admin/AdminLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Sidebar fijo a la izquierda ── */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/*
        ── Zona derecha ──
      */}
      <div
        className={`
          flex flex-col flex-1 w-0 min-h-screen
          transition-[margin] duration-300 ease-in-out
          ml-0
          ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        {/* Header confinado a esta columna */}
        <Header
          onMobileMenuOpen={() => setMobileOpen(true)}
          sidebarCollapsed={collapsed}
        />

        
        <main
          id="main-content"
          className="flex-1 p-4 sm:p-6 w-full overflow-x-hidden"
          role="main"
          aria-label="Contenido principal"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}