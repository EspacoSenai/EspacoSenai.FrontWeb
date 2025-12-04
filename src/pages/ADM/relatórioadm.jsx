import React, { useEffect, useState } from "react";
import OndaGeral from "../../assets/ondaLandinpage.svg";
import AvatarDefault from "../../assets/AvatarPadrao.svg";
import Header from "../../components/Home/HeaderGlobal";
import { buscarMeuPerfil } from "../../service/usuario";

// Faixa de título
function FaixaTitulo({ titulo, classe = "", alinhamento = "center" }) {
  const alignClass =
    alinhamento === "center"
      ? "text-center"
      : alinhamento === "right"
      ? "text-right"
      : "text-left";

  return (
    <div
      className={`w-full bg-[#B10404] mt-4 md:mt-6 py-3 sm:py-4 md:py-5 ${classe}`}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <h2
          className={`${alignClass} text-white font-semibold text-[16px] sm:text-[20px] md:text-[26px]`}
        >
          {titulo}
        </h2>
      </div>
    </div>
  );
}

export default function Geral() {
  // pega nome do usuário logado
  const [displayName, setDisplayName] = useState("");
  const primeiroNomeRaw = (displayName || "").split(" ")[0] || "";
  const nome = primeiroNomeRaw || "Administrador";

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const usuario = await buscarMeuPerfil();
        const nomeBack =
          (usuario &&
            (usuario.nome ||
              usuario.nomeCompleto ||
              usuario.nomeUsuario ||
              usuario.tag)) ||
          "";
        if (alive) {
          setDisplayName(nomeBack.toString().trim() || "Administrador");
        }
      } catch (err) {
        console.error("[RelatorioGeral] Erro ao buscar perfil:", err);
        if (alive) setDisplayName("Administrador");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#050505] transition-colors duration-300">
      {/* Header global */}
      <Header />

      {/* Onda + Avatar (sem absolute, só com margin negativa) */}
      <section className="w-full">
        {/* Onda */}
        <div className="w-full overflow-hidden mt-4 sm:mt-6 md:mt-10">
          <img
            src={OndaGeral}
            alt="Fundo ondulado"
            className="w-full h-auto select-none pointer-events-none"
            draggable="false"
          />
        </div>

        {/* Avatar + nome "encostando" na onda */}
        <div className="-mt-10 sm:-mt-12 md:-mt-16 flex justify-center">
          <div className="flex flex-col items-center px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.18)] bg-white">
              <img
                src={AvatarDefault}
                alt={nome}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-[15px] sm:text-[18px] md:text-[20px] font-semibold text-gray-900 dark:text-white tracking-wide text-center">
              {nome}
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-300 text-center">
              Visão geral de relatórios dos ambientes
            </span>
          </div>
        </div>
      </section>

      {/* Faixa de título */}
      <FaixaTitulo
        titulo="Visualização Geral do Relatório"
        alinhamento="center"
      />

      {/* Conteúdo */}
      <main className="w-full">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 text-[#171717] dark:text-[#E5E5E5] space-y-8 sm:space-y-9 md:space-y-12">
          {/* Cabeçalho do relatório */}
          <section className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-200/70 dark:border-white/10 px-4 sm:px-5 md:px-7 py-4 sm:py-5 md:py-6">
            <h3 className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="inline-block w-[4px] h-6 rounded-full bg-[#B10404]" />
              Informações do Relatório
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 sm:gap-x-8 text-[12px] sm:text-[13px] md:text-[15px]">
              <p>
                <span className="font-semibold">Escola: </span>
                Escola SENAI Suíço-Brasileira &quot;Paulo Ernesto Tolle&quot;
              </p>
              <p>
                <span className="font-semibold">Período: </span>
                20/08/2025 a 24/08/2025
              </p>
              <p>
                <span className="font-semibold">Coordenador Responsável: </span>
                Chile
              </p>
              <p>
                <span className="font-semibold">
                  Data de Geração do Relatório:{" "}
                </span>
                12/07/2025
              </p>
            </div>
          </section>

          {/* Resumo Geral */}
          <section className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-200/70 dark:border-white/10 px-4 sm:px-5 md:px-7 py-4 sm:py-5 md:py-6">
            <h3 className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="inline-block w-[4px] h-6 rounded-full bg-[#B10404]" />
              Resumo Geral
            </h3>

            {/* cards de números principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 sm:mb-6">
              <div className="rounded-xl bg-[#F5F5F5] dark:bg-[#181818] px-2.5 sm:px-3 py-2.5 sm:py-3 text-center">
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-300">
                  Reservas realizadas
                </p>
                <p className="mt-1 text-lg sm:text-xl md:text-2xl font-semibold text-[#B10404]">
                  124
                </p>
              </div>
              <div className="rounded-xl bg-[#F5F5F5] dark:bg-[#181818] px-2.5 sm:px-3 py-2.5 sm:py-3 text-center">
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-300">
                  Reservas disponíveis
                </p>
                <p className="mt-1 text-lg sm:text-xl md:text-2xl font-semibold">
                  4
                </p>
              </div>
              <div className="rounded-xl bg-[#F5F5F5] dark:bg-[#181818] px-2.5 sm:px-3 py-2.5 sm:py-3 text-center">
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-300">
                  Cancelamentos
                </p>
                <p className="mt-1 text-lg sm:text-xl md:text-2xl font-semibold">
                  8
                </p>
              </div>
              <div className="rounded-xl bg-[#F5F5F5] dark:bg-[#181818] px-2.5 sm:px-3 py-2.5 sm:py-3 text-center">
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-300">
                  Pendentes
                </p>
                <p className="mt-1 text-lg sm:text-xl md:text-2xl font-semibold">
                  2
                </p>
              </div>
            </div>

            {/* tabelinha resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-10 gap-y-3 sm:gap-y-4 text-[12px] sm:text-[13px] md:text-[15px]">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  Indicador
                </p>
                <p>Total de Reservas Realizadas</p>
                <p>Total de Reservas Disponíveis</p>
                <p>Ambientes mais reservados</p>
                <p>Horário de pico</p>
                <p>Cancelamentos Registrados</p>
                <p>Suspensões Registradas</p>
                <p>Pendentes de Aprovação</p>
              </div>
              <div className="space-y-1.5 sm:space-y-2 md:text-right">
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  Resultado
                </p>
                <p>124</p>
                <p>4</p>
                <p>PS5 e Quadra</p>
                <p>13h - 18h</p>
                <p>8</p>
                <p>5</p>
                <p>2</p>
              </div>
            </div>
          </section>

          {/* Resumo por Sala */}
          <section className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-200/70 dark:border-white/10 px-4 sm:px-5 md:px-7 py-4 sm:py-5 md:py-6">
            <h3 className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="inline-block w-[4px] h-6 rounded-full bg-[#B10404]" />
              Resumo por Sala
            </h3>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-collapse text-[12px] sm:text-[13px] md:text-[15px]">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#181818]">
                    <th className="text-left py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-l-lg">
                      Sala
                    </th>
                    <th className="text-center py-2 sm:py-2.5 px-2.5 sm:px-3">
                      Total de Reservas
                    </th>
                    <th className="text-center py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-r-lg">
                      Média por Semana
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sala: "Computadores", total: 15, media: 3 },
                    { sala: "PS5", total: 20, media: 7 },
                    { sala: "Quadra", total: 19, media: 6 },
                    { sala: "Impressoras 3D", total: 12, media: 2 },
                  ].map((row, idx) => (
                    <tr
                      key={row.sala}
                      className={
                        idx % 2 === 0
                          ? "bg-white dark:bg-[#111111]"
                          : "bg-gray-50 dark:bg-[#151515]"
                      }
                    >
                      <td className="py-2 sm:py-2.5 px-2.5 sm:px-3 text-left whitespace-nowrap">
                        {row.sala}
                      </td>
                      <td className="py-2 sm:py-2.5 px-2.5 sm:px-3 text-center">
                        {row.total}
                      </td>
                      <td className="py-2 sm:py-2.5 px-2.5 sm:px-3 text-center">
                        {row.media}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reservas por dia da semana */}
          <section className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-200/70 dark:border-white/10 px-4 sm:px-5 md:px-7 py-4 sm:py-5 md:py-6 mb-4 md:mb-8">
            <h3 className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="inline-block w-[4px] h-6 rounded-full bg-[#B10404]" />
              Reservas por Dia da Semana
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-10 gap-y-3 sm:gap-y-4 text-[12px] sm:text-[13px] md:text-[15px]">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  Dia da Semana
                </p>
                <p>Segunda-feira</p>
                <p>Terça-feira</p>
                <p>Quarta-feira</p>
                <p>Quinta-feira</p>
                <p>Sexta-feira</p>
                <p>Sábado</p>
              </div>
              <div className="space-y-1.5 sm:space-y-2 md:text-right">
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  Quantidade de Reservas
                </p>
                <p>14</p>
                <p>16</p>
                <p>19</p>
                <p>22</p>
                <p>24</p>
                <p>18</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
