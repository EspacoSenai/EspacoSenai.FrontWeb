import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../service/api";
import setinha from "../../assets/sairdomodal.svg";

const FONT_BASE = "font-poppins";
const TXT_LABEL =
  "text-sm font-medium text-gray-700 block w-full text-left " + FONT_BASE;
const TXT_INPUT = "text-[15px] font-normal text-black";
const TXT_TAG = "text-sm font-regular " + FONT_BASE;

const CL_INPUT = `w-full h-12 rounded-md bg-gray-200 border border-gray-200 px-4 ${TXT_INPUT} placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-[#B10404] ${FONT_BASE}`;
const CL_TEXTAREA = `w-full h-[140px] rounded-md bg-gray-200 border border-gray-200 px-4 py-3 ${TXT_INPUT} placeholder-gray-400 shadow-sm outline-none resize-none focus:ring-2 focus:ring-[#B10404] ${FONT_BASE}`;
const CL_TAG = `px-3 py-2 rounded-md border shadow-sm transition-colors duration-150 transform transition-transform duration-200 will-change-transform hover:scale-105 hover:z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B10404]/20 ${TXT_TAG} hover:bg-[#B10404] hover:text-white hover:border-[#B10404]`;
const CL_TAG_OFF = "bg-transparent text-gray-700 border-gray-200";
const CL_TAG_ON = "bg-[#B10404] text-white border-[#B10404]";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const AMBIENTE_CREATE_PATH = "/ambiente/salvar";

export default function CriarSala() {
  // Campos do back
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponibilidade, setDisponibilidade] = useState(""); // DISPONIVEL / INDISPONIVEL
  const [aprovacao, setAprovacao] = useState(""); // AUTOMATICA / MANUAL
  const [responsavelId, setResponsavelId] = useState("");
  const [qtdPessoas, setQtdPessoas] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const formValido = useMemo(() => {
    if (!nome.trim()) return false;
    if (!descricao.trim()) return false;
    if (!disponibilidade) return false;
    if (!aprovacao) return false;

    const q = Number(qtdPessoas);
    if (!q || q <= 0) return false;

    const resp = Number(responsavelId);
    if (!resp || resp <= 0) return false;

    return true;
  }, [nome, descricao, disponibilidade, aprovacao, qtdPessoas, responsavelId]);

  function handleQtdPessoas(e) {
    const raw = e.target.value;
    if (raw === "") {
      setQtdPessoas("");
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    setQtdPessoas(clamp(Math.floor(n), 1, 500));
  }

  function handleResponsavel(e) {
    const raw = e.target.value;
    if (raw === "") {
      setResponsavelId("");
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    setResponsavelId(clamp(Math.floor(n), 1, 999999));
  }

  async function criar(e) {
    e.preventDefault();
    if (!formValido || loading) return;

    setErro("");
    setSucesso("");
    setLoading(true);

    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      disponibilidade, // "DISPONIVEL" | "INDISPONIVEL"
      aprovacao,       // "AUTOMATICA" | "MANUAL"
      responsaveisIds: Number(responsavelId), // igual seu JSON de exemplo
      qtdPessoas: Number(qtdPessoas),
    };

    console.log("[CriarSala] payload:", payload);

    try {
      const resp = await api.post(AMBIENTE_CREATE_PATH, payload);

      console.log("[CriarSala] ambiente criado:", resp.data);
      setSucesso("Ambiente criado com sucesso!");

      // limpa formulário
      setNome("");
      setDescricao("");
      setDisponibilidade("");
      setAprovacao("");
      setResponsavelId("");
      setQtdPessoas("");
    } catch (err) {
      console.error("[CriarSala] erro ao criar ambiente:", err);

      let msg =
        "Não foi possível criar o ambiente. Verifique os dados e tente novamente.";
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 404) {
        msg =
          "Rota de criação de ambiente não encontrada (404). Confira se a URL do back está correta.";
      }

      if (data) {
        console.error("[CriarSala] body do erro:", data);
        if (typeof data === "string") {
          msg = data;
        } else if (data.mensagem) {
          msg = data.mensagem;
        } else if (data.message) {
          msg = data.message;
        }
      }

      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F5F5F5] font-poppins overflow-x-hidden">
      {/* Topo */}
      <header className="relative z-10 w-full bg-[#B10404]">
        <div className="mx-auto max-w-6xl h-14 md:h-16 flex items-center justify-center px-4">
          <Link to="/salas-administradores" className="absolute left-4">
            <img
              src={setinha}
              alt="Voltar"
              className="w-8 h-8 md:w-9 md:h-9"
            />
          </Link>
          <h1 className="text-white text-lg md:text-xl font-medium">
            Criar Ambiente
          </h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="relative z-10 mx-auto max-w-6xl px-5 md:px-6 pt-12 pb-6 md:pt-16 md:pb-8">
        <form onSubmit={criar} className="space-y-8">
          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            {/* Coluna esquerda – disponibilidade e aprovação */}
            <div className="space-y-9">
              {/* Disponibilidade */}
              <div className="space-y-2 text-left w-full">
                <p className={TXT_LABEL}>Disponibilidade:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Disponível", value: "DISPONIVEL" },
                    { label: "Indisponível", value: "INDISPONIVEL" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDisponibilidade(opt.value)}
                      className={`${CL_TAG} ${
                        disponibilidade === opt.value
                          ? CL_TAG_ON
                          : CL_TAG_OFF
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aprovação */}
              <div className="space-y-2 text-left w-full">
                <p className={TXT_LABEL}>Aprovação:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Manual", value: "MANUAL" },
                    { label: "Automática", value: "AUTOMATICA" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAprovacao(opt.value)}
                      className={`${CL_TAG} ${
                        aprovacao === opt.value ? CL_TAG_ON : CL_TAG_OFF
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsável */}
              <div className="space-y-2 text-left w-full">
                <label className={TXT_LABEL}>ID do responsável:</label>
                <input
                  type="number"
                  min={1}
                  className={CL_INPUT}
                  value={responsavelId}
                  onChange={handleResponsavel}
                  placeholder="Ex.: 2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use o ID do usuário responsável pelo ambiente.
                </p>
              </div>
            </div>

            {/* Coluna direita – nome, descrição, capacidade */}
            <div className="space-y-9 w-full md:max-w-[420px] md:ml-auto">
              <div className="space-y-2 text-left w-full">
                <label className={TXT_LABEL}>Nome do ambiente:</label>
                <input
                  className={CL_INPUT}
                  placeholder="Ex.: Auditório, Quadra, Laboratório 3..."
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="space-y-2 text-left w-full">
                <label className={TXT_LABEL}>Descrição:</label>
                <textarea
                  className={CL_TEXTAREA}
                  placeholder="Descreva o espaço, finalidade e observações importantes."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="space-y-2 text-left w-full">
                <label className={TXT_LABEL}>Capacidade de pessoas:</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  className="w-[90px] h-11 rounded-md bg-gray-200 border border-gray-200 px-3 text-[15px] text-black text-center shadow-sm outline-none focus:ring-2 focus:ring-[#B10404]"
                  value={qtdPessoas}
                  placeholder="50"
                  onChange={handleQtdPessoas}
                />
              </div>
            </div>
          </div>

          {/* Mensagens */}
          {(erro || sucesso) && (
            <div className="pt-2">
              {erro && (
                <p className="text-sm text-red-600 font-medium">{erro}</p>
              )}
              {sucesso && (
                <p className="text-sm text-green-700 font-medium">
                  {sucesso}
                </p>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="pt-4 flex justify-end gap-3">
            <Link
              to="/salas-administradores"
              className="min-w-[120px] rounded-md border border-gray-300 bg-white text-gray-800 py-1.5 px-5 text-base shadow-sm hover:bg-gray-100 transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={!formValido || loading}
              className={`min-w-[140px] rounded-md bg-[#B10404] text-white py-1.5 px-6 text-base shadow-sm hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity`}
            >
              {loading ? "Salvando..." : "Criar ambiente"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
