import React, { useMemo, useState } from "react";
import TrocaSemana from "../components/agendamento/TrocaSemana";
import SeletorDia from "../components/agendamento/SeletorDia";
import GradeHorarios from "../components/agendamento/GradeHorarios";
import SeletorComputadores from "../components/agendamento/SeletorComputadores";
import {
  HORARIOS_INICIO_COMPUTADOR,
  HORARIO_TERMINO_COMPUTADOR_FIXO,
  montarDiasSemana,
  montarPayload,
} from "../components/agendamento/FuncoesCompartilhada";

export default function AgendamentoComputadores() {
  const [semanaOffset, setSemanaOffset] = useState(0);
  const dias = useMemo(() => montarDiasSemana(semanaOffset), [semanaOffset]);

  const [diaSelecionado, setDiaSelecionado] = useState(
    dias[0]?.dataCompleta ?? new Date()
  );
  const [inicio, setInicio] = useState(HORARIOS_INICIO_COMPUTADOR[0]);
  const TERMINO_OPCOES = [HORARIO_TERMINO_COMPUTADOR_FIXO];
  const [termino, setTermino] = useState(TERMINO_OPCOES[0]);
  const [computador, setComputador] = useState(1);

  function handleConfirmar() {
    const payload = montarPayload({
      recurso: "COMPUTADOR",
      semanaSelecionada: semanaOffset === 0 ? "essa" : "proxima",
      dia: diaSelecionado,
      inicio,
      termino,
      extra: { computador },
    });
    console.log("CONFIRMAR:", payload);
    alert("Agendamento criado!");
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6">
        <div className="bg-[#AE0000] rounded-2xl text-white px-6 py-4 inline-block">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Agendamento  -  Computadores
          </h1>
        </div>
      </header>

      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex gap-3">
          <TrocaSemana
            semanaAtualAtiva={semanaOffset === 0}
            onEssaSemana={() => setSemanaOffset(0)}
            onProximaSemana={() => setSemanaOffset(1)}
          />
        </div>
        <div className="md:ml-auto">
          <SeletorDia
            dias={dias}
            selecionado={diaSelecionado}
            onSelect={setDiaSelecionado}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GradeHorarios
          titulo="Horário de início:"
          opcoes={HORARIOS_INICIO_COMPUTADOR}
          selecionado={inicio}
          onSelect={setInicio}
        />

        {/* Término AGORA É BOTÃO, exatamente como no início */}
        <GradeHorarios
          titulo="Horário de término:"
          opcoes={TERMINO_OPCOES}
          selecionado={termino}
          onSelect={setTermino}
        />

        <div className="md:col-span-2">
          <SeletorComputadores valor={computador} onChange={setComputador} />
        </div>
      </div>

      <p className="mt-4 text-xs text-[#6b6b6b]">
        <span className="text-[#C61919] font-semibold">OBS:</span> Informe apenas o
        horário de início. Todos devem desocupar os computadores até, no máximo, às {HORARIO_TERMINO_COMPUTADOR_FIXO}.
      </p>

      <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:gap-4 md:justify-end">
        <button
          type="button"
          className="w-full md:w-auto px-6 h-11 rounded-lg border border-[#CFCFCF] bg-white hover:bg-[#f7f7f7]"
          onClick={() => window.history.back()}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="w-full md:w-auto px-6 h-11 rounded-lg bg-[#AE0000] text-white hover:bg-[#920000]"
          onClick={handleConfirmar}
        >
          Confirmar
        </button>
      </div>
    </main>
  );
}
