
// ============================================================
// SISTEMA DE TEMAS PARA PORTALES
// Cada colaborador solo necesita importar el tema correcto
// y pasarlo al PortalLayout.
//
// Uso:
//   import { reclutadorTheme } from '../Componentes/Portal/portalTheme';
//   <PortalLayout theme={reclutadorTheme} ... />
// ============================================================

export const reclutadorTheme = {
  name: 'reclutador',

  // =========================
// DARK PURPLE PREMIUM LIGHT
// =========================

// Fondos
bg:             '#09090d',
bgSurface:      '#11111a',
bgElevated:     '#171723',
sidebar:        '#0c0c14',
sidebarBorder:  'rgba(139,92,246,0.20)',

// Textos
textPrimary:    '#ffffff',      // más blanco
textSecondary:  '#d4cff0',      // más claro
textMuted:      '#9c95be',      // más legible

// Acento principal
accent:         '#8b5cf6',
accentHover:    '#7c3aed',
accentSoft:     'rgba(139,92,246,0.12)',
accentBorder:   'rgba(139,92,246,0.28)',
accentGlow:     'rgba(139,92,246,0.25)',

// Navegación activa
navActive:       'rgba(139,92,246,0.16)',
navActiveBorder: 'rgba(139,92,246,0.50)',
navActiveText:   '#f0ebff',

// Bordes
border:          'rgba(255,255,255,0.07)',
borderHover:     'rgba(255,255,255,0.14)',

// Cards estadísticas
statBg:          'rgba(139,92,246,0.08)',
statBorder:      'rgba(139,92,246,0.22)',

// Header
headerBg:        'rgba(9,9,13,0.96)',
headerBorder:    'rgba(255,255,255,0.06)',

// Estados
success:         '#22c55e',
warning:         '#f59e0b',
danger:          '#ef4444',
info:             '#a78bfa',

// Gradientes
gradient:        'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
gradientGlow:    '0 0 45px rgba(139,92,246,0.35)',

// Extras opcionales
cardShadow:      '0 10px 30px rgba(0,0,0,0.35)',
cardHighlight:   'rgba(255,255,255,0.02)',

};

export const postulantTheme = {
  name: 'postulante',

  // Colores principales
  bg:          '#f8faff',
  bgSurface:   '#ffffff',
  bgElevated:  '#f0f4ff',
  sidebar:     '#ffffff',
  sidebarBorder:'rgba(59,130,246,0.15)',

  // Textos
  textPrimary:   '#0f1729',
  textSecondary: '#4a5a7a',
  textMuted:     '#9aaac8',

  // Acento
  accent:         '#2563eb',    // azul
  accentHover:    '#1d4ed8',
  accentSoft:     'rgba(37,99,235,0.08)',
  accentBorder:   'rgba(37,99,235,0.2)',
  accentGlow:     'rgba(37,99,235,0.15)',

  // Estado activo nav
  navActive:     'rgba(37,99,235,0.1)',
  navActiveBorder:'rgba(37,99,235,0.4)',
  navActiveText:  '#1d4ed8',

  // Bordes
  border:      'rgba(15,23,41,0.07)',
  borderHover: 'rgba(15,23,41,0.12)',

  // Stats / cards
  statBg:      'rgba(37,99,235,0.06)',
  statBorder:  'rgba(37,99,235,0.15)',

  // Header
  headerBg:    'rgba(248,250,255,0.95)',
  headerBorder:'rgba(59,130,246,0.12)',

  // Gradiente del logo/banner
  gradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
  gradientGlow: '0 0 40px rgba(37,99,235,0.2)',
};