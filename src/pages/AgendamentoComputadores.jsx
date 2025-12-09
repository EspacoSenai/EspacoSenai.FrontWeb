import React, { useEffect, useMemo, useRef, useState } from "react";
import TrocaSemana from "../components/ComponentsDeAgendamento/TrocaSemana";
import SeletorDia from "../components/ComponentsDeAgendamento/SeletorDia";
import GradeHorarios from "../components/ComponentsDeAgendamento/GradeHorarios";
import SeletorComputadores from "../components/ComponentsDeAgendamento/SeletorComputadores";
import ModalDeAgendamento from "../components/ComponentsDeAgendamento/ModalDeAgendamento";
import SeletorCatalogo from "../components/ComponentsDeAgendamento/SeletorCatalogo";

import sucessoIcon from "../assets/sucesso.svg";

import {
  COR_VERMELHO,
  HORARIOS_INICIO_COMPUTADOR,
  HORARIO_TERMINO_COMPUTADOR_FIXO,
  montarDiasSemana,
  montarPayload,
} from "../components/ComponentsDeAgendamento/FuncoesCompartilhada";

import { salvarReservaFormatoBack } from "../service/reserva";
import { buscarTodosAmbientes } from "../service/ambiente";
import { api } from "../service/api";
import { buscarCatalogosPorAmbiente } from "../service/catalogo";

// Nome do ambiente - usado para buscar o ID dinamicamente
const AMBIENTE_NOME = "Computadores";

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
    // Normaliza base64 URL para base64
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
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

function toHHMM(hora) {
  return String(hora || "").slice(0, 5);
}

function gerarIniciosPorFaixas(faixas, passoMinutos = 15) {
  if (!Array.isArray(faixas) || !faixas.length) return [];

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

function gerarTerminosPorFaixas(faixas, horaInicioSelecionada, passoMinutos = 15) {
  if (!Array.isArray(faixas) || !faixas.length) return [];
  if (!horaInicioSelecionada) return [];

  const inicioMin = timeToMin(horaInicioSelecionada);

  const faixa = faixas.find((f) => {
    const ini = timeToMin(f.horaInicio);
    const fim = timeToMin(f.horaFim);
    return Number.isFinite(ini) && Number.isFinite(fim) && inicioMin >= ini && inicioMin < fim;
  });

  if (!faixa) return [];

  const faixaIni = timeToMin(faixa.horaInicio);
  const faixaFim = timeToMin(faixa.horaFim);

  const result = [];
  for (let t = inicioMin + passoMinutos; t <= faixaFim; t += passoMinutos) {
    result.push(t);
  }

  const toHHMMFromMin = (min) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  return result.map(toHHMMFromMin);
}

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

  // Estado para armazenar o ID do ambiente buscado dinamicamente
  const [ambienteId, setAmbienteId] = useState(null);
  const [loadingAmbiente, setLoadingAmbiente] = useState(true);

  const [selectedCatalogo, setSelectedCatalogo] = useState(null);
  const [catalogoComputadores, setCatalogoComputadores] = useState([]);
  const [loadingAmbiente, setLoadingAmbiente] = useState(true);

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

  // Buscar o ID do ambiente pelo nome ao montar
  useEffect(() => {
    let cancelado = false;
    async function fetchAmbiente() {
      try {
        console.log(`[AgendamentoComputadores] Buscando ambientes...`);
        const ambientes = await buscarTodosAmbientes();
        
        if (!Array.isArray(ambientes)) {
          console.warn("[AgendamentoComputadores] /ambiente/buscar não retornou array:", ambientes);
          return;
        }

        console.log("[AgendamentoComputadores] Lista de ambientes:", ambientes.map(a => ({ id: a?.id, nome: a?.nome })));

        // Encontrar o ambiente Computadores pelo nome (case-insensitive)
        const ambienteComputadores = ambientes.find((amb) => {
          const nome = String(amb?.nome || "").toLowerCase();
          return nome.includes("computador") || nome.includes("laboratório") || nome.includes("informática");
        });

        if (!cancelado && ambienteComputadores?.id) {
          setAmbienteId(ambienteComputadores.id);
          console.log(`[AgendamentoComputadores] Ambiente encontrado - ID: ${ambienteComputadores.id}, Nome: ${ambienteComputadores.nome}`);
        } else {
          console.warn("[AgendamentoComputadores] Ambiente Computadores não encontrado. Ambientes disponíveis:", 
            ambientes.map(a => a?.nome));
        }
      } catch (err) {
        console.error(`[AgendamentoComputadores] Erro ao buscar ambientes:`, err);
      } finally {
        if (!cancelado) setLoadingAmbiente(false);
      }
    };

    fetchAmbiente();
  }, []);

  // Buscar catálogo quando ambienteId estiver disponível
  useEffect(() => {
    if (!ambienteId) return;
    
    let cancelado = false;

    async function carregarCatalogoComputadores() {
      try {
        console.log(`[AgendamentoComputadores] Buscando catálogo para ambienteId: ${ambienteId}`);
        const resp = await api.get("/catalogo/buscar");
        const data = Array.isArray(resp?.data) ? resp.data : resp;

        console.log("[AgendamentoComputadores] Catálogo completo recebido:", data?.length, "itens");

        if (!Array.isArray(data)) {
          console.warn(
            "[AgendamentoComputadores] /catalogo/buscar não retornou array:",
            data
          );
          return;
        }

        // Filtra pelo ID do ambiente
        const catalogoFiltrado = data.filter((item) => {
          const ambienteIdItem = item?.ambiente?.id ?? item?.ambienteId ?? item?.idAmbiente ?? null;
          return ambienteIdItem === ambienteId;
        });

        console.log(`[AgendamentoComputadores] Catálogo filtrado (ID ${ambienteId}):`, catalogoFiltrado.length, "itens");

        const mapeado = catalogoFiltrado.map((item) => {
          const catalogoIdItem = item?.id ?? null;

          const disponibilidadeItem = String(
            item?.disponibilidade || item?.ambiente?.disponibilidade || ""
          ).toUpperCase();

          const diaSemanaNormalizado = String(item.diaSemana || "")
            .trim()
            .toUpperCase();

          return {
            id: catalogoIdItem,
            diaSemana: diaSemanaNormalizado,
            horaInicio: item.horaInicio,
            horaFim: item.horaFim,
            status: disponibilidadeItem,
          };
        });

        if (!cancelado) {
          setCatalogoComputadores(mapeado);
        }
      } catch (err) {
        console.error(`[AgendamentoComputadores] Erro ao buscar catálogo:`, err);
      }
    };

    carregarCatalogoComputadores();
  }, [ambienteId]);

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

  const diaSemanaBackSelecionado = useMemo(() => {
    const dia = diasDaSemana[diaSelecionado]?.dataCompleta;
    if (!dia) return null;
    return DIAS_BACK[dia.getDay()];
  }, [diasDaSemana, diaSelecionado]);

  const faixasDoDia = useMemo(() => {
    if (!diaSemanaBackSelecionado) return [];
    if (selectedCatalogo) {
      if (selectedCatalogo.isDisponivel === false) return [];
      return selectedCatalogo.diaSemana === diaSemanaBackSelecionado ? [selectedCatalogo] : [];
    } else {
      const faixas = catalogoComputadores.filter((c) => c.diaSemana === diaSemanaBackSelecionado);
      return faixas;
    }
  }, [catalogoComputadores, diaSemanaBackSelecionado, selectedCatalogo]);

  const horariosInicioDisponiveis = useMemo(
    () => gerarIniciosPorFaixas(faixasDoDia, 15),
    [faixasDoDia]
  );

  const temHorariosParaDia = horariosInicioDisponiveis.length > 0;

  const timeToMin = (s) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    let cancelado = false;
    async function fetchAmbiente() {
      try {
        const ambientes = await buscarTodosAmbientes();
        if (!Array.isArray(ambientes)) return;

        const ambienteEncontrado = ambientes.find((amb) => {
          const nome = String(amb?.nome || "").toLowerCase();
          return nome.includes("computador") || nome.includes("computadores");
        });

        if (ambienteEncontrado?.id) {
          setAmbienteId(ambienteEncontrado.id);
          // buscar catálogos para o ambiente
          try {
            const cat = await buscarCatalogosPorAmbiente(ambienteEncontrado.id);
            if (!cancelado) setCatalogoComputadores(Array.isArray(cat) ? cat : []);
          } catch (err) {
            console.error("Erro ao buscar catálogos para computadores:", err);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar ambientes para computadores:", err);
      } finally {
        if (!cancelado) setLoadingAmbiente(false);
      }
    }

    fetchAmbiente();
    return () => (cancelado = true);
  }, []);
  
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
    setSelectedCatalogo(null);
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
    if (!selectedCatalogo) {
      abrirModal("error", "Catálogo não selecionado", "Selecione um catálogo para continuar.");
      return;
    }
    if (selectedCatalogo && selectedCatalogo.isDisponivel === false) {
      abrirModal("error", "Catálogo indisponível", "O catálogo selecionado está indisponível e não aceita reservas.");
      return;
    }

    const payload = montarPayload({
      recurso: "COMPUTADOR",
      semanaSelecionada: semanaSelecionada,
      dia: dia.dataCompleta,
      inicio,
      termino,
      extra: { computador, idCatalogo: selectedCatalogo.id },
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

        <SeletorCatalogo
          ambienteId={ambienteId}
          selectedCatalogo={selectedCatalogo}
          onSelect={setSelectedCatalogo}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <GradeHorarios
            titulo="Horário de início:"
            opcoes={horariosInicioDisponiveis}
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
