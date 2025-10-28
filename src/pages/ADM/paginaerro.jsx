import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorImg from "../../assets/error.svg";
import ErrorImgDark from "../../assets/errodark.svg";
import EspacoLogo from "../../assets/EspacoSenai.svg";
import LogoDark from "../../assets/LogoDark.svg";
import Noite from "../../assets/noite.svg";
import Sol from "../../assets/Sol.svg";

export default function PaginaErro() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="pagina-erro min-h-screen w-full bg-white dark:bg-black font-poppins flex flex-col transition-colors duration-300 overflow-x-hidden">
     {/* força a responsividade mantendo os px */}
     <style>{`
       /* força a largura responsiva mesmo se houver style inline width */
       .pagina-erro > header { box-sizing: border-box; }
       @media (max-width: 1400px) {
         .pagina-erro > header { width: calc(100% - 48px) !important; max-width: 1400px; margin: 0 auto; }
       }
       @media (max-width: 1024px) {
         .pagina-erro > header { width: calc(100% - 32px) !important; }
       }
       @media (max-width: 640px) {
         .pagina-erro > header { width: calc(100% - 16px) !important; }
       }
     `}</style>
      <header style={{ width: '1350px' }} className="mx-auto border-b-[1.5px] border-[#A6A3A3] dark:border-[#444] bg-white dark:bg-black transition-colors duration-300">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 xl:-ml-6 2xl:-ml-10">
            <img
              src={isDarkMode ? LogoDark : EspacoLogo}
              alt="Logo Senai"
              className="h-14 md:h-20 object-contain select-none"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto shrink-0 lg:mr-0 xl:-mr-6 2xl:-mr-10">
            {/* Toggle Dark Mode */}
            <button
              aria-label="Alternar modo"
              onClick={toggleDarkMode}
              className="w-[53px] h-7 flex items-center justify-between rounded-full p-1 transition-all duration-300 relative focus:outline-none focus:ring-0"
              style={{ backgroundColor: isDarkMode ? '#fff' : '#333' }}
            >
              <img
                src={Noite}
                alt="Modo Escuro"
                className={`w-4 h-4 absolute left-7 transition-all duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
              />
              <img
                src={Sol}
                alt="Modo Claro"
                className={`w-4 h-4 absolute right-7 transition-all duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
              />
              <div
                className={`w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${
                  isDarkMode ? 'bg-black transform translate-x-7' : 'bg-white'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center px-3 sm:px-8 lg:px-10 pb-10">
        <div className="w-full max-w-6xl bg-white dark:bg-black rounded-xl p-5 sm:p-10 lg:p-12 flex flex-col items-center text-center gap-6 transition-colors duration-300">
          <img
            src={isDarkMode ? ErrorImgDark : ErrorImg}
            alt="Erro 404"
            className="w-full max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl object-contain"
            style={{ filter: 'none' }}
          />

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
            Página não encontrada
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
            A página que você tentou acessar não existe. Verifique o
            endereço ou retorne à página inicial.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2 w-full">
            <Link
              to="/"
              className="inline-block w-full sm:w-auto rounded-md bg-[#B10404] text-white px-5 py-2 text-sm shadow-sm hover:scale-105 transition-transform duration-200 hover:opacity-95 focus:outline-none focus:ring-0 active:scale-100"
            >
              Ir para início
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}