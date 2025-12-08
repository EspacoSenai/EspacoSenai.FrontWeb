import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AvatarDefault from "../../assets/AvatarPadrao.svg";
import { api } from "../../service/api";

const COR_PADRAO = "#AE0000";

function AlunoCard({ aluno, cor = COR_PADRAO }) {
  const navigate = useNavigate();
  const { nome, email } = aluno;

  return (
    <div className="relative bg-white dark:bg-[#1E1E1E] rounded-xl border border-neutral-200/70 dark:border-neutral-800 shadow-sm p-6 w-full max-w-[360px] mx-auto">
      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
        <img
          src={AvatarDefault}
          alt={nome || email}
          className="w-full h-full object-contain"
        />
      </div>

      <p className="mt-3 text-center text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
        {nome || email}
      </p>

      <p className="mt-2 text-center text-[11px] text-neutral-500 dark:text-neutral-400">
        {email}
      </p>

      <div className="mt-4">
        <div className="rounded-lg px-4 py-3 text-center bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-[12px] font-medium text-amber-700 dark:text-amber-400">
            Sem turma
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/editarAluno/${aluno.id}`)}
        className="mt-4 w-full px-4 py-2 text-sm rounded-md font-medium text-white transition hover:brightness-95"
        style={{ backgroundColor: cor }}
      >
        Editar
      </button>
    </div>
  );
}

export default function GestaoAlunos({ cor = COR_PADRAO }) {
  const [estudantes, setEstudantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErro("");
        const resp = await api.get("/usuario/buscar-estudantes");
        const data = resp?.data ?? resp;
        const arr = Array.isArray(data) ? data : [];

        if (!alive) return;
        setEstudantes(arr);
      } catch (err) {
        console.error("[GestaoAlunos] Erro ao buscar estudantes:", err);
        if (!alive) return;
        setErro("Não foi possível carregar os alunos.");
        setEstudantes([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-10">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h3 className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-neutral-100">
              Gestão de alunos
            </h3>
            <div
              className="mt-2 mx-auto w-24 h-[3px] rounded-full"
              style={{ backgroundColor: cor }}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Carregando alunos...
          </div>
        ) : erro ? (
          <div className="py-10 text-center text-sm text-red-600">{erro}</div>
        ) : estudantes.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Nenhum aluno cadastrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estudantes
              .filter((aluno) => {
                const turmas = aluno.turmas || [];
                return turmas.length === 0;
              })
              .map((aluno) => (
                <AlunoCard key={aluno.id} aluno={aluno} cor={cor} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
