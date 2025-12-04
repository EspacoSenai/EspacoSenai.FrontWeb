import { api } from "./api";

export async function buscarMeuPerfil() {
  const resp = await api.get("/usuario/meu-perfil");
  return resp.data ?? resp;
}

export async function buscarMinhasTurmas() {
  const resp = await api.get("/usuario/minhas-turmas");
  return resp.data ?? resp;
}

export async function buscarEstudantes() {
  const resp = await api.get("/usuario/buscar-estudantes");
  return resp.data ?? resp;
}

export async function buscarPorRole(role) {
  const resp = await api.get(`/usuario/buscar-por-role/${role}`);
  return resp.data ?? resp;
}

export async function buscarProfessores() {
  return buscarPorRole("PROFESSOR");
}

export async function buscarCoordenadores() {
  return buscarPorRole("COORDENADOR");
}

export async function buscarTodos() {
  const resp = await api.get("/usuario/buscar-todos");
  return resp.data ?? resp;
}

export async function buscarPorId(id) {
  const resp = await api.get(`/usuario/buscar-por-id/${id}`);
  return resp.data ?? resp;
}

export async function atualizarUsuario(id, dados) {
  const resp = await api.put(`/usuario/atualizar/${id}`, dados);
  return resp.data ?? resp;
}

export async function alterarStatus(id, idStatus) {
  const resp = await api.post(`/usuario/alterar-status/${id}?idStatus=${idStatus}`);
  return resp.data ?? resp;
}