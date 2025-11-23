import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

import {
  buscarReservasPendentes,
  aprovarReserva,
} from "../../service/reserva";

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

function escolherImagem(ambienteNome) {
  const nome = String(ambienteNome || "").toLowerCase();
  if (nome.includes("ps5")) return ImgPS5;
  if (nome.includes("quadra")) return ImgQuadra;
  if (
    nome.includes("computador") ||
    nome.includes("pc") ||
    nome.includes("laboratório") ||
    nome.includes("informat")
  )
    return ImgComputadores;
  if (nome.includes("3d") || nome.includes("impressora"))
    return ImgImpressora3D;
  return ImgComputadores;
}

const CardReserva = ({ reserva, selected, onToggle }) => (
  <div
    className={
      "bg-white border border-gray-200 rounded-xl overflow-hidden p-[16px] sm:p-[20px] transition-transform duration-200 ease-out " +
      (selected
        ? "scale-[1.02] ring-2 ring-[#AE0000] shadow-2xl"
        : "shadow-lg hover:shadow-xl hover:scale-[1.01]")
    }
  >
    <img
      src={reserva.imagem}
      alt={`Imagem ${reserva.tipo}`}
      className="w-[298px] h-[143px] object-cover rounded-[12px] mx-auto cursor-pointer"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
    />

    <div className="bg-[#AE0000] text-white font-medium flex items-center justify-center mx-auto w-[200px] h-[30px] border border-[#AE0000] rounded-[8px] mt-[12px]">
      {reserva.tipo}
    </div>

    <div className="flex justify-between p-1 text-xs mt-[16px]">
      <div className="text-center">
        <p className="font-medium text-black dark:text-white">Data</p>
        <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">
          {reserva.data}
        </p>
      </div>

      <div className="text-center">
        <p className="font-medium text-black dark:text-white">Início</p>
        <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">
          {reserva.inicio}
        </p>
      </div>

      <div className="text-center">
        <p className="font-medium text-black dark:text-white">Término</p>
        <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">
          {reserva.termino}
        </p>
      </div>
    </div>
  </div>
);

function ReservaPendente() {
  const [reservasPendentes, setReservasPendentes] = useState([]);
  const [reservasSelecionadas, setReservasSelecionadas] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const carregarPendentes = useCallback(async () => {
    try {
      setLoading(true);
      const lista = await buscarReservasPendentes();
      const arr = Array.isArray(lista) ? lista : [];

      const mapeadas = arr.map((r) => {
        const ambienteNome =
          r.ambienteNome ||
          r.ambiente ||
          r.local ||
          r.espaco ||
          r.nomeEspaco ||
          r.nomeAmbiente ||
          "Reserva";

        const horaInicio =
          r.horaInicio || r.horaInicioReserva || r.inicio || r.horarioInicio;
        const horaFim =
          r.horaFim || r.horaFimReserva || r.fim || r.horarioFim;

        const dataRaw =
          r.data || r.dataReserva || r.dataAgendada || r.dataInicio || r.dia;

        return {
          id: r.id,
          tipo: ambienteNome,
          imagem: escolherImagem(ambienteNome),
          data: formatDataBR(dataRaw),
          inicio: formatHoraCurta(horaInicio),
          termino: formatHoraCurta(horaFim),
        };
      });

      setReservasPendentes(mapeadas);
      setReservasSelecionadas([]);
    } catch (err) {
      console.error("[ReservaPendente] Erro ao buscar pendentes:", err);
      alert("Erro ao buscar reservas pendentes. Tente novamente mais tarde.");
      setReservasPendentes([]);
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
    const ok = window.confirm(
      `Confirmar ${reservasSelecionadas.length} reserva(s) selecionada(s)?`
    );
    if (!ok) return;

    try {
      await Promise.all(reservasSelecionadas.map((id) => aprovarReserva(id)));

      const restantes = reservasPendentes.filter(
        (r) => !reservasSelecionadas.includes(r.id)
      );
      setReservasPendentes(restantes);
      setReservasSelecionadas([]);
      alert("Reservas confirmadas com sucesso!");
    } catch (err) {
      console.error("Erro ao confirmar reservas:", err);
      alert("Erro ao confirmar reservas. Tente novamente.");
    }
  };

  const temPendentes = reservasPendentes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CABEÇALHO */}
      <header className="bg-[#AE0000] text-white py-6 px-6 sm:px-8 relative">
        <button
          type="button"
          onClick={() => navigate(-1)} // Voltar para a página anterior
          className="absolute left-5 top-1/2 transform -translate-y-1/2 md:left-6 py-2 px-4 text-white bg-[#B10404] rounded-lg border border-[#AE0000] hover:bg-[#9e0000] focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
        >
          <img
            src="/src/assets/setawhiteleft.svg"
            alt="Voltar"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </button>
        <h1 className="text-center text-xl font-semibold">Reservas Pendentes</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <p className="text-center mt-8 mb-9 text-base text-gray-800">
          Você poderá visualizar e confirmar reservas pendentes para
          <br />
          ambientes que exigem aprovação manual antes do uso!
        </p>

        <div className="border-b-2 border-[#720505] w-[307px] mx-auto mb-9" />

        <div className="flex justify-start mb-6">
          <button
            onClick={selecionarTodas}
            className="bg-[#AE0000] text-white py-2 px-4 rounded-md hover:bg-[#8f0000] transition-colors"
            disabled={!temPendentes}
          >
            Selecionar todos
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-600 py-8">
            Carregando reservas pendentes...
          </div>
        )}

        {!loading && !temPendentes && (
          <div className="text-center text-gray-500 py-8">
            Não há reservas pendentes no momento.
          </div>
        )}

        {!loading && temPendentes && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 mb-6">
              {reservasPendentes.map((reserva, idx) => (
                <React.Fragment key={reserva.id}>
                  <CardReserva
                    reserva={reserva}
                    selected={reservasSelecionadas.includes(reserva.id)}
                    onToggle={() => alternarSelecao(reserva.id)}
                  />

                  {idx === 2 && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full border-t-2 border-[#A6A3A3] my-4"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {reservasSelecionadas.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={confirmarReservas}
                  className="bg-[#AE0000] text-white py-2 px-6 rounded-md hover:bg-[#8f0000] transition-colors"
                >
                  Confirmar selecionadas
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default ReservaPendente;
