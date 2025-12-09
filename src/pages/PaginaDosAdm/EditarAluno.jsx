// src/pages/Administrador/EditarAluno.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { api } from "../../service/api";

const COR = "#AE0000";

// Lista de cargos - apenas Estudante para alunos
const CARGOS = [
  { value: "aluno", label: "Estudante", roleId: 4 },
];

export default function EditarAluno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const alunoState = location.state?.aluno || null;

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    status: "ATIVO",
    cargo: "", // novo campo para controle do select
    rolesIds: [4], // padrão: estudante
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Carrega dados do aluno
  useEffect(() => {
    if (alunoState) {
      const cargoEncontrado = CARGOS.find((c) =>
        alunoState.rolesIds?.includes(c.roleId)
      );
      setForm({
        nome: alunoState.nome || "",
        email: alunoState.email || "",
        senha: "",
        status: alunoState.status || "ATIVO",
        cargo: cargoEncontrado?.value || "aluno",
        rolesIds: alunoState.rolesIds?.length
          ? alunoState.rolesIds
          : [cargoEncontrado?.roleId || 4],
      });
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const resp = await api.get(`/usuario/buscar-por-id/${id}`);
        const data = resp.data ?? resp;
        const cargoEncontrado = CARGOS.find((c) =>
          data.rolesIds?.includes(c.roleId)
        );
        setForm({
          nome: data.nome || "",
          email: data.email || "",
          senha: "",
          status: data.status || "ATIVO",
          cargo: cargoEncontrado?.value || "aluno",
          rolesIds: data.rolesIds?.length
            ? data.rolesIds
            : [cargoEncontrado?.roleId || 4],
        });
      } catch (err) {
        console.error("[EditarAluno] erro ao carregar aluno:", err);
        setFeedback({
          type: "error",
          message: "Não foi possível carregar os dados do aluno.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, alunoState]);

  const atualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (feedback.type) setFeedback({ type: "", message: "" });
  };

  // Atualiza role quando muda o cargo
  const atualizarCargo = (value) => {
    const cargoObj = CARGOS.find((c) => c.value === value);
    setForm((prev) => ({
      ...prev,
      cargo: value,
      rolesIds: [cargoObj?.roleId || 4],
    }));
  };

  // Salvar alterações
  const salvar = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) {
      setFeedback({
        type: "error",
        message: "Nome e e-mail são obrigatórios.",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        status: form.status || "ATIVO",
        rolesIds: form.rolesIds,
      };

      if (form.senha && form.senha.trim()) {
        payload.senha = form.senha.trim();
      }

      await api.put(`/usuario/atualizar/${id}`, payload);

      setFeedback({
        type: "success",
        message: "Aluno atualizado com sucesso!",
      });

      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error("[EditarAluno] erro ao salvar aluno:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao salvar alterações.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0f0f10] flex flex-col">
      {/* HEADER */}
      <header className="w-full border-b border-[#960000] bg-[#AE0000] dark:bg-[#8a0303] text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/80 bg-transparent text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Voltar
          </button>
          <h1 className="text-lg md:text-xl font-semibold">Editar Aluno</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 flex justify-center items-start md:items-center px-4 py-8">
        {loading ? (
          <div className="text-center text-sm text-gray-700">Carregando...</div>
        ) : (
          <div className="w-full max-w-xl">
            <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 px-6 py-6 md:px-8 md:py-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Informações do aluno
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Atualize os dados cadastrais e o cargo do aluno.
              </p>

              {feedback.message && (
                <div
                    className={`mb-4 rounded-lg px-4 py-2 text-sm ${feedback.type === "success"
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                    }`}
                >
                  {feedback.message}
                </div>
              )}

              <form onSubmit={salvar} className="space-y-5">
                {/* NOME */}
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => atualizarCampo("nome", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                    placeholder="Nome completo do aluno"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => atualizarCampo("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                    placeholder="email@exemplo.com"
                  />
                </div>

                {/* SENHA */}
                <div>
                  <label
                    htmlFor="senha"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Senha
                  </label>
                  <input
                    id="senha"
                    type="password"
                    value={form.senha}
                    onChange={(e) => atualizarCampo("senha", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                    placeholder="Nova senha (opcional)"
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    Se deixar em branco, a senha atual será mantida.
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => atualizarCampo("status", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                  >
                    <option value="ATIVO">ATIVO</option>
                    <option value="BLOQUEADO">BLOQUEADO</option>
                  </select>
                </div>

                {/* CARGO - Fixo como Estudante */}
                <div>
                  <label
                    htmlFor="cargo"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Cargo
                  </label>
                  <div className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#2a2a2e] px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                    Estudante
                  </div>
                </div>

                {/* BOTÕES */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-[#222] text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-[#2a2a2e] transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-sm rounded-md font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95 transition"
                    style={{ backgroundColor: COR }}
                  >
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
