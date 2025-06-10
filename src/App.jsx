// src/app.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Onboarding from './pages/onboarding';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}
