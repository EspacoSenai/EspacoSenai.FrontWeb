import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";
import LembretesReservas from "../../components/ComponentsHome/LembretesReservas";

import OndaPrincipal from "../../assets/OndasHome.svg";
import OndaRodape from "../../assets/ondaPrincipal.svg";
import Pessoa from "../../assets/HomeProfessor.svg";

import {
  COR,
  pages,
  pagesCount,
  ArrowBtn,
  Card,
} from "../../components/ComponentsHome/FuncoesHome";

import { buscarMeuPerfil } from "../../service/usuario";

export default function HomeProfessor() {
  const [page, setPage] = useState(0);
  const [displayName, setDisplayName] = useState("");

  const nome = displayName || "Professor(a)";
  const isLongName = nome.length > 18;

  const mobileTitleClass = isLongName
    ? "text-[22px] leading-snug"
    : "text-[26px] leading-tight";

  const desktopFirstLineClass = isLongName
    ? "text-[30px] lg:text-[34px]"
    : "text-[36px] lg:text-[40px]";

  const desktopSecondLineClass = isLongName
    ? "text-[30px] lg:text-[36px]"
    : "text-[40px] lg:text-[46px]";

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const usuario = await buscarMeuPerfil();
        const nomeBack =
          (usuario &&
            (usuario.nome ||
              usuario.nomeCompleto ||
              usuario.nomeUsuario ||
              usuario.tag)) ||
          "";
        if (alive) {
          setDisplayName(nomeBack.toString().trim() || "Professor(a)");
        }
      } catch (err) {
        console.error("[HomeProfessor] Erro ao buscar perfil:", err);
        if (alive) setDisplayName("Professor(a)");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const nextPage = useCallback(() => setPage((p) => (p + 1) % pagesCount), []);
  const prevPage = useCallback(
    () => setPage((p) => (p - 1 + pagesCount) % pagesCount),
    []
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPage, prevPage]);

  return (
    <>
      <Header />
      <main className="bg-white dark:bg-[#0B0B0B] w-full">
        {/* HERO */}
        <section className="relative w-full -mt-px">
          {/* Mobile */}
          <div className="md:hidden relative w-full h-[440px] bg-[#A00000] dark:bg-black text-white flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
              <img
                src={Pessoa}
                alt=""
                className="h-[170px] w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.15)]"
              />
              <h1
                className={`font-extrabold text-center text-balance ${mobileTitleClass}`}
              >
                Bem-vindo(a) {nome},
              </h1>
              <p className="text-sm opacity-95 text-center">
                Este é o Painel do Professor!
              </p>
              <Link to="/salas-professores" className="mt-2">
                <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                  Reserve agora
                </button>
              </Link>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex w-full h-[560px] lg:h-[600px] items-center">
            <div className="relative w-1/2 h-full flex items-end justify-center pb-12 md:translate-x-8 md:-translate-y-16 shrink-0 min-w-[360px]">
              <img src={Pessoa} alt="" className="h-[65%] w-auto" />
            </div>
            <div className="relative w-1/2 h-full overflow-hidden lg:-right-7">
              <img
                src={OndaPrincipal}
                alt=""
                className="absolute inset-0 w-full h-full object-contain object-right-top z-0 pointer-events-none select-none"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-0 z-10 pb-32">
                <h1 className="font-extrabold text-balance leading-tight pl-8">
                  <span className={`${desktopFirstLineClass} block`}>
                    Bem-vindo(a)
                  </span>
                  <span className={`${desktopSecondLineClass} block`}>
                    {nome},
                  </span>
                </h1>
                <p className="text-lg mt-3">Este é o Painel do Professor!</p>
                <div className="w-full mt-12 lg:mt-20 flex justify-end pr-10 lg:pr-20">
                  <Link to="/salas-professores">
                    <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                      Reserve agora
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

        {/* DESTAQUES */}
        <section className="w-full">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block h-5 w-[6px] rounded-full bg-[#AE0000]" />
              <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#1E1E1E] dark:text-white">
                Espaços em <span className="text-[#AE0000]">Destaque</span>
              </h2>
            </div>

            <div className="relative rounded-[14px] bg-[#E5E5E5] dark:bg-[#2A2A2A] p-3 sm:p-4 md:p-5 shadow-[inset_0_1px_0_rgba(0,0,0,0.05)]">
              <div className="absolute right-0 top-0 bottom-0 w-3 rounded-r-[14px] bg-[#E5E5E5] dark:bg-[#2A2A2A] z-10 pointer-events-none" />
              <ArrowBtn onClick={nextPage} />
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  <div className="w-full shrink-0">
                    <div className="space-y-4 md:space-y-5">
                      <Card {...pages[0][0]} />
                      <div className="h-px bg-gray-300 rounded-full mx-1" />
                      <Card {...pages[0][1]} />
                    </div>
                  </div>
                  <div className="w-full shrink-0">
                    <div className="space-y-4 md:space-y-5">
                      <Card {...pages[1][0]} />
                      <div className="h-px bg-gray-300 rounded-full mx-1" />
                      <Card {...pages[1][1]} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: pagesCount }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition ${
                      page === i
                        ? "bg-[#AE0000]"
                        : "bg-gray-400/70 dark:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LEMBRETES BONITO */}
        <LembretesReservas titulo="Minhas reservas" />

        {/* HORÁRIOS PDF E PRÉ-CADASTRO */}
        <div className="h-px w-full bg-gray-200 dark:bg-white/10" />
        <section className="relative w-full overflow-visible pt-12">
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-[460px] md:pb-[520px]">
            <div className="text-center">
              <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#1E1E1E] dark:text-white">
                Faça o pré-cadastro dos alunos
              </h3>

              <div className="mx-auto mt-2 h-[3px] w-44 rounded-full bg-[#AE0000]" />

              <p className="mt-5 max-w-2xl mx-auto text-[14px] sm:text-[15px] leading-relaxed text-[#1E1E1E] dark:text-gray-200">
                Realize o pré-cadastro dos alunos para que seja possível adicioná-los às
                turmas de forma rápida e organizada.
              </p>

              <div className="mx-auto mt-6 w-[300px] sm:w-[320px] rounded-[10px] bg-black/10 dark:bg-white/10 p-4 shadow-sm">
                <Link
                  to="/professores/pre-cadastrar"
                  className="inline-flex items-center justify-center w-full h-11 rounded-md
                     bg-[#AE0000] text-white font-semibold shadow-sm
                     hover:brightness-95 active:scale-[.99] transition"
                >
                  Pré-Cadastro
                </Link>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none select-none absolute inset-x-0 bottom-0
               h-[140px] md:h-[180px]"
          >
            <motion.img
              src={OndaRodape}
              alt=""
              className="absolute bottom-0 right-0 w-[120%] md:w-[110%] max-w-none"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
