import { api } from "./api";

export async function buscarMeuPerfil() {
  const data = await api.get("/usuario/meu-perfil");
  return data;
}

export async function buscarMinhasTurmas() {
  const data = await api.get("/usuario/minhas-turmas");
  return data;
}

export async function buscarEstudantes() {
  const resp = await api.get("/usuario/buscar-estudantes");
  return resp.data ?? resp;
}