// src/assets/Hook/Postulante/apiPostulante.js
// Este archivo centraliza la URL base y los endpoints del modulo Postulante.
// Aqui NO va logica de React ni llamadas fetch directas.
// Cuando backend entregue rutas reales, agregarlas dentro de ENDPOINTS por dominio.

export const BASE_URL = 'http://localhost/back/Modelo/Postulante';

export const ENDPOINTS = {
  // Ejemplo de estructura:

  // ── Vacantes ───────────────────────────────────────────────

  // postulaciones: {
  //   list: `${BASE_URL}/postulaciones.php?accion=listar`,
  //   detail: (id) => `${BASE_URL}/postulaciones.php?accion=detalle&id=${id}`,
  // },

  // ── Perfil ───────────────────────────────────────────────

    // perfil: {
  //   detail: `${BASE_URL}/perfil.php?accion=detalle`,
  //   update: `${BASE_URL}/perfil.php?accion=editar`,
  // },
};
