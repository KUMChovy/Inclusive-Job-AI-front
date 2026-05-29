// Hooks específicos por dominio - conectados a los endpoints PHP
import { useFetch, useApiAction } from './useApi';
import { ENDPOINTS } from './apiAdmin';

// ─── DASHBOARD ───────────────────────────────────────────────
export function useDashboardStats() {
  return useFetch(ENDPOINTS.dashboard.stats);
}
export function useVacantesRecientes() {
  return useFetch(ENDPOINTS.dashboard.vacantesRecientes);
}
export function useEmpresasPendientesDash() {
  return useFetch(ENDPOINTS.dashboard.empresasPendientes);
}

// ─── EMPRESAS ────────────────────────────────────────────────
export function useEmpresas(params = '') {
  return useFetch(`${ENDPOINTS.empresas.list}${params}`);
}
export function useEmpresaDetalle(id) {
  return useFetch(id ? ENDPOINTS.empresas.detail(id) : null);
}
export function useEmpresaAcciones() {
  const { execute, loading, error } = useApiAction();
  return {
    aprobar: (id) => execute(ENDPOINTS.empresas.aprobar(id), 'PUT'),
    rechazar: (id, motivo) => execute(ENDPOINTS.empresas.rechazar(id), 'PUT', { motivo }),
    suspender: (id) => execute(ENDPOINTS.empresas.suspender(id), 'PUT'),
    loading,
    error,
  };
}

// ─── USUARIOS ────────────────────────────────────────────────
export function useUsuarios(params = '') {
  return useFetch(`${ENDPOINTS.usuarios.list}${params}`);
}
export function useUsuarioDetalle(id) {
  return useFetch(id ? ENDPOINTS.usuarios.detail(id) : null);
}
export function useUsuarioAcciones() {
  const { execute, loading, error } = useApiAction();
  return {
    suspender: (id) => execute(ENDPOINTS.usuarios.suspender(id), 'PUT'),
    reactivar: (id) => execute(ENDPOINTS.usuarios.reactivar(id), 'PUT'),
    loading,
    error,
  };
}

// ─── VACANTES ────────────────────────────────────────────────
export function useVacantes(params = '') {
  return useFetch(`${ENDPOINTS.vacantes.list}${params}`);
}
export function useVacanteDetalle(id) {
  return useFetch(id ? ENDPOINTS.vacantes.detail(id) : null);
}
export function useVacanteAcciones() {
  const { execute, loading, error } = useApiAction();
  return {
    cerrar: (id) => execute(ENDPOINTS.vacantes.cerrar(id), 'PUT'),
    eliminar: (id) => execute(ENDPOINTS.vacantes.eliminar(id), 'DELETE'),
    loading,
    error,
  };
}

// ─── POSTULACIONES ───────────────────────────────────────────
export function usePostulaciones(params = '') {
  return useFetch(`${ENDPOINTS.postulaciones.list}${params}`);
}
export function usePostulacionDetalle(id) {
  return useFetch(id ? ENDPOINTS.postulaciones.detail(id) : null);
}

// ─── DISCAPACIDADES ──────────────────────────────────────────
export function useDiscapacidades() {
  return useFetch(ENDPOINTS.discapacidades.list);
}
export function useDiscapacidadAcciones() {
  const { execute, loading, error } = useApiAction();
  return {
    crear: (data) => execute(ENDPOINTS.discapacidades.create, 'POST', data),
    editar: (id, data) => execute(ENDPOINTS.discapacidades.update(id), 'PUT', data),
    eliminar: (id) => execute(ENDPOINTS.discapacidades.delete(id), 'DELETE'),
    loading,
    error,
  };
}

// ─── REPORTES ────────────────────────────────────────────────
export function useReportes(params = '') {
  return useFetch(`${ENDPOINTS.reportes.list}${params}`);
}
export function useReporteAcciones() {
  const { execute, loading, error } = useApiAction();
  return {
    ignorar: (id) => execute(ENDPOINTS.reportes.ignorar(id), 'PUT'),
    eliminarVacante: (id) => execute(ENDPOINTS.reportes.eliminarVacante(id), 'DELETE'),
    loading,
    error,
  };
}