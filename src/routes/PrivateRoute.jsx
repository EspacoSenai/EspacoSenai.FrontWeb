import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const SESSION_KEYS = [
  "access_token",
  "token",
  "espns.session",
  "roles",
  "selected_profile",
  "espns.user",
  "espns.perfil",
  "espns.regiao",
];

function clearSession() {
  try {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error("Erro ao limpar sessão:", e);
  }
}

function getStoredToken() {
  try {
    const direct =
      localStorage.getItem("access_token") || localStorage.getItem("token");

    if (direct) return direct;

    const sessionRaw = localStorage.getItem("espns.session");
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      if (parsed && parsed.token) return parsed.token;
    }
  } catch (e) {
    console.error("Erro ao ler token do localStorage:", e);
  }
  return null;
}

function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar JWT:", e);
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowInSeconds;
}


function getUserRoles() {
  const roles = [];

  try {
    const raw = localStorage.getItem("roles");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((r) => roles.push(String(r)));
        } else {
          roles.push(String(raw));
        }
      } catch {
        roles.push(String(raw));
      }
    }
  } catch {}

  const profile = localStorage.getItem("selected_profile");
  if (profile) roles.push(String(profile));


  try {
    const token = getStoredToken();
    if (token && token.split(".").length === 3) {
      const payload = parseJwt(token);
      if (payload) {
        let tokenRoles =
          payload?.roles || payload?.authorities || payload?.authorities;


        if (Array.isArray(tokenRoles)) {
          const mapped = tokenRoles.map((r) =>
            typeof r === "string" ? r : r.authority
          );
          mapped.forEach((r) => roles.push(String(r)));
        }
      }
    }
  } catch {
    // ignora erro
  }

  const normalized = Array.from(
    new Set(
      roles
        .filter(Boolean)
        .map((r) => r.trim().toUpperCase())
    )
  );

  return normalized;
}

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    clearSession();
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, reason: "no_token" }}
      />
    );
  }


  if (isTokenExpired(token)) {
    clearSession();
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, reason: "expired" }}
      />
    );
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const userRoles = getUserRoles();
  const allowedUpper = allowedRoles.map((r) =>
    String(r).trim().toUpperCase()
  );

  const hasPermission = userRoles.some((r) => allowedUpper.includes(r));

  if (!hasPermission) {
    return (
      <Navigate
        to="/404"
        replace
        state={{ from: location, reason: "forbidden" }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
