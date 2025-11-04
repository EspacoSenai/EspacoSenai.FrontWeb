import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import LogoLight from "../../assets/EspacoSenai.svg";
import LogoDark from "../../assets/logodark.svg";
import IconSun from "../../assets/Sol.svg";
import IconMoon from "../../assets/noite.svg";

const AVATAR_FALLBACK =
  "https://api.dicebear.com/8.x/avataaars/svg?seed=guest&backgroundColor=b6e3f4&radius=50";

function getInitialDark() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  } catch {
    return false;
  }
}


export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDark);

  // Estado do usuário
  const [userInfo, setUserInfo] = useState({
    name: "Nome",
    avatarUrl: AVATAR_FALLBACK,
    guestCode: "", // vem do back (prop) ou localStorage
  });

  
  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatar_url");
    const savedCode = localStorage.getItem("guest_code");  

    setUserInfo((prev) => ({
      name: user?.name || prev.name,
      avatarUrl: user?.avatarUrl || savedAvatar || prev.avatarUrl,
      guestCode: user?.guestCode || savedCode || prev.guestCode,
    }));
  }, [user]);

  // Tema
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const saved = localStorage.getItem("theme");
      if (!saved) setIsDarkMode(e.matches);
    };
    if (media.addEventListener) media.addEventListener("change", handler);
    else media.addListener(handler);
    return () => {
      if (media.removeEventListener) media.removeEventListener("change", handler);
      else media.removeListener(handler);
    };
  }, []);

  const toggleMenu = () => setMenuOpen((p) => !p);
  const toggleTheme = () => setIsDarkMode((p) => !p);

  const logoSrc = isDarkMode ? LogoDark : LogoLight;

  // Ações do painel
  const goToNotifications = () => {
    setMenuOpen(false);
    navigate("/notificacoes");
  };
  const goToEditProfile = () => {
    setMenuOpen(false);
    navigate("/editarperfil");
  };
  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) onLogout();
    else navigate("/login");
  };

 
  const codeDigits = (userInfo.guestCode || "")
    .toString()
    .split("")
    .slice(0, 5);

  return (
    <header className="relative p-0 z-20 w-full flex justify-center px-4 sm:px-6 pt-3 sm:pt-4 pb-0 bg-white dark:bg-[#0B0B0B] transition-colors duration-300 overflow-x-hidden">
      <div className="w-full max-w-7xl flex items-center justify-between border-b border-[#1E1E1E] dark:border-gray-700">
        {/* LOGO */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <img
            src={logoSrc}
            alt="Logo EspaçoSenai"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-opacity"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4">
          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className={`relative w-16 h-7 rounded-full flex items-center justify-between px-2 transition-colors duration-300 ${
              isDarkMode ? "bg-gray-300" : "bg-[#1E1E1E]"
            }`}
          >
            <img
              src={IconSun}
              alt="Modo Claro"
              className={`w-4 h-4 ${isDarkMode ? "opacity-100" : "opacity-0"}`}
            />
            <img
              src={IconMoon}
              alt="Modo Escuro"
              className={`w-4 h-4 ${isDarkMode ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                isDarkMode ? "translate-x-[38px] bg-[#1E1E1E]" : "translate-x-0 bg-white"
              }`}
            />
          </button>

          {/* Botão menu */}
          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            aria-expanded={menuOpen ? "true" : "false"}
            className="relative flex items-center justify-center w-10 h-10 bg-white dark:bg-black rounded-xl border border-white dark:border-[#1E1E1E]"
          >
            <span
              className={`absolute block h-[3px] rounded w-6 bg-[#1E1E1E] dark:bg-white transition-all duration-300 ease-in-out origin-center ${
                menuOpen ? "rotate-45" : "-translate-y-[7px]"
              }`}
            />
            <span
              className={`absolute block h-[3px] rounded w-6 bg-[#1E1E1E] dark:bg-white transition-all duration-200 ease-in-out ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute block h-[3px] rounded w-6 bg-[#1E1E1E] dark:bg-white transition-all duration-300 ease-in-out origin-center ${
                menuOpen ? "-rotate-45" : "translate-y-[7px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Overlay + Painel (cores idênticas ao mock) */}
      <div className={`fixed inset-0 z-40 ${menuOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          } bg-black/40`}
          onClick={() => setMenuOpen(false)}
        />

        <nav
          className={`absolute top-0 right-0 h-full w-[82%] max-w-[360px] 
            transition-transform duration-300 
            ${menuOpen ? "translate-x-0" : "translate-x-full"}
            rounded-l-2xl shadow-2xl
            border-l
            `}
          style={{
            background: "#0F0F10",     // fundo do painel
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="p-5 h-full flex flex-col gap-5">
            {/* topo: avatar + nome */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <img
                src={userInfo.avatarUrl || AVATAR_FALLBACK}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover ring-1"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}
              />
              <div className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                {userInfo.name || "Nome"}
              </div>
            </div>

            {/* separador */}
            <div
              className="h-px w-full"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />

            {/* itens */}
            <button
              onClick={goToNotifications}
              className="flex items-center gap-3 px-2 py-2 rounded-lg transition"
              style={{ color: "#C9C9C9" }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span className="text-sm">Notificações</span>
            </button>

            <button
              onClick={goToEditProfile}
              className="flex items-center gap-3 px-2 py-2 rounded-lg transition"
              style={{ color: "#C9C9C9" }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25Z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M14.06 5.19l3.75 3.75" stroke="currentColor" strokeWidth="1.6"/>
              </svg>
              <span className="text-sm">Editar Perfil</span>
            </button>

            {/* separador */}
            <div
              className="h-px w-full"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />

            {/* Código Pessoal */}
            <div className="flex flex-col gap-3">
              <div
                className="text-[12px] uppercase tracking-wide"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                Código Pessoal
              </div>
              <div className="flex items-center gap-2">
                {(codeDigits.length ? codeDigits : Array.from({ length: 5 }, () => "•")).map(
                  (d, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-semibold"
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #2A2A2A",
                        background: "transparent",
                      }}
                    >
                      {d}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* separador + sair */}
            <div className="mt-auto">
              <div
                className="h-px w-full mb-2"
                style={{ background: "rgba(255,255,255,0.10)" }}
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-2 py-2 rounded-lg transition font-semibold"
                style={{ color: "#E35151" }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span className="text-sm">Sair da conta</span>
              </button>

              <div
                className="pt-2 text-[11px]"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                © {new Date().getFullYear()} EspaçoSenai
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
