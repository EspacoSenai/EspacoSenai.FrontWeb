// src/hooks/useAuth.js
export function parseJwtSafe(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function useAuth() {
  const token = localStorage.getItem("access_token");
  const roles = (() => {
    try { return JSON.parse(localStorage.getItem("roles") || "[]"); } catch { return []; }
  })();

  const payload = token ? parseJwtSafe(token) : null;

  // tenta alguns campos comuns de nome
  const nome =
    payload?.name ||
    payload?.nome ||
    payload?.user_name ||
    payload?.preferred_username ||
    "";

  return { token, roles, nome };
}
