// src/pages/Reserva/ReservaPendente.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";
import setinha from "../../assets/setawhiteleft.svg";

import {
  buscarReservasPendentes,
  aprovarReserva,
  deletarReserva,
} from "../../service/reserva";
import { removeEmojis } from "../../utils/text";

const AMBIENTE_LABELS = {
  1: "Quadra",
  3: "Laboratório de Computadores",
  2: "PS5",
  4: "Impressora 3D",
  5: "Auditório",
};

function formatHoraCurta(h) {
  if (!h) return "";
  const str = String(h);
  if (str.length >= 5) return str.slice(0, 5);
  return str;
}

function formatDataBR(dataLike) {
  if (!dataLike) return "";
  const d = new Date(dataLike);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function escolherImagem(nomeSalaOuAmbiente) {
  const nome = String(nomeSalaOuAmbiente || "").toLowerCase();
  if (nome.includes("ps5")) return ImgPS5;
  if (nome.includes("quadra")) return ImgQuadra;
  if (
    nome.includes("computador") ||
    nome.includes("pc") ||
    nome.includes("laboratório") ||
    nome.includes("laboratorio") ||
    nome.includes("informat")
  )
    return ImgComputadores;
  if (nome.includes("3d") || nome.includes("impressora")) return ImgImpressora3D;
  return ImgComputadores;
}

function obterNomeSala(reservaRaw) {
  const r = reservaRaw || {};

  const direto =
    r.salaNome ||
    r.nomeSala ||
    r.sala ||
    r.nomeCatalogo ||
    r.catalogoNome ||
    r.nomeEspaco ||
    r.nomeAmbiente ||
    r.ambienteNome;

  if (direto) return direto;

  const ambienteId =
    r.ambienteId ||
    r.catalogo?.ambienteId ||
    r.catalogo?.ambiente?.id ||
    null;

  if (ambienteId != null) {
    if (AMBIENTE_LABELS[ambienteId]) return AMBIENTE_LABELS[ambienteId];
    return `Ambiente ${ambienteId}`;
  }

  return "Ambiente";
}

function obterNomeSolicitante(reservaRaw) {
  const r = reservaRaw || {};
  return (
    r.nomeUsuario ||
    r.usuarioNome ||
    r.nomeAluno ||
    r.alunoNome ||
    r.solicitanteNome ||
    r.nomeProfessor ||
    r.professorNome ||
    r.docenteNome ||
    r.hostNome ||
    r.nomeHost ||
    r.responsavelNome ||
    r.host?.nome ||
    r.host?.name ||
    null
  );
}

const FeedbackModal = ({ open, type, title, message, onClose }) => {
  if (!open) return null;

  const isError = type === "error";

  const iconBg = isError ? "bg-[#FFE5E5]" : "bg-[#E6F5EA]";
  const iconColor = isError ? "text-[#AE0000]" : "text-[#1B7F4A]";
  const buttonBg = isError ? "bg-[#AE0000]" : "bg-[#1B7F4A]";
  const buttonHover = isError ? "hover:bg-[#8f0000]" : "hover:bg-[#16663A]";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl max-w-md w-full px-6 sm:px-8 py-6 sm:py-7 text-center">
        <div
          className={`${iconBg} ${iconColor} w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <span className="text-2xl sm:text-3xl leading-none">
            {isError ? "Erro" : "Sucesso"}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
          {removeEmojis(title)}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 mb-6 whitespace-pre-line">
          {removeEmojis(message)}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`${buttonBg} ${buttonHover} text-white text-sm font-medium px-5 sm:px-6 py-2.5 rounded-lg shadow-sm transition-colors`}
        >
          Ok, entendi
        </button>
      </div>
    </div>
  );
};

const CardReserva = ({ reserva, selected, onToggle }) => (
  <div
    className={
      "bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden p-4 sm:p-5 transition-transform duration-200 ease-out " +
      (selected
        ? "scale-[1.02] ring-2 ring-[#AE0000] shadow-2xl"
        : "shadow-lg hover:shadow-xl hover:scale-[1.01]")
    }
  >
    <img
      src={reserva.imagem}
      alt={`Imagem da sala ${reserva.sala || reserva.tipo}`}
      className="w-full max-w-[320px] h-[143px] sm:h-[160px] object-cover rounded-[12px] mx-auto cursor-pointer"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
    />

    <div className="bg-[#AE0000] text-white text-xs sm:text-sm font-medium flex items-center justify-center mx-auto max-w-[220px] h-[30px] border border-[#AE0000] rounded-[8px] mt-3 sm:mt-4">
      Reserva
    </div>

    <div className="flex justify-between gap-2 p-1 text-[11px] sm:text-xs mt-4">
      <div className="flex-1 text-center">
        <p className="font-medium text-gray-900 dark:text-gray-50">Data</p>
        <p className="mt-1 bg-gray-300 dark:bg-[#020617] border border-black/70 dark:border-gray-500 rounded-[7px] px-2 py-1 text-gray-900 dark:text-gray-50 inline-block min-w-[70px]">
          {reserva.data || "--"}
        </p>
      </div>

      <div className="flex-1 text-center">
        <p className="font-medium text-gray-900 dark:text-gray-50">Início</p>
        <p className="mt-1 bg-gray-300 dark:bg-[#020617] border border-black/70 dark:border-gray-500 rounded-[7px] px-2 py-1 text-gray-900 dark:text-gray-50 inline-block min-w-[70px]">
          {reserva.inicio || "--"}
        </p>
      </div>

      <div className="flex-1 text-center">
        <p className="font-medium text-gray-900 dark:text-gray-50">Término</p>
        <p className="mt-1 bg-gray-300 dark:bg-[#020617] border border-black/70 dark:border-gray-500 rounded-[7px] px-2 py-1 text-gray-900 dark:text-gray-50 inline-block min-w-[70px]">
          {reserva.termino || "--"}
        </p>
      </div>
    </div>

    {(reserva.solicitante || reserva.sala) && (
      <div className="mt-4 text-[11px] sm:text-xs text-gray-900 dark:text-gray-100 space-y-1 px-1">
        {reserva.solicitante && (
          <p>
            <span className="font-semibold">Solicitante: </span>
            {reserva.solicitante}
          </p>
        )}
        {reserva.sala && (
          <p>
            <span className="font-semibold">Sala: </span>
            {reserva.sala}
          </p>
        )}
      </div>
    )}
  </div>
);

function ReservaPendente() {
  const [reservasPendentes, setReservasPendentes] = useState([]);
  const [reservasSelecionadas, setReservasSelecionadas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState(
    "Reserva rejeitada pelo coordenador na tela de pendentes."
  );
  const [processingCancel, setProcessingCancel] = useState(false);
  const [processingApprove, setProcessingApprove] = useState(false);

  const [feedback, setFeedback] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const navigate = useNavigate();

  const abrirFeedback = (type, title, message) => {
    setFeedback({
      open: true,
      type,
      title,
      message,
    });
  };

  const fecharFeedback = () => {
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  const carregarPendentes = useCallback(async () => {
    try {
      setLoading(true);
      const lista = await buscarReservasPendentes();
      const arr = Array.isArray(lista) ? lista : [];

      const mapeadas = arr.map((r) => {
        const salaNome = removeEmojis(obterNomeSala(r));

        const ambienteNome = removeEmojis(
          r.ambienteNome || r.nomeAmbiente || salaNome || "Ambiente"
        );

        const horaInicio =
          r.horaInicio || r.horaInicioReserva || r.inicio || r.horarioInicio;
        const horaFim =
          r.horaFim || r.horaFimReserva || r.fim || r.horarioFim;

        const dataRaw =
          r.data || r.dataReserva || r.dataAgendada || r.dataInicio || r.dia;

        const solicitante = removeEmojis(obterNomeSolicitante(r));

        const turma = removeEmojis(
          r.turma || r.nomeTurma || r.curso || r.nomeCurso || null
        );

        return {
          id: r.id,
          tipo: ambienteNome,
          imagem: escolherImagem(salaNome || ambienteNome),
          data: formatDataBR(dataRaw),
          inicio: formatHoraCurta(horaInicio),
          termino: formatHoraCurta(horaFim),
          solicitante,
          turma,
          sala: salaNome,
        };
      });

      setReservasPendentes(mapeadas);
      setReservasSelecionadas([]);
    } catch (err) {
      console.error("[ReservaPendente] Erro ao buscar pendentes:", err);

      const msg = String(err?.message || "");

      if (msg.includes("(404)") || msg.toLowerCase().includes("404")) {
        setReservasPendentes([]);
        setReservasSelecionadas([]);
      } else {
        abrirFeedback(
          "error",
          "Algo deu errado",
          "Erro ao buscar reservas pendentes. Tente novamente mais tarde."
        );
        setReservasPendentes([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPendentes();
  }, [carregarPendentes]);

  const selecionarTodas = () => {
    if (reservasSelecionadas.length === reservasPendentes.length) {
      setReservasSelecionadas([]);
    } else {
      setReservasSelecionadas(reservasPendentes.map((r) => r.id));
    }
  };

  const alternarSelecao = (id) => {
    if (reservasSelecionadas.includes(id)) {
      setReservasSelecionadas((prev) => prev.filter((x) => x !== id));
    } else {
      setReservasSelecionadas((prev) => [...prev, id]);
    }
  };

  const confirmarReservas = async () => {
    if (!reservasSelecionadas.length) return;

    try {
      setProcessingApprove(true);

      await Promise.all(reservasSelecionadas.map((id) => aprovarReserva(id)));

      const restantes = reservasPendentes.filter(
        (r) => !reservasSelecionadas.includes(r.id)
      );
      setReservasPendentes(restantes);
      setReservasSelecionadas([]);

      abrirFeedback(
        "success",
        "Reservas confirmadas",
        "As reservas selecionadas foram aprovadas com sucesso."
      );
    } catch (err) {
      console.error("Erro ao confirmar reservas:", err);
      abrirFeedback(
        "error",
        "Falha ao confirmar reservas",
        "Ocorreu um erro ao confirmar as reservas. Tente novamente."
      );
    } finally {
      setProcessingApprove(false);
    }
  };

  const abrirModalCancelamento = () => {
    if (!reservasSelecionadas.length) return;
    setCancelMotivo(
      "Reserva rejeitada pelo coordenador na tela de pendentes."
    );
    setShowCancelModal(true);
  };

  const confirmarCancelamento = async () => {
    if (!reservasSelecionadas.length || !cancelMotivo.trim()) return;

    try {
      setProcessingCancel(true);

      await Promise.all(
        reservasSelecionadas.map((id) => deletarReserva(id))
      );

      const restantes = reservasPendentes.filter(
        (r) => !reservasSelecionadas.includes(r.id)
      );
      setReservasPendentes(restantes);
      setReservasSelecionadas([]);
      setShowCancelModal(false);

      abrirFeedback(
        "success",
        "Reservas canceladas",
        "As reservas selecionadas foram canceladas com sucesso."
      );
    } catch (err) {
      console.error("Erro ao cancelar reservas:", err);

      // Verifica se alguma reserva já foi cancelada
      const errorMessage = err.message || "";
      if (errorMessage.includes("já foi cancelada") || errorMessage.includes("Esta reserva já foi cancelada")) {
        // Mesmo assim remove da lista e mostra sucesso
        const restantes = reservasPendentes.filter(
          (r) => !reservasSelecionadas.includes(r.id)
        );
        setReservasPendentes(restantes);
        setReservasSelecionadas([]);
        setShowCancelModal(false);

        abrirFeedback(
          "success",
          "Reservas canceladas",
          "As reservas selecionadas foram canceladas com sucesso."
        );
      } else {
        abrirFeedback(
          "error",
          "Falha ao cancelar reservas",
          "Ocorreu um erro ao cancelar as reservas. Tente novamente."
        );
      }
    } finally {
      setProcessingCancel(false);
    }
  };

  const temPendentes = reservasPendentes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <header className="bg-[#AE0000] text-white py-4 sm:py-6 px-4 sm:px-6 md:px-8 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 py-1.5 sm:py-2 px-3 sm:px-4 text-white bg-[#B10404] rounded-lg border border-[#AE0000] hover:bg-[#9e0000] focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
        >
          <img
            src={setinha}
            alt="Voltar"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
          />
        </button>
        <h1 className="text-center text-lg sm:text-xl font-semibold">
          Reservas Pendentes
        </h1>
      </header>

      {/* MAIN */}
      <main className="px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl mx-auto">
        <p className="text-center mt-4 sm:mt-6 mb-6 sm:mb-8 text-sm sm:text-base text-gray-800 dark:text-gray-100">
          Você poderá visualizar e confirmar reservas pendentes para
          <br className="hidden sm:block" />
          ambientes que exigem aprovação manual antes do uso!
        </p>

        <div className="border-b-2 border-[#720505] w-40 sm:w-[307px] mx-auto mb-6 sm:mb-9" />

        {/* AÇÕES */}
        <div className="flex justify-start mb-4 sm:mb-6">
          <button
            onClick={selecionarTodas}
            className="text-xs sm:text-sm bg-[#AE0000] text-white py-2 px-4 rounded-md hover:bg-[#8f0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!temPendentes}
          >
            Selecionar todos
          </button>
        </div>

        {/* LISTAGEM */}
        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-300 py-8 text-sm sm:text-base">
            Carregando reservas pendentes...
          </div>
        )}

        {!loading && !temPendentes && (
          <div className="text-center text-gray-500 dark:text-gray-300 py-8 text-sm sm:text-base">
            Não há reservas pendentes no momento.
          </div>
        )}

        {!loading && temPendentes && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-4 sm:mb-6">
              {reservasPendentes.map((reserva, idx) => (
                <React.Fragment key={reserva.id}>
                  <CardReserva
                    reserva={reserva}
                    selected={reservasSelecionadas.includes(reserva.id)}
                    onToggle={() => alternarSelecao(reserva.id)}
                  />

                  {idx === 2 && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full border-t-2 border-[#A6A3A3] dark:border-gray-600 my-3 sm:my-4" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {reservasSelecionadas.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button
                  onClick={abrirModalCancelamento}
                  className="text-xs sm:text-sm bg-[#FFF5F5] dark:bg-[#2b1010] text-[#AE0000] py-2 px-4 sm:px-6 rounded-md border border-[#AE0000] hover:bg-[#FFE2E2] dark:hover:bg-[#3b1515] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processingApprove || processingCancel}
                >
                  Cancelar selecionadas
                </button>

                <button
                  onClick={confirmarReservas}
                  className="text-xs sm:text-sm bg-[#AE0000] text-white py-2 px-4 sm:px-6 rounded-md hover:bg-[#8f0000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={processingApprove || processingCancel}
                >
                  {processingApprove
                    ? "Confirmando..."
                    : "Confirmar selecionadas"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL CANCELAMENTO */}
      {showCancelModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-[#020617] rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#AE0000] mb-2">
              Cancelar {reservasSelecionadas.length} reserva
              {reservasSelecionadas.length > 1 ? "s" : ""}?
            </h2>

            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 mb-3">
              Informe um motivo para o cancelamento. Esse texto poderá ser
              usado na comunicação com o responsável pela reserva.
            </p>

            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-xs sm:text-sm bg-[#F9F9F9] dark:bg-[#020617] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#AE0000]"
              rows={3}
              value={cancelMotivo}
              onChange={(e) => setCancelMotivo(e.target.value)}
              maxLength={255}
            />

            <div className="flex justify-between items-center mt-3 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
              <span>{cancelMotivo.length}/255 caracteres</span>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => !processingCancel && setShowCancelModal(false)}
                className="py-2 px-4 sm:px-5 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                disabled={processingCancel}
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={confirmarCancelamento}
                className="py-2 px-4 sm:px-5 rounded-md bg-[#AE0000] text-white hover:bg-[#8f0000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm"
                disabled={processingCancel || !cancelMotivo.trim()}
              >
                {processingCancel ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}

      <FeedbackModal
        open={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={fecharFeedback}
      />
    </div>
  );
}

export default ReservaPendente;
