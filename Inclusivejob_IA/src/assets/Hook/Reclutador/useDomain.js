// src/assets/Hook/Reclutador/useDomain.js
// Este archivo conecta endpoints del reclutador con hooks faciles de usar en componentes.
// Aqui deben vivir hooks por dominio/pantalla: perfil, vacantes, postulaciones, etc.
// Por ahora queda una base minima que recibe URL para que el equipo agregue metodos reales.

import { useApiAction, useFetch } from './useApi';

/**
 * useReclutadorResource - Base temporal para consultar una URL del modulo Reclutador.
 * Usar mientras se definen hooks especificos.
 *
 * Ejemplo futuro:
 * export function useVacantesReclutador() {
 *   return useFetch(ENDPOINTS.vacantes.list);
 * }
 */
export function useReclutadorResource(url, options = {}) {
  return useFetch(url, options);
}

/**
 * useReclutadorAction - Base temporal para ejecutar acciones sobre una URL.
 * Los colaboradores deben envolver execute con nombres claros del negocio.
 *
 * Ejemplo futuro:
 * export function useVacanteAcciones() {
 *   const { execute, loading, error } = useApiAction();
 *   return {
 *     crear: (data) => execute(ENDPOINTS.vacantes.create, 'POST', data),
 *     loading,
 *     error,
 *   };
 * }
 */
export function useReclutadorAction() {
  return useApiAction();
}
