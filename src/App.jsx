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
import SelecaoPerfil from "./pages/Autenticação/selecaoPerfil.jsx";
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

import PrivateRoute from "./routes/PrivateRoute";

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
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
          <Route path="/landing" element={<PageTransition><LandingPage /></PageTransition>} />

          {/* Autenticação (públicas) */}
          <Route path="/selecaoDePerfil" element={<PageTransition><SelecaoPerfil /></PageTransition>} />
          <Route path="/cadastro" element={<PageTransition><Cadastro /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/esqueci-senha" element={<PageTransition><EsqueciSenha /></PageTransition>} />
          <Route path="/codigodere" element={<PageTransition><CodigoDeRecuperacao /></PageTransition>} />
          <Route path="/códigoderec" element={<PageTransition><CodigoDeRecuperacao /></PageTransition>} />
          <Route path="/novasenha" element={<PageTransition><NovaSenha /></PageTransition>} />

          {/* Perfis / Notificações (logado, qualquer papel) */}
          <Route path="/editarperfil" element={<PrivateRoute><PageTransition><EditarPerfil /></PageTransition></PrivateRoute>} />
          <Route path="/avatares" element={<PrivateRoute><PageTransition><Avatares /></PageTransition></PrivateRoute>} />
          <Route path="/semnotificacao" element={<PrivateRoute><PageTransition><SemNotificacao /></PageTransition></PrivateRoute>} />
          <Route path="/notificacoes" element={<PrivateRoute><PageTransition><Notificacoes /></PageTransition></PrivateRoute>} />

          {/* Alunos (ESTUDANTE/ALUNO/ADMIN) */}
          <Route path="/HomeAlunos" element={<PrivateRoute allowedRoles={["ESTUDANTE", "ALUNO", "ADMIN"]}><PageTransition><HomeAlunos /></PageTransition></PrivateRoute>} />
          <Route path="/salas-alunos" element={<PrivateRoute allowedRoles={["ESTUDANTE", "ALUNO", "ADMIN"]}><PageTransition><SalasAlunos /></PageTransition></PrivateRoute>} />

          {/* Professores (PROFESSOR/ADMIN) */}
          <Route path="/HomeProfessor" element={<PrivateRoute allowedRoles={["PROFESSOR", "ADMIN"]}><PageTransition><HomeProfessor /></PageTransition></PrivateRoute>} />
          <Route path="/salas-professores" element={<PrivateRoute allowedRoles={["PROFESSOR", "ADMIN"]}><PageTransition><SalasProfessores /></PageTransition></PrivateRoute>} />
          <Route path="/professores/turmas/nova" element={<PrivateRoute allowedRoles={["PROFESSOR", "ADMIN"]}><PageTransition><NovaTurma /></PageTransition></PrivateRoute>} />

          {/* Coordenadores (COORDENADOR/ADMIN) */}
          <Route path="/HomeCoordenador" element={<PrivateRoute allowedRoles={["COORDENADOR", "ADMIN"]}><PageTransition><HomeCoordenador /></PageTransition></PrivateRoute>} />
          <Route path="/salas-coordenadores" element={<PrivateRoute allowedRoles={["COORDENADOR", "ADMIN"]}><PageTransition><SalasCoordenadores /></PageTransition></PrivateRoute>} />

          {/* Administradores (ADMIN/ADMINISTRADOR) */}
          <Route path="/HomeAdm" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><HomeAdm /></PageTransition></PrivateRoute>} />
          <Route path="/salas-administradores" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><SalasAdministradores /></PageTransition></PrivateRoute>} />

          {/* ADM extras (ADMIN/ADMINISTRADOR) */}
          <Route path="/relatorio-adm" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><RelatorioAdm /></PageTransition></PrivateRoute>} />
          <Route path="/gestao-de-aluno" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><GestaoDeAluno /></PageTransition></PrivateRoute>} />
          <Route path="/gestao-de-alunos" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><GestaoDeAlunos /></PageTransition></PrivateRoute>} />
          <Route path="/pre-cadastrar" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><PreCadastrarUsuario /></PageTransition></PrivateRoute>} />
          <Route path="/criar-usuario" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><CriarUsuario /></PageTransition></PrivateRoute>} />
          <Route path="/reserva-pendente" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><ReservaPendente /></PageTransition></PrivateRoute>} />

          {/* Editar turma/sala – PROF + ADMIN */}
          <Route
            path="/editar-versala"
            element={
              <PrivateRoute allowedRoles={["PROFESSOR", "ADMIN", "ADMINISTRADOR"]}>
                <PageTransition>
                  <EditarVersala />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/editar-versala/:id"
            element={
              <PrivateRoute allowedRoles={["PROFESSOR", "ADMIN", "ADMINISTRADOR"]}>
                <EditarVersala />
              </PrivateRoute>
            }
          />

          {/* Salas físicas (só ADM) */}
          <Route path="/criar-sala" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><CriarSala /></PageTransition></PrivateRoute>} />
          <Route path="/editar-sala" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><PageTransition><EditarSala /></PageTransition></PrivateRoute>} />
          <Route path="/editar-sala/:id" element={<PrivateRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}><EditarVersala /></PrivateRoute>} />

          {/* Agendamentos principais (logado qualquer papel) */}
          <Route path="/agendamento-quadra" element={<PrivateRoute><PageTransition><AgendamentoQuadra /></PageTransition></PrivateRoute>} />
          <Route path="/agendamento-computadores" element={<PrivateRoute><PageTransition><AgendamentoComputadores /></PageTransition></PrivateRoute>} />
          <Route path="/agendamento-ps5" element={<PrivateRoute><PageTransition><AgendamentoPS5 /></PageTransition></PrivateRoute>} />
          <Route path="/agendamento-auditorio" element={<PrivateRoute><PageTransition><AgendamentoAuditorio /></PageTransition></PrivateRoute>} />
          <Route path="/agendamento-impressora" element={<PrivateRoute><PageTransition><AgendamentoImpressora /></PageTransition></PrivateRoute>} />

          {/* Aliases compatíveis (logado qualquer papel) */}
          <Route path="/agendamentos/quadra" element={<PrivateRoute><PageTransition><AgendamentoQuadra /></PageTransition></PrivateRoute>} />
          <Route path="/agendamentos/computadores" element={<PrivateRoute><PageTransition><AgendamentoComputadores /></PageTransition></PrivateRoute>} />
          <Route path="/agendamentos/ps5" element={<PrivateRoute><PageTransition><AgendamentoPS5 /></PageTransition></PrivateRoute>} />
          <Route path="/agendamentos/auditorio" element={<PrivateRoute><PageTransition><AgendamentoAuditorio /></PageTransition></PrivateRoute>} />

          {/* 404 (pública) */}
          <Route path="/404" element={<PageTransition><PaginaErro /></PageTransition>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
