import React from 'react';
import Header from '../PageIniciais/header';
import Main from '../PageIniciais/main';
import Footer from '../PageIniciais/footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Main />
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

