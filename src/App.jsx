import React, { useEffect, useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Onboarding from './pages/onboarding';
import Cadastro from './pages/cadastro';
import Login from './pages/login';
import Index from './navigation/index';


import AOS from 'aos';
import 'aos/dist/aos.css';

export default function App() {
  // deixa o tema salvo mesmo quando não tem o header na tela 
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem('theme') || 'light';
      if (saved === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
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
    </Routes>
  );
}
