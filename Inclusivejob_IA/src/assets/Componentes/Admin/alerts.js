
// Uso: import { confirmAction, successAlert, errorAlert } from '../Componentes/Admin/alerts';

import Swal from 'sweetalert2';

const BASE = {
  background: '#1e293b',
  color: '#f8fafc',
  customClass: {
    popup: 'rounded-2xl border border-slate-700',
    title: 'text-white text-lg font-semibold',
    htmlContainer: 'text-slate-300 text-sm',
    confirmButton: 'rounded-lg px-4 py-2 text-sm font-medium',
    cancelButton: 'rounded-lg px-4 py-2 text-sm font-medium',
  },
};

function themedOptions(theme) {
  if (!theme) return {};

  const isLightTheme = theme.name === 'postulante' || theme.bgSurface === '#ffffff';

  return {
    background: theme.bgSurface || theme.sidebar || '#ffffff',
    color: theme.textPrimary || '#0f172a',
    customClass: {
      popup: '',
      title: '',
      htmlContainer: '',
      confirmButton: '',
      cancelButton: '',
    },
    didOpen: (popup) => {
      popup.style.border = `1px solid ${theme.border || theme.accentBorder || 'transparent'}`;
      popup.style.boxShadow = theme.cardShadow || theme.gradientGlow || `0 18px 60px ${theme.accentGlow || 'rgba(15,23,42,0.16)'}`;

      const titleEl = popup.querySelector('.swal2-title');
      const htmlEl = popup.querySelector('.swal2-html-container');
      const confirmButton = popup.querySelector('.swal2-confirm');
      const cancelButton = popup.querySelector('.swal2-cancel');

      if (titleEl) titleEl.style.color = theme.textPrimary || '#0f172a';
      if (htmlEl) htmlEl.style.color = theme.textSecondary || theme.textMuted || '#475569';
      if (confirmButton) {
        confirmButton.style.color = isLightTheme ? (theme.textPrimary || '#0f172a') : '#ffffff';
        confirmButton.style.fontWeight = '800';
      }
      if (cancelButton) {
        cancelButton.style.color = isLightTheme ? (theme.textPrimary || '#0f172a') : '#ffffff';
        cancelButton.style.fontWeight = '800';
        if (isLightTheme) {
          cancelButton.style.border = `1px solid ${theme.borderHover || theme.border || '#cbd5e1'}`;
        }
      }
    },
  };
}

/**
 * Diálogo de confirmación genérico
 * @param {object} opts - { title, html, confirmText, confirmColor }
 * @returns Promise<boolean>
 */
export async function confirmAction({
  title = '¿Estás seguro?',
  html = '',
  confirmText = 'Confirmar',
  confirmColor = '#7c3aed',
  cancelText = 'Cancelar',
  icon = 'warning',
  theme = null,
} = {}) {
  const result = await Swal.fire({
    ...BASE,
    ...themedOptions(theme),
    title,
    html,
    icon,
    iconColor: theme?.accent || undefined,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: theme?.accentHover || theme?.accent || confirmColor,
    cancelButtonColor: theme?.name === 'postulante'
      ? (theme.bgElevated || '#e0ecff')
      : (theme?.textMuted || '#475569'),
  });
  return result.isConfirmed;
}

/**
 * Alerta de éxito con autocierre
 */
export function successAlert(title = '¡Listo!', text = '', theme = null) {
  return Swal.fire({
    ...BASE,
    ...themedOptions(theme),
    title,
    text,
    icon: 'success',
    iconColor: theme?.success || theme?.accent || undefined,
    timer: 2000,
    showConfirmButton: false,
    confirmButtonColor: theme?.accent || '#7c3aed',
  });
}

/**
 * Alerta de error
 */
export function errorAlert(title = 'Error', text = '', theme = null) {
  return Swal.fire({
    ...BASE,
    ...themedOptions(theme),
    title,
    text,
    icon: 'error',
    iconColor: theme?.danger || '#ef4444',
    confirmButtonColor: theme?.accent || '#7c3aed',
  });
}

export async function confirmLogout(theme = null) {
  return confirmAction({
    title: 'Cerrar sesion',
    html: '<span>Tu sesion actual se cerrara y tendras que iniciar sesion de nuevo.</span>',
    confirmText: 'Si, salir',
    cancelText: 'Cancelar',
    confirmColor: '#dc2626',
    icon: 'warning',
    theme,
  });
}

/**
 * Confirmación de ELIMINAR — siempre rojo
 */
export async function confirmDelete(entityName = 'este elemento') {
  return confirmAction({
    title: '¿Eliminar?',
    html: `<span>¿Seguro que deseas eliminar <strong style="color:#fff">${entityName}</strong>? Esta acción no se puede deshacer.</span>`,
    confirmText: 'Sí, eliminar',
    confirmColor: '#dc2626',
    icon: 'warning',
  });
}

/**
 * Confirmación de SUSPENDER
 */
export async function confirmSuspend(entityName = '') {
  return confirmAction({
    title: '¿Suspender?',
    html: `<span>Se suspenderá el acceso de <strong style="color:#fff">${entityName}</strong>.</span>`,
    confirmText: 'Suspender',
    confirmColor: '#d97706',
    icon: 'warning',
  });
}

/**
 * Confirmación de APROBAR
 */
export async function confirmApprove(entityName = '') {
  return confirmAction({
    title: '¿Aprobar?',
    html: `<span><strong style="color:#fff">${entityName}</strong> podrá operar en la plataforma.</span>`,
    confirmText: '✓ Aprobar',
    confirmColor: '#16a34a',
    icon: 'question',
  });
}

/**
 * Confirmación de RECHAZAR
 */
export async function confirmReject(entityName = '') {
  return confirmAction({
    title: '¿Rechazar?',
    html: `<span>Se rechazará a <strong style="color:#fff">${entityName}</strong>.</span>`,
    confirmText: 'Rechazar',
    confirmColor: '#dc2626',
    icon: 'warning',
  });
}
