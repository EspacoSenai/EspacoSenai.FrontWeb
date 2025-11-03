// src/pages/PaginaDosAdministradores/HomeAdm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaPrincipal from "../../assets/OndasHome.svg";
import OndaRodape from "../../assets/ondaPrincipal.svg";
import Pessoa from "../../assets/HomeAdm.svg";

import {
  COR,
  pages,
  pagesCount,
  lembretesData,
  ArrowBtn,
  Card,
} from "../../components/ComponentsHome/FuncoesHome";

import ReservasConfirmadas from "../../components/ComponentsHome/ReservasConfirmadas.jsx";

export default function HomeAdm() {
  const [page, setPage] = useState(0);
  const [lembretes] = useState(lembretesData);

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
       
        <section className="relative w-full -mt-px">
          {/* Mobile */}
          <div className="md:hidden relative w-full h-[440px] bg-[#A00000] dark:bg-black text-white flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
              <img
                src={Pessoa}
                alt=""
                className="h-[170px] w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.15)]"
              />
              <h1 className="text-[26px] font-extrabold leading-tight text-center">
                Bem-vindo(a) Nome,
              </h1>
              <p className="text-sm opacity-95 text-center">
                Este é o Painel de Administração!
              </p>
              <Link to="/salas-administradores" className="mt-2">
                <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                  Começar agora
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
                <h1 className="text-[36px] lg:text-[44px] font-extrabold leading-tight pl-8">
                  Bem-vindo(a) Nome,
                </h1>
                <p className="text-lg mt-3">Este é o Painel do Coordenador!</p>
                <div className="w-full mt-12 lg:mt-20 flex justify-end pr-10 lg:pr-20">
                  <Link to="/salas-administradores">
                    <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                      Começar agora
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

       
        <section className="w-full" id="atalhos">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block h-5 w-[6px] rounded-full bg-[#AE0000]" />
              <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#1E1E1E] dark:text-white">
                Espaços <span className="text-[#AE0000]">Utilizados</span>
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
                      page === i ? "bg-[#AE0000]" : "bg-gray-400/70 dark:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

        <ReservasConfirmadas />

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

     
        <section className="w-full mt-6">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
            {/* Card dos botões (aprovado) */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-[0_1px_0_rgba(0,0,0,0.08)] border border-[#EDEDED] dark:border-neutral-800 px-4 sm:px-6 py-4 max-w-[760px] mx-auto">
              <div className="w-full flex items-center justify-center gap-16">
                <Link to="/pre-cadastro">
                  <button className="min-w-[180px] h-[44px] rounded-lg bg-[#AE0000] text-white font-semibold shadow-[0_3px_0_#7B0000] hover:brightness-95 active:translate-y-[1px] transition px-6">
                    Pré-Cadastro
                  </button>
                </Link>
                <Link to="/criar-usuario">
                  <button className="min-w-[180px] h-[44px] rounded-lg bg-[#AE0000] text-white font-semibold shadow-[0_3px_0_#7B0000] hover:brightness-95 active:translate-y-[1px] transition px-6">
                    Criar Usuário
                  </button>
                </Link>
              </div>
            </div>

            <p className="mt-3 text-center text-[13px] text-neutral-500 dark:text-neutral-300">
              Faça o pré-cadastro dos alunos
            </p>

            <div className="flex items-center gap-3 mt-7 -ml-5 sm:-ml-6">
              <span className="inline-block h-[22px] w-[6px] rounded-full bg-[#AE0000]" />
              <h3 className="text-[18px] sm:text-[19px] font-medium text-neutral-900 dark:text-white">
                <span className="text-[#AE0000] font-semibold">Funcionalidades</span>{" "}
                do Administrador
              </h3>
            </div>

            <ul className="mt-5 space-y-4 text-[15px] leading-relaxed text-neutral-900 dark:text-neutral-200">
              <li className="flex gap-3">
                <span className="mt-[6px] h-[10px] w-[10px] rounded-full bg-[#7B0000] shrink-0" />
                <span>Gerencie alunos: cadastre, edite ou suspenda.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[6px] h-[10px] w-[10px] rounded-full bg-[#7B0000] shrink-0" />
                <span>Crie, edite ou exclua salas de reserva.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[6px] h-[10px] w-[10px] rounded-full bg-[#7B0000] shrink-0" />
                <span>Gere relatórios detalhados por sala, aluno ou período.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[6px] h-[10px] w-[10px] rounded-full bg-[#7B0000] shrink-0" />
                <span>Visualize todos os agendamentos do sistema.</span>
              </li>
            </ul>

            <p className="mt-6 text-[15px] text-neutral-900 dark:text-neutral-200">
              <span className="font-semibold text-[#AE0000]">OBS:</span>{" "}
              Todas as reservas seguem critérios pedagógicos e operacionais
              definidos pela unidade.
            </p>

            <div className="mt-6">
              <Link
                to="https://sp.senai.br/unidade/suicobrasileira"
                target="_blank"
                className="inline-block underline underline-offset-4 font-semibold text-neutral-900 dark:text-white hover:text-[#AE0000] transition"
              >
                Saiba mais sobre o SENAI–Suíço-Brasileira
              </Link>
            </div>
          </div>
        </section>

       
        <section className="relative w-full overflow-visible">
          {/* Spacer que garante espaço pro conteúdo aparecer acima da onda */}
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-[360px] md:pb-[440px]" />
          <div className="pointer-events-none select-none absolute inset-x-0 bottom-0 h-[140px] md:h-[180px]">
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

      {/* Footer fora do main (mesmo padrão do Professor) */}
      <Footer />
    </>
  );
}
