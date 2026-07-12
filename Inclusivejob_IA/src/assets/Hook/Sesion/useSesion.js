// src/assets/Hook/Sesion/useSesion.js
// Hook para usar la sesion PHP dentro de componentes React.
//
// Ejemplos de uso:
//
// 1. Proteger una pantalla y traer usuario:
// const { user, loading, allowed } = useSesion({
//   allowedRoles: ['postulante'],
//   required: true,
// });
//
// 2. Login manual desde un formulario:
// const { login, loading, error } = useSesion({
//   allowedRoles: ['postulante', 'reclutador'],
//   auto: false,
// });
//
// 3. Logout desde un boton:
// const { logout } = useSesion({ auto: false });

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  cerrarSesion,
  loginYObtenerSesion,
  obtenerSesion,
  requerirSesion,
  recuperarPassword,
  registrarUsuario,
} from './apiSesion';

function useAsyncSesionAction(action) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      return await action(...args);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la solicitud.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [action]);

  return { execute, loading, error };
}

export function useRegistroSesion() {
  const { execute, loading, error } = useAsyncSesionAction(registrarUsuario);
  return { registrar: execute, loading, error };
}

export function useRecuperarPassword() {
  const { execute, loading, error } = useAsyncSesionAction(recuperarPassword);
  return { recuperar: execute, loading, error };
}

export function useSesion({
  allowedRoles = [],
  fallbackUser = null,
  required = false,
  auto = true,
} = {}) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  // Convertimos arrays/objetos a keys estables para evitar loops de useEffect.
  const rolesKey = useMemo(() => allowedRoles.join('|'), [allowedRoles]);
  const fallbackKey = useMemo(() => {
    try {
      return JSON.stringify(fallbackUser || {});
    } catch {
      return '{}';
    }
  }, [fallbackUser]);

  // Opciones que se pasan a apiSesion.
  // allowedRoles define quienes pueden entrar: ['administrador'], ['postulante'], etc.
  // fallbackUser sirve para mostrar datos temporales mientras llega la sesion real.
  const buildOptions = useCallback(() => ({
    allowedRoles: rolesKey ? rolesKey.split('|').filter(Boolean) : [],
    fallbackUser: JSON.parse(fallbackKey),
  }), [fallbackKey, rolesKey]);

  // Refresca/consulta la sesion actual.
  // Si required=true, falla cuando no hay sesion o el rol no esta permitido.
  const cargarSesion = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const options = buildOptions();
      const data = required
        ? await requerirSesion(options)
        : await obtenerSesion(options);

      setSession(data);
      setUser(data.user);
      return data;
    } catch (err) {
      setSession(null);
      setUser(null);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [buildOptions, required]);

  // Login para formularios.
  // Devuelve { login, session }, donde session.user ya viene normalizado.
  const login = useCallback(async (credenciales) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginYObtenerSesion(credenciales, buildOptions());
      setSession(data.session);
      setUser(data.session.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [buildOptions]);

  // Logout para botones de salir.
  // Cierra la sesion en backend y limpia el estado del hook.
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      return await cerrarSesion();
    } finally {
      setSession(null);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // auto=false se usa en formularios de login o botones de logout.
    // Asi evitamos consultar sesion.php en cada render de una pantalla publica.
    if (!auto) {
      setLoading(false);
      return;
    }

    cargarSesion().catch(() => {});
  }, [auto, cargarSesion]);

  return {
    user,
    session,
    auth: Boolean(session?.auth),
    allowed: Boolean(session?.allowed),
    loading,
    error,
    login,
    logout,
    refetch: cargarSesion,
  };
}

// Asi se jala la sesion y los datos que ocupen para que sepan como chiquillos

/*
variables de los datos en donde ya estan guardados
user.id
user.id_rol
user.rol
user.rol_canonico
user.nombre
user.correo
user.foto_perfil
user.avatar*/


/*import { useSesion } from '../assets/Hook/Sesion/useSesion';

export default function MiVista() {
  const { user, loading } = useSesion({
    allowedRoles: ['postulante'],
    required: true,
  });

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <p>ID usuario: {user.id}</p>
      <p>Nombre: {user.nombre}</p>
      <p>Rol: {user.rol}</p>
    </div>
  );
}*/
