import { api } from "./api";

// Busca dados do usuário logado
export async function getMe() {
  const resp = await api.get("/auth/me"); // seu AuthController devolve { id, nome, email }
  return resp?.data || resp;
}

// Atualiza nome/email do usuário logado
export async function updateMe({ id, nome, email }) {
  // 1) Tenta atualizar por id (padrão comum)
  try {
    return await api.postRaw(`/usuarios/${id}`, { nome, email, _method: "PUT" });
  } catch (_) {
    // 2) Fallback: alguns backends expõem /usuarios/me
    return await api.postRaw(`/usuarios/me`, { nome, email, _method: "PUT" });
  }
}
