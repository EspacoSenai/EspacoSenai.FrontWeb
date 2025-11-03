import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const COR = "#AE0000";

export default function NovaTurma() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nome: "",
    modulo: "",
    duracao: "",
    datas: "",
    periodo: "Manhã",
    tipo: "Teórica",
  });

  function update(field, v) {
    setValues((s) => ({ ...s, [field]: v }));
  }

  function handleSalvar() {
    const novaTurma = {
      id: Date.now(),
      titulo: values.modulo || "Novo Módulo",
      duracao: values.duracao || "—",
      datas: values.datas || "—",
      periodo: values.periodo || "—",
      tipo: values.tipo || "—",
      nome: values.nome || "Nova Turma",
    };
    navigate("/salas-professores", { state: { novaTurma } });
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#1E1E1E]">
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-8 pb-2">
        <nav className="text-sm mb-5">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/HomeProfessor" className="text-[#4F46E5] hover:underline">
                Home dos Professores
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/salas-professores" className="text-[#4F46E5] hover:underline">
                Salas
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 dark:text-gray-200">Nova Turma</li>
          </ol>
        </nav>

        <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-[#1E1E1E] dark:text-white">
          Nova Turma
        </h1>
        <p className="mt-1 text-[15px] text-gray-600 dark:text-gray-300">
          Preencha as informações abaixo para criar uma nova turma.
        </p>
      </section>

      {/* formulário */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-16">
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome da Turma */}
          <div className="md:col-span-2">
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Nome da Turma
            </label>
            <input
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
              style={{ "--cor": COR }}
              placeholder="Ex: Turma A, 2º Semestre"
              value={values.nome}
              onChange={(e) => update("nome", e.target.value)}
            />
          </div>

          {/* Módulo */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Módulo / Disciplina
            </label>
            <input
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
              style={{ "--cor": COR }}
              placeholder="Ex: Front-End, Mobile, BD..."
              value={values.modulo}
              onChange={(e) => update("modulo", e.target.value)}
            />
          </div>

          {/* Datas */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Datas
            </label>
            <input
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
              style={{ "--cor": COR }}
              placeholder="Ex: 02/09 – 30/09"
              value={values.datas}
              onChange={(e) => update("datas", e.target.value)}
            />
          </div>

          {/* Período */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Período
            </label>
            <select
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)] appearance-none"
              style={{ "--cor": COR }}
              value={values.periodo}
              onChange={(e) => update("periodo", e.target.value)}
            >
              <option>Manhã</option>
              <option>Tarde</option>
              <option>Noite</option>
              <option>Integral</option>
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Tipo
            </label>
            <select
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)] appearance-none"
              style={{ "--cor": COR }}
              value={values.tipo}
              onChange={(e) => update("tipo", e.target.value)}
            >
              <option>Teórica</option>
              <option>Prática</option>
              <option>Híbrida</option>
            </select>
          </div>

          {/* Duração */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Duração
            </label>
            <input
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
              style={{ "--cor": COR }}
              placeholder="Ex: 40h"
              value={values.duracao}
              onChange={(e) => update("duracao", e.target.value)}
            />
          </div>
        </div>

        {/* ações */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleSalvar}
            className="inline-flex items-center justify-center px-6 h-11 rounded-lg text-white font-semibold shadow-sm
                       hover:brightness-95 active:scale-95"
            style={{ background: COR }}
          >
            Adicionar
          </button>

          <Link
            to="/salas-professores"
            className="px-6 h-11 rounded-lg border border-black/10 dark:border-white/10
                       text-[#1E1E1E] dark:text-white font-semibold grid place-items-center
                       hover:bg-black/5 dark:hover:bg-white/10"
          >
            Cancelar
          </Link>
        </div>
      </section>
    </main>
  );
}
