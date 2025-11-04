import React, { useEffect, useLayoutEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Index from './navigation/index';

import LegacyLandingPage from './pages/PageIniciais/landingPage.jsx';
import LegacyOnboarding from './pages/PageIniciais/onboarding.jsx';
import CadastroLegacy from './pages/Autenticação/cadastro.jsx';
import LoginLegacy from './pages/Autenticação/login.jsx';
import EditarPerfil from './pages/Perfis/editarperfil.jsx';
import Avatares from './pages/Perfis/avatares.jsx';
import SemNotificacao from './pages/Notificações/semnotificação.jsx';
import Notificacoes from './pages/Notificações/notificações.jsx';
import NovaSenha from './pages/Autenticação/novasenha.jsx';
import SelecaoPerfil from './pages/Autenticação/selecaoPerfil.jsx';
import EsqueciSenha from './pages/Autenticação/esqueciSenha.jsx';
import CodigoDeRecuperacao from './pages/Autenticação/códigoderec.jsx';

import LandingPage from './pages/PageIniciais/landingPage.jsx';
import Onboarding from './pages/PageIniciais/onboarding.jsx';
import Cadastro from './pages/Autenticação/cadastro.jsx';
import Login from './pages/Autenticação/login.jsx';
import AgendamentoQuadra from './pages/agendamentoQuadra.jsx';
import AgendamentoComputadores from './pages/AgendamentoComputadores.jsx';
import AgendamentoImpressora from './pages/agendamentoImpressora.jsx';

import AOS from 'aos';
import 'aos/dist/aos.css';
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

export default function App() {
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

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/agendamento-quadra" element={<AgendamentoQuadra />} />
      <Route path="/agendamento-computadores" element={<AgendamentoComputadores />} />
      <Route path="/agendamento-impressora" element={<AgendamentoImpressora />} />

      <Route path="/onboarding-legacy" element={<LegacyOnboarding />} />
      <Route path="/landing-legacy" element={<LegacyLandingPage />} />
      <Route path="/cadastro-legacy" element={<CadastroLegacy />} />
      <Route path="/login-legacy" element={<LoginLegacy />} />

      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/selecao-perfil" element={<SelecaoPerfil />} />
      <Route path="/codigodere" element={<CodigoDeRecuperacao />} />
      <Route path="/novasenha" element={<NovaSenha />} />
      <Route path="/semnotificacao" element={<SemNotificacao />} />
      <Route path="/notificacoes" element={<Notificacoes />} />
      <Route path="/editarperfil" element={<EditarPerfil />} />
      <Route path="/avatares" element={<Avatares />} />
      <Route path="/gestao-de-aluno" element={<GestaoDeAluno />} />
      <Route path="/gestao-de-alunos" element={<GestaoDeAlunos />} />
      <Route path="/relatorio-adm" element={<RelatorioAdm />} />
      <Route path="/pre-cadastrar" element={<PreCadastrarUsuario />} />
      <Route path="/criar-usuario" element={<CriarUsuario />} />
      <Route path="/editar-versala" element={<EditarVersala />} />
      <Route path="/reserva-pendente" element={<ReservaPendente />} />
      <Route path="/criar-sala" element={<CriarSala />} />
      <Route path="/editar-sala" element={<EditarSala />} />
      <Route path="/404" element={<PaginaErro />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
