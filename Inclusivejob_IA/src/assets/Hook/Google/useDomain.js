import useGoogle from "./useGoogle.js";

export function useGoogleDomain() {
  const {
    registrarGoogle,
    loginGoogle,
    completarPasswordGoogle,
    loading,
    error
  } = useGoogle();

  const registrarConGoogle = async ({ credential, tipo }) =>
    await registrarGoogle(credential, tipo);

  const loginConGoogle = async ({ credential }) =>
    await loginGoogle(credential);

  // =========================
  // NUEVO: completar password
  // =========================
  const completarPassword = async ({ id_usuario, password }) =>
    await completarPasswordGoogle(id_usuario, password);

  return {
    registrarConGoogle,
    loginConGoogle,
    completarPassword,
    loading,
    error
  };
}