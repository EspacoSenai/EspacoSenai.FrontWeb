import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const jaViu = localStorage.getItem("onboardingVisto");
    const usarFluxoAntigo = localStorage.getItem("usarFluxoAntigo") === "true";

    if (jaViu === "true") {
      navigate(usarFluxoAntigo ? "/selecao-perfil" : "/landing");
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  return null;
}
