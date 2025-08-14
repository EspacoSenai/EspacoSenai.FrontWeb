import React, { useEffect, useLayoutEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Onboarding from "./pages/onboarding";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Index from "./navigation/index";
import AgendamentoQuadra from "./pages/agendamentoQuadra"; 

import AOS from "aos";
import "aos/dist/aos.css";

export default function App() {
  // mantém o tema salvo mesmo sem o Header na tela
  useLayoutEffect(() => {
    try {
      const salvo = localStorage.getItem("theme") || "light";
      if (salvo === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch {}
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />

      <Route path="/agendamento-quadra" element={<AgendamentoQuadra />} />
    </Routes>
  );
}
