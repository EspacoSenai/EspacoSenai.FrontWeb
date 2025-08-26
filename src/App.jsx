import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/PageIniciais/landingPage.jsx';
import SemNotificacao from './pages/Notificações/semnotificação.jsx';
import NovaSenha from './pages/Senhas/novasenha.jsx';
import Onboarding from './pages/PageIniciais/onboarding.jsx';
import Cadastro from './pages/Autenticação/cadastro.jsx';
import Login from './pages/Autenticação/login.jsx';
import SelecaoPerfil from './pages/Autenticação/selecaoPerfil.jsx';
import EsqueciSenha from './pages/Senhas/esqueciSenha.jsx';
import CodigoDeRec from './pages/Senhas/códigoderec.jsx';
import Index from './navigation/index';


import AOS from 'aos';
import 'aos/dist/aos.css';

export default function App() {
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
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/selecao-perfil" element={<SelecaoPerfil />} />
      <Route path="/códigoderec" element={<CodigoDeRec />} />
  <Route path="/novasenha" element={<NovaSenha />} />
  <Route path="/semnotificacao" element={<SemNotificacao />} />
    </Routes>
  );
}
