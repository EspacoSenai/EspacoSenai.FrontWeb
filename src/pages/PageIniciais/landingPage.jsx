import React from 'react';
import Header from './header';
import Main from './main';
import Footer from './footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
