// src/pages/GestaoAlunos/GestaoDeAlunos.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import OndaLandingpage from "../../assets/ondaLandinpage.svg";
import OndaGestao from "../../assets/ondagestaoalunos.svg";
import Header from "../../components/Home/HeaderGlobal";

import { buscarEstudantes } from "../../service/usuario";
import { buscarTurmas } from "../../service/turma";

const GestaoDeAlunos = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [alunosData, setAlunosData] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // -------------------- helper: status pelas notificações --------------------
  function extrairStatusReservaDoAluno(estudanteObj) {
    const notificacoes = Array.isArray(estudanteObj?.notificacoes)
      ? estudanteObj.notificacoes
      : [];

    if (!notificacoes.length) return "Sem reserva";

    for (let i = notificacoes.length - 1; i >= 0; i--) {
      const notif = notificacoes[i];
      const titulo = String(notif?.titulo || "").toUpperCase();
      const mensagem = String(notif?.mensagem || "").toUpperCase();
      const texto = `${titulo} ${mensagem}`;

      if (!texto.includes("RESERVA")) continue;

      if (texto.includes("CANCELADA") || texto.includes("REJEITADA")) {
        return "Cancelada";
      }

      if (texto.includes("APROVADA") || texto.includes("CONFIRMADA")) {
        return "Confirmada";
      }

      if (texto.includes("CRIADA") || texto.includes("PENDENTE")) {
        return "Pendente";
      }
    }

    return "Sem reserva";
  }

  // -------------------- carregamento inicial --------------------
  useEffect(() => {
    let vivo = true;

    (async () => {
      try {
        setLoading(true);
        setErro("");

        const [respAlunos, respTurmas] = await Promise.all([
          buscarEstudantes(),
          buscarTurmas(),
        ]);

        if (!vivo) return;

        const arrAlunos = Array.isArray(respAlunos)
          ? respAlunos
          : Array.isArray(respAlunos?.data)
          ? respAlunos.data
          : [];

        const arrTurmas = Array.isArray(respTurmas)
          ? respTurmas
          : Array.isArray(respTurmas?.data)
          ? respTurmas.data
          : [];

        setTurmas(arrTurmas);

        const mapaAlunos = new Map();
        arrAlunos.forEach((a) => {
          if (a && a.id != null) mapaAlunos.set(a.id, a);
        });

        const lista = [];

        arrTurmas.forEach((turma) => {
          const nomeTurma = turma.nome || turma.codigoacesso || "Turma";

          const estudantesTurma = Array.isArray(turma.estudantesIds)
            ? turma.estudantesIds
            : [];

          estudantesTurma.forEach((item) => {
            let alunoId = null;
            let alunoOrigem = null;

            if (typeof item === "number") {
              alunoId = item;
              alunoOrigem = mapaAlunos.get(alunoId);
            } else if (item && item.id != null) {
              alunoId = item.id;
              alunoOrigem = mapaAlunos.get(alunoId) || item;
            }

            if (!alunoId || !alunoOrigem) return;

            const statusReserva = extrairStatusReservaDoAluno(item);

            lista.push({
              id: alunoOrigem.id,
              nome: alunoOrigem.nome || alunoOrigem.email || "Aluno",
              email: alunoOrigem.email || "",
              statusReserva,
              statusAluno: alunoOrigem.status || "ATIVO",
              turma: nomeTurma,
              turmaNome: nomeTurma,
            });
          });
        });

        setAlunosData(lista);
      } catch (e) {
        console.error("[GestaoDeAlunos] Erro ao carregar dados:", e);
        if (!vivo) return;
        setErro("Não foi possível carregar os alunos por turma.");
        setAlunosData([]);
        setTurmas([]);
      } finally {
        if (vivo) setLoading(false);
      }
    })();

    return () => {
      vivo = false;
    };
  }, []);

  // -------------------- filtros / grupos --------------------
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
    const mapa = alunosFiltrados.reduce((acc, a) => {
      const key = a.turmaNome || a.turma;
      if (!acc[key]) acc[key] = [];
      acc[key].push(a);
      return acc;
    }, {});

    turmas.forEach((t) => {
      const nome = t.nome || t.codigoacesso || "Turma";
      if (!mapa[nome]) mapa[nome] = [];
    });

    return mapa;
  }, [alunosFiltrados, turmas]);

  // -------------------- estilos de status --------------------
  const statusBg = (s) =>
    ({
      Pendente: "bg-red-700",
      Confirmada: "bg-green-600",
      Cancelada: "bg-zinc-600",
      "Sem reserva": "bg-gray-500",
    }[s] || "bg-gray-500");

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

  // -------------------- carrossel por turma --------------------
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
          {items.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 py-4">
              Nenhum aluno nesta turma.
            </div>
          ) : (
            items.map((a) => (
              <div
                key={a.id}
                className="group relative snap-start flex-shrink-0 w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm transition-all duration-200 overflow-hidden hover:shadow-lg hover:scale-[1.02]"
              >
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
                    <div className="text-gray-900 dark:text-white">
                      Email:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {a.email || "-"}
                      </span>
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      Status:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {a.statusAluno}
                      </span>
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      Turma:{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {a.turma}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-[150px] h-[30px] mt-2 px-5 py-0 rounded-md bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 transition-transform duration-200 ease-out hover:scale-[1.05]"
                    onClick={() => navigate(`/editarAluno/${a.id}`)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

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

  // -------------------- render --------------------
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      <Header />

      <main className="flex-1 flex flex-col">
        <div className="w-full overflow-hidden mt-10">
          <img src={OndaLandingpage} alt="Onda" className="w-full" />
        </div>

        <section className="flex-1 bg-red-700 text-white px-4 sm:px-8 py-12 text-center flex items-center justify-center mt-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
              Gestão de alunos
            </h1>
            <p className="text-base sm:text-lg">
              Acompanhe as informações e status das reservas de cada turma!
            </p>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
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

            <div className="space-y-10">
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    Carregando alunos...
                  </p>
                </div>
              )}

              {erro && (
                <p className="text-red-600 dark:text-red-400 text-center">
                  {erro}
                </p>
              )}

              {!loading &&
                !erro &&
                Object.keys(grupos).length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Nenhum aluno encontrado.
                  </p>
                )}

              {!loading &&
                !erro &&
                Object.entries(grupos).map(([turmaNome, items]) => (
                  <GroupCarousel
                    key={turmaNome}
                    turma={turmaNome}
                    items={items}
                  />
                ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-white dark:bg-black">
        <img
          src={OndaGestao}
          alt="Onda Gestão de Alunos"
          className="w-full h-auto block"
          draggable={false}
        />
      </footer>
    </div>
  );
};

export default GestaoDeAlunos;
