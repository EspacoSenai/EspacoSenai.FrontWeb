import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarTurmaPorId, atualizarTurma } from "../../service/turma";
import setaLeft from "../../assets/setaleft.svg";
import setawhiteleft from "../../assets/setawhiteleft.svg";

const COR = "#AE0000";

// helper pra mostrar data BR quando o input está em modo texto
const formatDateBr = (iso) => {
  if (!iso) return "";
  if (iso.includes("/")) return iso; 
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};

// mapear modalidade do back -> texto do botão
const tipoFromModalidade = (modalidade) => {
  const m = String(modalidade || "").toUpperCase();
  if (m === "FIC") return "Fic";
  if (m === "FACULDADE") return "Faculdade";
  if (m === "TECNICO") return "Técnico";
  return "";
};

export default function EditarVersala() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [materia, setMateria] = useState("");
  const [nomeTurma, setNomeTurma] = useState("");
  const [inicio, setInicio] = useState("");  
  const [fim, setFim] = useState("");  
  const [tipo, setTipo] = useState("");
  const [capacidade, setCapacidade] = useState(""); 
  const [inicioType, setInicioType] = useState("text");
  const [fimType, setFimType] = useState("text");

  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const formularioValido = () =>
    materia && nomeTurma && inicio && fim && tipo;

  // ========= CARREGAR TURMA PELO ID =========
  useEffect(() => {
    let alive = true;

    if (!id) {
      setCarregando(false);
      setErro("ID da turma inválido.");
      return;
    }

    (async () => {
      try {
        setCarregando(true);
        setErro("");
        setSucesso("");

        const data = await buscarTurmaPorId(id);
        if (!alive) return;

        console.log("[EditarVersala] turma carregada:", data);

        setMateria(data?.curso || "");
        setNomeTurma(data?.nome || "");
        setInicio(data?.dataInicio || "");
        setFim(data?.dataTermino || "");
        setTipo(tipoFromModalidade(data?.modalidade));
        setCapacidade(
          data?.capacidade != null && data?.capacidade !== ""
            ? String(data.capacidade)
            : ""
        );
      } catch (err) {
        console.error("[EditarVersala] erro ao buscar turma:", err);
        if (!alive) return;
        setErro(
          "Não foi possível carregar os dados da turma. Tente novamente mais tarde."
        );
      } finally {
        if (alive) setCarregando(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  // ========= SUBMIT =========
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formularioValido()) return;
    if (!id) {
      setErro("ID da turma inválido.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      await atualizarTurma(id, {
        materia,
        nomeTurma,
        tipo,
        dataInicioISO: inicio,
        dataTerminoISO: fim,
        capacidade, // ainda enviamos pro back, mesmo sem editar na tela
      });

      setSucesso("Turma atualizada com sucesso!");
      // volta pra tela anterior depois de um pequeno delay
      setTimeout(() => {
        navigate(-1);
      }, 800);
    } catch (err) {
      console.error("[EditarVersala] erro ao atualizar turma:", err);
      const msgBack =
        err?.response?.data?.message ||
        err?.response?.data?.mensagem ||
        err?.message;

      setErro(
        msgBack
          ? `Erro ao salvar alterações: ${String(msgBack)}`
          : "Erro ao salvar alterações. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  // valores mostrados nos inputs de data
  const valueInicio = inicioType === "text" ? formatDateBr(inicio) : inicio;
  const valueFim = fimType === "text" ? formatDateBr(fim) : fim;

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <style>
        {`
          input.date-field::-webkit-datetime-edit { text-transform: uppercase; }
          input.date-field::-webkit-datetime-edit-fields-wrapper { text-transform: uppercase; }
          input.date-field::-webkit-calendar-picker-indicator { filter: brightness(0); }
        `}
      </style>

      {/* Cabeçalho */}
      <header className="w-full" style={{ backgroundColor: COR }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center">
          {/* Botão Voltar usando o SVG e sem fundo extra */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 p-0 border-none bg-transparent"
            aria-label="Voltar"
          >
            <img src={document.documentElement.classList.contains('dark') ? setawhiteleft : setaLeft} alt="" className="w-6 h-6" />
          </button>

          <div className="flex-1 flex justify-center">
            <h1 className="text-white text-lg md:text-xl font-semibold">
              Salas
            </h1>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="w-full px-4 md:px-8 py-8 md:py-14">
        <div className="bg-white rounded-none shadow-none p-4 md:p-8 min-h-screen max-w-7xl mx-auto">
          <p className="text-center text-sm md:text-lg text-gray-900 -mt-4 md:-mt-6 px-2">
            Você pode visualizar e editar as informações da turma de forma
            simples e <br className="hidden md:block" />
            atualizada!
          </p>
          <div
            className="w-[150px] md:w-[200px] mx-auto mt-3 mb-6 md:mb-8 rounded-full"
            style={{ borderBottom: `4px solid ${COR}` }}
          />

          {/* Avisos */}
          {carregando && (
            <p className="text-center text-sm text-gray-500 mb-4">
              Carregando informações da turma...
            </p>
          )}

          {erro && (
            <p className="text-center text-sm md:text-base text-red-600 mb-4">
              {erro}
            </p>
          )}

          {sucesso && !erro && (
            <p className="text-center text-sm md:text-base text-green-700 mb-4">
              {sucesso}
            </p>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Coluna Esquerda */}
              <div className="space-y-8 md:space-y-12 w-full">
                {/* Matéria */}
                <div className="w-full">
                  <label className="block text-gray-900 font-regular text-base md:text-lg mb-2 text-left md:ml-[90px]">
                    Matéria:
                  </label>
                  <input
                    type="text"
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                    placeholder="Front-End"
                    autoComplete="off"
                    className="w-full md:w-[370px] bg-gray-100 rounded-md pl-3 pr-4 py-2.5 text-sm md:text-base text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#AE0000]"
                    disabled={salvando || carregando}
                  />
                </div>

                {/* Nome da turma */}
                <div className="w-full">
                  <label className="block text-gray-900 font-regular text-base md:text-lg mb-2 text-left md:ml-[90px]">
                    Nome da turma:
                  </label>
                  <input
                    type="text"
                    value={nomeTurma}
                    onChange={(e) => setNomeTurma(e.target.value)}
                    placeholder="Seduc 1"
                    autoComplete="off"
                    className="w-full md:w-[370px] bg-gray-100 rounded-md pl-3 pr-4 py-2.5 text-sm md:text-base text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#AE0000]"
                    disabled={salvando || carregando}
                  />
                </div>

                {/* Tipo */}
                <div className="w-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:ml-[90px]">
                    <span className="text-gray-900 font-regular text-base md:text-lg whitespace-nowrap">
                      Tipo:
                    </span>
                    <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                      {["Fic", "Faculdade", "Técnico"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTipo(t)}
                          disabled={salvando || carregando}
                          className={
                            "px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium border transition-colors " +
                            (tipo === t
                              ? "text-white border-transparent"
                              : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200")
                          }
                          style={
                            tipo === t ? { backgroundColor: COR } : undefined
                          }
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-8 md:space-y-10 w-full">
                {/* Duração */}
                <div className="w-full md:ml-[245px]">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <span className="text-gray-900 font-regular text-base md:text-lg whitespace-nowrap">
                      Duração:
                    </span>
                    <div className="flex flex-col gap-4 w-full md:w-auto">
                      <input
                        id="duracao-inicio"
                        type={inicioType}
                        value={valueInicio}
                        onFocus={() => setInicioType("date")}
                        onBlur={(e) => {
                          if (!e.target.value) setInicioType("text");
                        }}
                        onChange={(e) => setInicio(e.target.value)}
                        placeholder="Início"
                        autoComplete="off"
                        className="date-field w-full md:w-[150px] bg-gray-100 rounded-md px-4 py-2.5 text-sm md:text-base text-gray-900 outline-none focus:ring-2 focus:ring-[#AE0000] placeholder-gray-500"
                        disabled={salvando || carregando}
                      />
                      <input
                        id="duracao-fim"
                        type={fimType}
                        value={valueFim}
                        onFocus={() => setFimType("date")}
                        onBlur={(e) => {
                          if (!e.target.value) setFimType("text");
                        }}
                        onChange={(e) => setFim(e.target.value)}
                        placeholder="Fim"
                        autoComplete="off"
                        className="date-field w-full md:w-[150px] bg-gray-100 rounded-md px-4 py-2.5 text-sm md:text-base text-gray-900 outline-none focus:ring-2 focus:ring-[#AE0000] placeholder-gray-500"
                        disabled={salvando || carregando}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Editar */}
            <div className="flex justify-center md:justify-end mt-12 md:mt-24 md:px-12">
              <button
                type="submit"
                disabled={!formularioValido() || salvando || carregando}
                className="min-w-[120px] md:min-w-[140px] rounded-md text-white py-2 md:py-1 px-5 md:px-6 text-sm md:text-base hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
                style={{ backgroundColor: COR }}
                aria-disabled={!formularioValido() || salvando || carregando}
              >
                {salvando ? "Editando..." : "Editar"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
