import React, { useEffect, useLayoutEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AOS from "aos";
import "aos/dist/aos.css";

import Index from "./navigation/index";

// Iniciais (atuais)
import LandingPage from "./pages/PageIniciais/landingPage.jsx";
import Onboarding from "./pages/PageIniciais/onboarding.jsx";

// Autenticação
import Cadastro from "./pages/Autenticação/cadastro.jsx";
import Login from "./pages/Autenticação/login.jsx";
import EsqueciSenha from "./pages/Autenticação/esqueciSenha.jsx";
import NovaSenha from "./pages/Autenticação/novasenha.jsx";
import CodigoDeRecuperacao from "./pages/Autenticação/códigoderec.jsx";

// Perfis / Notificações
import EditarPerfil from "./pages/Perfis/editarperfil.jsx";
import Avatares from "./pages/Perfis/avatares.jsx";
import SemNotificacao from "./pages/Notificações/semnotificação.jsx";
import Notificacoes from "./pages/Notificações/notificações.jsx";

// Agendamentos (atuais)
import AgendamentoQuadra from "./pages/Agendamento/agendamentoQuadra.jsx";
import AgendamentoComputadores from "./pages/Agendamento/AgendamentoComputadores.jsx";
import AgendamentoPS5 from "./pages/Agendamento/AgendamentoPS5.jsx";
import AgendamentoAuditorio from "./pages/Agendamento/AgendamentoAuditorio.jsx";
import AgendamentoImpressora from "./pages/Agendamento/agendamentoImpressora.jsx";

// Páginas por perfil
import HomeAlunos from "./pages/PaginaDosAlunos/HomeAlunos.jsx";
import SalasAlunos from "./pages/PaginaDosAlunos/SalasAlunos.jsx";

import HomeProfessor from "./pages/PaginaDosProfessores/HomeProfessor.jsx";
import SalasProfessores from "./pages/PaginaDosProfessores/SalasProfessores.jsx";
import NovaTurma from "./pages/PaginaDosProfessores/NovaTurma.jsx";

import HomeCoordenador from "./pages/PaginaDosCoordenadores/HomeCoordenadores.jsx";
import SalasCoordenadores from "./pages/PaginaDosCoordenadores/SalasCoordenadores.jsx";

import HomeAdm from "./pages/PaginaDosAdm/HomeAdm.jsx";
import SalasAdministradores from "./pages/PaginaDosAdm/SalasAdm.jsx";

// ADM extras
import RelatorioAdm from "./pages/ADM/relatórioadm.jsx";
import GestaoDeAluno from "./pages/ADM/gestaodealuno.jsx";
import GestaoDeAlunos from "./pages/ADM/gestaodealunos.jsx";
import PreCadastrarUsuario from "./pages/ADM/precadastrar.jsx";
import CriarUsuario from "./pages/ADM/criaruser.jsx";
import ReservaPendente from "./pages/ADM/reservapendente.jsx";
import EditarVersala from "./pages/ADM/editarversala.jsx";
import CriarSala from "./pages/ADM/criarsala.jsx";
import EditarSala from "./pages/ADM/editarsala.jsx";
import PaginaErro from "./pages/ADM/paginaerro.jsx";

import ProtectedRoute from "./routes/ProtectedRoute";

function ScrollToTop({ behavior = "instant" }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      try {
        const b = behavior === "smooth" ? "smooth" : "auto";
        window.scrollTo({ top: 0, left: 0, behavior: b });
      } catch {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, search, hash, behavior]);

  return null;
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

// página simples para bloqueio de permissão
function SemPermissao() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black">Sem permissão</h1>
        <p className="text-black/70 mt-2">
          Você não tem acesso a esta página.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  useLayoutEffect(() => {
    try {
      const salvo = localStorage.getItem("theme") || "light";
      if (salvo === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch (e) {
      console.error("Erro ao recuperar tema salvo:", e);
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    try {
      AOS.refreshHard?.();
    } catch {}
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop behavior="instant" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Iniciais (públicas) */}
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

          {/* Autenticação (públicas) */}
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
            path="/esqueci-senha"
            element={
              <PageTransition>
                <EsqueciSenha />
              </PageTransition>
            }
          />
          <Route
            path="/codigodere"
            element={
              <PageTransition>
                <CodigoDeRecuperacao />
              </PageTransition>
            }
          />
          <Route
            path="/códigoderec"
            element={
              <PageTransition>
                <CodigoDeRecuperacao />
              </PageTransition>
            }
          />
          <Route
            path="/novasenha"
            element={
              <PageTransition>
                <NovaSenha />
              </PageTransition>
            }
          />

          {/* Página de sem permissão */}
          <Route
            path="/sem-permissao"
            element={
              <PageTransition>
                <SemPermissao />
              </PageTransition>
            }
          />

          {/* Perfis / Notificações (logado qualquer papel) */}
          <Route
            path="/editarperfil"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <EditarPerfil />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/avatares"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <Avatares />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/semnotificacao"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <SemNotificacao />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notificacoes"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <Notificacoes />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Alunos */}
          <Route
            path="/HomeAlunos"
            element={
              <ProtectedRoute
                allowed={[
                  "SCOPE_ESTUDANTE",
                  "SCOPE_ALUNO",
                  "SCOPE_USER",
                  "SCOPE_ADMIN",
                ]}
              >
                <PageTransition>
                  <HomeAlunos />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas-alunos"
            element={
              <ProtectedRoute
                allowed={[
                  "SCOPE_ESTUDANTE",
                  "SCOPE_ALUNO",
                  "SCOPE_USER",
                  "SCOPE_ADMIN",
                ]}
              >
                <PageTransition>
                  <SalasAlunos />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Professores */}
          <Route
            path="/HomeProfessor"
            element={
              <ProtectedRoute
                allowed={["SCOPE_PROFESSOR", "SCOPE_ADMIN"]}
              >
                <PageTransition>
                  <HomeProfessor />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas-professores"
            element={
              <ProtectedRoute
                allowed={["SCOPE_PROFESSOR", "SCOPE_ADMIN"]}
              >
                <PageTransition>
                  <SalasProfessores />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/professores/turmas/nova"
            element={
              <ProtectedRoute
                allowed={["SCOPE_PROFESSOR", "SCOPE_ADMIN"]}
              >
                <PageTransition>
                  <NovaTurma />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Coordenadores */}
          <Route
            path="/HomeCoordenador"
            element={
              <ProtectedRoute
                allowed={["SCOPE_COORDENADOR", "SCOPE_ADMIN"]}
              >
                <PageTransition>
                  <HomeCoordenador />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas-coordenadores"
            element={
              <ProtectedRoute
                allowed={["SCOPE_COORDENADOR", "SCOPE_ADMIN"]}
              >
                <PageTransition>
                  <SalasCoordenadores />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Administradores */}
          <Route
            path="/HomeAdm"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <HomeAdm />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas-administradores"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <SalasAdministradores />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* ADM extras (ADMIN only) */}
          <Route
            path="/relatorio-adm"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <RelatorioAdm />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestao-de-aluno"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <GestaoDeAluno />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestao-de-alunos"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <GestaoDeAlunos />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pre-cadastrar"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <PreCadastrarUsuario />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/criar-usuario"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <CriarUsuario />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reserva-pendente"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <ReservaPendente />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-versala"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <EditarVersala />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/criar-sala"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <CriarSala />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-sala"
            element={
              <ProtectedRoute allowed={["SCOPE_ADMIN"]}>
                <PageTransition>
                  <EditarSala />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Agendamentos principais (qualquer logado) */}
          <Route
            path="/agendamento-quadra"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoQuadra />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamento-computadores"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoComputadores />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamento-ps5"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoPS5 />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamento-auditorio"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoAuditorio />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamento-impressora"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoImpressora />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Aliases compatíveis (qualquer logado) */}
          <Route
            path="/agendamentos/quadra"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoQuadra />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamentos/computadores"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoComputadores />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamentos/ps5"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoPS5 />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamentos/auditorio"
            element={
              <ProtectedRoute allowed={[]}>
                <PageTransition>
                  <AgendamentoAuditorio />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="/404"
            element={
              <PageTransition>
                <PaginaErro />
              </PageTransition>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
