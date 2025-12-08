import { api } from "./api";

/**
 * Serviço para gerenciar catálogos de ambientes
 * Endpoint: /catalogo
 */

/**
 * Busca todos os catálogos
 * @returns {Promise<Array>} Lista de catálogos
 */
export async function buscarCatalogos() {
  try {
    const response = await api.get("/catalogo/buscar");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[CatalogoService] Erro ao buscar catálogos:", error);
    return []; // Retorna array vazio em vez de throw
  }
}

/**
 * Busca catálogos de um ambiente específico
 * @param {number} ambienteId - ID do ambiente
 * @returns {Promise<Array>} Lista de catálogos
 */
export async function buscarCatalogosPorAmbiente(ambienteId) {
  const id = Number(ambienteId);
  if (!Number.isFinite(id)) return [];

  try {
    const response = await api.get(`/catalogo/buscar-por-ambiente/${id}`);
    const data = response?.data ?? response;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[CatalogoService] Erro ao buscar catálogos do ambiente:", error);
    return [];
  }
}

/**
 * Busca um catálogo específico por ID
 * @param {number} id - ID do catálogo
 * @returns {Promise<Object>} Dados do catálogo
 */
export async function buscarCatalogoPorId(id) {
  try {
    const response = await api.get(`/catalogo/buscar/${id}`);
    return response.data;
  } catch (error) {
    console.error(`[CatalogoService] Erro ao buscar catálogo ${id}:`, error);
    throw error;
  }
}

/**
 * Salva um novo catálogo para um ambiente
 * @param {string|number} ambienteIdentificador - ID ou nome do ambiente usado pelo backend
 * @param {Object} catalogo - Dados do catálogo a ser salvo
 * @returns {Promise<Object>} Resposta da API
 */
export async function salvarCatalogos(ambienteIdentificador, catalogoOuLista) {
  try {
    const ambienteId = Number(ambienteIdentificador);
    if (!Number.isFinite(ambienteId)) {
      throw new Error("ID do ambiente inválido para salvar catálogo.");
    }
    const payload = Array.isArray(catalogoOuLista)
      ? catalogoOuLista
      : [catalogoOuLista];
    const response = await api.post(
      `/catalogo/salvar/${ambienteId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("[CatalogoService] Erro ao salvar catálogos:", error);
    throw error;
  }
}

/**
 * Atualiza catálogos de um ambiente
 * @param {string|number} ambienteIdentificador - ID ou nome do ambiente usado pelo backend
 * @param {Object} catalogo - Dados atualizados do catálogo
 * @returns {Promise<Object>} Resposta da API
 */
export async function atualizarCatalogos(catalogoId, catalogoDTO) {
  try {
    const id = Number(catalogoId);
    if (!Number.isFinite(id)) {
      throw new Error("ID do catálogo inválido para atualizar.");
    }
    const response = await api.put(
      `/catalogo/atualizar/${id}`,
      catalogoDTO
    );
    return response.data;
  } catch (error) {
    console.error("[CatalogoService] Erro ao atualizar catálogos:", error);
    throw error;
  }
}

/**
 * Deleta catálogos por IDs
 * @param {Array<number>} catalogosIds - Lista de IDs dos catálogos a serem deletados
 * @returns {Promise<Object>} Resposta da API
 */
export async function deletarCatalogos(catalogosIds) {
  try {
    const response = await api.delete("/catalogo/deletar", {
      data: catalogosIds
    });
    return response.data;
  } catch (error) {
    console.error("[CatalogoService] Erro ao deletar catálogos:", error);
    throw error;
  }
}

/**
 * Filtra catálogos por ambiente
 * @param {Array} catalogos - Lista de catálogos
 * @param {number} ambienteId - ID do ambiente para filtrar
 * @returns {Array} Catálogos filtrados
 */
export function filtrarPorAmbiente(catalogos, ambienteId) {
  if (!Array.isArray(catalogos)) return [];
  return catalogos.filter(c => c.ambienteId === ambienteId);
}

/**
 * Filtra catálogos por dia da semana
 * @param {Array} catalogos - Lista de catálogos
 * @param {string} diaSemana - Dia da semana (SEGUNDA, TERCA, QUARTA, etc.)
 * @returns {Array} Catálogos filtrados
 */
export function filtrarPorDiaSemana(catalogos, diaSemana) {
  return catalogos.filter(c => c.diaSemana === diaSemana);
}

/**
 * Filtra catálogos por disponibilidade
 * @param {Array} catalogos - Lista de catálogos
 * @param {string} disponibilidade - DISPONIVEL, INDISPONIVEL, MANUTENCAO
 * @returns {Array} Catálogos filtrados
 */
export function filtrarPorDisponibilidade(catalogos, disponibilidade) {
  return catalogos.filter(c => c.disponibilidade === disponibilidade);
}

/**
 * Agrupa catálogos por dia da semana
 * @param {Array} catalogos - Lista de catálogos
 * @returns {Object} Objeto com catálogos agrupados por dia
 */
export function agruparPorDiaSemana(catalogos) {
  return catalogos.reduce((acc, catalogo) => {
    const dia = catalogo.diaSemana;
    if (!acc[dia]) {
      acc[dia] = [];
    }
    acc[dia].push(catalogo);
    return acc;
  }, {});
}

/**
 * Agrupa catálogos por ambiente
 * @param {Array} catalogos - Lista de catálogos
 * @returns {Object} Objeto com catálogos agrupados por ambiente
 */
export function agruparPorAmbiente(catalogos) {
  return catalogos.reduce((acc, catalogo) => {
    const ambienteId = catalogo.ambienteId;
    if (!acc[ambienteId]) {
      acc[ambienteId] = [];
    }
    acc[ambienteId].push(catalogo);
    return acc;
  }, {});
}

/**
 * Formata hora de LocalTime para string
 * @param {string} localTime - Hora no formato LocalTime (HH:mm:ss)
 * @returns {string} Hora formatada (HH:mm)
 */
export function formatarHora(localTime) {
  if (!localTime) return "";
  return localTime.substring(0, 5); // Retorna HH:mm
}

/**
 * Valida se um catálogo tem dados válidos
 * @param {Object} catalogo - Objeto de catálogo
 * @returns {boolean} True se válido
 */
export function validarCatalogo(catalogo) {
  return (
    catalogo &&
    (catalogo.idAmbiente || catalogo.ambienteId) &&
    catalogo.horaInicio &&
    catalogo.horaFim &&
    catalogo.diaSemana &&
    catalogo.disponibilidade
  );
}

export default {
  buscarCatalogos,
  buscarCatalogosPorAmbiente,
  buscarCatalogoPorId,
  salvarCatalogos,
  atualizarCatalogos,
  deletarCatalogos,
  filtrarPorAmbiente,
  filtrarPorDiaSemana,
  filtrarPorDisponibilidade,
  agruparPorDiaSemana,
  agruparPorAmbiente,
  formatarHora,
  validarCatalogo
};
