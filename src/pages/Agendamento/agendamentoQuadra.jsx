import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { getSalasPageByProfile } from "../../utils/navigation";

const QUADRA_AMBIENTE_ID = 1;
const QUADRA_CATALOGO_FALLBACK_ID = 1;

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

const timeToMin = (s) => {
  const [h, m] = String(s || "")
    .slice(0, 5)
    .split(":")
    .map(Number);
  return h * 60 + m;
};

function toHHMM(hora) {
  return String(hora || "").slice(0, 5);
}

function gerarSlotsPorFaixas(faixas, passoMinutos = 15) {
  if (!Array.isArray(faixas) || !faixas.length) {
    return { inicio: [], termino: [] };
  }

  const inicioSet = new Set();
  const terminoSet = new Set();

  faixas.forEach((f) => {
    const ini = timeToMin(f.horaInicio);
    const fim = timeToMin(f.horaFim);

    if (!Number.isFinite(ini) || !Number.isFinite(fim) || fim <= ini) return;

    for (let t = ini; t + passoMinutos <= fim; t += passoMinutos) {
      inicioSet.add(t);
    }

    for (let t = ini + passoMinutos; t <= fim; t += passoMinutos) {
      terminoSet.add(t);
    }
  });

  const toHHMMFromMin = (min) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const inicio = Array.from(inicioSet)
    .sort((a, b) => a - b)
    .map(toHHMMFromMin);

  const termino = Array.from(terminoSet)
    .sort((a, b) => a - b)
    .map(toHHMMFromMin);

  return { inicio, termino };
}

export default function AgendamentoQuadra() {
  const navigate = useNavigate();
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTermino, setHoraTermino] = useState(null);
  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");
  const [horaTerminoFiltro, setHoraTerminoFiltro] = useState("");
  const [catalogoQuadra, setCatalogoQuadra] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    let cancelado = false;
    async function carregarCatalogoQuadra() {
      try {
        const resp = await api.get("/catalogo/buscar");
        const data = Array.isArray(resp?.data) ? resp.data : resp;
        if (!Array.isArray(data)) return;
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
        const apenasQuadra = mapeado.filter(
          (it) => it.isQuadra && it.isDisponivel
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

  const diaSemanaBackSelecionado = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return null;
    return DIAS_BACK[dia.getDay()];
  }, [diasDaSemana, diaSelecionado]);

  const faixasDoDia = useMemo(() => {
    if (!diaSemanaBackSelecionado) return [];
    return catalogoQuadra.filter(
      (c) => c.diaSemana === diaSemanaBackSelecionado
    );
  }, [catalogoQuadra, diaSemanaBackSelecionado]);

  useEffect(() => {
    setHoraInicio(null);
    setHoraTermino(null);
    setHoraInicioFiltro("");
    setHoraTerminoFiltro("");
  }, [diaSemanaBackSelecionado]);

  const {
    inicio: horariosInicioDisponiveis,
    termino: horariosTerminoDisponiveis,
  } = useMemo(() => gerarSlotsPorFaixas(faixasDoDia, 15), [faixasDoDia]);

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
    navigate(-1);
  }

  async function confirmar() {
    if (loading) return;
    setLoading(true);
    try {
      const hostId = getUserIdFromToken();
      if (!hostId) throw new Error("Usuário não identificado.");

      const dia = diasDaSemana[diaSelecionado];
      if (!dia) throw new Error("Selecione um dia válido.");

      const catalogoSelecionado = catalogoQuadra.find(
        (c) => c.diaSemana === diaSemanaBackSelecionado
      );
      const catalogoId =
        catalogoSelecionado?.id || QUADRA_CATALOGO_FALLBACK_ID;

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
    } catch (err) {
      abrirModal("error", "Falha ao reservar", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0B0B0B] flex justify-center">
      <div className="w-full max-w-5xl px-4 md:px-8 py-8">
        <div
          className="w-full rounded-md text-white px-6 py-5 mb-6 text-center relative"
          style={{ backgroundColor: COR_VERMELHO }}
        >
          <button
            onClick={() => navigate(getSalasPageByProfile())}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-colors"
            aria-label="Voltar para salas"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-regular font-sans">
            Agendamento <span className="opacity-70">–</span>{" "}
            <span className="font-medium font-sans">Quadra</span>
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

        <div className="mt-6 md:mt-4 flex flex-col md:flex-row gap-4 md:justify-end">
          <button
            type="button"
            onClick={cancelar}
            disabled={loading}
            className={`px-6 py-3 rounded-md bg-[#EDEDED] dark:bg-[#1a1a1a] text-[#1E1E1E] dark:text-white ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-[#AE0000] hover:text-white"
            } transition-colors duration-150`}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={confirmar}
            disabled={loading}
            className={`px-6 py-3 rounded-md text-white flex items-center justify-center gap-2 ${
              loading ? "opacity-80 cursor-wait" : ""
            }`}
            style={{ backgroundColor: COR_VERMELHO }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"></div>
                <span className="animate-pulse">Processando...</span>
              </>
            ) : (
              "Confirmar"
            )}
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
