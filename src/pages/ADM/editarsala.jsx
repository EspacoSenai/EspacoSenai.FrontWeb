// src/pages/Salas/EditarSala.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { atualizarAmbiente } from "../../service/ambiente";
import { api } from "../../service/api";

const FONT_BASE = "font-poppins";
const TXT_LABEL =
  "text-sm font-medium text-gray-700 block w-full text-left mb-1 " + FONT_BASE;
const CL_INPUT =
  "w-full h-10 rounded-md bg-gray-100 border border-gray-200 px-3 text-[15px] text-black shadow-sm outline-none focus:ring-2 focus:ring-[#B10404] " +
  FONT_BASE;
const CL_TEXTAREA =
  "w-full h-28 rounded-md bg-gray-100 border border-gray-200 px-3 py-2 text-[15px] text-black shadow-sm outline-none resize-none focus:ring-2 focus:ring-[#B10404] " +
  FONT_BASE;

const CL_TAG_BASE =
  "px-3 py-2 rounded-md border text-sm shadow-sm cursor-pointer transition-colors " +
  FONT_BASE;
const CL_TAG_ON = "bg-[#B10404] text-white border-[#B10404]";
const CL_TAG_OFF = "bg-white text-gray-700 border-gray-200";

export default function EditarSala() {
  const { id } = useParams(); // rota tipo: /editar-sala/:id
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("DISPONIVEL");
  const [aprovacao, setAprovacao] = useState("MANUAL");
  const [qtdPessoas, setQtdPessoas] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const formValido =
    nome.trim() && descricao.trim() && Number(qtdPessoas) > 0;

  // ============ BUSCAR SALA PELO ID ============
  useEffect(() => {
    let alive = true;

    if (!id) {
      setCarregando(false);
      setErro("ID da sala inválido.");
      return;
    }

    (async () => {
      try {
        setCarregando(true);
        setErro("");

        // ajusta o caminho se o seu back for diferente
        const resp = await api.get(`/ambiente/buscar/${id}`);
        const data = resp?.data ?? resp;

        if (!alive) return;

        console.log("[EditarSala] ambiente carregado:", data);

        setNome(data?.nome || "");
        setDescricao(data?.descricao || "");

        // tenta mapear campos que possam ter nomes diferentes no back
        setDisponibilidade(
          (data?.disponibilidade || data?.status || "DISPONIVEL").toUpperCase()
        );
        setAprovacao(
          (data?.aprovacao || data?.tipoAprovacao || "MANUAL").toUpperCase()
        );

        setQtdPessoas(
          data?.qtdPessoas != null && data?.qtdPessoas !== ""
            ? Number(data.qtdPessoas)
            : ""
        );
      } catch (err) {
        console.error("[EditarSala] Erro ao buscar ambiente:", err);
        if (!alive) return;
        setErro(
          "Não foi possível carregar os dados da sala. Tente novamente mais tarde."
        );
      } finally {
        if (alive) setCarregando(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  // ============ HANDLERS ============
  function handleQtdChange(e) {
    const raw = e.target.value;
    if (raw === "") {
      setQtdPessoas("");
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n) || n <= 0) return;
    setQtdPessoas(n);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formValido || !id) return;

    try {
      setSalvando(true);
      setErro("");

      await atualizarAmbiente(id, {
        nome,
        descricao,
        disponibilidade, // "DISPONIVEL" ou "INDISPONIVEL"
        aprovacao, // "MANUAL" ou "AUTOMATICA"
        qtdPessoas: Number(qtdPessoas),
      });

      alert("Sala atualizada com sucesso!");
      navigate("/salas-coordenadores");
    } catch (err) {
      console.error("[EditarSala] Erro ao atualizar sala:", err);

      // se o back mandar mensagem na response, tenta mostrar
      const msgBack =
        err?.response?.data?.message ||
        err?.response?.data?.mensagem ||
        err?.message;

      alert(
        `Erro ao atualizar sala.${
          msgBack ? " Detalhes: " + String(msgBack) : ""
        }`
      );
    } finally {
      setSalvando(false);
    }
  }

  // ============ JSX ============
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Cabeçalho simples */}
      <header className="w-full bg-[#B10404]">
        <div className="mx-auto max-w-4xl h-14 flex items-center justify-center px-4 relative">
          <Link to="/salas-coordenadores" className="absolute left-4">
            <img
              src="/src/assets/sairdomodal.svg"
              alt="Voltar"
              className="w-7 h-7"
            />
          </Link>
          <h1 className="text-white text-lg font-medium">Editar Sala</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex items-start justify-center mt-8 px-4 pb-8">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md px-5 py-6">
          {/* mensagens de status */}
          {carregando && (
            <p className="text-sm text-gray-500 mb-4">
              Carregando dados da sala...
            </p>
          )}
          {erro && (
            <p className="text-sm text-red-600 mb-4">
              {erro}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className={TXT_LABEL}>Nome:</label>
              <input
                className={CL_INPUT}
                placeholder="Ex.: Quadra de esportes"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={carregando || salvando}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className={TXT_LABEL}>Descrição:</label>
              <textarea
                className={CL_TEXTAREA}
                placeholder="Ex.: Espaço ao ar livre para práticas esportivas."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={carregando || salvando}
              />
            </div>

            {/* Disponibilidade */}
            <div>
              <p className={TXT_LABEL}>Disponibilidade:</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`${CL_TAG_BASE} ${
                    disponibilidade === "DISPONIVEL"
                      ? CL_TAG_ON
                      : CL_TAG_OFF
                  }`}
                  onClick={() => setDisponibilidade("DISPONIVEL")}
                  disabled={carregando || salvando}
                >
                  Disponível
                </button>
                <button
                  type="button"
                  className={`${CL_TAG_BASE} ${
                    disponibilidade === "INDISPONIVEL"
                      ? CL_TAG_ON
                      : CL_TAG_OFF
                  }`}
                  onClick={() => setDisponibilidade("INDISPONIVEL")}
                  disabled={carregando || salvando}
                >
                  Indisponível
                </button>
              </div>
            </div>

            {/* Aprovação */}
            <div>
              <p className={TXT_LABEL}>Aprovação:</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`${CL_TAG_BASE} ${
                    aprovacao === "MANUAL" ? CL_TAG_ON : CL_TAG_OFF
                  }`}
                  onClick={() => setAprovacao("MANUAL")}
                  disabled={carregando || salvando}
                >
                  Manual
                </button>
                <button
                  type="button"
                  className={`${CL_TAG_BASE} ${
                    aprovacao === "AUTOMATICA" ? CL_TAG_ON : CL_TAG_OFF
                  }`}
                  onClick={() => setAprovacao("AUTOMATICA")}
                  disabled={carregando || salvando}
                >
                  Automática
                </button>
              </div>
            </div>

            {/* Quantidade de pessoas */}
            <div>
              <label className={TXT_LABEL}>Capacidade (qtdPessoas):</label>
              <input
                type="number"
                min={1}
                className={CL_INPUT + " max-w-[120px]"}
                placeholder="Ex.: 5"
                value={qtdPessoas}
                onChange={handleQtdChange}
                disabled={carregando || salvando}
              />
            </div>

            {/* Botão */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!formValido || salvando || carregando}
                className={`min-w-[130px] rounded-md bg-[#B10404] text-white py-2 px-5 text-sm md:text-base shadow-sm transition-opacity ${
                  !formValido || salvando || carregando
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:opacity-95"
                }`}
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
