import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(p => !p);

  return (
    <header className="relative z-20 w-full flex justify-center px-4 sm:px-6 py-3 sm:py-4 bg-white transition-colors duration-300 overflow-x-hidden">
      <div className="w-full max-w-7xl flex items-center justify-between border-b border-[#A6A3A3] pb-2">
        {/* LOGO */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <img
            src="src/assets/EspacoSenai.svg"
            alt="Logo EspaçoSenai"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
          />
        </div>

        {/* BOTÃO HAMBÚRGUER — sempre visível */}
        <button
          onClick={toggleMenu}
          aria-label="Abrir menu"
          aria-expanded={menuOpen ? "true" : "false"}
          className="
            relative flex items-center justify-center
            w-[42px] h-[32px]
            rounded-lg border border-[#D9D9D9] bg-white
            shadow-[0_1px_2px_rgba(0,0,0,0.06)]
            hover:bg-[#f7f7f7] active:scale-[0.98]
            transition-all duration-200
          "
        >
          {/* linhas */}
          <span
            className={`
              absolute block h-[2px] rounded
              ${menuOpen ? "rotate-45 translate-y-0" : "-translate-y-[6px]"}
              w-[18px] bg-[#111]
              transition-all duration-300 ease-in-out
              origin-center
            `}
          />
          <span
            className={`
              absolute block h-[2px] rounded
              ${menuOpen ? "opacity-0" : "opacity-100"}
              w-[18px] bg-[#111]
              transition-all duration-200 ease-in-out
            `}
          />
          <span
            className={`
              absolute block h-[2px] rounded
              ${menuOpen ? "-rotate-45 translate-y-0" : "translate-y-[6px]"}
              w-[18px] bg-[#111]
              transition-all duration-300 ease-in-out
              origin-center
            `}
          />
        </button>
      </div>

      {/* MENU LATERAL */}
      <div className={`fixed inset-0 z-40 ${menuOpen ? "" : "pointer-events-none"}`}>
        {/* BACKDROP ESCURO */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          } bg-black/40`}
          onClick={() => setMenuOpen(false)}
        />

        {/* NAV */}
        <nav
          className={`
            absolute top-0 right-0 h-full w-[82%] max-w-[360px]
            bg-white/90 backdrop-blur-xl border-l border-black/5 shadow-2xl rounded-l-2xl
            p-5 flex flex-col gap-5
            transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-medium text-black">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-black/5 transition bg-transparent"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-black"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-800 hover:text-[#AE0000] transition"
          >
            Início
          </Link>

          <Link
            to="/agendamentos"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-800 hover:text-[#AE0000] transition"
          >
            Agendamentos
          </Link>

          <Link
            to="/perfil"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-800 hover:text-[#AE0000] transition"
          >
            Perfil
          </Link>

          <Link
            to="/sobre"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-800 hover:text-[#AE0000] transition"
          >
            Sobre o Espaço
          </Link>

          <Link
            to="/suporte"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-800 hover:text-[#AE0000] transition"
          >
            Suporte
          </Link>

          <div className="mt-auto pt-2 text-xs text-black/60">
            © {new Date().getFullYear()} EspaçoSenai
          </div>
        </nav>
      </div>
    </header>
  );
}
