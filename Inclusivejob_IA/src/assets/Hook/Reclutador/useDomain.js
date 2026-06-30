// src/assets/Hook/Reclutador/useDomain.js
// Conecta endpoints del reclutador con hooks con nombres de negocio.

import { useApiAction, useFetch } from './useApi';
import { ENDPOINTS } from './apiReclutador';

export function useReclutadorDashboard() {
  return useFetch(ENDPOINTS.dashboard.resumen);
}

export function usePerfilReclutador() {
  return useFetch(ENDPOINTS.perfil.obtener);
}

export function useActualizarPerfilReclutador() {
  const { execute, loading, error } = useApiAction();

  return {
    actualizarPerfil: (data) => execute(ENDPOINTS.perfil.actualizar, 'POST', data),
    loading,
    error,
  };
}

export function useEmpresaReclutador() {
  return useFetch(ENDPOINTS.empresa.obtener);
}

export function useActualizarEmpresaReclutador() {
  const { execute, loading, error } = useApiAction();

  return {
    actualizarEmpresa: (data) => execute(ENDPOINTS.empresa.actualizar, 'POST', data),
    loading,
    error,
  };
}

export function useVacantesReclutador() {
  return useFetch(ENDPOINTS.vacantes.listar);
}

export function useGuardarVacanteReclutador() {
  const { execute, loading, error } = useApiAction();

  return {
    guardarVacante: (data) => execute(ENDPOINTS.vacantes.crear, 'POST', data),
    editarVacante: (data) => execute(ENDPOINTS.vacantes.editar, 'POST', data),
    actualizarEstadoVacante: (data) => execute(ENDPOINTS.vacantes.actualizarEstado, 'POST', data),
    eliminarVacante: (idVacante) => execute(ENDPOINTS.vacantes.eliminar(idVacante), 'POST'),
    loading,
    error,
  };
}

export function useDetalleVacanteReclutador(idVacante) {
  return useFetch(idVacante ? ENDPOINTS.vacantes.detalle(idVacante) : null);
}

export function useVacantesConCandidatosReclutador() {
  return useFetch(ENDPOINTS.candidatos.porVacante);
}

export function useCandidatosVacanteReclutador() {
  const { execute, loading, error } = useApiAction();

  return {
    obtenerCandidatosVacante: (idVacante) => execute(ENDPOINTS.candidatos.detallePorVacante(idVacante), 'GET'),
    loading,
    error,
  };
}

export function useReportesReclutador() {
  return useFetch(ENDPOINTS.reportes.listar);
}

export function useReclutadorResource(url, options = {}) {
  return useFetch(url, options);
}

export function useReclutadorAction() {
  return useApiAction();
}
