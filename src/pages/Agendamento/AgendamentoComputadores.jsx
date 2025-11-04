import React, { useEffect, useMemo, useRef, useState } from "react";

import sucessoIcon from "../../assets/sucesso.svg";

import TrocaSemana from "../../components/ComponentsDeAgendamento/TrocaSemana";
import SeletorDia from "../../components/ComponentsDeAgendamento/SeletorDia";
import GradeHorarios from "../../components/ComponentsDeAgendamento/GradeHorarios";
import SeletorComputadores from "../../components/ComponentsDeAgendamento/SeletorComputadores";
import ModalDeAgendamento from "../../components/ComponentsDeAgendamento/ModalDeAgendamento";

import {
  COR_VERMELHO,
  HORARIOS_INICIO_COMPUTADOR,
  HORARIOS_TERMINO_COMPUTADOR,
  HORARIO_TERMINO_COMPUTADOR_FIXO, 
  montarDiasSemana,
  validaIntervalo,
} from "../../components/ComponentsDeAgendamento/FuncoesCompartilhada";

export default function AgendamentoComputadores() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTermino, setHoraTermino] = useState(null);

  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");

  const [computadorSelecionado, setComputadorSelecionado] = useState(null);

  // Modal
  const [modal, setModal] = useState({
    aberto: false,
    tipo: "success",
    titulo: "",
    mensagem: "",
  });
  const modalBtnRef = useRef(null);

  const diasDaSemana = useMemo(
    () => montarDiasSemana(semanaSelecionada === "essa" ? 0 : 1),
    [semanaSelecionada]
  );

  // desabilita horários passados se for hoje
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  const isHoje = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return false;
    const n = new Date();
    return (
      dia.getFullYear() === n.getFullYear() &&
      dia.getMonth() === n.getMonth() &&
      dia.getDate() === n.getDate()
    );
  }, [diasDaSemana, diaSelecionado]);
  const timeToMin = (s) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };

  // só pode selecionar dia que não tenha passado
  useEffect(() => {
    const idxValido = diasDaSemana.findIndex((d) => !d.desabilitado);
    if (idxValido === -1 && semanaSelecionada === "essa") {
      setSemanaSelecionada("proxima");
      setDiaSelecionado(0);
    } else if (idxValido !== -1 && diasDaSemana[diaSelecionado]?.desabilitado) {
      setDiaSelecionado(idxValido);
    }
  }, [diasDaSemana, diaSelecionado, semanaSelecionada]);

  // ESC fecha modal e bloqueio de scroll
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

  function cancelar() {
    setDiaSelecionado(0);
    setHoraInicio(null);
    setHoraTermino(null);
    setHoraInicioFiltro("");
    setComputadorSelecionado(null);
  }

  function confirmar() {
    if (!horaInicio || !horaTermino || !computadorSelecionado) {
      abrirModal(
        "error",
        "Dados incompletos",
        "Escolha os horários e um computador para continuar."
      );
      return;
    }
    const dia = diasDaSemana[diaSelecionado];
    if (!dia || dia.desabilitado) {
      abrirModal("error", "Data inválida", "Selecione uma data válida.");
      return;
    }
    if (!validaIntervalo(horaInicio, horaTermino)) {
      abrirModal(
        "error",
        "Horários inconsistentes",
        "O término precisa ser depois do início."
      );
      return;
    }

    const dados = {
      local: "Computadores",
      semana: semanaSelecionada === "essa" ? "Essa semana" : "Próxima semana",
      data: dia.dataCompleta.toISOString(),
      inicio: horaInicio,
      termino: horaTermino,
      computador: computadorSelecionado,
    };
    console.log("Agendamento:", dados);

    abrirModal(
      "success",
      "Reserva realizada com sucesso!",
      "Sua solicitação foi enviada e está aguardando aprovação."
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0B0B0B] flex justify-center">
      <div className="w-full max-w-5xl px-4 md:px-8 py-8">
        {/* Cabeçalho */}
        <div
          className="w-full rounded-md text-white px-6 py-5 mb-6 text-center"
          style={{ backgroundColor: COR_VERMELHO }}
        >
          <h1 className="text-xl md:text-2xl font-regular font-sans">
            Agendamento <span className="opacity-70">–</span>{" "}
            <span className="font-medium font-sans">Computadores</span>
          </h1>
        </div>

        {/* Seleção semana e data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-10">
          <TrocaSemana value={semanaSelecionada} onChange={setSemanaSelecionada} />
          <div className="hidden md:block " />
          <div className="flex md:justify-end items-center gap-2 text-black dark:text-white">
            <span className="font-medium mr-1">Data:</span>
            <SeletorDia
              dias={diasDaSemana}
              selectedIndex={diaSelecionado}
              onSelect={setDiaSelecionado}
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Início */}
          <GradeHorarios
            titulo="Horário de início:"
            opcoes={HORARIOS_INICIO_COMPUTADOR}
            selecionado={horaInicio}
            onSelect={setHoraInicio}
            isDisabled={(t) => isHoje && timeToMin(t) <= nowMinutes}
            comFiltro={true}
            filtro={horaInicioFiltro}
            onFiltroChange={setHoraInicioFiltro}
          />

          {/* Término */}
          <div>
            <h2 className="text-lg font-medium text-black dark:text-white mb-1">
              Horário de término:
            </h2>

            <GradeHorarios
              titulo=""
              opcoes={HORARIOS_TERMINO_COMPUTADOR}
              selecionado={horaTermino}
              onSelect={setHoraTermino}
              isDisabled={(t) => isHoje && timeToMin(t) <= nowMinutes}
              comFiltro={false}
            />
          </div>
        </div>

        {/* Seletor de computadores */}
        <div className="mt-6">
          <SeletorComputadores
            valor={computadorSelecionado}
            onChange={setComputadorSelecionado}
          />

          {/* OBS abaixo do seletor */}
          <p className="mt-3 text-sm leading-5">
            <span className="font-semibold" style={{ color: COR_VERMELHO }}>
              OBS:
            </span>{" "}
            <span className="text-[#1E1E1E] dark:text-gray-200">
              Informe apenas o horário de início. Todos devem desocupar os computadores
              até, no máximo, às {HORARIO_TERMINO_COMPUTADOR_FIXO}.
            </span>
          </p>
        </div>

        {/* Botões */}
        <div className="mt-6 md:mt-4 flex flex-col md:flex-row gap-4 md:justify-end">
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

      {/* Modal */}
      <ModalDeAgendamento
        open={modal.aberto}
        onClose={fecharModal}
        type={modal.tipo}
        title={modal.titulo}
        message={modal.mensagem}
        sucessoIcon={sucessoIcon}
        primaryColor={COR_VERMELHO}
        ref={modalBtnRef}
      />
    </div>
  );
}
