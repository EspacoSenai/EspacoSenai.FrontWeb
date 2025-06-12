// src/pages/LandingPage.jsx
import React from 'react';
import Header from '../components/header';
import Main from '../components/main';
import Footer from '../components/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
