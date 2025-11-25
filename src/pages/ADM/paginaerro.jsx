import React from "react";
import { Link } from "react-router-dom";
import ErrorImg from "../../assets/error.svg";
import ErrorImgDark from "../../assets/errodark.svg";
import Header from "../../components/Home/HeaderGlobal";

export default function PaginaErro() {
  
  const isDarkMode =
    typeof window !== "undefined" &&
    (window.document.documentElement.classList.contains("dark") ||
      window.localStorage.getItem("theme") === "dark");

  return (
    <div className="pagina-erro min-h-screen w-full bg-white dark:bg-black font-poppins flex flex-col transition-colors duration-300 overflow-x-hidden">

      <Header />

      <main className="flex-1 w-full flex items-center justify-center px-3 sm:px-8 lg:px-10 pb-10">
        <div className="w-full max-w-6xl bg-white dark:bg-black rounded-xl p-5 sm:p-10 lg:p-12 flex flex-col items-center text-center gap-6 transition-colors duration-300">
          <img
            src={isDarkMode ? ErrorImgDark : ErrorImg}
            alt="Erro 404"
            className="w-full max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl object-contain"
          />

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
            Página não encontrada
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
            A página que você tentou acessar não existe. Verifique o endereço
            ou retorne à página inicial.
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
