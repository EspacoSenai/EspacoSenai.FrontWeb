// src/service/authService.js
import { api } from "./api";

/* ========= helpers JWT ========= */
function b64urlDecode(str) {
  try {
    const pad = "=".repeat((4 - (str.length % 4)) % 4);
    const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
    return atob(b64);
  } catch {
    return "";
  }
}

function parseJwt(token) {
  try {
    const [, payloadB64] = String(token || "").split(".");
    return JSON.parse(b64urlDecode(payloadB64) || "{}");
  } catch {
    return null;
  }
}

export function extractRolesFromToken(token) {
  const payload = parseJwt(token) || {};
  const raw =
    payload?.authorities ||
    payload?.roles ||
    payload?.scope ||
    payload?.scp ||
    [];
  const arr = Array.isArray(raw) ? raw : String(raw || "").split(" ");
  return arr.filter(Boolean);
}

/* ========= sessão ========= */
export async function signIn({ identificador, senha }) {
  try {
    const data = await api.post(
      "/auth/signin",
      { identificador: String(identificador ?? "").trim(), senha },
      { skipAuth: true }
    );

    const token =
      data?.accessToken ||
      data?.token ||
      data?.access_token ||
      data?.jwt ||
      null;

    if (!token) {
      return {
        ok: false,
        status: 500,
        error: "Token não retornado pelo servidor.",
      };
    }

    // mantém seus storages
    localStorage.setItem("access_token", token);
    localStorage.setItem("token", token);

    // espelho opcional para outros módulos
    try {
      localStorage.setItem(
        "espsn.session",
        JSON.stringify({ token, user: null })
      );
    } catch {}

    const roles = extractRolesFromToken(token);
    localStorage.setItem("roles", JSON.stringify(roles));

    // limpa apenas caches de nome (NÃO apagar o token!)
    localStorage.removeItem("display_name");
    localStorage.removeItem("aluno_nome_cache");

    return { ok: true, token, roles, expiresIn: data?.expiresIn ?? null };
  } catch (err) {
    const status = err?.status ?? 0;
    const msg =
      status === 401
        ? "Usuário ou senha inválidos."
        : err?.message || "Falha ao autenticar.";
    return { ok: false, status, error: msg };
  }
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function getRoles() {
  try {
    return JSON.parse(localStorage.getItem("roles") || "[]");
  } catch {
    return [];
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  localStorage.removeItem("selected_profile");
  localStorage.removeItem("display_name");
  localStorage.removeItem("aluno_nome_cache");
  localStorage.removeItem("espsn.session");
}

/* ========= cadastro / confirmação ========= */
export async function signUpUsuario({ nome, email, senha, tag }) {
  const data = await api.post(
    "/auth/signup",
    { nome, email, senha, tag },
    { skipAuth: true }
  );
  return {
    token: data?.token ?? data?.data?.token ?? null,
    message: data?.message ?? data?.data?.message ?? "",
    raw: data,
  };
}

export async function confirmarConta(token, codigo) {
  if (!token || !codigo)
    throw { message: "Token e código são obrigatórios." };

  const codigoUpper = String(codigo).toUpperCase();
  const path = `/auth/confirmar-conta/${encodeURIComponent(
    token
  )}/${encodeURIComponent(codigoUpper)}`;

  return await api.get(path, { skipAuth: true });
}

/* ========= util: obter dados do usuário logado =========
   AGORA: lê direto do JWT (sem chamar /usuario/buscar).  */
export async function fetchMe() {
  const token = getToken();
  if (!token) {
    return { id: null, nome: "", email: "" };
  }

  const p = parseJwt(token) || {};

  const id = p?.id || p?.user_id || p?.sub || null;
  const nome = (p?.nome || p?.name || "").toString().trim();
  const email = (p?.email || "").toString().trim();

  return { id, nome, email };
}

/** Busca o nome do usuário logado (via JWT). */
export async function fetchDisplayName() {
  const me = await fetchMe();
  return (me.nome || "").trim();
}

/* ========= perfis/roles ========= */
export function userHasRole(wanted, roles = getRoles()) {
  const upper = roles.map((r) => String(r).toUpperCase());
  const mapa = {
    ADMIN: ["SCOPE_ADMIN", "ADMIN", "ROLE_ADMIN"],
    COORDENADOR: ["SCOPE_COORDENADOR", "COORDENADOR", "ROLE_COORDENADOR"],
    PROFESSOR: ["SCOPE_PROFESSOR", "PROFESSOR", "ROLE_PROFESSOR"],
    ALUNO: [
      "SCOPE_ESTUDANTE",
      "SCOPE_ALUNO",
      "ESTUDANTE",
      "ALUNO",
      "ROLE_ALUNO",
    ],
  };
  const cand = mapa[wanted] || [wanted];
  return cand.some((c) => upper.includes(c));
}

export function routeForProfile(profile) {
  switch (profile) {
    case "ADMIN":
      return "/HomeAdm";
    case "COORDENADOR":
      return "/HomeCoordenador";
    case "PROFESSOR":
      return "/HomeProfessor";
    case "ALUNO":
      return "/HomeAlunos";
    default:
      return "/HomeAlunos";
  }
}
