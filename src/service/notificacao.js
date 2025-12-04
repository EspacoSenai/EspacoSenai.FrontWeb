// src/service/notificacao.js
import { api } from "./api";

/**
 * Busca notificações do usuário logado
 * GET /notificacao/minhas
 */
export async function buscarMinhasNotificacoes() {
  const response = await api.get("/notificacao/minhas");
  return response.data; // List<NotificacaoDTO>
}

/**
 * Marca notificação como lida
 * PUT /notificacao/ler/{id}
 */
export async function marcarNotificacaoComoLida(id) {
  await api.put(`/notificacao/ler/${id}`);
}

/**
 * Deleta notificação
 * DELETE /notificacao/deletar/{id}
 */
export async function deletarNotificacao(id) {
  await api.delete(`/notificacao/deletar/${id}`);
}
