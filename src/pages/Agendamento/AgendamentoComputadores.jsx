// src/pages/Agendamentos/AgendamentoComputadores.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  paraMinutos,
} from "../../components/ComponentsDeAgendamento/FuncoesCompartilhada";

import { salvarReservaFormatoBack } from "../../service/reserva";
import { buscarTodosAmbientes } from "../../service/ambiente";
import { buscarCatalogosPorAmbiente } from "../../service/catalogo";
import { normalizarChave } from "../../utils/ambientes";

const DIAS_BACK = [
  "DOMINGO",
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
];

function ehAmbienteComputador(nome) {
  const chave = normalizarChave(nome);
  return (
    chave.startsWith("pc") ||
    chave.includes("computador") ||
    chave.includes("laboratoriopc") ||
    chave.includes("laboratorio")
  );
}

function extrairNumeroComputador(nome) {
  const match = String(nome || "").match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function obterLabelComputador(nome, numero, fallbackId) {
  if (nome && nome.trim()) return nome.trim();
  if (Number.isFinite(numero)) return `PC${numero}`;
  return `PC-${fallbackId}`;
}

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

function normalizarCatalogo(item) {
  if (!item) return null;

  const disponibilidade = String(
    item?.disponibilidade || item?.ambiente?.disponibilidade || ""
  ).toUpperCase();

  if (disponibilidade && disponibilidade !== "DISPONIVEL") {
    return null;
  }

  const diaSemana = String(item?.diaSemana || "").trim().toUpperCase();
  const horaInicio = toHHMM(item?.horaInicio);
  const horaFim = toHHMM(item?.horaFim);

  if (!diaSemana || !horaInicio || !horaFim) return null;

  return {
    id: item?.id ?? item?.catalogoId ?? null,
    diaSemana,
    horaInicio,
    horaFim,
  };
}

function gerarSlotsComPasso15(faixas) {
  if (!Array.isArray(faixas) || !faixas.length) {
    return [];
  }

  const inicioSet = new Set();

  faixas.forEach((f) => {
    const iniMin = paraMinutos(f.horaInicio);
    const fimMin = paraMinutos(f.horaFim);
    if (!Number.isFinite(iniMin) || !Number.isFinite(fimMin)) return;
    if (fimMin <= iniMin) return;

    for (let m = iniMin; m < fimMin; m += 15) {
      inicioSet.add(minToHHMM(m));
    }
  });

  const inicio = Array.from(inicioSet).sort(
    (a, b) => paraMinutos(a) - paraMinutos(b)
  );

  return inicio;
}

export default function AgendamentoComputadores() {
  const navigate = useNavigate(); // ✅ navegação
  const [semanaSelecionada, setSemanaSelecionada] = useState("essa");
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const [horaInicio, setHoraInicio] = useState(null);
  const horaTermino = HORARIO_TERMINO_COMPUTADOR_FIXO;

  const [horaInicioFiltro, setHoraInicioFiltro] = useState("");

  const [computadores, setComputadores] = useState([]);
  const [computadorSelecionado, setComputadorSelecionado] = useState(null);

  const [catalogosPorAmbiente, setCatalogosPorAmbiente] = useState({});
  const [catalogoComputadores, setCatalogoComputadores] = useState([]);

  const [carregandoCatalogos, setCarregandoCatalogos] = useState(false);

  const [loading, setLoading] = useState(false); // ✅ loading

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

  function cancelar() {
    navigate(-1); // ✅ volta pra tela anterior
  }

  useEffect(() => {
    setHoraInicioFiltro("");
    setHoraInicio(null);
  }, [semanaSelecionada, diaSelecionado]);

  useEffect(() => {
    let ativo = true;

    (async () => {
      try {
        const ambientes = await buscarTodosAmbientes();
        if (!ativo) return;

        const lista = Array.isArray(ambientes) ? ambientes : [];
        const computadoresMapeados = lista
          .map((amb) => ({
            id: Number(amb?.id),
            nome: amb?.nome || amb?.nomeAmbiente || "",
          }))
          .filter((amb) => Number.isFinite(amb.id) && ehAmbienteComputador(amb.nome))
          .map((amb) => {
            const numero = extrairNumeroComputador(amb.nome);
            return {
              ...amb,
              numero,
              label: obterLabelComputador(amb.nome, numero, amb.id),
            };
          })
          .sort((a, b) => {
            if (Number.isFinite(a.numero) && Number.isFinite(b.numero)) {
              return a.numero - b.numero;
            }
            return a.label.localeCompare(b.label);
          });

        setComputadores(computadoresMapeados);
      } catch (err) {
        console.error("[AgendamentoComputadores] Erro ao buscar ambientes:", err);
        if (ativo) setComputadores([]);
      }
    })();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!computadores.length) {
      setCatalogosPorAmbiente({});
      return;
    }

    let ativo = true;
    setCarregandoCatalogos(true);

    (async () => {
      try {
        const entries = await Promise.all(
          computadores.map(async (pc) => {
            try {
              const data = await buscarCatalogosPorAmbiente(pc.id);
              const lista = Array.isArray(data)
                ? data.map(normalizarCatalogo).filter(Boolean)
                : [];
              return [pc.id, lista];
            } catch (err) {
              console.error(
                `[AgendamentoComputadores] Erro ao carregar catálogo do ambiente ${pc.id}:`,
                err
              );
              return [pc.id, []];
            }
          })
        );

        if (!ativo) return;

        const mapa = {};
        entries.forEach(([id, lista]) => {
          mapa[id] = lista;
        });
        setCatalogosPorAmbiente(mapa);
      } finally {
        if (ativo) setCarregandoCatalogos(false);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [computadores]);

  useEffect(() => {
    if (!computadorSelecionado && computadores.length) {
      setComputadorSelecionado(computadores[0].id);
      return;
    }

    if (!computadorSelecionado) {
      setCatalogoComputadores([]);
      return;
    }

    const catalogos = catalogosPorAmbiente[computadorSelecionado];
    setCatalogoComputadores(Array.isArray(catalogos) ? catalogos : []);
  }, [computadores, computadorSelecionado, catalogosPorAmbiente]);

  const diaSemanaBackSelecionado = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return null;
    return DIAS_BACK[dia.getDay()];
  }, [diasDaSemana, diaSelecionado]);

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

  const horariosInicioDisponiveis = useMemo(
    () => gerarSlotsComPasso15(faixasDoDia),
    [faixasDoDia]
  );

  useEffect(() => {
    if (!horaInicio) return;
    if (!horariosInicioDisponiveis.includes(horaInicio)) {
      setHoraInicio(null);
    }
  }, [horariosInicioDisponiveis, horaInicio]);

  const temHorariosParaDia = horariosInicioDisponiveis.length > 0;

  async function confirmar() {
    if (loading) return;
    setLoading(true); // ✅ começa loading

    try {
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

      const faixaQueCobre = faixasDoDia.find((f) => {
        const iniFaixa = paraMinutos(f.horaInicio);
        const fimFaixa = paraMinutos(f.horaFim);
        const iniSel = paraMinutos(horaInicio);
        const fimSel = paraMinutos(horaTermino);
        return iniSel >= iniFaixa && fimSel <= fimFaixa;
      });

      if (!faixaQueCobre?.id) {
        console.error(
          "[AgendamentoComputadores] Não encontrou faixa que cubra o intervalo",
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
      const computadorInfo = computadores.find(
        (c) => c.id === computadorSelecionado
      );
      const computadorLabel =
        computadorInfo?.label || `Computador ${computadorSelecionado}`;

      await salvarReservaFormatoBack({
        idUsuario: hostId,
        catalogoId,
        dataJS: dia.dataCompleta,
        horaInicioHHMM: horaInicio,
        horaFimHHMM: horaTermino,
        msgUsuario: `Reserva de computadores - máquina: ${computadorLabel}`,
      });

      abrirModal(
        "success",
        "Reserva realizada com sucesso!",
        "Seu pedido foi enviado e está aguardando aprovação."
      );
    } catch (err) {
      console.error("ERRO SALVAR RESERVA [COMPUTADORES]:", err);
      const msg =
        err?.data?.message ||
        err?.message ||
        `Erro ao comunicar com o servidor. [${err?.status || ""}]`;
      abrirModal("error", "Falha ao reservar", msg);
    } finally {
      setLoading(false); // ✅ termina loading
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
            <span className="font-medium font-sans">Computadores</span>
          </h1>
        </div>

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

        {!computadores.length && !carregandoCatalogos && (
          <div className="mb-6 rounded-md border border-dashed border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            Nenhum computador foi encontrado no cadastro de ambientes. Peça a um administrador para revisar os ambientes PC1–PC5.
          </div>
        )}

        {carregandoCatalogos ? (
          <div className="mt-6 bg-[#F5F5F5] dark:bg-[#111111] rounded-md px-4 py-8 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm md:text-base gap-3">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Carregando catálogos de computadores...
          </div>
        ) : temHorariosParaDia ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GradeHorarios
                titulo="Horário de início:"
                opcoes={horariosInicioDisponiveis}
                selecionado={horaInicio}
                onSelect={setHoraInicio}
                isDisabled={(t) => {
                  const passado = isHoje && paraMinutos(t) <= nowMinutes;
                  const depoisTermino =
                    paraMinutos(t) >= paraMinutos(horaTermino);
                  return passado || depoisTermino;
                }}
                comFiltro={true}
                filtro={horaInicioFiltro}
                onFiltroChange={setHoraInicioFiltro}
              />

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
                    paraMinutos(horaInicio) >= paraMinutos(horaTermino) && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                        O início precisa ser antes do término.
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <SeletorComputadores
                valor={computadorSelecionado}
                onChange={(id) => setComputadorSelecionado(id)}
                opcoes={computadores.map((comp) => ({
                  id: comp.id,
                  label: comp.label,
                  numero: comp.numero,
                }))}
                isDisabled={(id) =>
                  carregandoCatalogos ||
                  !(catalogosPorAmbiente[id]?.length)
                }
              />

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
