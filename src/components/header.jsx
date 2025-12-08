import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((p) => !p);
  const toggleMenu = () => setMenuOpen((p) => !p);

  return (
    <header className="relative z-20 w-full flex justify-center px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-[#0B0B0B] transition-colors duration-300 overflow-x-hidden">
      <div className="w-full max-w-7xl flex items-center justify-between border-b border-[#A6A3A3] dark:border-[#444] pb-2">
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <img
            src={isDarkMode ? "src/assets/LogoDark.svg" : "src/assets/EspacoSenai.svg"}
            alt="Logo Senai"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            style={{ width: "auto" }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Alternar modo"
            onClick={toggleDarkMode}
            className="w-[52px] h-7 flex items-center justify-between rounded-full p-1 transition-all duration-300 relative ring-1 ring-black/5 dark:ring-white/10"
            style={{ backgroundColor: isDarkMode ? "#fff" : "#333" }}
          >
            <img
              src="src/assets/noite.svg"
              alt="Modo Escuro"
              className={`w-4 h-4 absolute left-7 transition-all duration-300 ${isDarkMode ? "opacity-0" : "opacity-100"}`}
            />
            <img
              src="src/assets/Sol.svg"
              alt="Modo Claro"
              className={`w-4 h-4 absolute right-7 transition-all duration-300 ${isDarkMode ? "opacity-100" : "opacity-0"}`}
            />
            <div
              className={`w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${
                isDarkMode ? "bg-black translate-x-7" : "bg-white"
              }`}
            />
          </button>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 rounded-md hover:opacity-90 transition"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="px-4 py-2 text-sm font-medium border border-red-600 dark:border-red-700 bg-transparent text-red-600 dark:text-red-400 rounded-md hover:bg-red-600 hover:text-white dark:hover:bg-red-700 transition"
            >
              Cadastrar-se
            </Link>
          </div>

          {/* Botão hambúrguer */}
          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            aria-expanded={menuOpen ? "true" : "false"}
            className="md:hidden w-10 h-10 inline-flex flex-col items-center justify-center gap-[5px] 
                       rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
            style={{ backgroundColor: "transparent" }}
          >
            <span className="block w-6 h-[2px] bg-black dark:bg-white rounded" />
            <span className="block w-6 h-[2px] bg-black dark:bg-white rounded" />
            <span className="block w-6 h-[2px] bg-black dark:bg-white rounded" />
          </button>
        </div>
      </div>

      {/* Menu lateral (inalterado) */}
      <div className={`fixed inset-0 z-40 md:hidden ${menuOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          } bg-black/40 dark:bg-black/60`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-[82%] max-w-[360px] 
          bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl 
          border-l border-black/5 dark:border-white/10
          shadow-2xl rounded-l-2xl
          p-5 flex flex-col gap-4
          transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-medium text-black dark:text-white">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition bg-transparent group"
            >
              <span className="text-black dark:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 dark:bg-red-700 rounded-lg text-center hover:opacity-90 transition"
          >
            Entrar
          </Link>

          <Link
            to="/cadastro"
            onClick={() => setMenuOpen(false)}
            className="w-full px-4 py-3 text-sm font-medium border border-red-600 dark:border-red-700 bg-transparent text-red-600 dark:text-red-400 rounded-lg text-center hover:bg-red-600 hover:text-white dark:hover:bg-red-700 transition"
          >
            Cadastrar-se
          </Link>

          <div className="mt-auto pt-2 text-xs text-black/60 dark:text-white/50">
            © {new Date().getFullYear()} EspaçoSenai
          </div>
        </nav>
      </div>
    </header>
  );
}
