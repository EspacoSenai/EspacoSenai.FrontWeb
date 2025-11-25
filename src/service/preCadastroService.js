import { api } from "../service/api"; // <- o mesmo api.js que já usamos no auth

// Lista todos (ADMIN/COORDENADOR)
export async function listarPreCadastros() {
  const { data } = await api.get("/precadastro/buscar");
  return data;
}

// Cria um único pré-cadastro (ADMIN/PROFESSOR)
export async function criarPreCadastro({ nome, email }) {
  const payload = { nome: nome?.trim(), email: email?.trim() };
  const { data } = await api.post("/precadastro/salvar", payload);
  return data;
}

// Atualiza (ADMIN/PROFESSOR)
export async function atualizarPreCadastro(id, { nome, email }) {
  const payload = { nome: nome?.trim(), email: email?.trim() };
  const { data } = await api.post(`/precadastro/atualizar/${id}`, payload);
  return data;
}

// Envia planilha .xlsx/.csv (ADMIN/PROFESSOR)
// Campo do back: "planilha"
export async function enviarPlanilha(file) {
  const formData = new FormData();
  formData.append("planilha", file);
  const { data } = await api.post("/precadastro/planilha", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
