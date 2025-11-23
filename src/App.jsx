import React, { useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Index from './navigation/index';

// Iniciais (atuais)
import LandingPage from './pages/PageIniciais/landingPage.jsx';
import Onboarding from './pages/PageIniciais/onboarding.jsx';


// Autenticação
import SelecaoPerfil from './pages/Autenticação/selecaoPerfil.jsx';
import Cadastro from './pages/Autenticação/cadastro.jsx';
import Login from './pages/Autenticação/login.jsx';
import EsqueciSenha from './pages/Autenticação/esqueciSenha.jsx';
import NovaSenha from './pages/Autenticação/novasenha.jsx';
import CodigoDeRecuperacao from './pages/Autenticação/códigoderec.jsx';

// Perfis / Notificações
import EditarPerfil from './pages/Perfis/editarperfil.jsx';
import Avatares from './pages/Perfis/avatares.jsx';
import SemNotificacao from './pages/Notificações/semnotificação.jsx';
import Notificacoes from './pages/Notificações/notificações.jsx';

// Agendamentos (atuais)
import AgendamentoQuadra from './pages/Agendamento/agendamentoQuadra.jsx';
import AgendamentoComputadores from './pages/Agendamento/AgendamentoComputadores.jsx';
import AgendamentoPS5 from './pages/Agendamento/AgendamentoPS5.jsx';
import AgendamentoAuditorio from './pages/Agendamento/AgendamentoAuditorio.jsx';
import AgendamentoImpressora from './pages/Agendamento/agendamentoImpressora.jsx';

// Páginas por perfil
import HomeAlunos from './pages/PaginaDosAlunos/HomeAlunos.jsx';
import SalasAlunos from './pages/PaginaDosAlunos/SalasAlunos.jsx';

import HomeProfessor from './pages/PaginaDosProfessores/HomeProfessor.jsx';
import SalasProfessores from './pages/PaginaDosProfessores/SalasProfessores.jsx';
import NovaTurma from './pages/PaginaDosProfessores/NovaTurma.jsx';

import HomeCoordenador from './pages/PaginaDosCoordenadores/HomeCoordenadores.jsx';
import SalasCoordenadores from './pages/PaginaDosCoordenadores/SalasCoordenadores.jsx';

import HomeAdm from './pages/PaginaDosAdm/HomeAdm.jsx';
import SalasAdministradores from './pages/PaginaDosAdm/SalasAdm.jsx';

// ADM extras
import RelatorioAdm from './pages/ADM/relatórioadm.jsx';
import GestaoDeAluno from './pages/ADM/gestaodealuno.jsx';
import GestaoDeAlunos from './pages/ADM/gestaodealunos.jsx';
import PreCadastrarUsuario from './pages/ADM/precadastrar.jsx';
import CriarUsuario from './pages/ADM/criaruser.jsx';
import ReservaPendente from './pages/ADM/reservapendente.jsx';
import EditarVersala from './pages/ADM/editarversala.jsx';
import CriarSala from './pages/ADM/criarsala.jsx';
import EditarSala from './pages/ADM/editarsala.jsx';
import PaginaErro from './pages/ADM/paginaerro.jsx';

function ScrollToTop({ behavior = 'instant' }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      try {
        const b = behavior === 'smooth' ? 'smooth' : 'auto';
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
      transition={{ duration: 0.4, ease: 'easeInOut' }}
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
      const salvo = localStorage.getItem('theme') || 'light';
      if (salvo === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {
      console.error('Erro ao recuperar tema salvo:', e);
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
          {/* Iniciais */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
          <Route path="/landing" element={<PageTransition><LandingPage /></PageTransition>} />


          {/* Autenticação */}
          <Route path="/selecaoDePerfil" element={<PageTransition><SelecaoPerfil /></PageTransition>} />
          <Route path="/cadastro" element={<PageTransition><Cadastro /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/esqueci-senha" element={<PageTransition><EsqueciSenha /></PageTransition>} />
          <Route path="/codigodere" element={<PageTransition><CodigoDeRecuperacao /></PageTransition>} />
          <Route path="/códigoderec" element={<PageTransition><CodigoDeRecuperacao /></PageTransition>} />
          <Route path="/novasenha" element={<PageTransition><NovaSenha /></PageTransition>} />

          {/* Perfis / Notificações */}
          <Route path="/editarperfil" element={<PageTransition><EditarPerfil /></PageTransition>} />
          <Route path="/avatares" element={<PageTransition><Avatares /></PageTransition>} />
          <Route path="/semnotificacao" element={<PageTransition><SemNotificacao /></PageTransition>} />
          <Route path="/notificacoes" element={<PageTransition><Notificacoes /></PageTransition>} />

          {/* Alunos */}
          <Route path="/HomeAlunos" element={<PageTransition><HomeAlunos /></PageTransition>} />
          <Route path="/salas-alunos" element={<PageTransition><SalasAlunos /></PageTransition>} />

          {/* Professores */}
          <Route path="/HomeProfessor" element={<PageTransition><HomeProfessor /></PageTransition>} />
          <Route path="/salas-professores" element={<PageTransition><SalasProfessores /></PageTransition>} />
          <Route path="/professores/turmas/nova" element={<PageTransition><NovaTurma /></PageTransition>} />

          {/* Coordenadores */}
          <Route path="/HomeCoordenador" element={<PageTransition><HomeCoordenador /></PageTransition>} />
          <Route path="/salas-coordenadores" element={<PageTransition><SalasCoordenadores /></PageTransition>} />

          {/* Administradores */}
          <Route path="/HomeAdm" element={<PageTransition><HomeAdm /></PageTransition>} />
          <Route path="/salas-administradores" element={<PageTransition><SalasAdministradores /></PageTransition>} />

          {/* ADM extras */}
          <Route path="/relatorio-adm" element={<PageTransition><RelatorioAdm /></PageTransition>} />
          <Route path="/gestao-de-aluno" element={<PageTransition><GestaoDeAluno /></PageTransition>} />
          <Route path="/gestao-de-alunos" element={<PageTransition><GestaoDeAlunos /></PageTransition>} />
          <Route path="/pre-cadastrar" element={<PageTransition><PreCadastrarUsuario /></PageTransition>} />
          <Route path="/criar-usuario" element={<PageTransition><CriarUsuario /></PageTransition>} />
          <Route path="/reserva-pendente" element={<PageTransition><ReservaPendente /></PageTransition>} />
          <Route path="/editar-versala" element={<PageTransition><EditarVersala /></PageTransition>} />
          <Route path="/editar-versala/:id" element={<EditarVersala />} />
          <Route path="/criar-sala" element={<PageTransition><CriarSala /></PageTransition>} />
          <Route path="/editar-sala" element={<PageTransition><EditarSala /></PageTransition>} />
          <Route path="/editar-sala/:id" element={<EditarVersala />} />

          {/* Agendamentos principais */}
          <Route path="/agendamento-quadra" element={<PageTransition><AgendamentoQuadra /></PageTransition>} />
          <Route path="/agendamento-computadores" element={<PageTransition><AgendamentoComputadores /></PageTransition>} />
          <Route path="/agendamento-ps5" element={<PageTransition><AgendamentoPS5 /></PageTransition>} />
          <Route path="/agendamento-auditorio" element={<PageTransition><AgendamentoAuditorio /></PageTransition>} />
          <Route path="/agendamento-impressora" element={<PageTransition><AgendamentoImpressora /></PageTransition>} />

          {/* Aliases compatíveis */}
          <Route path="/agendamentos/quadra" element={<PageTransition><AgendamentoQuadra /></PageTransition>} />
          <Route path="/agendamentos/computadores" element={<PageTransition><AgendamentoComputadores /></PageTransition>} />
          <Route path="/agendamentos/ps5" element={<PageTransition><AgendamentoPS5 /></PageTransition>} />
          <Route path="/agendamentos/auditorio" element={<PageTransition><AgendamentoAuditorio /></PageTransition>} />

          {/* 404 */}
          <Route path="/404" element={<PageTransition><PaginaErro /></PageTransition>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
