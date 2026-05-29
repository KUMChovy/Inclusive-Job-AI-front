// src/assets/Componentes/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, Briefcase, FileText,
  Accessibility, Flag, Settings, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/vacantes', label: 'Vacantes', icon: Briefcase },
  { to: '/admin/postulaciones', label: 'Postulaciones', icon: FileText },
  { to: '/admin/discapacidades', label: 'Discapacidades', icon: Accessibility },
  { to: '/admin/reportes', label: 'Reportes', icon: Flag },

];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Menú principal"
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-slate-900 border-r border-slate-700/50
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-slate-700/50 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                <Accessibility size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-sm leading-tight whitespace-nowrap">
                Inclusive<span className="text-violet-400"> Job IA</span>
              </span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Accessibility size={16} className="text-white" />
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
          {/* Desktop collapse toggle */}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="hidden lg:flex text-slate-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Colapsar menú"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1 px-2" role="list">
            {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                    ${isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }
                    ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? label : undefined}
                  aria-label={label}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="p-2 border-t border-slate-700/50">
            <button
              onClick={onToggle}
              className="w-full flex justify-center text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Expandir menú"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Admin badge */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-300 text-xs font-bold">A</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">Administrador</p>
                <p className="text-slate-500 text-xs truncate">Panel de control</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}