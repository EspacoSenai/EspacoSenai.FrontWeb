import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="w-full flex justify-center px-6 py-4 bg-white dark:bg-[#0B0B0B] transition-colors duration-300">
      <div className="w-full max-w-7xl flex justify-between items-center border-b border-[#A6A3A3] dark:border-[#444]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={isDarkMode ? 'src/assets/LogoDark.svg' : 'src/assets/EspacoSenai.svg'}
            alt="Logo Senai"
            className="h-14"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4">
          {/* Toggle Dark Mode */}
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
              className={`w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${
                isDarkMode ? 'bg-black transform translate-x-7' : 'bg-white'
              }`}
            ></div>
          </button>

          {/* Navegação */}
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700">
            Entrar
          </button>
          <button className="px-4 py-2 text-sm font-medium border border-red-600 dark:border-red-700 transition-all duration-300 bg-white text-black dark:text-black hover:bg-red-600 hover:text-white dark:hover:bg-red-700 dark:hover:text-white">
            Cadastrar-se
          </button>
        </div>
      </div>
    </header>
  );
}
