import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { criarTurma } from "../../service/turma";
import { buscarProfessores } from "../../service/usuario";

const COR = "#AE0000";

/* ==== helpers pra pegar id do usuário do token ==== */
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("espacoSenaiToken") ||
    ""
  );
}

export default function NovaTurma() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nome: "",
    curso: "",
    capacidade: "",
    modalidade: "TECNICO", // FIC | TECNICO | FACULDADE
    dataInicio: "",
    dataTermino: "",
    professorId: "",
  });

  const [professores, setProfessores] = useState([]);
  const [loadingProfs, setLoadingProfs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Detectar perfil e agir de acordo
  useEffect(() => {
    const token = getToken();
    const role = (localStorage.getItem("role") || "").toUpperCase();
    const isAdministrador = role.includes("ADMIN") || role.includes("ADMINISTRADOR");
    setIsAdmin(isAdministrador);

    if (isAdministrador) {
      // Admin: buscar todos os professores para selecionar
      async function carregarProfessores() {
        try {
          setLoadingProfs(true);
          const data = await buscarProfessores();
          setProfessores(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error("[NovaTurma] Erro ao buscar professores:", e);
          setProfessores([]);
        } finally {
          setLoadingProfs(false);
        }
      }
      carregarProfessores();
    } else {
      // Professor: preencher automaticamente com seu próprio ID
      if (!token) {
        setLoadingProfs(false);
        return;
      }

      const payload = parseJwt(token) || {};
      const id =
        payload.id ||
        payload.userId ||
        payload.usuarioId ||
        payload.sub ||
        payload.uid;

      if (id) {
        setValues((s) => ({ ...s, professorId: id }));
      }
      setLoadingProfs(false);
    }
  }, []);

  function update(field, v) {
    setValues((s) => ({ ...s, [field]: v }));
  }

  async function handleSalvar() {
    setErro("");

    if (!values.nome.trim()) {
      setErro("Preencha o nome da turma.");
      return;
    }
    if (!values.curso.trim()) {
      setErro("Preencha o nome do curso.");
      return;
    }
    if (!values.capacidade) {
      setErro("Preencha a capacidade máxima da turma.");
      return;
    }
    if (!values.dataInicio || !values.dataTermino) {
      setErro("Preencha a data de início e a data de término.");
      return;
    }
    if (!values.professorId) {
      setErro("Não foi possível identificar o professor. Verifique o login.");
      return;
    }

    try {
      setLoading(true);

      await criarTurma(values);

      navigate("/salas-professores");
    } catch (e) {
      console.error("[NovaTurma] Erro ao salvar turma:", e);

      const data = e?.response?.data;
      let msg = "Não foi possível salvar a turma. Tente novamente.";

      if (Array.isArray(data?.message)) {
        msg = data.message.join(" ");
      } else if (typeof data?.message === "string") {
        msg = data.message;
      } else if (typeof data?.mensagem === "string") {
        msg = data.mensagem;
      }

      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#1E1E1E]">
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-8 pb-2">
        <nav className="text-sm mb-5">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                to="/HomeProfessor"
                className="text-[#4F46E5] hover:underline"
              >
                Home dos Professores
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/salas-professores"
                className="text-[#4F46E5] hover:underline"
              >
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

        {erro && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{erro}</p>
        )}
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
              placeholder="Ex: Mecânica 2026"
              value={values.nome}
              onChange={(e) => update("nome", e.target.value)}
            />
          </div>

          {/* Nome do Curso */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Nome do curso
            </label>
            <input
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
              style={{ "--cor": COR }}
              placeholder="Ex: mecânica, desenvolvimento de sistemas..."
              value={values.curso}
              onChange={(e) => update("curso", e.target.value)}
            />
          </div>

          {/* Capacidade máxima */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Capacidade máxima da turma
            </label>
            <input
              type="number"
              min="1"
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
              style={{ "--cor": COR }}
              placeholder="Ex: 30"
              value={values.capacidade}
              onChange={(e) => update("capacidade", e.target.value)}
            />
          </div>

          {/* Modalidade */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
              Modalidade
            </label>
            <select
              className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                         bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                         focus:ring-2 focus:ring-[var(--cor, #AE0000)] appearance-none"
              style={{ "--cor": COR }}
              value={values.modalidade}
              onChange={(e) => update("modalidade", e.target.value)}
            >
              <option value="FIC">FIC</option>
              <option value="TECNICO">Técnico</option>
              <option value="FACULDADE">Faculdade</option>
            </select>
          </div>

          {/* Datas: início e término */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
                Data de início do curso
              </label>
              <input
                type="date"
                className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                           bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                           focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
                style={{ "--cor": COR }}
                value={values.dataInicio}
                onChange={(e) => update("dataInicio", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
                Data de término do curso
              </label>
              <input
                type="date"
                className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                           bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                           focus:ring-2 focus:ring-[var(--cor, #AE0000)]"
                style={{ "--cor": COR }}
                value={values.dataTermino}
                onChange={(e) => update("dataTermino", e.target.value)}
              />
            </div>
          </div>

          {/* Professor responsável - apenas para ADMIN */}
          {isAdmin && (
            <div className="md:col-span-2">
              <label className="block text-[14px] font-semibold text-[#1E1E1E] dark:text-gray-100">
                Professor responsável
              </label>
              {loadingProfs ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Carregando professores...</p>
              ) : (
                <select
                  className="mt-2 w-full h-12 px-3 rounded-md border border-black/10 dark:border-white/10
                             bg-[#F7F7F7] dark:bg-[#2A2A2A] text-[#111] dark:text-white outline-none
                             focus:ring-2 focus:ring-[var(--cor, #AE0000)] appearance-none"
                  style={{ "--cor": COR }}
                  value={values.professorId}
                  onChange={(e) => update("professorId", e.target.value)}
                >
                  <option value="">-- Selecione um professor --</option>
                  {professores.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome} (ID: {prof.id})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* ações */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleSalvar}
            disabled={loading}
            className="inline-flex items-center justify-center px-6 h-11 rounded-lg text-white font-semibold shadow-sm
                       hover:brightness-95 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: COR }}
          >
            {loading ? "Salvando..." : "Adicionar"}
          </button>

          <Link
            to="/salas-professores"
            className="px-6 h-11 rounded-lg border border-black/10 dark:border-white/10
                       text-[#1E1E1E] dark:text-white font-semibold grid place-items-center
                       hover:bg-black/5 dark:hover:bg:white/10"
          >
            Cancelar
          </Link>
        </div>
      </section>
    </main>
  );
}
