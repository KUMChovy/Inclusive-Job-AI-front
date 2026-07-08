
// ============================================================
// ITEMS DE NAVEGACIÓN POR ROL
// Importa el array correcto y pásalo al PortalLayout.
// badge: número que se mostrará como indicador (0 = oculto)
// ============================================================

import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  UserCircle,
  Flag,
  FileText,
  Award,
  Search,
  BookmarkCheck,
  Accessibility,
} from 'lucide-react';

// ── Reclutador ───────────────────────────────────────────────
export const reclutadorNav = [
  {
    to: '/reclutador',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/reclutador/empresa',
    label: 'Mi empresa',
    icon: Building2,
  },
  {
    to: '/Reclutador/Vacantes',
    label: 'Mis vacantes',
    icon: Briefcase,
  },
  {
    to: '/reclutador/candidatos',
    label: 'Candidatos',
    icon: Users,
  },
  {
    to: '/reclutador/reportes',
    label: 'Reportes',
    icon: Flag,
    badge: 2, // número dinámico — reemplazar con dato real
  },
  {
    to: '/reclutador/perfil',
    label: 'Mi perfil',
    icon: UserCircle,
  },
];

// ── Postulante ───────────────────────────────────────────────
export const postulantNav = [
  {
    to: '/postulante',
    label: 'Inicio',
    icon: LayoutDashboard,
  },
  {
    to: '/postulante/vacantes',
    label: 'Buscar vacantes',
    icon: Search,
  },
  {
    to: '/postulante/postulaciones',
    label: 'Mis postulaciones',
    icon: BookmarkCheck,
    badge: 3, // número dinámico
  },
  {
    to: '/postulante/certificaciones',
    label: 'Certificaciones',
    icon: Award,
  },
  {
    to: '/postulante/reportes',
    label: 'Reportes',
    icon: Flag,
  },
  {
    to: '/postulante/perfil',
    label: 'Mi perfil',
    icon: UserCircle,
  },
];