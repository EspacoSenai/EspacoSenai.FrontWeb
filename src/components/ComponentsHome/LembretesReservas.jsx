// src/components/Lembretes/LembretesReservas.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { buscarMinhasReservas, deletarReserva } from "../../service/reserva";

import LembreteImgComputadores from "../../assets/Computadores.svg";
import LembreteImgQuadra from "../../assets/FotoQuadra.svg";
import LembreteImgPS5 from "../../assets/FotoPs5.svg";
import LembreteImgSalaPCs from "../../assets/Computadores.svg";

const COR = "#AE0000";

/* ==================== HELPERS ==================== */

function escolherImagemReserva(nomeEspaco = "") {
  const n = String(nomeEspaco).toLowerCase();

  if (n.includes("quadra")) return LembreteImgQuadra;
  if (n.includes("ps5") || n.includes("playstation")) return LembreteImgPS5;
  if (n.includes("3d")) return LembreteImgSalaPCs;

  return LembreteImgComputadores;
}

function formatarData(dataRaw) {
  if (!dataRaw) return "—";

  try {
    const str = String(dataRaw);

    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const [y, m, d] = str.split("T")[0].split("-");
      return `${d}/${m}`;
    }

    const d = new Date(str);
    if (Number.isNaN(d.getTime())) return str;

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}`;
  } catch {
    return String(dataRaw);
  }
}

function horaParaHHMM(valor) {
  if (!valor) return "";
  const parts = String(valor).split(":");
  if (parts.length < 2) return String(valor);
  const [h, m] = parts;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function derivarPeriodo(hhmm = "") {
  const [hStr] = String(hhmm).split(":");
  const h = parseInt(hStr || "0", 10);

  if (Number.isNaN(h)) return "—";
  if (h < 12) return "Manhã";
  if (h < 18) return "Tarde";
  return "Noite";
}

/** Mapeia reserva do back → objeto usado no card */
function mapReservaParaLembrete(reserva) {
  if (!reserva) return null;

  const id =
    reserva.id ||
    reserva.idReserva ||
    reserva.codigo ||
    `${Math.random()}-${Date.now()}`;

  const tituloBase =
    reserva.nomeEspaco ||
    reserva.nomeSala ||
    reserva.espaco ||
    reserva.sala ||
    reserva.tipoEspaco ||
    reserva.tipo ||
    reserva.nomeCatalogo ||
    reserva.catalogoNome ||
    (reserva.catalogo &&
      (reserva.catalogo.nome ||
        reserva.catalogo.descricao ||
        reserva.catalogo.tipo)) ||
    "Reserva";

  const titulo = String(tituloBase);

  const horaInicioBruta =
    reserva.horaInicio ||
    reserva.horarioInicio ||
    reserva.horaComeco ||
    reserva.horaInicial;

  const horaFimBruta =
    reserva.horaFim ||
    reserva.horarioFim ||
    reserva.horaTermino ||
    reserva.horaFinal;

  const horaInicio = horaParaHHMM(horaInicioBruta);
  const horaFim = horaParaHHMM(horaFimBruta);

  let horario = "—";
  if (horaInicio && horaFim) horario = `${horaInicio} - ${horaFim}`;
  else if (horaInicio) horario = horaInicio;

  const periodoRaw = reserva.periodo || reserva.turno || reserva.turnoDescricao;
  const periodo = periodoRaw || derivarPeriodo(horaInicio);

  const dataReserva = reserva.data || reserva.dia || reserva.dataReserva;

  return {
    id,
    titulo,
    imagem: escolherImagemReserva(titulo),
    periodo: periodo || "—",
    horario,
    data: formatarData(dataReserva),
  };
}

/* ==================== COMPONENTES VISUAIS ==================== */

const Dot = () => (
  <span
    className="inline-block w-[8px] h-[8px] rounded-full mr-2"
    style={{ backgroundColor: COR }}
  />
);

const Kebab = ({ onClick, ariaControls, ariaExpanded }) => (
  <button
    type="button"
    aria-label="Mais opções"
    aria-controls={ariaControls}
    aria-expanded={ariaExpanded}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className="h-10 w-10 grid place-items-center rounded-xl bg-transparent text-neutral-700 dark:text-white hover:bg-black/5 transition outline-none"
    style={{
      WebkitTapHighlightColor: "transparent",
      border: "none",
      boxShadow: "none",
    }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
    </svg>
  </button>
);

const LembreteCard = ({ item, onRequestCancel }) => {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  function handleCancelarClick() {
    setOpen(false);
    if (onRequestCancel) onRequestCancel(item);
  }

  return (
    <div className="relative rounded-xl bg-white dark:bg-[#1B1B1B] shadow-sm ring-1 ring-black/5 px-3 py-3 md:px-4 md:py-4">
      <div className="absolute bottom-3 right-3 -m-2 p-2 z-[70]" ref={popRef}>
        <Kebab
          onClick={() => setOpen((v) => !v)}
          ariaControls={`menu-${item.id}`}
          ariaExpanded={open}
        />

        {open && (
          <div
            id={`menu-${item.id}`}
            role="menu"
            className="absolute bottom-12 right-0 w-56 overflow-hidden select-none z-[9999]"
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              border: "1px solid rgba(0,0,0,0.10)",
            }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleCancelarClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-black/5 transition bg-transparent text-[#b91c1c]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke={COR} strokeWidth="1.8" />
                <path
                  d="M9.5 9.5l5 5M14.5 9.5l-5 5"
                  stroke={COR}
                  strokeWidth="1.8"
                />
              </svg>
              <span className="font-semibold">Cancelar reserva</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-3 md:gap-4">
        <div className="col-span-12 sm:col-span-5 md:col-span-4">
          <img
            src={item.imagem}
            alt={item.titulo}
            className="w-full h-[180px] md:h-[150px] object-cover rounded-xl"
          />
        </div>

        <div className="relative col-span-12 sm:col-span-7 md:col-span-8 pr-16 pt-12">
          <span className="absolute top-0 right-[-12px] md:right-[-16px] h-10 md:h-11 px-5 md:px-6 bg-[#720505] text-white text-[15px] md:text-[16px] font-semibold leading-[2.5rem] md:leading-[2.75rem] rounded-l-xl rounded-r-none whitespace-nowrap shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
            {item.titulo}
          </span>

          <div className="space-y-2.5 text-[16px]">
            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Período:</span>
              <span className="opacity-90">{item.periodo}</span>
            </div>
            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Horário:</span>
              <span className="opacity-90">{item.horario}</span>
            </div>
            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Data:</span>
              <span className="opacity-90">{item.data}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== COMPONENTE PRINCIPAL ==================== */

export default function LembretesReservas({
  titulo = "Lembretes",
  mostrarOnda = false,
}) {
  const [lembretes, setLembretes] = useState([]);
  const [loadingLembretes, setLoadingLembretes] = useState(true);
  const [erroLembretes, setErroLembretes] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [cancelando, setCancelando] = useState(null);
  const [loadingCancelamento, setLoadingCancelamento] = useState(false);

  // Função para carregar/recarregar reservas
  const carregarReservas = useCallback(async (primeiraVez = false) => {
    try {
      if (primeiraVez) {
        setLoadingLembretes(true);
      }
      setErroLembretes("");

      const reservas = await buscarMinhasReservas();

      const ativos = (reservas || []).filter((r) => {
        const status = String(r?.status || r?.statusReserva || r?.situacao || "").toUpperCase();
        // Exibir apenas reservas ativas ou pendentes; ocultar canceladas/negadas/concluídas
        return status === "APROVADA" || status === "PENDENTE" || status === "ATIVA" || status === "EM_ANDAMENTO" || status === "";
      });

      const mapped = ativos
        .map(mapReservaParaLembrete)
        .filter(Boolean);

      mapped.sort((a, b) => {
        if (a.data === "—" || b.data === "—") return 0;
        const [da, ma] = a.data.split("/").map(Number);
        const [db, mb] = b.data.split("/").map(Number);
        if (ma === mb) return da - db;
        return ma - mb;
      });

      setLembretes(mapped);
    } catch (err) {
      console.error("[LembretesReservas] Erro ao buscar reservas:", err);
      setErroLembretes("Não foi possível carregar suas reservas.");
      setLembretes([]);
    } finally {
      if (primeiraVez) {
        setLoadingLembretes(false);
      }
    }
  }, []);

  // Carregar reservas na montagem e configurar polling
  useEffect(() => {
    let alive = true;
    let intervaloId = null;

    const init = async () => {
      if (alive) {
        await carregarReservas(true);
      }
    };

    init();

    // Atualização automática a cada 30 segundos
    intervaloId = setInterval(() => {
      if (alive) {
        carregarReservas(false);
      }
    }, 30000);

    return () => {
      alive = false;
      if (intervaloId) {
        clearInterval(intervaloId);
      }
    };
  }, [carregarReservas]);

  async function confirmarCancelamento() {
    if (!cancelando) return;
    try {
      setLoadingCancelamento(true);
      setFeedback({ type: "", message: "" });

      await deletarReserva(cancelando.id);

      // Remove da lista imediatamente
      setLembretes((prev) => prev.filter((l) => l.id !== cancelando.id));
      setCancelando(null);

      setFeedback({
        type: "success",
        message: "Reserva cancelada com sucesso.",
      });

      // Recarrega a lista do backend para garantir sincronização
      setTimeout(() => {
        carregarReservas(false);
      }, 1000);
    } catch (e) {
      console.error("[LembretesReservas] erro ao cancelar reserva:", e);

      // Verifica se a reserva já foi cancelada (não é erro, apenas estado já atualizado)
      const errorMessage = e.message || "";
      if (errorMessage.includes("já foi cancelada") || errorMessage.includes("Esta reserva já foi cancelada") || errorMessage.includes("No Content")) {
        // Remove da lista local mesmo assim, pois o backend já está correto
        setLembretes((prev) => prev.filter((l) => l.id !== cancelando.id));
        setCancelando(null);

        setFeedback({
          type: "success",
          message: "Reserva cancelada com sucesso.",
        });

        // Recarrega para sincronizar
        setTimeout(() => {
          carregarReservas(false);
        }, 1000);
      } else {
        setFeedback({
          type: "error",
          message: "Não foi possível cancelar a reserva. Tente novamente.",
        });
        // Em caso de erro, recarrega a lista para garantir estado correto
        carregarReservas(false);
      }
    } finally {
      setLoadingCancelamento(false);
    }
  }

  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-2 pb-10 md:pb-14">
        <h3 className="text-center text-[20px] sm:text-[22px] font-semibold text-[#1E1E1E] dark:text-white">
          {titulo}
        </h3>

        <div
          className="mx-auto mt-1 mb-6 h-[3px] w-24 rounded-full"
          style={{ backgroundColor: COR }}
        />

        {/* feedback bonitinho */}
        {feedback.message && (
          <div
            className={`mb-4 max-w-3xl mx-auto rounded-xl border px-4 py-3 text-sm text-center ${
              feedback.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {loadingLembretes ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
              Carregando suas reservas...
            </div>
          ) : erroLembretes ? (
            <div className="col-span-full text-center text-red-600 dark:text-red-400 py-8">
              {erroLembretes}
            </div>
          ) : lembretes.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
              Você ainda não possui reservas registradas.
            </div>
          ) : (
            lembretes.map((it) => (
              <LembreteCard
                key={it.id}
                item={it}
                onRequestCancel={setCancelando}
              />
            ))
          )}
        </div>

        <div className="mt-6 grid place-items-center">
          <span
            className="h-[4px] w-16 rounded-full"
            style={{ backgroundColor: COR }}
          />
        </div>
      </div>

      {/* modal de confirmação de cancelamento */}
      {cancelando && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md px-6 py-6 border border-neutral-200 dark:border-neutral-700">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
              Cancelar reserva
            </h4>
            <p className="text-sm text-neutral-600 dark:text-gray-300 mb-4">
              Tem certeza que deseja cancelar a reserva de{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">{cancelando.titulo}</span>?
            </p>

            <div className="flex flex-col gap-2 text-sm bg-neutral-50 dark:bg-[#2A2A2A] border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 mb-5 text-neutral-900 dark:text-white">
              <div className="flex items-center gap-2">
                <Dot />
                <span className="font-semibold">Data:</span>
                <span>{cancelando.data}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dot />
                <span className="font-semibold">Horário:</span>
                <span>{cancelando.horario}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dot />
                <span className="font-semibold">Período:</span>
                <span>{cancelando.periodo}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setCancelando(null)}
                disabled={loadingCancelamento}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#2A2A2A] text-sm font-medium text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-[#333] disabled:opacity-60"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={confirmarCancelamento}
                disabled={loadingCancelamento}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: COR }}
              >
                {loadingCancelamento ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarOnda && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ondinha opcional aqui depois, se quiser */}
        </motion.div>
      )}
    </section>
  );
}
