// src/pages/Agendamentos/AgendamentoAuditorio.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

import sucessoIcon from "../../assets/sucesso.svg";

import TrocaSemana from "../../components/ComponentsDeAgendamento/TrocaSemana";
import SeletorDia from "../../components/ComponentsDeAgendamento/SeletorDia";
import GradeHorarios from "../../components/ComponentsDeAgendamento/GradeHorarios";
import ModalDeAgendamento from "../../components/ComponentsDeAgendamento/ModalDeAgendamento";

import {
  COR_VERMELHO,
  montarDiasSemana,
  validaIntervalo,
  paraMinutos,
} from "../../components/ComponentsDeAgendamento/FuncoesCompartilhada";

import { salvarReservaFormatoBack } from "../../service/reserva";
import { api } from "../../service/api";

/* ===== IDs / helpers ===== */
// AJUSTA esse ID se no back o ambiente "Auditório" tiver outro id
const AUDITORIO_AMBIENTE_ID = 6;

// dias da semana como o back usa
const DIAS_BACK = [
  "DOMINGO",
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
];

/* ===== helpers JWT p/ pegar id do usuário ===== */
function b64urlDecode(str) {
  try {
    const pad = "=".repeat((4 - (str.length % 4)) % 4);
    const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
    return atob(b64);
  } catch {
    return "";
  }
}

function parseJwtLocal(token) {
  try {
    const [, payload] = String(token || "").split(".");
    return JSON.parse(b64urlDecode(payload) || "{}");
  } catch {
    return {};
  }
}

function getUserIdFromToken() {
  const token = localStorage.getItem("access_token") || "";
  const claims = parseJwtLocal(token);
  return claims?.id ?? claims?.user_id ?? claims?.sub ?? null;
}

// helpers de horário
const timeToMin = (s) => paraMinutos(s || "");

/**
 * Gera lista de horários de início a partir das faixas do catálogo
 */
function gerarInicioPorFaixas(faixas) {
  if (!Array.isArray(faixas) || !faixas.length) return [];
  const set = new Set();
  faixas.forEach((f) => {
    if (f.horaInicio) set.add(f.horaInicio);
  });
  return Array.from(set).sort((a, b) => timeToMin(a) - timeToMin(b));
}


function gerarTerminoPorFaixas(faixas, horaInicioSelecionada) {
  if (!Array.isArray(faixas) || !faixas.length) return [];
  const set = new Set();
  faixas.forEach((f) => {
    if (horaInicioSelecionada && f.horaInicio !== horaInicioSelecionada) {
      return;
    }
    if (f.horaFim) set.add(f.horaFim);
  });
  return Array.from(set).sort((a, b) => timeToMin(a) - timeToMin(b));
}

export default function AgendamentoAuditorio() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTermino, setHoraTermino] = useState(null);

  // nome da turma
  const [turma, setTurma] = useState("");

  // filtros dos horários
  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");
  const [horaTerminoFiltro, setHoraTerminoFiltro] = useState("");

  // catálogo do auditório vindo do back
  const [catalogoAuditorio, setCatalogoAuditorio] = useState([]);

  // Modal
  const [modal, setModal] = useState({
    aberto: false,
    tipo: "success",
    titulo: "",
    mensagem: "",
  });
  const modalBtnRef = useRef(null);

  // Monta dias (seg–sáb), respeitando “essa/próxima” e bloqueando dias passados
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

  // garante que o dia selecionado não esteja desabilitado
  useEffect(() => {
    const idxValido = diasDaSemana.findIndex((d) => !d.desabilitado);
    if (idxValido === -1 && semanaSelecionada === "essa") {
      setSemanaSelecionada("proxima");
      setDiaSelecionado(0);
    } else if (idxValido !== -1 && diasDaSemana[diaSelecionado]?.desabilitado) {
      setDiaSelecionado(idxValido);
    }
  }, [diasDaSemana, diaSelecionado, semanaSelecionada]);

  // Modal: ESC fecha + bloqueio de scroll
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
    setSemanaSelecionada("essa");
    setDiaSelecionado(0);
    setHoraInicio(null);
    setHoraTermino(null);
    setHoraInicioFiltro("");
    setHoraTerminoFiltro("");
    setTurma("");
  }

  // ===== carrega catálogo do AUDITÓRIO =====
  useEffect(() => {
    let cancelado = false;

    async function carregarCatalogoAuditorio() {
      try {
        const resp = await api.get("/catalogo/buscar");
        const data = Array.isArray(resp?.data) ? resp.data : resp;

        if (!Array.isArray(data)) {
          console.warn(
            "[AgendamentoAuditorio] /catalogo/buscar não retornou array:",
            data
          );
          return;
        }

        const mapeado = data.map((item) => {
          const catalogoIdItem = item?.id ?? null;
          const ambienteId =
            item?.ambiente?.id ?? item?.ambienteId ?? item?.idAmbiente ?? null;

          const nomeAmbiente = String(
            item?.ambiente?.nome || item?.ambienteNome || ""
          )
            .trim()
            .toLowerCase();

          const disponibilidadeItem = String(
            item?.disponibilidade || item?.ambiente?.disponibilidade || ""
          ).toUpperCase();

          const diaSemanaNormalizado = String(item.diaSemana || "")
            .trim()
            .toUpperCase();

          // heurística: ambiente do Auditório
          const isAuditorio =
            ambienteId === AUDITORIO_AMBIENTE_ID ||
            nomeAmbiente.includes("auditório") ||
            nomeAmbiente.includes("auditorio");

          const isDisponivel =
            !disponibilidadeItem || disponibilidadeItem === "DISPONIVEL";

          const horaInicio = (item.horaInicio || "").toString().slice(0, 5);
          const horaFim = (item.horaFim || "").toString().slice(0, 5);

          return {
            id: catalogoIdItem,
            diaSemana: diaSemanaNormalizado,
            horaInicio,
            horaFim,
            isAuditorio,
            isDisponivel,
          };
        });

        const apenasAuditorio = mapeado.filter(
          (it) => it.isAuditorio && it.isDisponivel
        );

        console.log(
          "[AgendamentoAuditorio] faixas AUDITÓRIO (disponíveis):",
          apenasAuditorio
        );

        if (!cancelado) {
          setCatalogoAuditorio(
            apenasAuditorio.map((it) => ({
              id: it.id,
              diaSemana: it.diaSemana,
              horaInicio: it.horaInicio,
              horaFim: it.horaFim,
            }))
          );
        }
      } catch (err) {
        console.error(
          "[AgendamentoAuditorio] Erro ao buscar catálogo do auditório:",
          err
        );
      }
    }

    carregarCatalogoAuditorio();

    return () => {
      cancelado = true;
    };
  }, []);

  // label de dia da semana como o back usa
  const diaSemanaBackSelecionado = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return null;
    return DIAS_BACK[dia.getDay()];
  }, [diasDaSemana, diaSelecionado]);

  // faixas do catálogo para o dia selecionado
  const faixasDoDia = useMemo(() => {
    if (!diaSemanaBackSelecionado) return [];
    const faixas = catalogoAuditorio.filter(
      (c) => c.diaSemana === diaSemanaBackSelecionado
    );
    console.log(
      "[AgendamentoAuditorio] faixasDoDia para",
      diaSemanaBackSelecionado,
      faixas
    );
    return faixas;
  }, [catalogoAuditorio, diaSemanaBackSelecionado]);

  // horários de início/término disponíveis no dia
  const horariosInicioDisponiveis = useMemo(
    () => gerarInicioPorFaixas(faixasDoDia),
    [faixasDoDia]
  );

  const horariosTerminoDisponiveis = useMemo(
    () => gerarTerminoPorFaixas(faixasDoDia, horaInicio),
    [faixasDoDia, horaInicio]
  );

  const temHorariosParaDia = horariosInicioDisponiveis.length > 0;

  // limpa término quando muda o início
  useEffect(() => {
    setHoraTermino(null);
    setHoraTerminoFiltro("");
  }, [horaInicio]);

  async function confirmar() {
    const dia = diasDaSemana[diaSelecionado];

    if (!turma.trim()) {
      abrirModal(
        "error",
        "Nome da turma obrigatório",
        "Informe o nome da turma para continuar."
      );
      return;
    }

    if (!dia || dia.desabilitado) {
      abrirModal("error", "Data inválida", "Selecione uma data válida.");
      return;
    }

    if (!temHorariosParaDia) {
      abrirModal(
        "error",
        "Dia indisponível",
        "Não há horários configurados para este dia."
      );
      return;
    }

    if (!horaInicio || !horaTermino) {
      abrirModal(
        "error",
        "Dados incompletos",
        "Escolha os horários de início e término."
      );
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

    if (isHoje && timeToMin(horaInicio) <= nowMinutes) {
      abrirModal(
        "error",
        "Horário não permitido",
        "Escolha um horário de início que ainda não tenha passado."
      );
      return;
    }

    const hostId = getUserIdFromToken();
    if (!hostId) {
      abrirModal(
        "error",
        "Sessão inválida",
        "Não foi possível identificar o usuário logado."
      );
      return;
    }

    // escolhe o catálogo certinho pelo dia + horário de início/término
    const catalogoSelecionado = faixasDoDia.find(
      (c) => c.horaInicio === horaInicio && c.horaFim === horaTermino
    );

    if (!catalogoSelecionado?.id) {
      console.error(
        "[AgendamentoAuditorio] Não encontrou catálogo para",
        diaSemanaBackSelecionado,
        horaInicio,
        horaTermino,
        faixasDoDia
      );
      abrirModal(
        "error",
        "Configuração inválida",
        "Não foi possível localizar o catálogo correspondente para esse horário. Avise o coordenador."
      );
      return;
    }

    const msgUsuario = `Reserva do Auditório para a turma ${turma.trim()}.`;

    try {
      await salvarReservaFormatoBack({
        idUsuario: hostId,
        catalogoId: catalogoSelecionado.id,
        dataJS: dia.dataCompleta,
        horaInicioHHMM: horaInicio,
        horaFimHHMM: horaTermino,
        msgUsuario,
      });

      abrirModal(
        "success",
        "Reserva realizada com sucesso!",
        "Sua solicitação foi enviada e está aguardando aprovação."
      );
      cancelar();
    } catch (err) {
      console.error("[AgendamentoAuditorio] ERRO SALVAR RESERVA:", err);
      const data = err?.response?.data || err?.data;
      const msg =
        data?.message ||
        data?.mensagem ||
        (Array.isArray(data?.erros) ? data.erros.join(" ") : null) ||
        err?.message ||
        `Erro ao comunicar com o servidor. [${err?.status || ""}]`;

      abrirModal("error", "Falha ao reservar", msg);
    }
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
            <span className="font-medium font-sans">Auditório</span>
          </h1>
        </div>

        {/* Seleção semana e data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-6">
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

        {/* Nome da turma (visual igual ao que você já tinha) */}
        <div className="mb-8">
          <label className="block text-black dark:text-white font-medium mb-2">
            Nome da turma:
          </label>

          <div className="w-full sm:max-w-[200px]">
            <input
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              placeholder="Ex.: Turma A"
              maxLength={60}
              className="w-full h-9 rounded-md px-3 bg-[#F2F2F2] dark:bg-[#1d1d1d]
                         text-sm text-[#1E1E1E] dark:text-white outline-none border border-transparent
                         focus:border-[#d1d1d1] dark:focus:border-zinc-700
                         placeholder:text-[10px] md:placeholder:text-xs
                         placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Grades de horário (layout igual, mas horários vindo do back) */}
        {temHorariosParaDia ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GradeHorarios
              titulo="Horário de início:"
              opcoes={horariosInicioDisponiveis}
              selecionado={horaInicio}
              onSelect={setHoraInicio}
              isDisabled={(t) => isHoje && timeToMin(t) <= nowMinutes}
              comFiltro={true}
              filtro={horaInicioFiltro}
              onFiltroChange={setHoraInicioFiltro}
            />

            <GradeHorarios
              titulo="Horário de término:"
              opcoes={horariosTerminoDisponiveis}
              selecionado={horaTermino}
              onSelect={setHoraTermino}
              isDisabled={(t) => isHoje && timeToMin(t) <= nowMinutes}
              comFiltro={true}
              filtro={horaTerminoFiltro}
              onFiltroChange={setHoraTerminoFiltro}
            />
          </div>
        ) : (
          <div className="mt-6 bg-[#F5F5F5] dark:bg-[#111111] rounded-md px-4 py-8 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Nenhum horário disponível para este dia.
          </div>
        )}

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
