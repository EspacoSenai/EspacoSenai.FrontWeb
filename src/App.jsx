import React, { useEffect, useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import LandingPage from "./pages/landingPage";
import Onboarding from "./pages/onboarding";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Index from "./navigation/index";
import AgendamentoQuadra from "./pages/agendamentoQuadra";
import AgendamentoComputadores from "./pages/AgendamentoComputadores";

import AOS from "aos";
import "aos/dist/aos.css";

export default function App() {
  const location = useLocation();

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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/onboarding"
          element={
            <PageTransition>
              <Onboarding />
            </PageTransition>
          }
        />
        <Route
          path="/landing"
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/cadastro"
          element={
            <PageTransition>
              <Cadastro />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/agendamento-quadra"
          element={
            <PageTransition>
              <AgendamentoQuadra />
            </PageTransition>
          }
        />
        <Route
          path="/agendamento-computadores"
          element={
            <PageTransition>
              <AgendamentoComputadores />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
