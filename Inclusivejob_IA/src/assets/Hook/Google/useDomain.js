import useGoogle from "./useGoogle.js";

export function useGoogleDomain() {
  const { registrarGoogle, loginGoogle, loading, error } = useGoogle();

  const registrarConGoogle = async ({ credential, tipo }) =>
    await registrarGoogle(credential, tipo);

  const loginConGoogle = async ({ credential }) =>
    await loginGoogle(credential);

  return {
    registrarConGoogle,
    loginConGoogle,
    loading,
    error
  };
}