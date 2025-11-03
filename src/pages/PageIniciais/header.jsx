import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((p) => !p);

  return (
    <header className="relative z-20 w-full flex justify-center px-4 sm:px-6 py-3 sm:py-4 bg-white transition-colors duration-300 overflow-x-hiddenz">
      <div className="w-full max-w-7xl flex items-center justify-between border-b border-[#A6A3A3] pb-2">
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <img
            src="src/assets/EspacoSenai.svg"
            alt="Logo Senai"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            style={{ width: "auto" }}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:opacity-90 transition"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="px-4 py-2 text-sm font-medium border border-red-600 bg-transparent text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
            >
              Cadastrar-se
            </Link>
          </div>

          {/* Botão hambúrguer */}
          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            aria-expanded={menuOpen ? "true" : "false"}
            className="md:hidden w-10 h-10 inline-flex flex-col items-center justify-center gap-[5px] rounded-md hover:bg-black/5 transition"
            style={{ backgroundColor: "transparent" }}
          >
            <span className="block w-6 h-[2px] bg-black rounded" />
            <span className="block w-6 h-[2px] bg-black rounded" />
            <span className="block w-6 h-[2px] bg-black rounded" />
          </button>
        </div>
      </div>

      {/* Menu lateral */}
      <div className={`fixed inset-0 z-40 md:hidden ${menuOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          } bg-black/40`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-[82%] max-w-[360px] 
          bg-white/90 backdrop-blur-xl 
          border-l border-black/5
          shadow-2xl rounded-l-2xl
          p-5 flex flex-col gap-4
          transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-medium text-black">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-black/5 transition bg-transparent group"
            >
              <span className="text-black">
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
            className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg text-center hover:opacity-90 transition"
          >
            Entrar
          </Link>

          <Link
            to="/cadastro"
            onClick={() => setMenuOpen(false)}
            className="w-full px-4 py-3 text-sm font-medium border border-red-600 bg-transparent text-red-600 rounded-lg text-center hover:bg-red-600 hover:text-white transition"
          >
            Cadastrar-se
          </Link>

          <div className="mt-auto pt-2 text-xs text-black/60">
            © {new Date().getFullYear()} EspaçoSenai
          </div>
        </nav>
      </div>
    </header>
  );
}
