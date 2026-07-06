// src/assets/Hook/Postulante/apiPostulante.js
// Este archivo centraliza la URL base y los endpoints del modulo Postulante.
// Aqui NO va logica de React ni llamadas fetch directas.
// Cuando backend entregue rutas reales, agregarlas dentro de ENDPOINTS por dominio.

export const BASE_URL = 'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante';

export const ENDPOINTS = {
  dashboard: {
    resumen: `${BASE_URL}/dashboard.php`,
  },

  chat: {
    responder: `${BASE_URL}/chat/chatbot.php`,
  },

  ia: {
    recomendarVacantes: `${BASE_URL}/chat/recomendar_vacantes.php`,
  },

  // Formulario
  formulario: {
    estado: `${BASE_URL}/guardar_formulario.php`,
    guardar: `${BASE_URL}/guardar_formulario.php`,
  },

  // Ejemplo de estructura:
  //
  // postulaciones: {
  //   list: `${BASE_URL}/postulaciones.php?accion=listar`,
  //   detail: (id) => `${BASE_URL}/postulaciones.php?accion=detalle&id=${id}`,
  // },
  //
  // perfil: {
  //   detail: `${BASE_URL}/perfil.php?accion=detalle`,
  //   update: `${BASE_URL}/perfil.php?accion=editar`,
  // },
};
