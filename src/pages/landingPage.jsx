// src/pages/LandingPage.jsx
import React from 'react';
import Header from '../components/header';
import Main from '../components/main';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main />
    </div>
  );
}
