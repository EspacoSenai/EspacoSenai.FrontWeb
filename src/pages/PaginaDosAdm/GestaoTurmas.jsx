// src/pages/Administrador/GestaoTurmas.jsx
import React, { useEffect, useState } from "react";
import { buscarTurmas, criarTurma } from "../../service/turma";
import { api } from "../../service/api";

const COR = "#AE0000";

function TurmaCard({
  id,
  nome,
  codigo, // <- vem do codigoAcesso
  curso,
  modalidade,
  dataInicio,
  dataTermino,
  capacidade,
  onEditar,
}) {
  return (
    <div className="w-full max-w-[520px] mx-auto">
      {/* header vermelho */}
      <div
        className="relative rounded-t-lg px-6 py-3 text-white text-center"
        style={{ backgroundColor: COR }}
      >
        <div className="font-semibold text-[18px]">
          {nome || "Turma sem nome"}
        </div>
        <div className="mt-1 text-[13px] opacity-90">
          Código: <span className="font-medium">{codigo || "—"}</span>
        </div>

        {/* Botão de editar */}
        <button
          onClick={() => onEditar({ id, nome, codigo, curso, modalidade, dataInicio, dataTermino, capacidade })}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-lg transition"
          title="Editar turma"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>

      {/* tabela */}
      <div className="border-x border-b rounded-b-lg border-neutral-200 overflow-hidden bg-white">
        {/* cabeçalho */}
        <div className="grid grid-cols-3 text-center text-[14px] font-semibold bg-white text-black">
          <div className="p-3 border-r border-neutral-200">Duração</div>
          <div className="p-3 border-r border-neutral-200">Curso</div>
          <div className="p-3">Modalidade</div>
        </div>

        {/* linha de dados */}
        <div className="grid grid-cols-3 text-[13px] bg-white text-black">
          {/* duração */}
          <div className="border-t border-r border-neutral-200 p-3 text-left">
            <p>Início:</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-black">
              {dataInicio || "—"}
            </span>
            <p className="mt-3">Fim:</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-black">
              {dataTermino || "—"}
            </span>
          </div>

          {/* curso */}
          <div className="border-t border-r border-neutral-200 p-3 flex items-center justify-center">
            <span className="inline-block px-4 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-center text-black">
              {curso || "—"}
            </span>
          </div>

          {/* modalidade */}
          <div className="border-t border-neutral-200 p-3 flex items-center justify-center">
            <span className="inline-block px-4 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-black">
              {modalidade || "—"}
            </span>
          </div>
        </div>

        {/* footer capacidade */}
        <div className="text-center text-[14px] bg-neutral-100 px-4 py-3 text-black">
          {capacidade
            ? `Capacidade: ${capacidade} alunos`
            : "Capacidade não informada"}
        </div>
      </div>
    </div>
  );
}

export default function GestaoTurmas({ cor = COR }) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [turmaEditando, setTurmaEditando] = useState(null);
  const [salvandoTurma, setSalvandoTurma] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const [form, setForm] = useState({
    nome: "",
    curso: "",
    modalidade: "",
    dataInicio: "",
    dataTermino: "",
    capacidade: "",
    professorId: "",
    estudantesIdsTexto: "",
  });

  const CLASSES_INPUT =
    "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-[14px] text-black outline-none focus:ring-2 focus:ring-[#B10404] focus:border-[#B10404]";

  async function carregarTurmas() {
    try {
      setLoading(true);
      setErro("");
      const arr = await buscarTurmas();
      setTurmas(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error("[GestaoTurmas] erro ao buscar turmas:", err);
      setErro(
        "Não foi possível carregar as turmas. Tente novamente mais tarde."
      );
      setTurmas([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTurmas();
  }, []);

  const formValido = () =>
    form.nome.trim() &&
    form.curso.trim() &&
    form.modalidade.trim() &&
    form.dataInicio.trim() &&
    form.dataTermino.trim();

  function abrirModal() {
    setErroForm("");
    setForm({
      nome: "",
      curso: "",
      modalidade: "",
      dataInicio: "",
      dataTermino: "",
      capacidade: "",
      professorId: "",
      estudantesIdsTexto: "",
    });
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvandoTurma) return;
    setModalAberto(false);
    setErroForm("");
  }

  function abrirModalEditar(turma) {
    setTurmaEditando(turma);
    setForm({
      nome: turma.nome || "",
      curso: turma.curso || "",
      modalidade: turma.modalidade || "",
      dataInicio: turma.dataInicio || "",
      dataTermino: turma.dataTermino || "",
      capacidade: turma.capacidade || "",
      professorId: "",
      estudantesIdsTexto: "",
    });
    setModalEditarAberto(true);
  }

  function fecharModalEditar() {
    if (salvandoTurma) return;
    setModalEditarAberto(false);
    setTurmaEditando(null);
    setErroForm("");
  }

  function onChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErroForm("");
  }

  async function salvarTurma(e) {
    e.preventDefault();
    if (!formValido()) {
      setErroForm("Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvandoTurma(true);
    setErroForm("");

    try {
      await criarTurma(form);
      fecharModal();
      await carregarTurmas();
    } catch (err) {
      console.error("[GestaoTurmas] erro ao salvar turma:", err);
      setErroForm(
        "Não foi possível salvar a turma. Verifique os dados e tente novamente."
      );
    } finally {
      setSalvandoTurma(false);
    }
  }

  async function salvarEdicaoTurma(e) {
    e.preventDefault();
    if (!formValido()) {
      setErroForm("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!turmaEditando?.id) {
      setErroForm("ID da turma não encontrado.");
      return;
    }

    setSalvandoTurma(true);
    setErroForm("");

    try {
      //Usa o endpoint de atualização
      await api.put(`/turma/atualizar/${turmaEditando.id}`, form);

      // Fecha modal e recarrega dados
      fecharModalEditar();
      await carregarTurmas();

      // Feedback de sucesso
      console.log("[GestaoTurmas] Turma atualizada com sucesso!");
    } catch (err) {
      console.error("[GestaoTurmas] erro ao atualizar turma:", err);
      setErroForm(
        err?.response?.data?.message ||
        "Não foi possível atualizar a turma. Verifique os dados e tente novamente."
      );
    } finally {
      setSalvandoTurma(false);
    }
  }

  return (
    <section className="w-full bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6 pb-10 pt-4">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={abrirModal}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-[15px] font-semibold text-white shadow-md hover:brightness-95 active:scale-[.99] transition"
            style={{ backgroundColor: cor }}
          >
            <span className="text-lg leading-none">＋</span>
            Adicionar Turma
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Carregando turmas...
          </div>
        ) : erro ? (
          <div className="py-10 text-center text-sm text-red-600">{erro}</div>
        ) : turmas.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Nenhuma turma cadastrada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {turmas.map((t) => (
              <TurmaCard
                key={t.id || t.nome}
                id={t.id}
                nome={t.nome}
                codigo={
                  t.codigoAcesso || t.codigo || t.codigoTurma || t.codigoTurmaAcesso
                }
                curso={t.curso}
                modalidade={t.modalidade}
                dataInicio={t.dataInicio}
                dataTermino={t.dataTermino}
                capacidade={t.capacidade}
                onEditar={abrirModalEditar}
              />
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={fecharModal} />
          <div className="relative z-50 w-[90%] max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 px-6 py-6">
            <h4 className="text-lg font-semibold text-neutral-900">
              Adicionar turma
            </h4>

            <form onSubmit={salvarTurma} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nome da turma *
                </label>
                <input
                  type="text"
                  className={CLASSES_INPUT}
                  value={form.nome}
                  onChange={(e) => onChange("nome", e.target.value)}
                  placeholder="Ex.: Seduc 1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Curso *
                </label>
                <input
                  type="text"
                  className={CLASSES_INPUT}
                  value={form.curso}
                  onChange={(e) => onChange("curso", e.target.value)}
                  placeholder="Ex.: Banco de dados"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Modalidade *
                </label>
                <input
                  type="text"
                  className={CLASSES_INPUT}
                  value={form.modalidade}
                  onChange={(e) => onChange("modalidade", e.target.value)}
                  placeholder="Ex.: FIC, Técnico..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Data de início *
                  </label>
                  <input
                    type="text"
                    className={CLASSES_INPUT}
                    value={form.dataInicio}
                    onChange={(e) => onChange("dataInicio", e.target.value)}
                    placeholder="Ex.: 2025-11-20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Data de término *
                  </label>
                  <input
                    type="text"
                    className={CLASSES_INPUT}
                    value={form.dataTermino}
                    onChange={(e) => onChange("dataTermino", e.target.value)}
                    placeholder="Ex.: 2026-12-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Capacidade (opcional)
                  </label>
                  <input
                    type="number"
                    className={CLASSES_INPUT}
                    value={form.capacidade}
                    onChange={(e) => onChange("capacidade", e.target.value)}
                    placeholder="Ex.: 40"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    ID do professor (opcional)
                  </label>
                  <input
                    type="number"
                    className={CLASSES_INPUT}
                    value={form.professorId}
                    onChange={(e) => onChange("professorId", e.target.value)}
                    placeholder="Ex.: 7"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  IDs de estudantes (separados por vírgula)
                </label>
                <input
                  type="text"
                  className={CLASSES_INPUT}
                  value={form.estudantesIdsTexto}
                  onChange={(e) =>
                    onChange("estudantesIdsTexto", e.target.value)
                  }
                  placeholder="Ex.: 1, 2, 5, 9"
                />
              </div>

              {erroForm && (
                <p className="text-xs text-red-600 mt-1">{erroForm}</p>
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvandoTurma}
                  className="px-4 py-2 text-sm rounded-md border border-neutral-300 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 disabled:opacity-70 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvandoTurma || !formValido()}
                  className="px-5 py-2 text-sm rounded-md text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95 transition"
                  style={{ backgroundColor: cor }}
                >
                  {salvandoTurma ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {modalEditarAberto && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={fecharModalEditar} />
          <div className="relative z-50 w-[90%] max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 px-6 py-6">
            <h4 className="text-lg font-semibold text-neutral-900">
              Editar turma
            </h4>

            <form onSubmit={salvarEdicaoTurma} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nome da turma *
                </label>
                <input
                  type="text"
                  className={CLASSES_INPUT}
                  value={form.nome}
                  onChange={(e) => onChange("nome", e.target.value)}
                  placeholder="Ex.: Seduc 1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Curso *
                </label>
                <input
                  type="text"
                  className={CLASSES_INPUT}
                  value={form.curso}
                  onChange={(e) => onChange("curso", e.target.value)}
                  placeholder="Ex.: Banco de dados"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Modalidade *
                </label>
                <input
                  type="text"
                  className={CLASSES_INPUT}
                  value={form.modalidade}
                  onChange={(e) => onChange("modalidade", e.target.value)}
                  placeholder="Ex.: FIC, Técnico..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Data de início *
                  </label>
                  <input
                    type="text"
                    className={CLASSES_INPUT}
                    value={form.dataInicio}
                    onChange={(e) => onChange("dataInicio", e.target.value)}
                    placeholder="Ex.: 2025-11-20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Data de término *
                  </label>
                  <input
                    type="text"
                    className={CLASSES_INPUT}
                    value={form.dataTermino}
                    onChange={(e) => onChange("dataTermino", e.target.value)}
                    placeholder="Ex.: 2026-12-20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Capacidade (opcional)
                </label>
                <input
                  type="number"
                  className={CLASSES_INPUT}
                  value={form.capacidade}
                  onChange={(e) => onChange("capacidade", e.target.value)}
                  placeholder="Ex.: 40"
                  min={0}
                />
              </div>

              {erroForm && (
                <p className="text-xs text-red-600 mt-1">{erroForm}</p>
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={fecharModalEditar}
                  disabled={salvandoTurma}
                  className="px-4 py-2 text-sm rounded-md border border-neutral-300 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 disabled:opacity-70 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvandoTurma || !formValido()}
                  className="px-5 py-2 text-sm rounded-md text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95 transition"
                  style={{ backgroundColor: cor }}
                >
                  {salvandoTurma ? "Salvando..." : "Atualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
