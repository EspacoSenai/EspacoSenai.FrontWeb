import React from "react";
import OndaGeral from "../../assets/ondaLandinpage.svg";
import Samira from "../../assets/avatar11.svg";
import Header from "../../components/Home/HeaderGlobal";

// Faixa de título
function FaixaTitulo({ titulo, classe = "", alinhamento = "left" }) {
  const alignClass =
    alinhamento === "center"
      ? "text-center"
      : alinhamento === "right"
      ? "text-right"
      : "text-left";

  return (
    <div
      className={`w-full bg-[#B10404] mt-6 py-6 md:py-8 mb-6 md:mb-10 ${classe}`}
    >
      <div className="w-full px-4">
        <h2
          className={`${alignClass} text-white font-semibold text-[18px] md:text-[30px]`}
        >
          {titulo}
        </h2>
      </div>
    </div>
  );
}

export default function Geral() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0B] transition-colors duration-300">
      {/* Header global do sistema */}
      <Header />

      {/* Onda + Avatar */}
      <div className="relative w-full pb-[120px] md:pb-[140px]">
        {/* Onda */}
        <div className="relative w-full overflow-hidden z-0 mt-8 md:mt-12">
          <img
            src={OndaGeral}
            alt="Onda"
            className="w-full h-auto select-none pointer-events-none"
            draggable="false"
          />
        </div>

        {/* Avatar + nome */}
        <div className="absolute inset-x-0 top-[64px] md:top-[96px] z-10 flex justify-center">
          <div className="flex flex-col items-center">
            <img
              src={Samira}
              alt="Administrador"
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover"
            />
            <span className="mt-2 text-[16px] sm:text-[20px] md:text-[32px] font-semibold text-gray-800 dark:text-white">
              Administrador
            </span>
          </div>
        </div>
      </div>

      {/* Faixa de título */}
      <div className="mt-32 md:mt-35">
        <FaixaTitulo
          titulo="Visualização Geral Relatório"
          alinhamento="center"
        />
      </div>

      {/* Conteúdo */}
      <main className="w-full pl-[20px] pr-6 sm:pr-12 lg:pr-24 xl:pr-[896px] py-8 text-[#000] dark:text-[#E5E5E5]">
        {/* Cabeçalho do relatório */}
        <section className="space-y-2 text-left text-[14px] md:text-[16px]">
          <p>
            <span className="font-semibold">Escola:</span> Escola SENAI
            Suíço-Brasileira &quot;Paulo Ernesto Tolle&quot;
          </p>
          <p>
            <span className="font-semibold">Período:</span> 20/08/2025 a
            24/08/2025
          </p>
          <p>
            <span className="font-semibold">Coordenador Responsável:</span>{" "}
            Chile
          </p>
          <p>
            <span className="font-semibold">
              Data de Geração do Relatório:
            </span>{" "}
            12/07/2025
          </p>
        </section>

        {/* Resumo Geral */}
        <section className="mt-12 flex flex-col items-center">
          <h3 className="text-left font-semibold text-[16px] md:text-[18px] mb-4 self-start">
            Resumo Geral
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[14px] md:text-[16px] mx-auto">
            <div className="space-y-3 text-left">
              <p className="text-left font-medium">Item</p>
              <p className="pt-1">Total de Reservas Realizadas</p>
              <p>Total de Reservas Disponíveis</p>
              <p>Mais Reservados</p>
              <p>Horário de Pico</p>
              <p>Cancelamentos Registrados</p>
              <p>Suspensões Registradas</p>
              <p>Pendentes de Aprovação</p>
            </div>
            <div className="space-y-3 text-center">
              <p className="text-center font-medium">Quantidade</p>
              <p className="pt-1">124</p>
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
        <section className="mt-16 flex flex-col items-center">
          <h3 className="text-left font-semibold text-[16px] md:text-[18px] mb-4 self-start">
            Resumo por Sala
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-[14px] md:text-[16px] mx-auto">
            <div className="space-y-3 text-left">
              <p className="text-left font-medium">Sala</p>
              <p className="pt-1">Computadores</p>
              <p>PS5</p>
              <p>Quadra</p>
              <p>Impressoras 3D</p>
            </div>
            <div className="space-y-3 text-center">
              <p className="text-center font-medium">Total de Reservas</p>
              <p className="pt-1">15</p>
              <p>20</p>
              <p>19</p>
              <p>12</p>
            </div>
            <div className="space-y-3 text-center">
              <p className="text-center font-medium">Média por Semana</p>
              <p className="pt-1">3</p>
              <p>7</p>
              <p>6</p>
              <p>2</p>
            </div>
          </div>
        </section>

        {/* Reservas por Dia da Semana */}
        <section className="mt-16 flex flex-col items-center">
          <h3 className="text-left font-semibold text-[16px] md:text-[18px] mb-4 self-start">
            Reservas por Dia da Semana
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[14px] md:text-[16px] mx-auto">
            <div className="space-y-3 text-left">
              <p className="text-left font-medium">Dia da Semana</p>
              <p className="pt-1">Segunda-Feira</p>
              <p>Terça-Feira</p>
              <p>Quarta-Feira</p>
              <p>Quinta-Feira</p>
              <p>Sexta-Feira</p>
              <p>Sábado</p>
            </div>
            <div className="space-y-3 text-center">
              <p className="text-center font-medium">
                Quantidade de Reservas
              </p>
              <p className="pt-1">14</p>
              <p>16</p>
              <p>19</p>
              <p>22</p>
              <p>24</p>
              <p>18</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
