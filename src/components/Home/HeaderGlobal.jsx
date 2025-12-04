import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buscarMeuPerfil } from "../../service/usuario";

import LogoLight from "../../assets/EspacoSenai.svg";
import LogoDark from "../../assets/logodark.svg";
import IconSun from "../../assets/Sol.svg";
import IconMoon from "../../assets/noite.svg";
import AVATAR_FALLBACK from "../../assets/AvatarPadrao.svg";

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

function getProfileFallbackName() {
  try {
    const profile = localStorage.getItem("selected_profile") || "ALUNO";
    switch (profile) {
      case "ADMIN":
        return "Administrador(a)";
      case "COORDENADOR":
        return "Coordenador(a)";
      case "PROFESSOR":
        return "Professor(a)";
      case "ALUNO":
      default:
        return "Aluno";
    }
  } catch {
    return "Aluno";
  }
}

// Decide pra qual home ir pela logo
function getHomePathByProfile() {
  try {
    const profile = localStorage.getItem("selected_profile") || "";
    switch (profile) {
      case "ADMIN":
        return "/HomeAdm";
      case "COORDENADOR":
        return "/HomeCoordenador";
      case "PROFESSOR":
        return "/HomeProfessor";
      case "ALUNO":
      case "ESTUDANTE":
        return "/HomeAlunos";
      default:
        return "/";
    }
  } catch {
    return "/";
  }
}

export default function HeaderGlobal() {
  const navigate = useNavigate();
  const { signOut = () => {}, refresh = () => {} } = useAuth() ?? {};

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDark);
  const [avatarLocal, setAvatarLocal] = useState(
    () => localStorage.getItem("avatar_url") || ""
  );
  const [displayName, setDisplayName] = useState(getProfileFallbackName);

  const loadName = useCallback(async () => {
    const fallback = getProfileFallbackName();
    try {
      const perfil = await buscarMeuPerfil();
      const nomeBack = String(perfil?.nome || perfil?.name || "").trim();
      setDisplayName(nomeBack || fallback);
    } catch {
      setDisplayName(fallback);
    }
  }, []);

  useEffect(() => {
    loadName();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (
        e.key === "access_token" ||
        e.key === "espsn.session" ||
        e.key === "avatar_url" ||
        e.key === "selected_profile" ||
        e.key === "token" ||
        e.key === "roles"
      ) {
        loadName();
        setAvatarLocal(localStorage.getItem("avatar_url") || "");
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadName, refresh]);

  // tema
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    try {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    } catch {}
  }, [isDarkMode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const saved = localStorage.getItem("theme");
      if (!saved) setIsDarkMode(e.matches);
    };
    media.addEventListener?.("change", handler);
    media.addListener?.(handler);
    return () => {
      media.removeEventListener?.("change", handler);
      media.removeListener?.(handler);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      setAvatarLocal(localStorage.getItem("avatar_url") || "");
      refresh();
    }
  }, [menuOpen, refresh]);

  const toggleMenu = () => setMenuOpen((p) => !p);
  const toggleTheme = () => setIsDarkMode((p) => !p);
  const logoSrc = isDarkMode ? LogoDark : LogoLight;
  const avatarUrl = avatarLocal || AVATAR_FALLBACK;

  // AQUI: usa a logo mas mantendo o Link (sem mudar o visual)
  const handleLogoClick = (e) => {
    e.preventDefault(); // impede o / padrão
    const path = getHomePathByProfile();
    navigate(path);
  };

  const goToNotifications = () => {
    setMenuOpen(false);
    navigate("/notificacoes");
  };

  const goToEditProfile = () => {
    setMenuOpen(false);
    navigate("/editarperfil");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("selected_profile");
      localStorage.removeItem("avatar_url");
      localStorage.removeItem("espsn.session");
      localStorage.removeItem("access_token");
    } catch (e) {
      console.error("[HeaderGlobal] erro ao limpar storage no logout:", e);
    }

    setMenuOpen(false);

    try {
      signOut && signOut();
      refresh && refresh();
    } catch (e) {
      console.error("[HeaderGlobal] erro ao chamar signOut/refresh:", e);
    }

    navigate("/");
    window.location.reload();
  };

  return (
    <header className="relative p-0 z-20 w-full flex justify-center px-4 sm:px-6 pt-3 sm:pt-4 pb-0 bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden">
      <div className="w-full max-w-7xl flex items-center justify-between border-b border-[#1E1E1E] dark:border-gray-700">
        {/* LOGO – design igual, só com onClick pra home certa */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 shrink-0 min-w-0"
        >
          <img
            src={logoSrc}
            alt="EspaçoSenai"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* Ações */}
        <div className="flex items-center gap-4">
          {/* Tema */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className={`relative w-16 h-7 rounded-full flex items-center justify-between px-2 transition-colors duration-300 ${
              isDarkMode ? "bg-gray-300" : "bg-[#1E1E1E]"
            }`}
          >
            <img
              src={IconSun}
              alt=""
              className={`w-4 h-4 ${
                isDarkMode ? "opacity-100" : "opacity-0"
              }`}
            />
            <img
              src={IconMoon}
              alt=""
              className={`w-4 h-4 ${
                isDarkMode ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                isDarkMode
                  ? "translate-x-[38px] bg-[#1E1E1E]"
                  : "translate-x-0 bg-white"
              }`}
            />
          </button>

          {/* Botão hambúrguer */}
          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            aria-expanded={menuOpen ? "true" : "false"}
            className="relative flex items-center justify-center w-10 h-10
                       bg-white dark:bg-black rounded-xl
                       border border-white dark:border-[#1E1E1E]"
          >
            <span
              className={`absolute block h-[3px] rounded w-6 bg-[#1E1E1E] dark:bg-white transition-all duration-300 ease-in-out origin-center ${
                menuOpen ? "rotate-45" : "-translate-y-[7px]"
              }`}
            />
            <span
              className={`absolute block h-[3px] rounded w-6 bg-[#1E1E1E] dark:bg-white transition-all duration-200 ease-in-out ${
                menuOpen ? "opacity-0" : "opacity-100"
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

      {/* Overlay + Painel */}
      <div
        className={`fixed inset-0 z-40 ${
          menuOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          } bg-black/40`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-[82%] max-w-[360px] transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } rounded-l-2xl shadow-2xl border-l`}
          style={{
            background: "#0F0F10",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="p-5 h-full flex flex-col gap-5">
            {/* topo: avatar + nome */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover ring-1"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}
              />
              <div className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                {displayName}
              </div>
            </div>

            <div
              className="h-px w-full"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />

            <button
              onClick={goToNotifications}
              className="flex items-center gap-3 px-2 py-2 rounded-lg transition"
              style={{ color: "#C9C9C9" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              <span className="text-sm">Notificações</span>
            </button>

            <div
              className="h-px w-full"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />

            <div className="mt-auto">
              <div
                className="h-px w-full mb-2"
                style={{ background: "rgba(255,255,255,0.10)" }}
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-2 py-2 rounded-lg transition font-semibold"
                style={{ color: "#E35151" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M10 17l5-5-5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M15 12H3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
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
