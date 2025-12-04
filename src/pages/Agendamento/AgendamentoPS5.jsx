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
import { buscarTodosAmbientes } from "../../service/ambiente";

// Nome do ambiente para buscar no backend
const AMBIENTE_NOME = "PS5";

const DIAS_BACK = [
  "DOMINGO",
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
];

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

function toHHMM(hora) {
  return String(hora || "").slice(0, 5);
}

function minToHHMM(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function gerarSlotsComPasso15(faixas) {
  if (!Array.isArray(faixas) || !faixas.length) {
    return { inicio: [], termino: [] };
  }

  const inicioSet = new Set();
  const terminoSet = new Set();

  faixas.forEach((f) => {
    const iniMin = paraMinutos(f.horaInicio);
    const fimMin = paraMinutos(f.horaFim);
    if (!Number.isFinite(iniMin) || !Number.isFinite(fimMin)) return;
    if (fimMin <= iniMin) return;

    for (let m = iniMin; m < fimMin; m += 15) {
      inicioSet.add(minToHHMM(m));
    }
    for (let m = iniMin + 15; m <= fimMin; m += 15) {
      terminoSet.add(minToHHMM(m));
    }
  });

  const inicio = Array.from(inicioSet).sort(
    (a, b) => paraMinutos(a) - paraMinutos(b)
  );
  const termino = Array.from(terminoSet).sort(
    (a, b) => paraMinutos(a) - paraMinutos(b)
  );

  return { inicio, termino };
}

export default function AgendamentoPS5() {
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTermino, setHoraTermino] = useState(null);

  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");
  const [horaTerminoFiltro, setHoraTerminoFiltro] = useState("");

  const [catalogoPS5, setCatalogoPS5] = useState([]);
  const [ambienteId, setAmbienteId] = useState(null);

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

  useEffect(() => {
    const idxValido = diasDaSemana.findIndex((d) => !d.desabilitado);
    if (idxValido === -1 && semanaSelecionada === "essa") {
      setSemanaSelecionada("proxima");
      setDiaSelecionado(0);
    } else if (idxValido !== -1 && diasDaSemana[diaSelecionado]?.desabilitado) {
      setDiaSelecionado(idxValido);
    }
  }, [diasDaSemana, diaSelecionado, semanaSelecionada]);

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

  // Busca os ambientes e o catálogo, filtrando pelo nome do ambiente
  useEffect(() => {
    let cancelado = false;

    async function carregarDados() {
      try {
        // 1. Buscar todos os ambientes para encontrar o ID do PS5
        console.log(`[AgendamentoPS5] Buscando ambientes...`);
        const ambientes = await buscarTodosAmbientes();
        console.log("[AgendamentoPS5] Ambientes recebidos:", ambientes);

        if (!Array.isArray(ambientes)) {
          console.warn("[AgendamentoPS5] /ambiente/buscar não retornou array:", ambientes);
          return;
        }

        // Log todos os ambientes para debug
        console.log("[AgendamentoPS5] Lista de ambientes:", ambientes.map(a => ({ id: a?.id, nome: a?.nome })));

        // Encontrar o ambiente PS5 pelo nome (case-insensitive)
        const ambientePS5 = ambientes.find((amb) => {
          const nome = String(amb?.nome || "").toLowerCase();
          const match = nome.includes("ps5") || nome.includes("playstation");
          console.log(`[AgendamentoPS5] Verificando ambiente: "${amb?.nome}" -> match: ${match}`);
          return match;
        });

        if (!ambientePS5) {
          console.warn("[AgendamentoPS5] Ambiente PS5 não encontrado. Ambientes disponíveis:", 
            ambientes.map(a => a?.nome));
          return;
        }

        const idAmbientePS5 = ambientePS5.id;
        console.log(`[AgendamentoPS5] Ambiente PS5 encontrado - ID: ${idAmbientePS5}, Nome: ${ambientePS5.nome}`);
        
        if (!cancelado) {
          setAmbienteId(idAmbientePS5);
        }

        // 2. Buscar o catálogo
        console.log(`[AgendamentoPS5] Buscando catálogo...`);
        const resp = await api.get("/catalogo/buscar");
        const catalogoData = Array.isArray(resp?.data) ? resp.data : resp;

        console.log("[AgendamentoPS5] Catálogo completo recebido:", catalogoData?.length, "itens");

        if (!Array.isArray(catalogoData)) {
          console.warn("[AgendamentoPS5] /catalogo/buscar não retornou array:", catalogoData);
          return;
        }

        // 3. Filtrar o catálogo pelo ID do ambiente PS5
        const catalogoFiltrado = catalogoData.filter((item) => {
          const ambienteIdItem = item?.ambiente?.id ?? item?.ambienteId ?? item?.idAmbiente ?? null;
          return ambienteIdItem === idAmbientePS5;
        });

        console.log(`[AgendamentoPS5] Catálogo filtrado para PS5 (ID ${idAmbientePS5}):`, catalogoFiltrado.length, "itens");
        console.log(`[AgendamentoPS5] Itens filtrados:`, catalogoFiltrado);

        const mapeado = catalogoFiltrado.map((item) => {
          const catalogoIdItem = item?.id ?? null;

          const disponibilidadeItem = String(
            item?.disponibilidade || item?.ambiente?.disponibilidade || ""
          ).toUpperCase();

          const diaSemanaNormalizado = String(item.diaSemana || "")
            .trim()
            .toUpperCase();

          const isDisponivel =
            !disponibilidadeItem || disponibilidadeItem === "DISPONIVEL";

          return {
            id: catalogoIdItem,
            diaSemana: diaSemanaNormalizado,
            horaInicio: toHHMM(item.horaInicio),
            horaFim: toHHMM(item.horaFim),
            isDisponivel,
          };
        });

        const catalogoDisponivel = mapeado.filter((it) => it.isDisponivel);

        console.log(`[AgendamentoPS5] Catálogo disponível final:`, catalogoDisponivel);

        if (!cancelado) {
          setCatalogoPS5(
            catalogoDisponivel.map((it) => ({
              id: it.id,
              diaSemana: it.diaSemana,
              horaInicio: it.horaInicio,
              horaFim: it.horaFim,
            }))
          );
        }
      } catch (err) {
        console.error("[AgendamentoPS5] Erro ao carregar dados:", err);
      }
    }

    carregarDados();

    return () => {
      cancelado = true;
    };
  }, []);

  const diaSemanaBackSelecionado = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return null;
    return DIAS_BACK[dia.getDay()];
  }, [diasDaSemana, diaSelecionado]);

  const faixasDoDia = useMemo(() => {
    if (!diaSemanaBackSelecionado) return [];
    const faixas = catalogoPS5.filter(
      (c) => c.diaSemana === diaSemanaBackSelecionado
    );
    console.log(
      "[AgendamentoPS5] faixasDoDia para",
      diaSemanaBackSelecionado,
      faixas
    );
    return faixas;
  }, [catalogoPS5, diaSemanaBackSelecionado]);

  useEffect(() => {
    setHoraInicio(null);
    setHoraTermino(null);
    setHoraInicioFiltro("");
    setHoraTerminoFiltro("");
  }, [diaSemanaBackSelecionado]);

  const {
    inicio: horariosInicioDisponiveis,
    termino: horariosTerminoDisponiveis,
  } = useMemo(() => gerarSlotsComPasso15(faixasDoDia), [faixasDoDia]);

  const temHorariosParaDia =
    horariosInicioDisponiveis.length > 0 ||
    horariosTerminoDisponiveis.length > 0;

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

    const faixaQueCobre = faixasDoDia.find((f) => {
      const iniFaixa = paraMinutos(f.horaInicio);
      const fimFaixa = paraMinutos(f.horaFim);
      const iniSel = paraMinutos(horaInicio);
      const fimSel = paraMinutos(horaTermino);
      return iniSel >= iniFaixa && fimSel <= fimFaixa;
    });

    if (!faixaQueCobre?.id) {
      console.error(
        "[AgendamentoPS5] Não encontrou faixa que cubra o intervalo",
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

    const catalogoId = faixaQueCobre.id;

    try {
      await salvarReservaFormatoBack({
        idUsuario: hostId,
        catalogoId,
        dataJS: dia.dataCompleta,
        horaInicioHHMM: horaInicio,
        horaFimHHMM: horaTermino,
        msgUsuario: "Reserva do PS5",
      });

      abrirModal(
        "success",
        "Reserva realizada com sucesso!",
        "Sua solicitação foi enviada e está aguardando aprovação."
      );
    } catch (err) {
      console.error("ERRO SALVAR RESERVA [PS5]:", err);
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
        <div
          className="w-full rounded-md text-white px-6 py-5 mb-6 text-center"
          style={{ backgroundColor: COR_VERMELHO }}
        >
          <h1 className="text-xl md:text-2xl font-regular font-sans">
            Agendamento <span className="opacity-70">–</span>{" "}
            <span className="font-medium font-sans">PS5</span>
          </h1>
        </div>

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

        {temHorariosParaDia ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GradeHorarios
              titulo="Horário de início:"
              opcoes={horariosInicioDisponiveis}
              selecionado={horaInicio}
              onSelect={setHoraInicio}
              isDisabled={(t) => isHoje && paraMinutos(t) <= nowMinutes}
              comFiltro={true}
              filtro={horaInicioFiltro}
              onFiltroChange={setHoraInicioFiltro}
            />

            <GradeHorarios
              titulo="Horário de término:"
              opcoes={horariosTerminoDisponiveis}
              selecionado={horaTermino}
              onSelect={setHoraTermino}
              isDisabled={(t) => isHoje && paraMinutos(t) <= nowMinutes}
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
