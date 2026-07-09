// src/assets/Hook/Postulante/useDomain.js
// Este archivo conecta endpoints del postulante con hooks faciles de usar en componentes.
// Aqui deben vivir hooks por dominio/pantalla: perfil, vacantes, postulaciones, etc.


import { useCallback, useState } from 'react';
import { useApiAction, useFetch } from './useApi';
import { ENDPOINTS } from './apiPostulante';

export function usePostulanteDashboard() {
  return useFetch(ENDPOINTS.dashboard.resumen);
}

export function usePostulanteChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enviarMensaje = useCallback(async (mensaje) => {
    const texto = String(mensaje ?? '').trim();

    if (!texto) {
      throw new Error('Escribe un mensaje.');
    }

    setLoading(true);
    setError(null);

    try {
      const body = new URLSearchParams();
      body.set('mensaje', texto);

      const res = await fetch(ENDPOINTS.chat.responder, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const respuesta = await res.text();

      if (!res.ok) {
        throw new Error(respuesta || `Error ${res.status}: ${res.statusText}`);
      }

      return respuesta;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo contactar al asistente.';
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  }, []);

  return { enviarMensaje, loading, error };
}

export function usePostulanteChatHistorial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarHistorial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('postulante_token');
      const res = await fetch(ENDPOINTS.chat.historial, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || `Error ${res.status}: ${res.statusText}`);
      }

      return data.historial ?? [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar el historial del chat.';
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  }, []);

  return { cargarHistorial, loading, error };
}

export function useRecomendacionVacantesIA() {
  const { execute, loading, error } = useApiAction();

  const recomendarVacantes = useCallback(() => (
    execute(ENDPOINTS.ia.recomendarVacantes, 'POST')
  ), [execute]);

  return { recomendarVacantes, loading, error };
}

export function useAnalisisCvIA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analizarCV = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('postulante_token');
      const res = await fetch(ENDPOINTS.ia.analizarCv, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ source: 'session_cv' }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        throw new Error(data.message || data.msg || `Error ${res.status}: ${res.statusText}`);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo analizar el CV.';
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  }, []);

  return { analizarCV, loading, error };
}

/**
 * usePostulacionesEntrevistaIA - Trae las postulaciones del usuario para
 * mostrarlas como tarjetas en el chat ("elige una vacante para simular
 * una entrevista"), igual que se hace con recomendar vacantes.
 */
export function usePostulacionesEntrevistaIA() {
  const { execute, loading, error } = useApiAction();

  const listarPostulaciones = useCallback(async () => {
    const data = await execute(ENDPOINTS.ia.entrevistaPostulaciones, 'GET');
    return data.postulaciones ?? [];
  }, [execute]);

  return { listarPostulaciones, loading, error };
}

/**
 * useEntrevistaIA - Maneja los 3 pasos de la entrevista simulada:
 * iniciar (primera pregunta), responder (turno a turno) y finalizar
 * (evaluacion final, solo cuando el usuario decide terminarla).
 * Cancelar la entrevista NO debe llamar a finalizarEntrevista: el modal
 * simplemente se cierra sin guardar ni calificar nada.
 */
export function useEntrevistaIA() {
  const { execute, loading, error } = useApiAction();

  const iniciarEntrevista = useCallback((idVacante) => (
    execute(ENDPOINTS.ia.entrevistaIniciar, 'POST', { id_vacante: idVacante })
  ), [execute]);

  const responderEntrevista = useCallback((idVacante, historial, mensaje) => (
    execute(ENDPOINTS.ia.entrevistaResponder, 'POST', {
      id_vacante: idVacante,
      historial,
      mensaje,
    })
  ), [execute]);

  const finalizarEntrevista = useCallback((idVacante, historial) => (
    execute(ENDPOINTS.ia.entrevistaFinalizar, 'POST', {
      id_vacante: idVacante,
      historial,
    })
  ), [execute]);

  return { iniciarEntrevista, responderEntrevista, finalizarEntrevista, loading, error };
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