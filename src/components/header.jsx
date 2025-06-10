// src/components/header.jsx
import React, { useState } from 'react';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode);
  };

  return (
    <header className="w-full flex justify-center px-6 py-4 bg-white">
      {/* Container centralizado */}
      <div className="w-full max-w-7xl flex justify-between items-center border-b border-[#A6A3A3]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="src/assets/EspacoSenai.svg" alt="Logo Senai" className="h-14" />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4">
          {/* Botão de alternar modo claro/escuro */}
          <button
            aria-label="Alternar modo"
            onClick={toggleDarkMode}
            className="w-[50px] h-7 flex items-center justify-between rounded-full p-1 transition-all duration-300 relative"
            style={{ backgroundColor: isDarkMode ? '#fff' : '#333' }}
          >
            <img
              src="src/assets/noite.svg"
              alt="Modo Escuro"
              className={`w-4 h-4 absolute left-7 transition-all duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
            />
            <img
              src="src/assets/Sol.svg"
              alt="Modo Claro"
              className={`w-4 h-4 absolute right-7 transition-all duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
            />
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'bg-black transform translate-x-7' : ''}`}
            ></div>
          </button>

          {/* Botões de navegação */}
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-600">
            Entrar
          </button>
          <button className="px-4 py-2 bg-white text-black text-sm font-medium border border-red-600">
            Cadastrar-se
          </button>
        </div>
      </div>
    </header>
  );
}
