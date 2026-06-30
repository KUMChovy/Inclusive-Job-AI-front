// src/assets/Hook/Reclutador/apiReclutador.js
// Centraliza la URL base y todos los endpoints del modulo Reclutador.

export const BACKEND_URL = 'http://localhost/inclusijob_back/back-inclusiveJob';
export const BASE_URL = `${BACKEND_URL}/Modelo/Reclutador`;

const qs = (params = {}) => new URLSearchParams(params).toString();

export const ENDPOINTS = {
  dashboard: {
    resumen: `${BASE_URL}/dashboard.php`,
  },

  perfil: {
    obtener: `${BASE_URL}/perfil.php?accion=obtener`,
    actualizar: `${BASE_URL}/perfil.php?accion=actualizar`,
  },

  empresa: {
    obtener: `${BASE_URL}/empresa.php?accion=obtener`,
    actualizar: `${BASE_URL}/empresa.php?accion=actualizar`,
  },

  vacantes: {
    listar: `${BASE_URL}/vacantes.php?accion=listar`,
    crear: `${BASE_URL}/vacantes.php?accion=insertar`,
    editar: `${BASE_URL}/vacantes.php?accion=editar`,
    actualizarEstado: `${BASE_URL}/vacantes.php?accion=actualizar_estado`,
    eliminar: (idVacante) => `${BASE_URL}/vacantes.php?${qs({ accion: 'eliminar', id_vacante: idVacante })}`,
    detalle: (idVacante) => `${BASE_URL}/mostrar_vacante_detalle.php?${qs({ id: idVacante })}`,
  },

  candidatos: {
    porVacante: `${BASE_URL}/candidatos.php?accion=listar_por_vacante`,
    detallePorVacante: (idVacante) => `${BASE_URL}/candidatos.php?${qs({ accion: 'detalles_candidatos', id_vacante: idVacante })}`,
  },

  reportes: {
    listar: `${BASE_URL}/mostrar_reportes.php`,
  },
};
