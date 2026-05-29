
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
} = {}) {
  const result = await Swal.fire({
    ...BASE,
    title,
    html,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: confirmColor,
    cancelButtonColor: '#475569',
  });
  return result.isConfirmed;
}

/**
 * Alerta de éxito con autocierre
 */
export function successAlert(title = '¡Listo!', text = '') {
  return Swal.fire({
    ...BASE,
    title,
    text,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    confirmButtonColor: '#7c3aed',
  });
}

/**
 * Alerta de error
 */
export function errorAlert(title = 'Error', text = '') {
  return Swal.fire({
    ...BASE,
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#7c3aed',
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