// src/pages/Agendamento/AgendamentoQuadra.jsx
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
} from "../../components/ComponentsDeAgendamento/FuncoesCompartilhada";

import { salvarReservaFormatoBack } from "../../service/reserva";
import { api } from "../../service/api";

/* ===== IDs fixos ===== */
// ID do AMBIENTE da quadra (no JSON do Insomnia aparece ambienteId: 1)
const QUADRA_AMBIENTE_ID = 1;
// Apenas fallback se não encontrarmos o catálogo correto (ideal é nunca usar)
const QUADRA_CATALOGO_FALLBACK_ID = 1;

/* ===== dias da semana como o back usa ===== */
const DIAS_BACK = [
  "DOMINGO",
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
];

/* ===== helpers JWT p/ pegar id do usuário do token ===== */
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

// ===== helpers de horário =====
const timeToMin = (s) => {
  const [h, m] = String(s || "")
    .slice(0, 5)
    .split(":")
    .map(Number);
  return h * 60 + m;
};

function toHHMM(hora) {
  // aceita "09:00" ou "09:00:00"
  return String(hora || "").slice(0, 5);
}

/**
 * Gera slots de horários a partir das faixas do catálogo **sem inventar intervalos**.
 *
 * - Início: todos os `horaInicio` únicos do dia, ordenados
 * - Término: todos os `horaFim` únicos do dia, ordenados
 */
function gerarSlotsPorFaixas(faixas) {
  if (!Array.isArray(faixas) || !faixas.length) {
    return { inicio: [], termino: [] };
  }

  const inicioSet = new Set();
  const terminoSet = new Set();

  faixas.forEach((f) => {
    if (f.horaInicio) inicioSet.add(toHHMM(f.horaInicio));
    if (f.horaFim) terminoSet.add(toHHMM(f.horaFim));
  });

  const inicio = Array.from(inicioSet).sort(
    (a, b) => timeToMin(a) - timeToMin(b)
  );
  const termino = Array.from(terminoSet).sort(
    (a, b) => timeToMin(a) - timeToMin(b)
  );

  return { inicio, termino };
}

export default function AgendamentoQuadra() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTermino, setHoraTermino] = useState(null);

  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");
  const [horaTerminoFiltro, setHoraTerminoFiltro] = useState("");

  // catálogo da quadra vindo do back (lista de objetos com id, diaSemana, horaInicio, horaFim)
  const [catalogoQuadra, setCatalogoQuadra] = useState([]);

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

  // relógio para bloquear horários passados no dia atual
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

  // ESC fecha modal + bloqueio de scroll
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

  // ===== carrega catálogo da quadra =====
  useEffect(() => {
    let cancelado = false;

    async function carregarCatalogoQuadra() {
      try {
        const resp = await api.get("/catalogo/buscar");
        const data = Array.isArray(resp?.data) ? resp.data : resp;

        if (!Array.isArray(data)) {
          console.warn(
            "[AgendamentoQuadra] /catalogo/buscar não retornou array:",
            data
          );
          return;
        }

        const mapeado = data.map((item) => {
          const catalogoIdItem = item?.id ?? null;

          // suporta tanto ambiente.id quanto ambienteId direto
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

          // QUADRA: ambienteId = 1 OU nome contendo “quadra”
          const isQuadra =
            ambienteId === QUADRA_AMBIENTE_ID ||
            nomeAmbiente.includes("quadra");

          const isDisponivel =
            !disponibilidadeItem || disponibilidadeItem === "DISPONIVEL";

          return {
            id: catalogoIdItem,
            diaSemana: diaSemanaNormalizado,
            horaInicio: toHHMM(item.horaInicio),
            horaFim: toHHMM(item.horaFim),
            isQuadra,
            isDisponivel,
          };
        });

        console.log("[AgendamentoQuadra] catálogo completo:", mapeado);

        const apenasQuadra = mapeado.filter(
          (it) => it.isQuadra && it.isDisponivel
        );

        console.log(
          "[AgendamentoQuadra] apenas quadra (ambiente 1):",
          apenasQuadra
        );

        if (!cancelado) {
          setCatalogoQuadra(
            apenasQuadra.map((it) => ({
              id: it.id,
              diaSemana: it.diaSemana,
              horaInicio: it.horaInicio,
              horaFim: it.horaFim,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao buscar catálogo da quadra:", err);
      }
    }

    carregarCatalogoQuadra();

    return () => {
      cancelado = true;
    };
  }, []);

  // ===== pega o label de dia da semana como o back usa (TERCA, QUARTA, etc) =====
  const diaSemanaBackSelecionado = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return null;
    return DIAS_BACK[dia.getDay()];
  }, [diasDaSemana, diaSelecionado]);

  // ===== faixas de horário disponíveis para o dia selecionado =====
  const faixasDoDia = useMemo(() => {
    if (!diaSemanaBackSelecionado) return [];
    const faixas = catalogoQuadra.filter(
      (c) => c.diaSemana === diaSemanaBackSelecionado
    );
    console.log(
      "[AgendamentoQuadra] faixasDoDia para",
      diaSemanaBackSelecionado,
      faixas
    );
    return faixas;
  }, [catalogoQuadra, diaSemanaBackSelecionado]);

  // sempre que muda o dia, limpa seleção e filtros
  useEffect(() => {
    setHoraInicio(null);
    setHoraTermino(null);
    setHoraInicioFiltro("");
    setHoraTerminoFiltro("");
  }, [diaSemanaBackSelecionado]);

  // ===== horários realmente exibidos na tela (usando só o que vem do catálogo) =====
  const {
    inicio: horariosInicioDisponiveis,
    termino: horariosTerminoDisponiveis,
  } = useMemo(() => gerarSlotsPorFaixas(faixasDoDia), [faixasDoDia]);

  const temHorariosParaDia =
    horariosInicioDisponiveis.length > 0 ||
    horariosTerminoDisponiveis.length > 0;

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
    setHoraTerminoFiltro("");
  }

  async function confirmar() {
    if (!horaInicio || !horaTermino) {
      abrirModal(
        "error",
        "Selecione os horários",
        "Escolha o horário de início e o de término para continuar."
      );
      return;
    }

    if (
      !horariosInicioDisponiveis.includes(horaInicio) ||
      !horariosTerminoDisponiveis.includes(horaTermino)
    ) {
      abrirModal(
        "error",
        "Horário indisponível",
        "O horário selecionado não está disponível para esse dia."
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

    if (!validaIntervalo(horaInicio, horaTermino)) {
      abrirModal(
        "error",
        "Horários inconsistentes",
        "O horário de término precisa ser depois do início e respeitar a duração mínima."
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

    // >>>>>>> AQUI ESTAVA O PROBLEMA: escolher o catálogo certo <<<<<<
    const catalogoSelecionado = catalogoQuadra.find(
      (c) =>
        c.diaSemana === diaSemanaBackSelecionado &&
        c.horaInicio === horaInicio &&
        c.horaFim === horaTermino
    );

    if (!catalogoSelecionado?.id) {
      console.error(
        "[AgendamentoQuadra] Não encontrou catálogo para",
        diaSemanaBackSelecionado,
        horaInicio,
        horaTermino
      );
      abrirModal(
        "error",
        "Configuração inválida",
        "Não foi possível localizar o catálogo correspondente para esse horário. Avise o coordenador."
      );
      return;
    }

    const catalogoId = catalogoSelecionado.id || QUADRA_CATALOGO_FALLBACK_ID;

    try {
      await salvarReservaFormatoBack({
        idUsuario: hostId,
        catalogoId,
        dataJS: dia.dataCompleta,
        horaInicioHHMM: horaInicio,
        horaFimHHMM: horaTermino,
        msgUsuario: "Reserva da quadra",
      });

      abrirModal(
        "success",
        "Reserva realizada com sucesso!",
        "Sua solicitação foi enviada e está aguardando aprovação."
      );
      // cancelar();
    } catch (err) {
      console.error("ERRO SALVAR RESERVA [QUADRA]:", err);
      const msg =
        err?.data?.message ||
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
            <span className="font-medium font-sans">Quadra</span>
          </h1>
        </div>

        {/* Seleção semana e data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-6">
          <TrocaSemana
            value={semanaSelecionada}
            onChange={setSemanaSelecionada}
          />
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

        {/* Conteúdo */}
        {temHorariosParaDia ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Horário de início COM pesquisa */}
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

            {/* Horário de término COM pesquisa */}
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
