import React, { useEffect, useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Index from './navigation/index';

import LegacyLandingPage from './pages/PageIniciais/landingPage.jsx';
import LegacyOnboarding from './pages/PageIniciais/onboarding.jsx';
import CadastroLegacy from './pages/Autenticação/cadastro.jsx';
import LoginLegacy from './pages/Autenticação/login.jsx';
import EditarPerfil from './pages/Perfis/editarperfil.jsx';
import Avatares from './pages/Perfis/avatares.jsx';
import SemNotificacao from './pages/Notificações/semnotificação.jsx';
import Notificacoes from './pages/Notificações/notificações.jsx';
import NovaSenha from './pages/Senhas/novasenha.jsx';
import SelecaoPerfil from './pages/Autenticação/selecaoPerfil.jsx';
import EsqueciSenha from './pages/Senhas/esqueciSenha.jsx';
import CodigoDeRec from './pages/Senhas/códigoderec.jsx';

import LandingPage from './pages/landingPage.jsx';
import Onboarding from './pages/onboarding.jsx';
import Cadastro from './pages/cadastro.jsx';
import Login from './pages/login.jsx';
import AgendamentoQuadra from './pages/agendamentoQuadra.jsx';
import AgendamentoComputadores from './pages/AgendamentoComputadores.jsx';
import AgendamentoImpressora from './pages/agendamentoImpressora.jsx';

import AOS from 'aos';
import 'aos/dist/aos.css';

export default function App() {
  useLayoutEffect(() => {
    try {
      const salvo = localStorage.getItem('theme') || 'light';
      if (salvo === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Erro ao recuperar tema salvo:', error);
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
      <Route path="/códigoderec" element={<CodigoDeRec />} />
      <Route path="/novasenha" element={<NovaSenha />} />
      <Route path="/semnotificacao" element={<SemNotificacao />} />
      <Route path="/notificacoes" element={<Notificacoes />} />
      <Route path="/editarperfil" element={<EditarPerfil />} />
      <Route path="/avatares" element={<Avatares />} />
    </Routes>
  );
}
