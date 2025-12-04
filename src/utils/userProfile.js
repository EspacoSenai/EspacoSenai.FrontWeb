// src/utils/userProfile.js

function b64urlDecode(str) {
  try {
    const pad = "=".repeat((4 - (str.length % 4)) % 4);
    const base64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
    return atob(base64);
  } catch {
    return "";
  }
}

export function parseJwtSafe(token) {
  try {
    const [, payloadB64] = String(token || "").split(".");
    return JSON.parse(b64urlDecode(payloadB64) || "{}");
  } catch {
    return null;
  }
}

export function extractRolesFromToken(token) {
  const p = parseJwtSafe(token) || {};
  const raw = p?.authorities || p?.scope || p?.scp || [];
  const arr = Array.isArray(raw) ? raw : String(raw || "").split(" ");
  return arr.map(String);
}

export function isValidName(v) {
  const s = String(v || "").trim();
  return s && !/^\d+$/.test(s) && s.length >= 2;
}

export function toDisplayName(s) {
  const str = String(s || "").trim();
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

export function quickNameFromTokenOrCache() {
  const token = localStorage.getItem("access_token");
  if (token) {
    const p = parseJwtSafe(token) || {};
    const quick =
      p?.nome ||
      p?.name ||
      p?.given_name ||
      (p?.email ? String(p.email).split("@")[0] : "");
    if (isValidName(quick)) return toDisplayName(quick);
  }
  const cache = localStorage.getItem("aluno_nome_cache");
  if (isValidName(cache)) return toDisplayName(cache);
  return "";
}

function hasPrivilegedRole(roles = []) {
  const set = new Set(roles.map((r) => r.toUpperCase()));
  return (
    set.has("ADMIN") ||
    set.has("SCOPE_ADMIN") ||
    set.has("COORDENADOR") ||
    set.has("SCOPE_COORDENADOR") ||
    set.has("PROFESSOR") ||
    set.has("SCOPE_PROFESSOR")
  );
}

/**
 * Tenta buscar o nome “oficial” no back apenas se o papel
 * do token for privilegiado. Nunca lança/loga erro.
 */
export async function fetchOfficialNameFromBackend(api) {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return "";

    const roles = extractRolesFromToken(token);
    if (!hasPrivilegedRole(roles)) return "";

    const payload = parseJwtSafe(token) || {};
    const sub = String(payload.sub || "").trim();
    if (!/^\d+$/.test(sub)) return "";

    const resp = await api.get(`/usuario/buscar/${encodeURIComponent(sub)}`);
    const data = resp?.data ?? resp;
    const nome =
      data?.nome ||
      data?.name ||
      (data?.email ? String(data.email).split("@")[0] : "");
    return isValidName(nome) ? toDisplayName(nome) : "";
  } catch {
    return "";
  }
}

export function cacheDisplayName(name) {
  if (isValidName(name)) {
    const pretty = toDisplayName(name);
    localStorage.setItem("aluno_nome_cache", pretty);
    localStorage.setItem("display_name", pretty);
  }
}
