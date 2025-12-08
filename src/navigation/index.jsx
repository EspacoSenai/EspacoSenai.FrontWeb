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
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    // Se estiver logado, vai para a home do perfil
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

    // Se nunca viu o onboarding, mostra apenas na primeira vez
    if (!onboardingVisto) {
      navigate("/onboarding", { replace: true });
      return;
    }

    // Caso contrário, sempre vai para landing
    navigate("/landing", { replace: true });
  }, [pathname, navigate]);

  return null;
}
