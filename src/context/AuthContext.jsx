// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ================= helpers ================= */
const LS_SESSION = "espsn.session";

// base64url -> string
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
    const [, payloadB64] = String(token).split(".");
    return JSON.parse(b64urlDecode(payloadB64) || "{}");
  } catch {
    return null;
  }
}

function rolesFrom(token) {
  const p = parseJwt(token) || {};
  const raw = p.authorities || p.roles || p.scope || p.scp || [];
  const arr = Array.isArray(raw) ? raw : String(raw || "").split(" ");
  return arr.filter(Boolean);
}

// checa se o token já expirou pelo campo "exp" (segundos)
function isTokenExpired(token) {
  const p = parseJwt(token);
  if (!p || !p.exp) return false;
  const nowMs = Date.now();
  const expMs = p.exp * 1000;
  return expMs <= nowMs;
}

// → monta um usuário o mais completo possível a partir do JWT
function userFromToken(token) {
  const p = parseJwt(token) || {};

  const candidateName =
    p.nome ||
    p.name ||
    p.full_name ||
    p.username ||
    p.preferred_username ||
    p.sub ||
    (p.email ? p.email.split("@")[0] : "");

  const nome = candidateName || "Aluno";

  return {
    id: p.id || p.user_id || p.sub || null,
    nome,
    email: p.email || "",
    tag: p.tag || null,
    avatarUrl: p.picture || null,
    roles: rolesFrom(token),
    _payload: p,
  };
}

/** Busca sessão salva; se não houver, tenta montar a partir de access_token */
function getInitialSession() {
  try {
    const sess = JSON.parse(localStorage.getItem(LS_SESSION) || "null");
    if (sess?.token) return sess;
  } catch {}

  // fallback: usa token cru
  const token = localStorage.getItem("access_token");
  if (token) return { token, user: userFromToken(token) };

  return null;
}

function saveSession(s) {
  try {
    if (s) localStorage.setItem(LS_SESSION, JSON.stringify(s));
    else localStorage.removeItem(LS_SESSION);
  } catch {}
}

/* ================= contexto ================= */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSess] = useState(() => getInitialSession());
  const [status, setStatus] = useState("idle"); // idle | loading | ready

  // helper interno pra limpar tudo e mandar pra landing
  function hardSignOut() {
    saveSession(null);
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("avatar_url");
      localStorage.removeItem("selected_profile");
    } catch {}
    setSess(null);
    setStatus("ready");

    // garante que vai pra landing mesmo se tiver em rota maluca
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  function hydrate(source = getInitialSession()) {
    const token = source?.token;

    // se não tiver token, só considera deslogado
    if (!token) {
      setSess(null);
      setStatus("ready");
      return;
    }

    // se o token já expirou, desloga geral e volta pra landing
    if (isTokenExpired(token)) {
      hardSignOut();
      return;
    }

    // se não tiver user ou se o user não tiver nome,
    // recalcula a partir do token
    let user = source.user;
    if (!user || !user.nome) {
      user = userFromToken(token);
    }

    // override do avatar salvo na tela Avatares
    try {
      const chosen = localStorage.getItem("avatar_url");
      if (chosen) user = { ...user, avatarUrl: chosen };
    } catch {}

    const merged = { token, user };
    saveSession(merged);
    setSess(merged);
    setStatus("ready");
  }

  useEffect(() => {
    setStatus("loading");
    hydrate();

    // se outra aba logar/sair ou trocar avatar, atualiza
    const onStorage = (e) => {
      if (
        e.key === "access_token" ||
        e.key === LS_SESSION ||
        e.key === "avatar_url"
      ) {
        hydrate();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      status,
      token: session?.token ?? null,
      user: session?.user ?? null,
      setSession(s) {
        // permite salvar de qualquer lugar após login
        saveSession(s);
        hydrate(s);
      },
      // logout chamado pelos componentes / interceptors
      signOut() {
        hardSignOut();
      },
      refresh() {
        hydrate();
      },
    }),
    [session, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return (
    useContext(AuthContext) ?? {
      status: "idle",
      token: null,
      user: null,
      setSession() {},
      signOut() {},
      refresh() {},
    }
  );
}
