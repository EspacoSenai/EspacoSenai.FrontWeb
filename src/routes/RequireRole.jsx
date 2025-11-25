// src/routes/RequireRole.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireRole({ roles = [], userRoles = [], children }) {
  const location = useLocation();
  const upperUser = (userRoles || []).map((r) => String(r).toUpperCase());
  const ok = roles.some((r) => upperUser.includes(String(r).toUpperCase()));

  if (!ok) {
    // sem permissão → volta pro login (ou /)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
