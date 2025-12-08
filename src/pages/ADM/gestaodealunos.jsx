import React, { useState, useEffect, useMemo, useRef } from "react";

import OndaLandingpage from "../../assets/ondaLandinpage.svg";
import OndaGestao from "../../assets/ondagestaoalunos.svg";
import Header from "../../components/Home/HeaderGlobal";

const GestaoDeAlunos = () => {
  // Busca e dados (mock)
  const [query, setQuery] = useState("");

  const alunosData = useMemo(
    () => [
      {
        id: 1,
        nome: "Gabriela Almeida",
        email: "gabi@email.com",
        statusReserva: "Pendente",
        statusAluno: "Ativo",
        turma: "Seduc1",
      },
      {
        id: 2,
        nome: "João Pedro",
        email: "joao@email.com",
        statusReserva: "Confirmada",
        statusAluno: "Ativo",
        turma: "Seduc1",
      },
      {
        id: 3,
        nome: "Marina Costa",
        email: "marina@email.com",
        statusReserva: "Pendente",
        statusAluno: "Ativo",
        turma: "Seduc2",
      },
      {
        id: 4,
        nome: "Rafael Souza",
        email: "rafa@email.com",
        statusReserva: "Cancelada",
        statusAluno: "Inativo",
        turma: "Seduc2",
      },
      {
        id: 5,
        nome: "Bianca Lima",
        email: "bianca@email.com",
        statusReserva: "Confirmada",
        statusAluno: "Ativo",
        turma: "FIC",
      },
      {
        id: 6,
        nome: "Carlos Nunes",
        email: "carlos@email.com",
        statusReserva: "Pendente",
        statusAluno: "Ativo",
        turma: "Seduc1",
      },
      {
        id: 7,
        nome: "Ana Silva",
        email: "ana@email.com",
        statusReserva: "Confirmada",
        statusAluno: "Ativo",
        turma: "FIC",
      },
      {
        id: 8,
        nome: "Pedro Santos",
        email: "pedro@email.com",
        statusReserva: "Pendente",
        statusAluno: "Ativo",
        turma: "Seduc2",
      },
    ],
    []
  );

  const alunosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alunosData;
    return alunosData.filter(
      (a) =>
        a.turma.toLowerCase().includes(q) ||
        a.nome.toLowerCase().includes(q)
    );
  }, [query, alunosData]);

  const grupos = useMemo(() => {
    return alunosFiltrados.reduce((acc, a) => {
      acc[a.turma] = acc[a.turma] || [];
      acc[a.turma].push(a);
      return acc;
    }, {});
  }, [alunosFiltrados]);

  const statusBg = (s) =>
    (
      {
        Pendente: "bg-red-700",
        Confirmada: "bg-green-600",
        Cancelada: "bg-zinc-600",
      }[s] || "bg-zinc-500"
    );

  const InitialAvatar = ({ name }) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center justify-center text-xl font-semibold select-none">
        {initials}
      </div>
    );
  };

  // Carrossel por turma com barra de progresso
  const GroupCarousel = ({ turma, items }) => {
    const ref = useRef(null);
    const [pct, setPct] = useState(0);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const onScroll = () => {
        const max = el.scrollWidth - el.clientWidth;
        setPct(max > 0 ? el.scrollLeft / max : 0);
      };
      onScroll();
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    }, []);

    return (
      <div className="space-y-4">
        <h2 className="text-left text-lg font-normal text-gray-900 dark:text-gray-100">
          <span className="inline-block border-b-2 border-red-700 pb-[2px]">
            {turma}
          </span>
        </h2>

        <div
          ref={ref}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth no-scrollbar"
        >
          {items.map((a) => (
            <div
              key={a.id}
              className="group relative snap-start flex-shrink-0 w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm transition-all duration-200 overflow-hidden hover:shadow-lg hover:scale-[1.02]"
            >
              {/* Overlay do card */}
              <div className="pointer-events-none absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              <div className="p-7 sm:p-8 relative z-10 flex flex-col items-center text-center gap-4 sm:gap-5">
                <InitialAvatar name={a.nome} />

                <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {a.nome}
                </div>

                <div
                  className={`w-full ${statusBg(
                    a.statusReserva
                  )} text-white text-xs sm:text-sm py-2 rounded-md`}
                >
                  Status de Reserva: {a.statusReserva}
                </div>

                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-900 dark:text-white">
                    <span className="truncate">
                      Email:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {a.email}
                      </span>
                    </span>
                    <span>
                      Status:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {a.statusAluno}
                      </span>
                    </span>
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    Turma:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      {a.turma}
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <button
                    type="button"
                    className="group relative overflow-hidden w-[150px] h-[30px] px-5 py-0 flex items-center justify-center rounded-md bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 transition-transform duration-200 ease-out hover:scale-[1.05] mx-auto"
                    onClick={() => alert(`Editar ${a.nome}`)}
                  >
                    {/* Overlay do botão */}
                    <span className="pointer-events-none absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-md" />
                    <span className="relative -translate-y-[1px]">
                      Editar
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de progresso */}
        <div className="flex justify-center">
          <div className="relative h-1 w-40 bg-gray-200 dark:bg-zinc-700 rounded-full">
            <div
              className="absolute left-0 top-0 h-1 bg-red-700 rounded-full transition-all"
              style={{ width: `${Math.max(8, pct * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header global, com tema e menu centralizados */}
      <Header />

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Onda da Landing Page */}
        <div className="w-full overflow-hidden mt-10 bg-white dark:bg-black">
          <img
            src={OndaLandingpage}
            alt="Onda decorativa"
            className="w-full h-auto block"
            draggable={false}
          />
        </div>

        {/* Hero */}
        <section className="flex-1 bg-red-700 text-white px-4 sm:px-8 py-12 sm:py-16 lg:py-20 text-center flex items-center justify-center mt-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6 tracking-tight text-center">
              Gestão de alunos
            </h1>
            <p className="text-base sm:text-lg font-normal leading-relaxed mb-3 text-center md:transform md:-translate-y-1 md:-translate-x-9 whitespace-normal md:whitespace-nowrap">
              Aqui você pode acompanhar e organizar as informações dos alunos
              com facilidade!
            </p>
            <p className="text-base sm:text-lg font-normal leading-relaxed text-center">
              Mantenha tudo em dia de um jeito simples e rápido.
            </p>
          </div>
        </section>

        {/* Lista e gestão de alunos */}
        <section className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Busca */}
            <div className="w-full">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar turma ou aluno"
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-zinc-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-600"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
                  />
                </svg>
              </div>
            </div>

            {/* Grupos por turma */}
            <div className="space-y-10">
              {Object.keys(grupos).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum resultado encontrado.
                </p>
              )}
              {Object.entries(grupos).map(([turma, items]) => (
                <GroupCarousel key={turma} turma={turma} items={items} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-black">
        <div className="w-full overflow-hidden">
          <img
            src={OndaGestao}
            alt="Onda Gestão de Alunos"
            className="w-full h-auto block"
            draggable={false}
          />
        </div>
      </footer>
    </div>
  );
};

export default GestaoDeAlunos;
