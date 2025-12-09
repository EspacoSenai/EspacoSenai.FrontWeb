// src/service/turma.js
import { api } from "./api";

/* ===== helpers de conversão ===== */

// front manda dd/MM/yyyy → back espera yyyy-MM-dd
// se já vier em yyyy-MM-dd, só devolve
function toISODateFromBR(dateStr) {
  if (!dateStr) return null;

  const s = String(dateStr);

  // se já estiver no formato ISO, mantém
  if (s.includes("-") && s.split("-").length === 3) {
    return s;
  }

  const parts = s.split("/");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return null;

  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

/* ===== mapear tipo bonitinho → ENUM do back ===== */
function mapTipoToModalidade(tipo) {
  const t = String(tipo || "").toLowerCase();

  if (t === "fic") return "FIC";
  if (t === "faculdade") return "FACULDADE";
  if (t === "técnico" || t === "tecnico") return "TECNICO";

  // fallback seguro (ajusta se quiser outro default)
  return "FIC";
}

/**
 * Cria turma no formato que o back espera:
 * {
 *   "nome": "seduc",
 *   "curso": "Front-End",
 *   "modalidade": "TECNICO",
 *   "dataInicio": "2026-11-20",
 *   "dataTermino": "2026-12-12",
 *   "capacidade": 40,
 *   "professorId": 2,
 *   "estudantesIds": [1, 2, ...]
 * }
 */
export async function criarTurma(values) {
  // monta array de IDs de alunos
  let estudantesIds = [];
  if (values.estudantesIdsTexto?.trim()) {
    estudantesIds = values.estudantesIdsTexto
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
  }

  const nome = values.nome?.trim() || "";
  const curso = values.curso?.trim() || "";
  const modalidadeUpper = String(values.modalidade || "").trim().toUpperCase();

  const dataInicioISO = toISODateFromBR(values.dataInicio);
  const dataTerminoISO = toISODateFromBR(values.dataTermino);

  // professorId É OBRIGATÓRIO no back (coluna NOT NULL)
  const professorIdRaw = String(values.professorId ?? "").trim();
  const professorId = professorIdRaw ? Number(professorIdRaw) : null;

  if (!professorId || Number.isNaN(professorId)) {
    throw new Error("O ID do professor é obrigatório (o back não aceita nulo).");
  }

  const body = {
    nome,
    curso,
    modalidade: modalidadeUpper, // FIC, TECNICO etc, sempre MAIÚSCULO
    dataInicio: dataInicioISO,
    dataTermino: dataTerminoISO,
    capacidade: values.capacidade ? Number(values.capacidade) : null,
    professorId,
    estudantesIds,
  };

  console.log("[criarTurma] body enviado:", body);

  const resp = await api.post("/turma/salvar", body);
  // axios → resp.data; fetch mock → resp
  return resp?.data ?? resp;
}

/**
 * Busca TODAS as turmas para o ADM/Professor
 */
export async function buscarTurmas() {
  const resp = await api.get("/turma/buscar");
  const data = resp?.data ?? resp;

  console.log("[buscarTurmas] dados recebidos do back:", data);

  // se o back devolver array direto
  if (Array.isArray(data)) return data;

  // se o back devolver dentro de "conteudo" ou "content"
  if (Array.isArray(data?.conteudo)) return data.conteudo;
  if (Array.isArray(data?.content)) return data.content;

  return [];
}

/**
 * Para aluno, hoje é o mesmo endpoint.
 * Se um dia tiver endpoint específico, é só trocar aqui.
 */
export async function buscarTurmasAluno() {
  return buscarTurmas();
}

/**
 * Buscar turma específica por ID (usado na tela de edição)
 */
export async function buscarTurmaPorId(id) {
  const resp = await api.get(`/turma/buscar/${id}`);
  const data = resp?.data ?? resp;
  console.log("[buscarTurmaPorId] turma:", data);
  return data;
}

/**
 * Gerar novo código de acesso para a turma (endpoint do back)
 * POST /turma/gerar-novo-codigo/:turmaId
 */
export async function gerarNovoCodigo(turmaId) {
  if (!turmaId) throw new Error("ID da turma obrigatório para gerar novo código.");
  const resp = await api.post(`/turma/gerar-novo-codigo/${turmaId}`, {});
  return resp?.data ?? resp;
}

/**
 * Atualizar turma existente.
 * Recebe um objeto vindo da tela:
 * {
 *   materia,
 *   nomeTurma,
 *   tipo,            // "Fic" | "Faculdade" | "Técnico"
 *   dataInicioISO,   // "yyyy-MM-dd"
 *   dataTerminoISO,  // "yyyy-MM-dd"
 *   capacidade       // number (obrigatório no back)
 * }
 */
export async function atualizarTurma(id, values) {
  const nome = values.nomeTurma?.trim() || "";
  const curso = values.materia?.trim() || "";
  const modalidade = mapTipoToModalidade(values.tipo);
  const dataInicio = toISODateFromBR(values.dataInicioISO || values.dataInicio);
  const dataTermino = toISODateFromBR(
    values.dataTerminoISO || values.dataTermino
  );

  const capacidadeNum =
    values.capacidade != null && values.capacidade !== ""
      ? Number(values.capacidade)
      : null;

  const body = {
    nome,
    curso,
    modalidade,
    dataInicio,
    dataTermino,
    capacidade: capacidadeNum,
    // professorId e estudantesIds são controlados por outros fluxos,
    // então não estamos mexendo aqui.
  };

  console.log("[atualizarTurma] body enviado:", body);

  const resp = await api.put(`/turma/atualizar/${id}`, body);
  return resp?.data ?? resp;
}

/**
 * Ingressar turma por código
 */
export async function ingressarTurmaPorCodigo(codigo) {
  const cod = String(codigo || "").trim();
  if (!cod) {
    throw new Error("Digite o código da turma.");
  }

  const resp = await api.get(
    `/turma/ingressar-por-codigo/${encodeURIComponent(cod)}`
  );

  console.log("[ingressarTurmaPorCodigo] resposta do back:", resp);
  return resp?.data ?? resp;
}
