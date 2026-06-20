// src/assets/Hook/Postulante/useApi.js
// Hooks genericos para consumir cualquier URL del modulo Postulante.
// Este archivo debe mantenerse generico: recibe una URL y ejecuta la peticion.
// Los endpoints concretos se definen en apiPostulante.js.

import { useCallback, useEffect, useState } from 'react';

/**
 * useFetch - Hook generico para peticiones GET.
 * @param {string|null} url - URL completa del endpoint. Si es null, no hace la peticion.
 * @param {object} options - Opciones extra, por ejemplo headers.
 */
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('postulante_token');
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options.headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * useApiAction - Hook generico para POST, PUT, PATCH o DELETE.
 * Se usa desde useDomain.js para crear acciones con nombres del negocio.
 */
export function useApiAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (url, method = 'POST', body = null) => {
    if (!url) throw new Error('La URL es requerida para ejecutar la accion.');

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('postulante_token');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}
