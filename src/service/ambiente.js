import { api } from "./api";

export async function buscarTodosAmbientes() {
  const resp = await api.get("/ambiente/buscar");
  return resp?.data ?? resp;
}

export async function buscarAmbiente(id) {
  const resp = await api.get(`/ambiente/buscar/${id}`);
  return resp?.data ?? resp;
}

export async function atualizarAmbiente(id, ambienteDTO) {
  const resp = await api.patch(`/ambiente/atualizar/${id}`, ambienteDTO);
  return resp?.data ?? resp;
}

export async function buscarAmbientePorNome(nome) {
  const resp = await api.get(`/ambiente/buscar/por-nome/${nome}`);
  return resp?.data ?? resp;
}