import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ adicionado

import sucessoIcon from "../../assets/sucesso.svg";

import TrocaSemana from "../../components/ComponentsDeAgendamento/TrocaSemana";
import SeletorDia from "../../components/ComponentsDeAgendamento/SeletorDia";
import GradeHorarios from "../../components/ComponentsDeAgendamento/GradeHorarios";
import ModalDeAgendamento from "../../components/ComponentsDeAgendamento/ModalDeAgendamento";
import SeletorImpressoras from "../../components/ComponentsDeAgendamento/SeletorImpressoras";
import SeletorCatalogo from "../../components/ComponentsDeAgendamento/SeletorCatalogo";

import {
  COR_VERMELHO,
  montarDiasSemana,
  paraMinutos,
  HORARIOS_INICIO_IMPRESSORA,
} from "../../components/ComponentsDeAgendamento/FuncoesCompartilhada";

import { salvarReservaFormatoBack } from "../../service/reserva";
import { api } from "../../service/api";
import { getSalasPageByProfile } from "../../utils/navigation";

const IMPRESSORA_AMBIENTE_ID = 4;
const IMPRESSORA_CATALOGO_FALLBACK_ID = 4;

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

const timeToMin = (s) => paraMinutos(s || "");

function toHHMM(hora) {
  return String(hora || "").slice(0, 5);
}

function gerarSlotsPorFaixas(faixas, passoMinutos = 15) {
  if (!Array.isArray(faixas) || !faixas.length) {
    return [];
  }

  const inicioSet = new Set();

  faixas.forEach((f) => {
    const ini = timeToMin(f.horaInicio);
    const fim = timeToMin(f.horaFim);

    if (!Number.isFinite(ini) || !Number.isFinite(fim) || fim <= ini) return;

    for (let t = ini; t + passoMinutos <= fim; t += passoMinutos) {
      inicioSet.add(t);
    }
  });

  const toHHMMFromMin = (min) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  return Array.from(inicioSet)
    .sort((a, b) => a - b)
    .map(toHHMMFromMin);
}

export default function AgendamentoImpressoras() {
  const navigate = useNavigate(); // ✅
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const [horaInicio, setHoraInicio] = useState(null);
  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");

  const [impressorasSelecionadas, setImpressorasSelecionadas] = useState([]);

  const [catalogoImpressoras, setCatalogoImpressoras] = useState([]);
  const [selectedCatalogo, setSelectedCatalogo] = useState(null);

  const [loading, setLoading] = useState(false); // ✅

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

        const apenasImpressoras = mapeado.filter(
          (it) => it.isImpressora && it.isDisponivel
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
        console.error("Erro ao buscar catálogo das impressoras:", err);
      }
    }

    carregarCatalogoImpressoras();

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
    if (selectedCatalogo) {
      if (selectedCatalogo.isDisponivel === false) return [];
      const normalized = {
        id: selectedCatalogo.id,
        diaSemana: String(selectedCatalogo.diaSemana || selectedCatalogo.dia || "").trim().toUpperCase(),
        horaInicio: toHHMM(selectedCatalogo.horaInicio),
        horaFim: toHHMM(selectedCatalogo.horaFim),
      };
      return normalized.diaSemana === diaSemanaBackSelecionado ? [normalized] : [];
    }
    const faixas = catalogoImpressoras.filter((c) => c.diaSemana === diaSemanaBackSelecionado);
    return faixas;
  }, [catalogoImpressoras, diaSemanaBackSelecionado, selectedCatalogo]);

  const horariosInicioDisponiveis = useMemo(() => {
    const inicioCat = gerarSlotsPorFaixas(faixasDoDia, 15);
    return inicioCat.length > 0 ? inicioCat : HORARIOS_INICIO_IMPRESSORA;
  }, [faixasDoDia]);

  const temHorariosParaDia = horariosInicioDisponiveis.length > 0;

  function cancelar() {
    navigate(-1); // ✅ voltar pra tela anterior
  }

  useEffect(() => {
    setHoraInicio(null);
    setHoraInicioFiltro("");
  }, [diaSemanaBackSelecionado]);

  async function confirmar() {
    if (loading) return;
    setLoading(true); // ✅ inicia o loading
    try {
      if (selectedCatalogo && selectedCatalogo.isDisponivel === false) {
        abrirModal("error", "Catálogo indisponível", "O catálogo selecionado está indisponível e não aceita reservas.");
        return;
      }
      const dia = diasDaSemana[diaSelecionado];
      const hostId = getUserIdFromToken();
      if (!hostId) throw new Error("Sessão inválida.");

      const catalogoSelecionado = faixasDoDia.find((c) => {
        const cIni = paraMinutos(c.horaInicio);
        const cFim = paraMinutos(c.horaFim);
        return (
          c.diaSemana === diaSemanaBackSelecionado &&
          paraMinutos(horaInicio) >= cIni &&
          paraMinutos(horaInicio) < cFim
        );
      });

      const catalogoId =
        catalogoSelecionado?.id || IMPRESSORA_CATALOGO_FALLBACK_ID;
      const horaFimHHMM = catalogoSelecionado?.horaFim;
      const msgUsuario = `Reserva das impressoras 3D. Impressoras: ${impressorasSelecionadas.join(
        ", "
      )}.`;

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
    } catch (err) {
      abrirModal("error", "Falha ao reservar", err.message);
    } finally {
      setLoading(false); // ✅ encerra o loading
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
            <span className="font-medium font-sans">Impressoras 3D</span>
          </h1>
        </div>

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

        <div className="mb-4">
              <SeletorCatalogo
                ambienteId={IMPRESSORA_AMBIENTE_ID}
                diaSemana={diaSemanaBackSelecionado}
                selectedCatalogo={selectedCatalogo}
                onSelect={(c) => setSelectedCatalogo(c ? c : null)}
              />
        </div>
        {temHorariosParaDia ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
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

              <p className="mt-4 text-sm leading-5 md:pr-12">
                <span
                  className="font-semibold"
                  style={{ color: COR_VERMELHO }}
                >
                  OBS:
                </span>{" "}
                <span className="text-[#1E1E1E] dark:text-gray-200">
                  Informe apenas o horário de início. O tempo de impressão
                  pode variar e o término é definido automaticamente conforme
                  o catálogo configurado para as impressoras.
                </span>
              </p>
            </div>

            <div>
              <SeletorImpressoras
                selecionados={impressorasSelecionadas}
                onChange={setImpressorasSelecionadas}
                quantidade={6}
              />
              
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-[#F5F5F5] dark:bg-[#111111] rounded-md px-4 py-8 flex itens-center justify-center text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Nenhum horário disponível para este dia.
          </div>
        )}

        <div className="mt-6 md:mt-4 flex flex-col md:flex-row gap-4 md:justify-end">
          <button
            type="button"
            onClick={cancelar}
            disabled={loading}
            className={`px-6 py-3 rounded-md bg-[#EDEDED] text-[#1E1E1E] ${
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
