import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthGate() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasCadastro =
      localStorage.getItem("hasCadastro") === "true" ||
      !!localStorage.getItem("user") ||
      !!localStorage.getItem("token");

    navigate(hasCadastro ? "/login" : "/cadastro", { replace: true });
  }, [navigate]);

  return null;
}
