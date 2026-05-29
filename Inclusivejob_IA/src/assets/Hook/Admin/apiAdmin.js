// ============================================================
// CONFIGURACIÓN BASE DE LA API
// Cambia BASE_URL al dominio de tu API PHP
// ============================================================
export const BASE_URL = 'https://tu-api.com/api';

export const ENDPOINTS = {
  // AUTH
  login: `${BASE_URL}/auth/login`,
  logout: `${BASE_URL}/auth/logout`,

  // DASHBOARD
  dashboard: {
    stats: `${BASE_URL}/admin/dashboard/stats`,
    vacantesRecientes: `${BASE_URL}/admin/dashboard/vacantes-recientes`,
    empresasPendientes: `${BASE_URL}/admin/dashboard/empresas-pendientes`,
    vacantasPorMes: `${BASE_URL}/admin/dashboard/vacantes-por-mes`,
    usuariosPorMes: `${BASE_URL}/admin/dashboard/usuarios-por-mes`,
  },

  // EMPRESAS
  empresas: {
    list: `${BASE_URL}/admin/empresas`,
    detail: (id) => `${BASE_URL}/admin/empresas/${id}`,
    aprobar: (id) => `${BASE_URL}/admin/empresas/${id}/aprobar`,
    rechazar: (id) => `${BASE_URL}/admin/empresas/${id}/rechazar`,
    suspender: (id) => `${BASE_URL}/admin/empresas/${id}/suspender`,
    reclutadores: (id) => `${BASE_URL}/admin/empresas/${id}/reclutadores`,
    vacantes: (id) => `${BASE_URL}/admin/empresas/${id}/vacantes`,
  },

  // USUARIOS
  usuarios: {
    list: `${BASE_URL}/admin/usuarios`,
    detail: (id) => `${BASE_URL}/admin/usuarios/${id}`,
    suspender: (id) => `${BASE_URL}/admin/usuarios/${id}/suspender`,
    reactivar: (id) => `${BASE_URL}/admin/usuarios/${id}/reactivar`,
  },

  // VACANTES
  vacantes: {
    list: `${BASE_URL}/admin/vacantes`,
    detail: (id) => `${BASE_URL}/admin/vacantes/${id}`,
    cerrar: (id) => `${BASE_URL}/admin/vacantes/${id}/cerrar`,
    eliminar: (id) => `${BASE_URL}/admin/vacantes/${id}`,
    postulaciones: (id) => `${BASE_URL}/admin/vacantes/${id}/postulaciones`,
  },

  // POSTULACIONES
  postulaciones: {
    list: `${BASE_URL}/admin/postulaciones`,
    detail: (id) => `${BASE_URL}/admin/postulaciones/${id}`,
  },

  // DISCAPACIDADES
  discapacidades: {
    list: `${BASE_URL}/admin/discapacidades`,
    create: `${BASE_URL}/admin/discapacidades`,
    update: (id) => `${BASE_URL}/admin/discapacidades/${id}`,
    delete: (id) => `${BASE_URL}/admin/discapacidades/${id}`,
  },

  // REPORTES
  reportes: {
    list: `${BASE_URL}/admin/reportes`,
    detail: (id) => `${BASE_URL}/admin/reportes/${id}`,
    ignorar: (id) => `${BASE_URL}/admin/reportes/${id}/ignorar`,
    eliminarVacante: (id) => `${BASE_URL}/admin/reportes/${id}/eliminar-vacante`,
  },
};