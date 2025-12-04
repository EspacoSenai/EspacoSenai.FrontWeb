import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ranRef = useRef(false);

  useEffect(() => {

    if (pathname !== "/" || ranRef.current) return;
    ranRef.current = true;

    const onboardingVisto = localStorage.getItem("onboardingVisto") === "true";
    const hasCadastro =
      localStorage.getItem("hasCadastro") === "true" ||
      !!localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    if (token) {
      const destinoPorRole = {
        ADMIN: "/HomeAdm",
        COORDENADOR: "/HomeCoordenador",
        PROFESSOR: "/HomeProfessor",
        ALUNO: "/HomeAlunos",
      };
      navigate(destinoPorRole[role] || "/HomeAlunos", { replace: true });
      return;
    }

    if (onboardingVisto) {
      navigate(hasCadastro ? "/login" : "/landing", { replace: true });
      return;
    }

 
    navigate("/onboarding", { replace: true });
  }, [pathname, navigate]);

  return null;
}
