import React, { useMemo, useState } from "react";

const COR_VERMELHO = "#AE0000";
const TAMANHO_CODIGO = 5;
const MAX_CONVIDADOS = 9;

function juntarClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

function pegarSegundaFeira(dataAtual = new Date()) {
  const data = new Date(dataAtual);
  const diaSemana = data.getDay();
  const diferenca = (diaSemana === 0 ? -6 : 1) - diaSemana;
  data.setDate(data.getDate() + diferenca);
  data.setHours(0, 0, 0, 0);
  return data;
}

function montarDiasSemana(semanaAdiante = 0) {
  const segunda = pegarSegundaFeira();
  segunda.setDate(segunda.getDate() + semanaAdiante * 7);
  const diasSemana = ["S", "T", "Q", "Q", "S", "S", "D"];
  return [...Array(7)].map((_, i) => {
    const d = new Date(segunda);
    d.setDate(segunda.getDate() + i);
    return {
      diaSemana: diasSemana[i],
      numeroDia: String(d.getDate()).padStart(2, "0"),
      dataCompleta: d,
    };
  });
}

const HORARIOS_INICIO = ["11:50", "13:30", "14:30", "15:30", "16:00", "16:50"];
const HORARIOS_TERMINO = ["14:50", "13:00", "16:00", "16:30", "17:00", "17:30"];

export default function AgendamentoQuadra() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTermino, setHoraTermino] = useState(null);


  const [convidados, setConvidados] = useState([Array(TAMANHO_CODIGO).fill("")]);

  const diasDaSemana = useMemo(
    () => montarDiasSemana(semanaSelecionada === "essa" ? 0 : 1),
    [semanaSelecionada]
  );

  function adicionarConvidado() {
    if (convidados.length < MAX_CONVIDADOS) {
      setConvidados((lista) => [...lista, Array(TAMANHO_CODIGO).fill("")]);
    }
  }

  function mudarDigito(indConvidado, indDigito, valor) {
    const char = valor.slice(-1);
    setConvidados((lista) =>
      lista.map((cod, i) =>
        i === indConvidado
          ? cod.map((d, j) => (j === indDigito ? char : d))
          : cod
      )
    );
  }

  function cancelar() {
    setDiaSelecionado(0);
    setHoraInicio(null);
    setHoraTermino(null);
    setConvidados([Array(TAMANHO_CODIGO).fill("")]);
  }

  function confirmar() {
    if (!horaInicio || !horaTermino) {
      alert("Selecione o horário de início e término.");
      return;
    }
    const paraMinutos = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    if (paraMinutos(horaTermino) <= paraMinutos(horaInicio)) {
      alert("O horário de término deve ser depois do início.");
      return;
    }

    const codigosConvidados = convidados.map((arr) => arr.join(""));
    const dados = {
      local: "Quadra",
      semana: semanaSelecionada === "essa" ? "Essa semana" : "Próxima semana",
      data: diasDaSemana[diaSelecionado].dataCompleta.toISOString(),
      inicio: horaInicio,
      termino: horaTermino,
      codigosConvidados,
      qtdeConvidados: convidados.length,
    };
    console.log("Agendamento:", dados);
    alert("Agendamento pronto! Veja no console.");
  }

  const estiloBotaoSemana =
    "px-5 py-3 rounded-md text-sm md:text-base select-none transition-colors duration-150 outline-none focus:ring-0";
  const estiloBotaoHorario =
    "min-w-[96px] text-center px-4 py-3 rounded-md text-sm md:text-base outline-none focus:ring-0 transition-colors duration-150";

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0B0B0B] flex justify-center">
      <div className="w-full max-w-5xl px-4 md:px-8 py-8">
        {/* Cabeçalho */}
        <div
          className="w-full rounded-md text-white px-6 py-5 mb-6 text-center"
          style={{ backgroundColor: COR_VERMELHO }}
        >
          <h1 className="text-xl md:text-2xl font-medium">
            Agendamento <span className="opacity-70">–</span>{" "}
            <span className="font-semibold">Quadra</span>
          </h1>
        </div>

        {/* Seleção semana e data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSemanaSelecionada("essa")}
              className={juntarClasses(
                estiloBotaoSemana,
                semanaSelecionada === "essa"
                  ? "bg-[#AE0000] text-white"
                  : "bg-[#F6F6F6] text-gray-700 hover:bg-[#AE0000] hover:text-white"
              )}
            >
              Essa semana
            </button>
            <button
              type="button"
              onClick={() => setSemanaSelecionada("proxima")}
              className={juntarClasses(
                estiloBotaoSemana,
                semanaSelecionada === "proxima"
                  ? "bg-[#AE0000] text-white"
                  : "bg-[#F6F6F6] text-gray-700 hover:bg-[#AE0000] hover:text-white"
              )}
            >
              Próxima semana
            </button>
          </div>

          <div className="hidden md:block" />

          <div className="flex md:justify-end items-center gap-2 text-black dark:text-white">
            <span className="font-medium mr-1">Data:</span>
            <div className="flex gap-2">
              {diasDaSemana.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDiaSelecionado(idx)}
                  className={juntarClasses(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-md text-xs outline-none focus:ring-0 transition-colors duration-150",
                    diaSelecionado === idx
                      ? "bg-[#AE0000] text-white"
                      : "bg-[#F6F6F6] text-gray-700 hover:bg-[#AE0000] hover:text-white"
                  )}
                >
                  <span className="text-[11px]">{d.diaSemana}</span>
                  <span className="text-sm font-medium">{d.numeroDia}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Início */}
          <section>
            <h3 className="font-medium mb-3 text-black dark:text-white">Horário de início:</h3>
            <div className="bg-[#F3F3F3] rounded-md p-4">
              <div className="grid grid-cols-3 gap-3">
                {HORARIOS_INICIO.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setHoraInicio(t)}
                    className={juntarClasses(
                      estiloBotaoHorario,
                      horaInicio === t
                        ? "bg-[#C61919] text-white"
                        : "bg-white text-[#1E1E1E] hover:bg-[#AE0000] hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Código de convidado */}
            <div className="mt-6">
              <h3 className="font-medium mb-2 text-black dark:text-white">Código de convidado:</h3>

              {/* Lista de convidados */}
              <div className="flex flex-col gap-3">
                {convidados.map((codigo, iConvidado) => (
                  <div
                    key={iConvidado}
                    className="flex items-center gap-2 flex-wrap"
                  >
                    {codigo.map((dig, iDig) => (
                      <input
                        key={iDig}
                        value={dig}
                        onChange={(e) =>
                          mudarDigito(iConvidado, iDig, e.target.value)
                        }
                        className="w-12 h-12 border bg-white text-black border-gray-300 rounded-md text-center text-lg outline-none focus:ring-0 focus:border-gray-400"
                        maxLength={1}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600 dark:text-white">
                      Convidado {iConvidado + 1}
                    </span>
                  </div>
                ))}

                {/* Botão para adicionar outro convidado */}
                <button
                  type="button"
                  onClick={adicionarConvidado}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white text-black rounded-md text-base outline-none hover:bg-[#AE0000] hover:text-white transition-colors duration-150 disabled:opacity-40"
                  disabled={convidados.length >= MAX_CONVIDADOS}
                  title="Adicionar convidado"
                >
                  +
                </button>
              </div>

              <p className="text-[12px] mt-2 text-black dark:text-white">
                <span className="text-[#AE0000] font-semibold">OBS:</span>{" "}
                Você poderá convidar seus amigos para aproveitar a reserva. O
                máximo é de {MAX_CONVIDADOS} convidados.
              </p>
            </div>
          </section>

          {/* Término */}
          <section>
            <h3 className="font-medium mb-3 text-black dark:text-white">Horário de término:</h3>
            <div className="bg-[#F3F3F3] rounded-md p-4">
              <div className="grid grid-cols-3 gap-3">
                {HORARIOS_TERMINO.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setHoraTermino(t)}
                    className={juntarClasses(
                      estiloBotaoHorario,
                      horaTermino === t
                        ? "bg-[#C61919] text-white"
                        : "bg-white text-[#1E1E1E] hover:bg-[#AE0000] hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Botões */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 md:justify-end">
          <button
            type="button"
            onClick={cancelar}
            className="px-6 py-3 rounded-md bg-[#EDEDED] text-[#1E1E1E] outline-none focus:ring-0 hover:bg-[#AE0000] hover:text-white transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            className="px-6 py-3 rounded-md text-white outline-none focus:ring-0 transition-colors duration-150"
            style={{ backgroundColor: COR_VERMELHO }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
