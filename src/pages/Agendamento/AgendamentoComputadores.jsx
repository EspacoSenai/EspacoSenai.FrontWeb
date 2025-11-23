// src/pages/Agendamentos/AgendamentoComputadores.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

import sucessoIcon from "../../assets/sucesso.svg";

import TrocaSemana from "../../components/ComponentsDeAgendamento/TrocaSemana";
import SeletorDia from "../../components/ComponentsDeAgendamento/SeletorDia";
import GradeHorarios from "../../components/ComponentsDeAgendamento/GradeHorarios";
import SeletorComputadores from "../../components/ComponentsDeAgendamento/SeletorComputadores";
import ModalDeAgendamento from "../../components/ComponentsDeAgendamento/ModalDeAgendamento";

import {
  COR_VERMELHO,
  HORARIO_TERMINO_COMPUTADOR_FIXO,
  montarDiasSemana,
  validaIntervalo,
} from "../../components/ComponentsDeAgendamento/FuncoesCompartilhada";

import { salvarReservaFormatoBack } from "../../service/reserva";
import { api } from "../../service/api";

/* ====== IDs fixos / ambiente ====== */
// ID do AMBIENTE de computadores (ajuste conforme estiver no banco)
const COMPUTADORES_AMBIENTE_ID = 3;
// Fallback de catálogo se por algum motivo não achar o correto
const COMPUTADORES_CATALOGO_FALLBACK_ID = 4;

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
 */
function gerarSlotsPorFaixas(faixas) {
  if (!Array.isArray(faixas) || !faixas.length) {
    return { inicio: [] };
  }

  const inicioSet = new Set();

  faixas.forEach((f) => {
    if (f.horaInicio) inicioSet.add(toHHMM(f.horaInicio));
  });

  const inicio = Array.from(inicioSet).sort(
    (a, b) => timeToMin(a) - timeToMin(b)
  );

  return { inicio };
}

export default function AgendamentoComputadores() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const [horaInicio, setHoraInicio] = useState(null);
  const horaTermino = HORARIO_TERMINO_COMPUTADOR_FIXO;

  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");

  const [computadorSelecionado, setComputadorSelecionado] = useState(null);

  // catálogo de computadores vindo do back (lista de objetos com id, diaSemana, horaInicio, horaFim)
  const [catalogoComputadores, setCatalogoComputadores] = useState([]);

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

  // ESC fecha modal + bloqueio de scroll enquanto aberto
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
    setHoraInicioFiltro("");
    setComputadorSelecionado(null);
  }

  // limpa filtro/horário de início quando trocar semana/dia
  useEffect(() => {
    setHoraInicioFiltro("");
    setHoraInicio(null);
  }, [semanaSelecionada, diaSelecionado]);

  // ===== carrega catálogo de computadores =====
  useEffect(() => {
    let cancelado = false;

    async function carregarCatalogoComputadores() {
      try {
        const resp = await api.get("/catalogo/buscar");
        const data = Array.isArray(resp?.data) ? resp.data : resp;

        if (!Array.isArray(data)) {
          console.warn(
            "[AgendamentoComputadores] /catalogo/buscar não retornou array:",
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

          // COMPUTADORES: ambienteId = COMPUTADORES_AMBIENTE_ID
          // ou nome contendo "computador"/"laboratório"
          const isComputador =
            ambienteId === COMPUTADORES_AMBIENTE_ID ||
            nomeAmbiente.includes("computador") ||
            nomeAmbiente.includes("laboratório") ||
            nomeAmbiente.includes("laboratorio");

          const isDisponivel =
            !disponibilidadeItem || disponibilidadeItem === "DISPONIVEL";

          return {
            id: catalogoIdItem,
            diaSemana: diaSemanaNormalizado,
            horaInicio: toHHMM(item.horaInicio),
            horaFim: toHHMM(item.horaFim),
            isComputador,
            isDisponivel,
          };
        });

        console.log("[AgendamentoComputadores] catálogo completo:", mapeado);

        const apenasComputadores = mapeado.filter(
          (it) => it.isComputador && it.isDisponivel
        );

        console.log(
          "[AgendamentoComputadores] apenas computadores:",
          apenasComputadores
        );

        if (!cancelado) {
          setCatalogoComputadores(
            apenasComputadores.map((it) => ({
              id: it.id,
              diaSemana: it.diaSemana,
              horaInicio: it.horaInicio,
              horaFim: it.horaFim,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao buscar catálogo de computadores:", err);
      }
    }

    carregarCatalogoComputadores();

    return () => {
      cancelado = true;
    };
  }, []);

  // ===== dia da semana no formato do back =====
  const diaSemanaBackSelecionado = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return null;
    return DIAS_BACK[dia.getDay()];
  }, [diasDaSemana, diaSelecionado]);

  // ===== faixas do dia =====
  const faixasDoDia = useMemo(() => {
    if (!diaSemanaBackSelecionado) return [];
    const faixas = catalogoComputadores.filter(
      (c) => c.diaSemana === diaSemanaBackSelecionado
    );
    console.log(
      "[AgendamentoComputadores] faixasDoDia para",
      diaSemanaBackSelecionado,
      faixas
    );
    return faixas;
  }, [catalogoComputadores, diaSemanaBackSelecionado]);

  // horários de início disponíveis (saindo do catálogo)
  const { inicio: horariosInicioDisponiveis } = useMemo(
    () => gerarSlotsPorFaixas(faixasDoDia),
    [faixasDoDia]
  );

  const temHorariosParaDia = horariosInicioDisponiveis.length > 0;

  async function confirmar() {
    if (!horaInicio || !computadorSelecionado) {
      abrirModal(
        "error",
        "Dados incompletos",
        "Escolha o horário de início e um computador para continuar."
      );
      return;
    }

    const dia = diasDaSemana[diaSelecionado];
    if (!dia || dia.desabilitado) {
      abrirModal("error", "Data inválida", "Selecione uma data válida.");
      return;
    }

    // Back com @Future em data -> HOJE não passa
    if (isHoje) {
      abrirModal(
        "error",
        "Data não permitida",
        "As reservas de computadores só são aceitas a partir de amanhã."
      );
      return;
    }

    if (!horariosInicioDisponiveis.includes(horaInicio)) {
      abrirModal(
        "error",
        "Horário indisponível",
        "O horário selecionado não está disponível para este dia."
      );
      return;
    }

    // início deve ser antes do horário de encerramento (exibição)
    if (!validaIntervalo(horaInicio, horaTermino)) {
      abrirModal(
        "error",
        "Horários inconsistentes",
        `O início precisa ser antes de ${horaTermino}.`
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

    // catálogo correto pelo dia + horário de início
    const catalogoSelecionado = catalogoComputadores.find(
      (c) =>
        c.diaSemana === diaSemanaBackSelecionado &&
        c.horaInicio === horaInicio
    );

    if (!catalogoSelecionado?.id) {
      console.error(
        "[AgendamentoComputadores] Não encontrou catálogo para",
        diaSemanaBackSelecionado,
        horaInicio
      );
      abrirModal(
        "error",
        "Configuração inválida",
        "Não foi possível localizar o catálogo correspondente para esse horário. Avise o coordenador."
      );
      return;
    }

    const catalogoId =
      catalogoSelecionado.id || COMPUTADORES_CATALOGO_FALLBACK_ID;

    try {
      await salvarReservaFormatoBack({
        idUsuario: hostId,
        catalogoId,
        dataJS: dia.dataCompleta,
        horaInicioHHMM: horaInicio,
        // término fixo (o mesmo que você mostra na tela)
        horaFimHHMM: HORARIO_TERMINO_COMPUTADOR_FIXO,
        msgUsuario: `Reserva de computadores - máquina: ${computadorSelecionado}`,
      });

      abrirModal(
        "success",
        "Reserva realizada com sucesso!",
        "Seu pedido foi enviado e está aguardando aprovação."
      );
      // cancelar(); // se quiser limpar o formulário depois
    } catch (err) {
      console.error("ERRO SALVAR RESERVA [COMPUTADORES]:", err);
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
            <span className="font-medium font-sans">Computadores</span>
          </h1>
        </div>

        {/* Seleção semana e data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-10">
          <TrocaSemana
            value={semanaSelecionada}
            onChange={setSemanaSelecionada}
          />
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
        {temHorariosParaDia ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Início */}
              <GradeHorarios
                titulo="Horário de início:"
                opcoes={horariosInicioDisponiveis}
                selecionado={horaInicio}
                onSelect={setHoraInicio}
                isDisabled={(t) => {
                  const passado = isHoje && timeToMin(t) <= nowMinutes;
                  const depoisTermino =
                    timeToMin(t) >= timeToMin(horaTermino);
                  return passado || depoisTermino;
                }}
                comFiltro={true}
                filtro={horaInicioFiltro}
                onFiltroChange={setHoraInicioFiltro}
              />

              {/* Término fixo (exibição) */}
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-medium text-black dark:text-white">
                  Horário de término:
                </h2>

                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-[#F7F7F7] dark:bg-[#151515] text-black dark:text-white">
                  <p className="text-sm leading-relaxed">
                    Todos devem desocupar os computadores até{" "}
                    <span
                      className="font-semibold"
                      style={{ color: COR_VERMELHO }}
                    >
                      {horaTermino}
                    </span>
                    .
                  </p>

                  {horaInicio &&
                    timeToMin(horaInicio) >= timeToMin(horaTermino) && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                        O início precisa ser antes do término.
                      </p>
                    )}
                </div>
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
                <span
                  className="font-semibold"
                  style={{ color: COR_VERMELHO }}
                >
                  OBS:
                </span>{" "}
                <span className="text-[#1E1E1E] dark:text-gray-200">
                  Informe apenas o horário de início. Todos devem desocupar os
                  computadores até, no máximo, às {HORARIO_TERMINO_COMPUTADOR_FIXO}.
                </span>
              </p>
            </div>
          </>
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
