// src/pages/Home/HomeAlunos.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaPrincipal from "../../assets/OndasHome.svg";
import OndaRodape from "../../assets/ondaPrincipal.svg";
import Pessoa from "../../assets/HomeMulher.svg";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

import { buscarMeuPerfil } from "../../service/usuario";
import LembretesReservas from "../../components/ComponentsHome/LembretesReservas";

const COR = "#AE0000";

export default function HomeAlunos() {
  const [page, setPage] = useState(0);
  const [displayName, setDisplayName] = useState("");

  const nome = displayName || "Aluno";
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
        if (alive) setDisplayName(nomeBack.toString().trim() || "Aluno");
      } catch (err) {
        console.error("[HomeAlunos] Erro ao buscar perfil:", err);
        if (alive) setDisplayName("Aluno");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const items = [
    {
      title: "PS5",
      img: ImgPS5,
      desc: "Agora você pode aproveitar toda a emoção dos games com o PlayStation 5 na biblioteca!",
      link: "/salas-alunos",
    },
    {
      title: "Quadra",
      img: ImgQuadra,
      desc: "A quadra é um espaço essencial para a prática de esportes, lazer e atividades físicas.",
      link: "/salas-alunos",
    },
    {
      title: "Computadores",
      img: ImgComputadores,
      desc: "Espaço equipado com computadores para estudos, pesquisas e projetos em grupo.",
      link: "/salas-alunos",
    },
    {
      title: "Impressão 3D",
      img: ImgImpressora3D,
      desc: "Área com impressoras 3D para prototipagem e atividades de inovação e tecnologia.",
      link: "/salas-alunos",
    },
  ];

  const pagesArr = [
    [items[0], items[1]],
    [items[2], items[3]],
  ];
  const pagesCount = pagesArr.length;

  const nextPage = useCallback(
    () => setPage((p) => (p + 1) % pagesCount),
    [pagesCount]
  );
  const prevPage = useCallback(
    () => setPage((p) => (p - 1 + pagesCount) % pagesCount),
    [pagesCount]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPage, prevPage]);

  const ArrowBtn = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Próximo"
      className="absolute z-40 right-[-4px] lg:right-[-2px] top-[46%] lg:top-[44%] h-10 lg:h-11 w-10 lg:w-11 grid place-items-center rounded-full bg-transparent border-0 shadow-none ring-0 hover:scale-[1.06] active:scale-95 focus:outline-none focus-visible:outline-none select-none cursor-pointer"
      style={{
        WebkitTapHighlightColor: "transparent",
        background: "transparent",
        border: "none",
        outline: "none",
        boxShadow: "none",
        appearance: "none",
        MozAppearance: "none",
        WebkitAppearance: "none",
      }}
    >
      <svg
        viewBox="0 0 20 37"
        className="w-5 h-5 text-[#1E1E1E] dark:text-white"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1.75 35.375L18.625 18.5L1.75 1.625"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </button>
  );

  const Card = ({ title, img, desc, link }) => (
    <Link
      to={link}
      className="block rounded-[12px] bg-white dark:bg-[#1B1B1B] shadow-md ring-1 ring-black/5 p-3 sm:p-4 md:p-5 group"
    >
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-5 items-center">
        <div className="md:col-span-4">
          <img
            src={img}
            alt={title}
            className="w-full h-[160px] sm:h-[190px] md:h-[180px] object-cover rounded-[10px]"
          />
        </div>
        <div className="md:col-span-6 relative">
          <span className="inline-block bg-[#720505] text-white text-sm font-semibold px-4 py-1 rounded-[10px]">
            {title}
          </span>
          <div className="mt-3 sm:mt-4 rounded-[10px] bg-[#EFEFEF] dark:bg-[#111] ring-1 ring-black/5 p-3 sm:p-4">
            <p className="text-sm sm:text-base text-[#1E1E1E] dark:text-gray-200 leading-relaxed">
              {desc}
            </p>
          </div>
          <div className="mt-3 sm:mt-4 flex justify-end">
            <span className="inline-flex items-center gap-2 bg-white dark:bg-[#0f0f0f] text-[#1E1E1E] dark:text-white border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-sm font-semibold group-hover:translate-x-[2px] transition">
              Agendar agora
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 5l6 5-6 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <Header />

      <main className="bg-white dark:bg-[#0B0B0B] w-full pb-24 relative overflow-hidden">
        {/* HERO */}
        <section className="relative w-full -mt-px">
          {/* mobile */}
          <div className="lg:hidden relative w-full h-[440px] bg-[#A00000] dark:bg-black text-white flex items-center pt-12">
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
                Esta é a página principal!
              </p>
              <Link to="/salas-alunos" className="mt-2">
                <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                  Reserve agora
                </button>
              </Link>
            </div>
          </div>

          {/* desktop */}
          <div className="hidden lg:flex w-full h-[560px] lg:h-[600px] items-center">
            <div className="relative w-1/2 h-full flex items-end justify-center pb-12 md:translate-x-8 md:-translate-y-16 shrink-0 min-w-[360px]">
              <img src={Pessoa} alt="" className="h-[65%] w-auto" />
            </div>

            <div className="relative w-1/2 h-full overflow-hidden lg:-right-7">
              <img
                src={OndaPrincipal}
                alt=""
                className="absolute inset-0 w-full h-full object-contain object-right-top z-0 pointer-events-none select-none"
              />
              <div className="absolute inset-0 flex flex-col items-end justify-center text-white text-right pr-12 lg:pr-24 z-10 pb-24">
                <div className="w-full max-w-[520px] ml-auto">
                  <h1 className="font-extrabold text-balance leading-tight">
                    <span className={`${desktopFirstLineClass} block`}>
                      Bem-vindo(a)
                    </span>
                    <span className={`${desktopSecondLineClass} block`}>
                      {nome},
                    </span>
                  </h1>
                  <p className="text-lg mt-3">Esta é a página principal!</p>
                  <div className="w-full mt-12 lg:mt-20 flex justify-end">
                    <Link to="/salas-alunos">
                      <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                        Reserve agora
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

        {/* ===== ESPAÇOS UTILIZADOS ===== */}
        <section className="w-full" id="atalhos">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block h-5 w-[6px] rounded-full bg-[#AE0000]" />
              <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#1E1E1E] dark:text-white">
                Espaços <span className="text-[#AE0000]">Utilizados</span>
              </h2>
            </div>

            <div className="relative rounded-[14px] bg-[#E5E5E5] dark:bg-[#2A2A2A] p-3 sm:p-4 md:p-5 shadow-[inset_0_1px_0_rgba(0,0,0,0.05)]">
              <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-[14px] bg-[#E5E5E5] dark:bg-[#2A2A2A] z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-3 rounded-r-[14px] bg-[#E5E5E5] dark:bg-[#2A2A2A] z-10 pointer-events-none" />
              <button
                type="button"
                onClick={prevPage}
                aria-label="Anterior"
                className="absolute z-40 left-[-4px] md:left-[-15px] top-[48%] -translate-y-1/2 h-10 md:h-11 w-10 md:w-11 grid place-items-center rounded-full bg-transparent border-0 hover:scale-[1.06] active:scale-95 focus:outline-none select-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <svg
                  viewBox="0 0 20 37"
                  className="w-5 h-5 text-[#1E1E1E] dark:text-white"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M18.625 35.375L1.75 18.5L18.625 1.625"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextPage}
                aria-label="Próximo"
                className="absolute z-40 right-[-4px] md:right-[-5px] top-[48%] -translate-y-1/2 h-10 md:h-11 w-10 md:w-11 grid place-items-center rounded-full bg-transparent border-0 hover:scale-[1.06] active:scale-95 focus:outline-none select-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <svg
                  viewBox="0 0 20 37"
                  className="w-5 h-5 text-[#1E1E1E] dark:text-white"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1.375 1.625L18.25 18.5L1.375 35.375"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {pagesArr.map((pageItems, idx) => (
                    <div key={idx} className="w-full shrink-0">
                      <div className="space-y-4 md:space-y-5">
                        <Card {...pageItems[0]} />
                        <div className="h-px bg-gray-300 rounded-full mx-1" />
                        {pageItems[1] ? (
                          <Card {...pageItems[1]} />
                        ) : (
                          <div className="h-[200px]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: pagesCount }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition ${page === i
                      ? "bg-[#AE0000]"
                      : "bg-gray-400/70 dark:bg-gray-500"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

        {/* Lembretes – componente separado */}
        <LembretesReservas />

        {/* Quem pode reservar? */}
        <section className="relative w-full">
          <div className="max-w-6xl mx-auto px-6 md:px-10 pt-10 pb-16">
            <div className="border-t border-gray-200 dark:border-white/10 mb-10" />

            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="inline-block h-8 w-[6px] rounded-full"
                    style={{ backgroundColor: COR }}
                  />
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] dark:text-white">
                    Quem pode reservar?
                  </h3>
                </div>

                <ul className="space-y-4 text-[#1E1E1E] dark:text-gray-100">
                  <li className="flex gap-4 text-lg md:text-xl leading-relaxed">
                    <span className="mt-2 inline-block h-3 w-3 rounded-full bg-red-600" />
                    <p>Alunos do SENAI que tenham cadastro no nosso site.</p>
                  </li>
                  <li className="flex gap-4 text-lg md:text-xl leading-relaxed">
                    <span className="mt-2 inline-block h-3 w-3 rounded-full bg-red-600" />
                    <p>Docentes e coordenadores para preparação de aula.</p>
                  </li>
                </ul>

                <p className="mt-8 text-base md:text-lg">
                  <span className="font-extrabold" style={{ color: COR }}>
                    OBS:
                  </span>{" "}
                  <span className="text-[#1E1E1E] dark:text-gray-200">
                    Todas as reservas seguem critérios pedagógicos e
                    operacionais definidos pela unidade.
                  </span>
                </p>

                <a
                  href="https://www.sp.senai.br/unidade/suico-brasileira"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-6 text-lg md:text-xl text-[#1E1E1E] dark:text-white font-semibold underline underline-offset-4"
                >
                  Saiba mais sobre o SENAI–Suíço–Brasileira
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Ondas rodapé */}
        <section className="relative w-full overflow-visible -mb-[140px] md:-mb-[200px]">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-6">
            <div className="h-px w-full" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-[460px] md:pb-[520px]" />

          <div className="pointer-events-none select-none absolute inset-x-0 bottom-0 h-[160px] md:h-[200px]">
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
