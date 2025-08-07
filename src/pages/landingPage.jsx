import React from 'react';
import Header from '../components/header';
import Main from '../components/main';
import Footer from '../components/footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
