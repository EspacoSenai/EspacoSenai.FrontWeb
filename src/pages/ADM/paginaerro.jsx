import React from "react";
import { useNavigate } from "react-router-dom";
import ErrorImg from "../../assets/error.svg";
import ErrorImgDark from "../../assets/errodark.svg";

export default function PaginaErro() {
  const navigate = useNavigate();

  const isDarkMode =
    typeof window !== "undefined" &&
    (window.document.documentElement.classList.contains("dark") ||
      window.localStorage.getItem("theme") === "dark");

  return (
    <div
      className="
        h-screen w-full font-poppins flex items-center justify-center
        bg-gradient-to-b from-[#f5f5f8] via-white to-[#e8edf8]
        dark:from-[#0b0b10] dark:via-[#050007] dark:to-[#16001b]
        transition-colors duration-300 overflow-hidden
      "
    >
      <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-4 sm:gap-5">
          <img
            src={isDarkMode ? ErrorImgDark : ErrorImg}
            alt="Erro 404 - Página não encontrada"
            className="w-40 sm:w-56 md:w-64 object-contain drop-shadow-2xl"
          />

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Página não encontrada
          </h1>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200/90 max-w-md">
            A página que você tentou acessar não existe ou não está disponível
            no momento. Verifique o endereço ou volte para uma área segura do sistema.
          </p>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Caso você não esteja logado, tente realizar o login novamente antes de
            acessar essa página.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2 w-full">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                inline-flex items-center justify-center w-full sm:w-auto
                rounded-md bg-[#B10404]
                px-6 py-2.5 text-sm font-semibold text-white
                shadow-md hover:scale-[1.03] active:scale-100
                hover:brightness-110
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-[#B10404]/80 focus:ring-offset-transparent
                transition-all duration-150
              "
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={() => navigate("/landing")}
              className="
                inline-flex items-center justify-center w-full sm:w-auto
                rounded-md border border-gray-300 dark:border-gray-500/60
                bg-white/90 dark:bg-transparent
                px-5 py-2.5 text-sm font-medium
                text-gray-900 dark:text-gray-100
                shadow-sm hover:bg-gray-50 dark:hover:bg-white/5
                hover:scale-[1.02] active:scale-100
                transition-all duration-150
              "
            >
              Ir para página inicial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
