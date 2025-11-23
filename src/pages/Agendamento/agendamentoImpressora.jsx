// src/pages/Agendamentos/AgendamentoImpressoras.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

import sucessoIcon from "../../assets/sucesso.svg";

import TrocaSemana from "../../components/ComponentsDeAgendamento/TrocaSemana";
import SeletorDia from "../../components/ComponentsDeAgendamento/SeletorDia";
import GradeHorarios from "../../components/ComponentsDeAgendamento/GradeHorarios";
import ModalDeAgendamento from "../../components/ComponentsDeAgendamento/ModalDeAgendamento";
import SeletorImpressoras from "../../components/ComponentsDeAgendamento/SeletorImpressoras";

import {
  COR_VERMELHO,
  montarDiasSemana,
  paraMinutos,
  HORARIOS_INICIO_IMPRESSORA,
} from "../../components/ComponentsDeAgendamento/FuncoesCompartilhada";

import { salvarReservaFormatoBack } from "../../service/reserva";
import { api } from "../../service/api";

/* ===== IDs fixos / helpers ===== */
// ambiente das impressoras 3D (AJUSTE se no back for outro id)
const IMPRESSORA_AMBIENTE_ID = 4;
// fallback de catálogo (só se algo der errado na busca)
const IMPRESSORA_CATALOGO_FALLBACK_ID = 4;

/* dias da semana como o back usa */
const DIAS_BACK = [
  "DOMINGO",
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
];

/* ===== helpers JWT ===== */
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

/* helpers de horário */
const timeToMin = (s) => paraMinutos(s || "");

function toHHMM(hora) {
  return String(hora || "").slice(0, 5);
}

/**
 * Gera os horários de início disponíveis a partir das faixas do catálogo.
 */
function gerarSlotsPorFaixas(faixas) {
  if (!Array.isArray(faixas) || !faixas.length) {
    return [];
  }

  const inicioSet = new Set();
  faixas.forEach((f) => {
    if (f.horaInicio) inicioSet.add(toHHMM(f.horaInicio));
  });

  const inicio = Array.from(inicioSet).sort(
    (a, b) => timeToMin(a) - timeToMin(b)
  );

  return inicio;
}

export default function AgendamentoImpressoras() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const [horaInicio, setHoraInicio] = useState(null);
  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");

  const [impressorasSelecionadas, setImpressorasSelecionadas] = useState([]);

  // catálogo das impressoras vindo do back
  const [catalogoImpressoras, setCatalogoImpressoras] = useState([]);

  // Modal
  const [modal, setModal] = useState({
    aberto: false,
    tipo: "success", // "success" | "error"
    titulo: "",
    mensagem: "",
  });
  const modalBtnRef = useRef(null);

  // Monta dias (seg–sáb), respeitando “essa/próxima” e bloqueando dias passados
  const diasDaSemana = useMemo(
    () => montarDiasSemana(semanaSelecionada === "essa" ? 0 : 1),
    [semanaSelecionada]
  );

  // Controle de "hoje" para desabilitar horários passados
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    }, 30000);
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

  // Garante que o dia selecionado não esteja desabilitado
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

  // ===== carrega catálogo das impressoras =====
  useEffect(() => {
    let cancelado = false;

    async function carregarCatalogoImpressoras() {
      try {
        const resp = await api.get("/catalogo/buscar");
        const data = Array.isArray(resp?.data) ? resp.data : resp;

        if (!Array.isArray(data)) {
          console.warn(
            "[AgendamentoImpressoras] /catalogo/buscar não retornou array:",
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

          // heurística: ambiente de impressoras
          const isImpressora =
            ambienteId === IMPRESSORA_AMBIENTE_ID ||
            nomeAmbiente.includes("impressora") ||
            nomeAmbiente.includes("3d");

          const isDisponivel =
            !disponibilidadeItem || disponibilidadeItem === "DISPONIVEL";

          return {
            id: catalogoIdItem,
            diaSemana: diaSemanaNormalizado,
            horaInicio: toHHMM(item.horaInicio),
            horaFim: toHHMM(item.horaFim),
            isImpressora,
            isDisponivel,
          };
        });

        console.log("[AgendamentoImpressoras] catálogo completo:", mapeado);

        const apenasImpressoras = mapeado.filter(
          (it) => it.isImpressora && it.isDisponivel
        );

        console.log(
          "[AgendamentoImpressoras] apenas impressoras:",
          apenasImpressoras
        );

        if (!cancelado) {
          setCatalogoImpressoras(
            apenasImpressoras.map((it) => ({
              id: it.id,
              diaSemana: it.diaSemana,
              horaInicio: it.horaInicio,
              horaFim: it.horaFim,
            }))
          );
        }
      } catch (err) {
        console.error(
          "Erro ao buscar catálogo das impressoras:",
          err
        );
      }
    }

    carregarCatalogoImpressoras();

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
    const faixas = catalogoImpressoras.filter(
      (c) => c.diaSemana === diaSemanaBackSelecionado
    );
    console.log(
      "[AgendamentoImpressoras] faixasDoDia para",
      diaSemanaBackSelecionado,
      faixas
    );
    return faixas;
  }, [catalogoImpressoras, diaSemanaBackSelecionado]);

  // horários de início realmente disponíveis no dia
  const horariosInicioDisponiveis = useMemo(() => {
    const inicioCat = gerarSlotsPorFaixas(faixasDoDia);

    // Se quiser, pode intersectar com HORARIOS_INICIO_IMPRESSORA:
    // return HORARIOS_INICIO_IMPRESSORA.filter((h) => inicioCat.includes(h));
    // ou usar só o que vem do catálogo:
    if (inicioCat.length > 0) return inicioCat;

    // fallback: lista fixa (se catálogo não estiver configurado ainda)
    return HORARIOS_INICIO_IMPRESSORA;
  }, [faixasDoDia]);

  const temHorariosParaDia = horariosInicioDisponiveis.length > 0;

  function cancelar() {
    setSemanaSelecionada("essa");
    setDiaSelecionado(0);
    setHoraInicio(null);
    setHoraInicioFiltro("");
    setImpressorasSelecionadas([]);
  }

  // limpa seleção ao trocar de dia
  useEffect(() => {
    setHoraInicio(null);
    setHoraInicioFiltro("");
  }, [diaSemanaBackSelecionado]);

  async function confirmar() {
    const dia = diasDaSemana[diaSelecionado];

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

    if (!horaInicio) {
      abrirModal(
        "error",
        "Selecione o horário",
        "Escolha o horário de início."
      );
      return;
    }

    if (!impressorasSelecionadas.length) {
      abrirModal(
        "error",
        "Selecione a impressora",
        "Escolha ao menos uma impressora."
      );
      return;
    }

    if (isHoje && paraMinutos(horaInicio) <= nowMinutes) {
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

    // escolhe o catálogo certinho pelo dia + horário de início
    const catalogoSelecionado = faixasDoDia.find(
      (c) =>
        c.diaSemana === diaSemanaBackSelecionado &&
        c.horaInicio === horaInicio
    );

    if (!catalogoSelecionado?.id) {
      console.error(
        "[AgendamentoImpressoras] Não encontrou catálogo para",
        diaSemanaBackSelecionado,
        horaInicio,
        faixasDoDia
      );
      abrirModal(
        "error",
        "Configuração inválida",
        "Não foi possível localizar o catálogo correspondente para esse horário. Avise o coordenador."
      );
      return;
    }

    const catalogoId =
      catalogoSelecionado.id || IMPRESSORA_CATALOGO_FALLBACK_ID;
    const horaFimHHMM = catalogoSelecionado.horaFim; // usamos o término configurado no catálogo

    const msgUsuario = `Reserva das impressoras 3D. Impressoras: ${impressorasSelecionadas.join(
      ", "
    )}.`;

    try {
      await salvarReservaFormatoBack({
        idUsuario: hostId,
        catalogoId,
        dataJS: dia.dataCompleta,
        horaInicioHHMM: horaInicio,
        horaFimHHMM,
        msgUsuario,
      });

      abrirModal(
        "success",
        "Reserva realizada com sucesso!",
        "Sua solicitação foi enviada e está aguardando aprovação."
      );
      // cancelar();
    } catch (err) {
      console.error("ERRO SALVAR RESERVA [IMPRESSORA]:", err);
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
            <span className="font-medium font-sans">Impressoras 3D</span>
          </h1>
        </div>

        {/* Seleção de semana e dia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-10">
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

        {/* Conteúdo */}
        {temHorariosParaDia ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* ESQUERDA: horários + OBS (embaixo, à esquerda) */}
            <div>
              <GradeHorarios
                titulo="Horário de início:"
                opcoes={horariosInicioDisponiveis}
                selecionado={horaInicio}
                onSelect={setHoraInicio}
                isDisabled={(t) =>
                  isHoje && paraMinutos(t) <= nowMinutes
                }
                comFiltro={true}
                filtro={horaInicioFiltro}
                onFiltroChange={setHoraInicioFiltro}
              />

              <p className="mt-4 text-sm leading-5 md:pr-12">
                <span
                  className="font-semibold"
                  style={{ color: COR_VERMELHO }}
                >
                  OBS:
                </span>{" "}
                <span className="text-[#1E1E1E] dark:text-gray-200">
                  Informe apenas o horário de início. O tempo de impressão
                  pode variar e não é necessário informar o horário de
                  término — ele é definido automaticamente conforme o
                  catálogo configurado.
                </span>
              </p>
            </div>

            {/* DIREITA: Seletor de Impressoras */}
            <div>
              <SeletorImpressoras
                selecionados={impressorasSelecionadas}
                onChange={setImpressorasSelecionadas}
                quantidade={6}
              />
            </div>
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
