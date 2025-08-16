import React, { useEffect, useMemo, useRef, useState } from "react";

import sucessoIcon from "../assets/sucesso.svg";

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

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasSemana = ["S", "T", "Q", "Q", "S", "S"]; // seg..sáb
  return [...Array(6)].map((_, i) => {
    const d = new Date(segunda);
    d.setDate(segunda.getDate() + i);
    const desabilitado = semanaAdiante === 0 ? d < hoje : false;
    return {
      diaSemana: diasSemana[i],
      numeroDia: String(d.getDate()).padStart(2, "0"),
      dataCompleta: d,
      desabilitado,
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

  // Modal
  const [modal, setModal] = useState({
    aberto: false,
    tipo: "success",
    titulo: "",
    mensagem: "",
  });
  const modalBtnRef = useRef(null);

  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current = convidados.map(
      (codigo, i) => inputsRef.current[i] || Array(TAMANHO_CODIGO).fill(null)
    );
  }, [convidados]);

  const diasDaSemana = useMemo(
    () => montarDiasSemana(semanaSelecionada === "essa" ? 0 : 1),
    [semanaSelecionada]
  );

  // so pode selecionar dia válido
  useEffect(() => {
    const idxValido = diasDaSemana.findIndex((d) => !d.desabilitado);
    if (idxValido === -1 && semanaSelecionada === "essa") {
      setSemanaSelecionada("proxima");
      setDiaSelecionado(0);
    } else if (idxValido !== -1 && diasDaSemana[diaSelecionado]?.desabilitado) {
      setDiaSelecionado(idxValido);
    }
  }, [diasDaSemana, diaSelecionado, semanaSelecionada]);

  // ESC fecha modal
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && fecharModal();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);
  useEffect(() => {
    if (modal.aberto) {
      setTimeout(() => modalBtnRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [modal.aberto]);

  function abrirModal(tipo, titulo, mensagem) {
    setModal({ aberto: true, tipo, titulo, mensagem });
  }
  function fecharModal() {
    setModal((m) => ({ ...m, aberto: false }));
  }

  function adicionarConvidado() {
    if (convidados.length < MAX_CONVIDADOS) {
      setConvidados((lista) => [...lista, Array(TAMANHO_CODIGO).fill("")]);
    } else {
      abrirModal(
        "warning",
        "Limite de convidados atingido",
        `O máximo é de ${MAX_CONVIDADOS} convidados.`
      );
    }
  }

  function removerConvidado(indConvidado) {
    setConvidados((lista) => lista.filter((_, i) => i !== indConvidado));
  }

  function normalizaChar(v) {
    const char = v.slice(-1);
    return char.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  }
  function mudarDigito(indConvidado, indDigito, valor) {
    const char = normalizaChar(valor);
    setConvidados((lista) =>
      lista.map((cod, i) =>
        i === indConvidado
          ? cod.map((d, j) => (j === indDigito ? char : d))
          : cod
      )
    );
  }

  // auto avanco quando digita no codigo de convidado e copiar e colar
  function handleChange(iConvidado, iDig, e) {
    const v = e.target.value;

    if (v.length > 1) {
      const chars = v.replace(/[^0-9A-Za-z]/g, "").toUpperCase().split("");
      if (chars.length) {
        setConvidados((lista) =>
          lista.map((cod, i) => {
            if (i !== iConvidado) return cod;
            const novo = [...cod];
            let k = iDig;
            for (const c of chars) {
              if (k >= TAMANHO_CODIGO) break;
              novo[k] = c;
              k++;
            }
            return novo;
          })
        );
        const next = Math.min(iDig + chars.length, TAMANHO_CODIGO - 1);
        inputsRef.current[iConvidado][next]?.focus();
      }
      return;
    }

    mudarDigito(iConvidado, iDig, v);
    if (v && v.trim() !== "" && iDig < TAMANHO_CODIGO - 1) {
      inputsRef.current[iConvidado][iDig + 1]?.focus();
    }
  }

  function handleKeyDown(iConvidado, iDig, e) {
    if (e.key === "Backspace") {
      const valor = convidados[iConvidado][iDig];
      if (!valor && iDig > 0) {
        const prev = iDig - 1;
        inputsRef.current[iConvidado][prev]?.focus();
        setConvidados((lista) =>
          lista.map((cod, i) =>
            i === iConvidado
              ? cod.map((d, j) => (j === prev ? "" : d))
              : cod
          )
        );
      }
    }
    if (e.key === "ArrowLeft" && iDig > 0) {
      inputsRef.current[iConvidado][iDig - 1]?.focus();
    }
    if (e.key === "ArrowRight" && iDig < TAMANHO_CODIGO - 1) {
      inputsRef.current[iConvidado][iDig + 1]?.focus();
    }
  }

  function cancelar() {
    setDiaSelecionado(0);
    setHoraInicio(null);
    setHoraTermino(null);
    setConvidados([Array(TAMANHO_CODIGO).fill("")]);
  }

  function confirmar() {
    if (!horaInicio || !horaTermino) {
      abrirModal(
        "error",
        "Selecione os horários",
        "Escolha o horário de início e o de término para continuar."
      );
      return;
    }
    const dia = diasDaSemana[diaSelecionado];
    if (!dia || dia.desabilitado) {
      abrirModal(
        "error",
        "Data inválida",
        "Selecione uma data válida para agendar."
      );
      return;
    }
    const paraMinutos = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    if (paraMinutos(horaTermino) <= paraMinutos(horaInicio)) {
      abrirModal(
        "error",
        "Horários inconsistentes",
        "O término precisa ser depois do início."
      );
      return;
    }

    const codigosConvidados = convidados.map((arr) => arr.join(""));
    const dados = {
      local: "Quadra",
      semana: semanaSelecionada === "essa" ? "Essa semana" : "Próxima semana",
      data: dia.dataCompleta.toISOString(),
      inicio: horaInicio,
      termino: horaTermino,
      codigosConvidados,
      qtdeConvidados: convidados.length,
    };
    console.log("Agendamento:", dados);

    abrirModal(
      "success",
      "Reserva realizada com sucesso!",
      "Sua solicitação foi enviada e está aguardando aprovação."
    );
  }

  const estiloBotaoSemana =
    "px-5 py-3 rounded-md text-sm md:text-base select-none transition-colors duration-150 outline-none focus:ring-0";
  const estiloBotaoHorario =
    "min-w-[96px] text-center px-4 py-3 rounded-md text-sm md:text-base outline-none focus:ring-0 transition-colors duration-150";

  // visual dos modal
  const iconsByType = {
    success: {
      bg: "bg-green-100",
      color: "text-green-600",
      // svg não será usado no success (usa sua imagem), mas mantemos a estrutura
      svg: null,
    },
    error: {
      bg: "bg-red-100",
      color: "text-red-600",
      svg: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </>
      ),
    },
    warning: {
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      svg: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </>
      ),
    },
  };

  const ic = iconsByType[modal.tipo];

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
              {diasDaSemana.map((d, idx) => {
                const selecionado = diaSelecionado === idx;
                const baseClasse =
                  "flex flex-col items-center justify-center w-12 h-12 rounded-md text-xs outline-none focus:ring-0 transition-colors duration-150";
                const classeVisual = d.desabilitado
                  ? "bg-[#E5E5E5] text-gray-400 cursor-not-allowed opacity-70"
                  : selecionado
                  ? "bg-[#AE0000] text-white"
                  : "bg-[#F6F6F6] text-gray-700 hover:bg-[#AE0000] hover:text-white";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !d.desabilitado && setDiaSelecionado(idx)}
                    className={juntarClasses(baseClasse, classeVisual)}
                    disabled={d.desabilitado}
                    title={d.desabilitado ? "Dia indisponível (já passou)" : "Selecionar data"}
                  >
                    <span className="text-[11px]">{d.diaSemana}</span>
                    <span className="text-sm font-medium">{d.numeroDia}</span>
                  </button>
                );
              })}
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
                    {/* Toggle de exclusão */}
                    <input
                      type="checkbox"
                      onChange={(e) => e.target.checked && removerConvidado(iConvidado)}
                      className="appearance-none w-5 h-5 rounded-md border border-gray-300 bg-white shadow-sm cursor-pointer
                                 checked:bg-[#AE0000] checked:border-[#AE0000]
                                 focus:outline-none focus:ring-0"
                      title="Marcar para remover"
                    />

                    {/* Inputs do código com auto-avance/colar */}
                    {codigo.map((dig, iDig) => (
                      <input
                        key={iDig}
                        ref={(el) => {
                          if (!inputsRef.current[iConvidado]) inputsRef.current[iConvidado] = [];
                          inputsRef.current[iConvidado][iDig] = el;
                        }}
                        value={dig}
                        onChange={(e) => handleChange(iConvidado, iDig, e)}
                        onKeyDown={(e) => handleKeyDown(iConvidado, iDig, e)}
                        className="w-12 h-12 border bg-white text-black border-gray-300 rounded-md text-center text-lg outline-none focus:ring-0 focus:border-gray-400"
                        maxLength={TAMANHO_CODIGO} // Limita a 5 caracteres
                        inputMode="text"
                        autoComplete="off"
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600 dark:text-white">
                      Convidado {iConvidado + 1}
                    </span>
                  </div>
                ))}

                {/* Adicionar convidado */}
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

      {/* MODAL */}
      {modal.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
         
          <div className="absolute inset-0 bg-black/60" onClick={fecharModal} />
          
          <div className="relative z-10 w-[92%] max-w-md rounded-xl bg-white dark:bg-[#111] shadow-2xl p-8 text-center">
            {/* Ícone */}
            <div
              className={juntarClasses(
                "mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center",
                ic.bg
              )}
            >
              {modal.tipo === "success" ? (
                <img src={sucessoIcon} alt="Sucesso" className="h-9 w-9" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={juntarClasses("h-9 w-9", ic.color)}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {ic.svg}
                </svg>
              )}
            </div>

            <h2 className="text-lg font-semibold text-black dark:text-white">
              {modal.titulo}
            </h2>
            {modal.mensagem && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {modal.mensagem}
              </p>
            )}
            <button
              ref={modalBtnRef}
              onClick={fecharModal}
              className="mt-6 inline-flex items-center justify-center rounded-md px-6 py-3 text-white"
              style={{ backgroundColor: COR_VERMELHO }}
            >
              Ok, entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
