import React, { useEffect, useMemo, useRef, useState } from "react";
import TrocaSemana from "../components/agendamento/TrocaSemana";
import SeletorDia from "../components/agendamento/SeletorDia";
import GradeHorarios from "../components/agendamento/GradeHorarios";
import SeletorComputadores from "../components/agendamento/SeletorComputadores";
import ModalDeAgendamento from "../components/agendamento/ModalDeAgendamento";

import sucessoIcon from "../assets/sucesso.svg";

import {
  COR_VERMELHO,
  HORARIOS_INICIO_COMPUTADOR,
  HORARIO_TERMINO_COMPUTADOR_FIXO,
  montarDiasSemana,
  montarPayload,
} from "../components/agendamento/FuncoesCompartilhada";

export default function AgendamentoComputadores() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const diasDaSemana = useMemo(
    () => montarDiasSemana(semanaSelecionada === "essa" ? 0 : 1),
    [semanaSelecionada]
  );
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [inicio, setInicio] = useState(null);
  const TERMINO_OPCOES = [HORARIO_TERMINO_COMPUTADOR_FIXO];
  const [termino, setTermino] = useState(TERMINO_OPCOES[0]);
  const [computador, setComputador] = useState(1);

  const [modal, setModal] = useState({
    aberto: false,
    tipo: "success",
    titulo: "",
    mensagem: "",
  });
  const modalBtnRef = useRef(null);

  function abrirModal(tipo, titulo, mensagem) {
    setModal({ aberto: true, tipo, titulo, mensagem });
  }
  function fecharModal() {
    setModal((m) => ({ ...m, aberto: false }));
  }

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

  useEffect(() => {
    const idxValido = diasDaSemana.findIndex((d) => !d.desabilitado);
    if (idxValido === -1 && semanaSelecionada === "essa") {
      setSemanaSelecionada("proxima");
      setDiaSelecionado(0);
    } else if (idxValido !== -1 && diasDaSemana[diaSelecionado]?.desabilitado) {
      setDiaSelecionado(idxValido);
    }
  }, [diasDaSemana, diaSelecionado, semanaSelecionada]);

  function cancelar() {
    setDiaSelecionado(0);
    setInicio(null);
    setTermino(TERMINO_OPCOES[0]);
    setComputador(1);
  }

  function handleConfirmar() {
    const dia = diasDaSemana[diaSelecionado];
    if (!dia || dia.desabilitado) {
      abrirModal("error", "Data inválida", "Selecione uma data válida para agendar.");
      return;
    }
    if (!inicio) {
      abrirModal("error", "Selecione os horários", "Escolha o horário de início para continuar.");
      return;
    }

    const payload = montarPayload({
      recurso: "COMPUTADOR",
      semanaSelecionada: semanaSelecionada,
      dia: dia.dataCompleta,
      inicio,
      termino,
      extra: { computador },
    });

    console.log("CONFIRMAR:", payload);

    abrirModal(
      "success",
      "Reserva realizada com sucesso!",
      "Sua solicitação foi enviada e está aguardando aprovação."
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0B0B0B] flex justify-center">
      <div className="w-full max-w-5xl px-4 md:px-8 py-8">
        <div
          className="w-full rounded-md text-white px-6 py-5 mb-6 text-center"
          style={{ backgroundColor: COR_VERMELHO }}
        >
          <h1 className="text-xl md:text-2xl font-regular font-sans">
            Agendamento <span className="opacity-70">–</span>{" "}
            <span className="font-medium font-sans">Computadores</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-6">
          <TrocaSemana value={semanaSelecionada} onChange={setSemanaSelecionada} />
          <div className="hidden md:block" />
          <div className="flex md:justify-end items-center gap-2 text-black dark:text-white">
            <span className="font-medium mr-1">Data:</span>
            <SeletorDia
              dias={diasDaSemana}
              selectedIndex={diaSelecionado}
              onSelect={setDiaSelecionado}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <GradeHorarios
            titulo="Horário de início:"
            opcoes={HORARIOS_INICIO_COMPUTADOR}
            selecionado={inicio}
            onSelect={setInicio}
            isDisabled={(t) => isHoje && timeToMin(t) <= nowMinutes}
          />
          <GradeHorarios
            titulo="Horário de término:"
            opcoes={TERMINO_OPCOES}
            selecionado={termino}
            onSelect={setTermino}
            isDisabled={(t) => isHoje && timeToMin(t) <= nowMinutes}
          />
          <div className="md:col-span-2">
            <SeletorComputadores valor={computador} onChange={setComputador} />
          </div>
        </div>

        <p className="mt-4 text-xs text-[#6b6b6b] dark:text-[#c9c9c9]">
          <span className="font-semibold" style={{ color: COR_VERMELHO }}>
            OBS:
          </span>{" "}
          Informe apenas o horário de início. Todos devem desocupar os
          computadores até, no máximo, às {HORARIO_TERMINO_COMPUTADOR_FIXO}.
        </p>

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
            onClick={handleConfirmar}
            className="px-6 py-3 rounded-md text-white outline-none focus:ring-0 transition-colors duration-150"
            style={{ backgroundColor: COR_VERMELHO }}
          >
            Confirmar
          </button>
        </div>
      </div>

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
