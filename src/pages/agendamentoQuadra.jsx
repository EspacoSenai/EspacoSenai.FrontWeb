import React, { useEffect, useMemo, useRef, useState } from "react";

import sucessoIcon from "../assets/sucesso.svg";

import TrocaSemana from "../components/agendamento/TrocaSemana";
import SeletorDia from "../components/agendamento/SeletorDia";
import GradeHorarios from "../components/agendamento/GradeHorarios";
import CodigoConvidados from "../components/agendamento/CodigoConvidados";
import ModalDeAgendamento from "../components/agendamento/ModalDeAgendamento";

import {
  COR_VERMELHO,
  TAMANHO_CODIGO,
  MAX_CONVIDADOS,
  HORARIOS_INICIO_QUADRA,
  HORARIOS_TERMINO_QUADRA,
  montarDiasSemana,
  validaIntervalo,
} from "../components/agendamento/FuncoesCompartilhada";

export default function AgendamentoQuadra() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTermino, setHoraTermino] = useState(null);
  const [convidados, setConvidados] = useState([Array(TAMANHO_CODIGO).fill("")]);

  // Modal
  const [modal, setModal] = useState({ aberto: false, tipo: "success", titulo: "", mensagem: "" });
  const modalBtnRef = useRef(null);

  const diasDaSemana = useMemo(
    () => montarDiasSemana(semanaSelecionada === "essa" ? 0 : 1),
    [semanaSelecionada]
  );

  // só pode selecionar dia válido
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
    setConvidados([Array(TAMANHO_CODIGO).fill("")]);
  }

  function confirmar() {
    if (!horaInicio || !horaTermino) {
      abrirModal("error", "Selecione os horários", "Escolha o horário de início e o de término para continuar.");
      return;
    }
    const dia = diasDaSemana[diaSelecionado];
    if (!dia || dia.desabilitado) {
      abrirModal("error", "Data inválida", "Selecione uma data válida para agendar.");
      return;
    }
    if (!validaIntervalo(horaInicio, horaTermino)) {
      abrirModal("error", "Horários inconsistentes", "O término precisa ser depois do início.");
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

    abrirModal("success", "Reserva realizada com sucesso!", "Sua solicitação foi enviada e está aguardando aprovação.");
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0B0B0B] flex justify-center">
      <div className="w-full max-w-5xl px-4 md:px-8 py-8">
        {/* Cabeçalho */}
        <div className="w-full rounded-md text-white px-6 py-5 mb-6 text-center" style={{ backgroundColor: COR_VERMELHO }}>
          <h1 className="text-xl md:text-2xl font-regular font-sans">
            Agendamento <span className="opacity-70">–</span>{" "}
            <span className="font-medium font-sans">Quadra</span>
          </h1>
        </div>

        {/* Seleção semana e data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-6">
          <TrocaSemana value={semanaSelecionada} onChange={setSemanaSelecionada} />
          <div className="hidden md:block" />
          <div className="flex md:justify-end items-center gap-2 text-black dark:text-white">
            <span className="font-medium mr-1">Data:</span>
            <SeletorDia dias={diasDaSemana} selectedIndex={diaSelecionado} onSelect={setDiaSelecionado} />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GradeHorarios
            titulo="Horário de início:"
            opcoes={HORARIOS_INICIO_QUADRA}
            selecionado={horaInicio}
            onSelect={setHoraInicio}
          />
          <GradeHorarios
            titulo="Horário de término:"
            opcoes={HORARIOS_TERMINO_QUADRA}
            selecionado={horaTermino}
            onSelect={setHoraTermino}
          />

          <div className="md:col-span-2">
            <CodigoConvidados
              convidados={convidados}
              setConvidados={setConvidados}
              tamanhoCodigo={TAMANHO_CODIGO}
              maxConvidados={MAX_CONVIDADOS}
              onAviso={abrirModal}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="-mt-11 flex flex-col md:flex-row gap-4 md:justify-end">
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
