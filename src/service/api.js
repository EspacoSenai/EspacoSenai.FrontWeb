const API_URL = (import.meta.env.VITE_API_URL || "https://espacosenai.azurewebsites.net").replace(/\/+$/, "");

// const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

function ensurePath(path = "") {
  const p = String(path || "");
  return p.startsWith("/") ? p : `/${p}`;
}

function getAuthToken() {
  const strip = (t) => String(t || "").replace(/^Bearer\s+/i, "").trim();

  // tenta em várias chaves diretas
  const direct =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  if (direct) return strip(direct);

  // tenta dentro da sessão salva (suporta as duas chaves, com e sem typo)
  try {
    const rawSess =
      localStorage.getItem("espns.session") ||
      localStorage.getItem("espsn.session");
    if (rawSess) {
      const sess = JSON.parse(rawSess || "null");
      if (sess?.token) return strip(sess.token);
    }
  } catch {}

  return null;
}

function isPublicAuthPath(path = "") {
  const p = ensurePath(path);
  return (
    p.startsWith("/auth/signin") ||
    p.startsWith("/auth/signup") ||
    p.startsWith("/auth/redefinir-senha") ||
    p.startsWith("/auth/confirmar-conta")
  );
}

function normalizeHeaders(headers) {
  try {
    return Object.fromEntries(
      Array.from(headers.entries()).map(([k, v]) => [k.toLowerCase(), v])
    );
  } catch {
    return {};
  }
}

/* ===== helpers de logout automático ===== */

function clearAuthTokens() {
  try {
    const keys = [
      "access_token",
      "token",
      "espns.session",
      "espsn.session", // caso antigo com typo
      "roles",
      "selected_profile",
      "avatar_url",
      "display_name",
      "aluno_nome_cache",
    ];
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

function handleAuthError() {
  clearAuthTokens();

  try {
    // avisa outros listeners que o token mudou
    window.dispatchEvent(
      new StorageEvent("storage", { key: "access_token", newValue: null })
    );
  } catch {}

  if (typeof window !== "undefined") {
    if (window.location.pathname !== "/landing") {
      window.location.href = "/landing";
    }
  }
}

/* ===== construção de headers ===== */

function buildHeaders({ path, options, isFormData }) {
  const token = getAuthToken();
  const skipAuth = Boolean(options?.skipAuth) || isPublicAuthPath(path);

  const base = {};
  if (!isFormData) base["Content-Type"] = "application/json";
  if (!skipAuth && token) base["Authorization"] = `Bearer ${token}`;

  return {
    ...base,
    ...(options?.headers || {}),
  };
}

/* ===== request padrão ===== */

async function request(path, options = {}) {
  const url = `${API_URL}${ensurePath(path)}`;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const response = await fetch(url, {
    method: options.method || "GET",
    ...options,
    headers: buildHeaders({ path, options, isFormData }),
    body: isFormData
      ? options.body
      : options.body !== undefined && options.body !== null
      ? typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const status = response.status;

    // se for 401/403 fora das rotas públicas de auth → auto logout + redirect
    if ((status === 401 || status === 403) && !isPublicAuthPath(path)) {
      handleAuthError();
    }

    throw {
      status,
      data,
      message:
        data?.message ||
        data?.error ||
        data?.details ||
        `Erro ao comunicar com o servidor. [${status}]`,
    };
  }

  return data;
}

/* ===== request "raw" (com status/headers) ===== */

async function requestRaw(path, options = {}) {
  const url = `${API_URL}${ensurePath(path)}`;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const response = await fetch(url, {
    method: options.method || "GET",
    ...options,
    headers: buildHeaders({ path, options, isFormData }),
    body: isFormData
      ? options.body
      : options.body !== undefined && options.body !== null
      ? typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const status = response.status;

    if ((status === 401 || status === 403) && !isPublicAuthPath(path)) {
      handleAuthError();
    }

    throw {
      status,
      data,
      message:
        data?.message ||
        data?.error ||
        data?.details ||
        `Erro ao comunicar com o servidor. [${status}]`,
    };
  }

  return {
    data,
    status: response.status,
    headers: normalizeHeaders(response.headers),
  };
}

/* ===== API "bonitinha" ===== */

export const api = {
  // básicas
  get: (path, extra = {}) => request(path, { method: "GET", ...extra }),
  post: (path, body, extra = {}) =>
    request(path, { method: "POST", body, ...extra }),
  put: (path, body, extra = {}) =>
    request(path, { method: "PUT", body, ...extra }),
  patch: (path, body, extra = {}) =>
    request(path, { method: "PATCH", body, ...extra }),
  delete: (path, extra = {}) =>
    request(path, { method: "DELETE", ...extra }),

  // versões Raw (quando precisa do status/headers)
  getRaw: (path, extra = {}) => requestRaw(path, { method: "GET", ...extra }),
  postRaw: (path, body, extra = {}) =>
    requestRaw(path, { method: "POST", body, ...extra }),
  putRaw: (path, body, extra = {}) =>
    requestRaw(path, { method: "PUT", body, ...extra }),
  patchRaw: (path, body, extra = {}) =>
    requestRaw(path, { method: "PATCH", body, ...extra }),
  deleteRaw: (path, extra = {}) =>
    requestRaw(path, { method: "DELETE", ...extra }),
};

export function setAuthToken(token) {
  try {
    const clean = String(token || "").replace(/^Bearer\s+/i, "").trim();
    if (clean) {
      localStorage.setItem("access_token", clean);
      localStorage.setItem(
        "espns.session",
        JSON.stringify({ token: clean, user: null })
      );
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("espns.session");
    }
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "access_token",
        newValue: clean || null,
      })
    );
  } catch {}
}

export function getBearer() {
  const t = getAuthToken();
  return t ? `Bearer ${t}` : null;
}

export async function signInAuth({ identificador, senha }) {
  const { data } = await api.postRaw("/auth/signin", {
    identificador: String(identificador ?? "").trim(),
    senha,
  });

  const token =
    data?.accessToken ??
    data?.token ??
    data?.jwt ??
    (typeof data === "string" ? data : null);

  if (!token)
    throw new Error("Token JWT não encontrado na resposta de /auth/signin.");

  setAuthToken(token);
  return { token: getAuthToken(), expiresIn: data?.expiresIn ?? null };
}

export function fetchMe() {
  return api.get("/auth/me");
}


export function buscarMinhasNotificacoes() {
  return api.get("/notificacao/minhas");
}


export function marcarNotificacaoComoLida(id) {
  return api.put(`/notificacao/ler/${id}`, {});
}


export function deletarNotificacao(id) {
  return api.delete(`/notificacao/deletar/${id}`);
}

export function enviarBroadcastNotificacao(dto) {
  return api.post("/notificacao/broadcast", dto);
}

export function enviarNotificacaoWsUsuario(usuarioId, payload) {
  return api.post(`/notificacao/ws/usuario/${usuarioId}`, payload);
}

export function enviarNotificacaoWsTodos(payload) {
  return api.post("/notificacao/ws/todos", payload);
}
export { API_URL, ensurePath, getAuthToken };
