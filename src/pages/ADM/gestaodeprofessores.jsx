import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import OndaLandingpage from "../../assets/ondaLandinpage.svg";
import OndaGestao from "../../assets/ondagestaoalunos.svg";
import Header from "../../components/Home/HeaderGlobal";
import { buscarProfessores, atualizarUsuario } from "../../service/usuario";

const GestaoDeProfessores = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca professores do backend
  useEffect(() => {
    async function carregarProfessores() {
      try {
        setLoading(true);
        const data = await buscarProfessores();
        // Converte Set para Array se necessário
        const lista = Array.isArray(data) ? data : Array.from(data || []);
        setProfessores(lista);
        setError(null);
      } catch (err) {
        console.error("[GestaoDeProfessores] Erro ao buscar professores:", err);
        setError("Erro ao carregar professores");
        setProfessores([]);
      } finally {
        setLoading(false);
      }
    }
    carregarProfessores();
  }, []);

  const professoresFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return professores;
    return professores.filter(
      (p) =>
        (p.nome || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q)
    );
  }, [query, professores]);

  const statusBg = (s) => {
    const status = String(s || "").toUpperCase();
    return {
      ATIVO: "bg-green-600",
      BLOQUEADO: "bg-red-700",
      INATIVO: "bg-zinc-600",
    }[status] || "bg-zinc-500";
  };

  const InitialAvatar = ({ name }) => {
    const initials = (name || "P")
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

  const handleEditar = (professor) => {
    navigate(`/editar-usuario/${professor.id}`, { 
      state: { usuario: professor, tipo: "PROFESSOR" } 
    });
  };

  const ProfessorCard = ({ professor }) => {
    return (
      <div className="group relative snap-start flex-shrink-0 w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm transition-all duration-200 overflow-hidden hover:shadow-lg hover:scale-[1.02]">
        <div className="pointer-events-none absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="p-7 sm:p-8 relative z-10 flex flex-col items-center text-center gap-4 sm:gap-5">
          <InitialAvatar name={professor.nome} />

          <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
            {professor.nome || "Professor"}
          </div>

          <div
            className={`w-full ${statusBg(professor.status)} text-white text-xs sm:text-sm py-2 rounded-md`}
          >
            Status: {professor.status || "ATIVO"}
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-900 dark:text-white">
              <span className="truncate">
                Email:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  {professor.email || "-"}
                </span>
              </span>
            </div>
            {professor.turmas && professor.turmas.length > 0 && (
              <div className="text-gray-900 dark:text-white">
                Turmas:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  {professor.turmas.map(t => t.nome || t).join(", ")}
                </span>
              </div>
            )}
          </div>

          <div className="w-full">
            <button
              type="button"
              className="group relative overflow-hidden w-[150px] h-[30px] px-5 py-0 flex items-center justify-center rounded-md bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 transition-transform duration-200 ease-out hover:scale-[1.05] mx-auto"
              onClick={() => handleEditar(professor)}
            >
              <span className="pointer-events-none absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-md" />
              <span className="relative -translate-y-[1px]">Editar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <Header />

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
              Gestão de Professores
            </h1>
            <p className="text-base sm:text-lg font-normal leading-relaxed mb-3 text-center">
              Aqui você pode acompanhar e gerenciar as informações dos professores
              com facilidade!
            </p>
            <p className="text-base sm:text-lg font-normal leading-relaxed text-center">
              Edite perfis e mantenha tudo organizado.
            </p>
          </div>
        </section>

        {/* Lista de professores */}
        <section className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Busca */}
            <div className="w-full">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar professor por nome ou email"
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

            {/* Lista */}
            <div className="space-y-6">
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Carregando professores...</p>
                </div>
              )}

              {error && (
                <p className="text-red-500 dark:text-red-400 text-center">
                  {error}
                </p>
              )}

              {!loading && !error && professoresFiltrados.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Nenhum professor encontrado.
                </p>
              )}

              {!loading && !error && professoresFiltrados.length > 0 && (
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth no-scrollbar">
                  {professoresFiltrados.map((professor) => (
                    <ProfessorCard key={professor.id} professor={professor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-black">
        <div className="w-full overflow-hidden">
          <img
            src={OndaGestao}
            alt="Onda Gestão"
            className="w-full h-auto block"
            draggable={false}
          />
        </div>
      </footer>
    </div>
  );
};

export default GestaoDeProfessores;
