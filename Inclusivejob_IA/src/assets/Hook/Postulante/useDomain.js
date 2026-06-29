// src/assets/Hook/Postulante/useDomain.js
// Este archivo conecta endpoints del postulante con hooks faciles de usar en componentes.
// Aqui deben vivir hooks por dominio/pantalla: perfil, vacantes, postulaciones, etc.


import { useApiAction, useFetch } from './useApi';
import { ENDPOINTS } from './apiPostulante';

export function usePostulanteDashboard() {
  return useFetch(ENDPOINTS.dashboard.resumen);
}

/**
 * usePostulanteResource - Base temporal para consultar una URL del modulo Postulante.
 * Usar mientras se definen hooks especificos.
 *
 * Ejemplo futuro:
 * export function usePostulacionesPostulante() {
 *   return useFetch(ENDPOINTS.postulaciones.list);
 * }
 */
export function usePostulanteResource(url, options = {}) {
  return useFetch(url, options);
}

/**
 * usePostulanteAction - Base temporal para ejecutar acciones sobre una URL.
 * Los colaboradores deben envolver execute con nombres claros del negocio.
 *
 * Ejemplo futuro:
 * export function usePostulacionAcciones() {
 *   const { execute, loading, error } = useApiAction();
 *   return {
 *     cancelar: (id) => execute(ENDPOINTS.postulaciones.cancelar(id), 'POST'),
 *     loading,
 *     error,
 *   };
 * }
 */
export function usePostulanteAction() {
  return useApiAction();
}
