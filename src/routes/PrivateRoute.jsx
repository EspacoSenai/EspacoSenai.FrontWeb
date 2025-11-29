// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getStoredToken() {
  try {
    const direct =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

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

  // tenta pegar do token (se tiver roles/authorities lá dentro)
  try {
    const token = getStoredToken();
    if (token && token.split(".").length === 3) {
      const payloadStr = atob(
        token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
      );
      const payload = JSON.parse(payloadStr);

      const tokenRoles =
        payload?.roles ||
        payload?.authorities ||
        (Array.isArray(payload?.authorities)
          ? payload.authorities.map((a) => a.authority)
          : null);

      if (Array.isArray(tokenRoles)) {
        tokenRoles.forEach((r) => roles.push(String(r)));
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
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // se nenhuma role foi passada, qualquer logado entra
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const userRoles = getUserRoles();
  const allowedUpper = allowedRoles.map((r) =>
    String(r).trim().toUpperCase()
  );

  const hasPermission = userRoles.some((r) => allowedUpper.includes(r));

  if (!hasPermission) {
    // logado mas sem permissão → manda pra 404
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
