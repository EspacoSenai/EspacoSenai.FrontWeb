import { api } from "../service/api";

export async function listarPreCadastros() {
  const { data } = await api.get("/precadastro/buscar");
  return data;
}

export async function criarPreCadastro({ nome, email }) {
  const payload = { nome: nome?.trim(), email: email?.trim() };
  const { data } = await api.post("/precadastro/salvar", payload);
  return data;
}

export async function atualizarPreCadastro(id, { nome, email }) {
  const payload = { nome: nome?.trim(), email: email?.trim() };
  const { data } = await api.post(`/precadastro/atualizar/${id}`, payload);
  return data;
}

export async function enviarPlanilha(file) {
  const formData = new FormData();
  formData.append("planilha", file); 
  const { data } = await api.post("/precadastro/planilha", formData);
  return data;
}
