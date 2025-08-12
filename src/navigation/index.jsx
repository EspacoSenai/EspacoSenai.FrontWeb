import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();


  useEffect(() => {
    const jaViu = localStorage.getItem("onboardingVisto");

    if (jaViu === "true") {
      navigate("/selecao-perfil");
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  return null;
}
