import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaTopo from "../../assets/ondaLandinpage.svg";
import OndaRodape from "../../assets/OndaSalasProfessor.svg";
import AvatarDefault from "../../assets/AvatarPadrao.svg";
import PessoaRelatorios from "../../assets/mulherRelatorios.svg";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";
import ImgAuditorio from "../../assets/Impressora3D.svg";

const COR = "#AE0000";

/* Components  */
function AlunoCard({
  nome,
  status,
  turma,
  reserva,
  avatar = AvatarDefault,
  onEditarStatus,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div className="relative bg-white dark:bg-[#1E1E1E] rounded-xl border border-neutral-200/70 dark:border-neutral-800 shadow-sm p-6 w-full max-w-[360px] mx-auto">
      {/* Botão 3 pontos */}
      <button
        ref={btnRef}
        type="button"
        className="
          absolute top-3 right-3 h-7 w-7 rounded-md
          flex items-center justify-center
          shadow-sm border border-black/15
          text-white outline-none
          focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20
        "
        style={{ backgroundColor: COR }}
        aria-label="Opções"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="leading-none text-sm">•••</span>
      </button>

      {/* Dropdown do menu */}
      {open && (
        <div
          ref={menuRef}
          className="
            absolute top-11 right-2 sm:right-3 z-20
            rounded-lg border border-black/10 dark:border-white/10
            bg-white dark:bg-neutral-800
            shadow-[0_6px_20px_rgba(0,0,0,0.12)]
            p-0 min-w-[190px] max-w-[92vw]
          "
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEditarStatus?.();
            }}
            className="
              w-full flex items-center gap-2
              px-3.5 py-2.5 text-sm rounded-lg outline-none
              bg-white dark:bg-neutral-800
              text-neutral-800 dark:text-neutral-100
              border border-transparent
              hover:bg-neutral-50 dark:hover:bg-neutral-700
              focus-visible:ring-2 focus-visible:ring-indigo-400/60
              transition
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14.06 5.19l3.75 3.75" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Editar status
          </button>
        </div>
      )}

      {/* avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
        <img src={avatar} alt={nome} className="w-full h-full object-contain" />
      </div>

      {/* nome */}
      <p className="mt-3 text-center text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
        {nome}
      </p>

      {/* infos */}
      <div className="mt-5 grid grid-cols-2 gap-x-4 text-[12px] text-neutral-800 dark:text-neutral-300">
        <span>
          Status: <strong className="font-medium">{status}</strong>
        </span>
        <span className="text-right">
          Turma: <strong className="font-medium">{turma}</strong>
        </span>
      </div>

      {/* status de reserva */}
      <div className="mt-4">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-3">
          <p className="text-[12px] text-neutral-800 dark:text-neutral-200">
            <span className="font-medium">Status de Reserva:</span> {reserva}
          </p>
        </div>
      </div>
    </div>
  );
}

/* Card de Turma (tabela compacta como no print) */
function TurmaCard({
  titulo,
  inicio,
  fim,
  diaSemana,
  tipo,
  nomeTurma,
}) {
  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Header vermelho com título */}
      <div
        className="rounded-t-lg px-6 py-2.5 text-white font-semibold text-[16px] text-center"
        style={{ backgroundColor: COR }}
      >
        {titulo}
      </div>

      {/* Tabela/grade */}
      <div className="border-x border-b rounded-b-lg border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="grid grid-cols-3 text-center text-[13px] font-semibold bg-white dark:bg-[#1E1E1E]">
          <div className="p-3 border-r border-neutral-200 dark:border-neutral-800">Duração</div>
          <div className="p-3 border-r border-neutral-200 dark:border-neutral-800">Datas</div>
          <div className="p-3">Tipo</div>
        </div>

        <div className="grid grid-cols-3 text-[12px] bg-white dark:bg-[#1E1E1E]">
          {/* Duração */}
          <div className="border-r border-t border-neutral-200 dark:border-neutral-800 p-3">
            <div className="text-left">
              <p>Início:</p>
              <span className="inline-block mt-1 px-2 py-1 rounded-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                {inicio}
              </span>
            </div>
            <div className="text-left mt-2">
              <p>Fim:</p>
              <span className="inline-block mt-1 px-2 py-1 rounded-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                {fim}
              </span>
            </div>
          </div>

          {/* Datas */}
          <div className="border-r border-t border-neutral-200 dark:border-neutral-800 p-3 flex items-center justify-center">
            <span className="inline-block px-3 py-1 rounded-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
              {diaSemana}
            </span>
          </div>

          {/* Tipo */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 flex items-center justify-center">
            <span className="inline-block px-3 py-1 rounded-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
              {tipo}
            </span>
          </div>
        </div>

        {/* Footer cinza com nome da turma */}
        <div className="text-center text-[13px] bg-neutral-100 dark:bg-neutral-900 px-3 py-2.5">
          {nomeTurma}
        </div>
      </div>
    </div>
  );
}

export default function SalasAdministradores() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />

      {/* Onda do topo + avatar */}
      <section className="relative w-full overflow-hidden">
        <img src={OndaTopo} alt="" className="pointer-events-none select-none w-full h-auto" />

        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 -mt-10 md:-mt-12 flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center">
            <img src={AvatarDefault} alt="Administrador" className="w-full h-full object-contain" />
          </div>
          <p className="mt-2 font-semibold text-neutral-800 dark:text-neutral-100">Administrador</p>
        </div>

        {/* Faixa vermelha */}
        <div className="mt-6 w-full" style={{ backgroundColor: COR }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-10 md:py-12 text-center text-white">
            <h2 className="text-lg md:text-2xl font-extrabold">
              Gerencie facilmente as reservas dos espaços
            </h2>
            <p className="mt-3 text-sm md:text-base opacity-95">
              Aqui você pode acompanhar solicitações, aprovar agendamentos,
              visualizar a ocupação dos espaços e manter tudo organizado.
            </p>
          </div>
        </div>
      </section>

      {/* Salas de agendamento */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10 relative">
          {/* Criar sala — mobile em fluxo */}
          <div className="md:hidden mb-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold text-white shadow-md hover:brightness-95 active:scale-[.99] transition"
              style={{ backgroundColor: COR }}
            >
              <span className="text-lg leading-none">＋</span>
              Criar sala
            </button>
          </div>

          {/* Criar sala — desktop absoluto */}
          <div className="hidden md:block absolute left-[max(1.25rem,calc(50%-36rem+1.25rem))] top-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold text-white shadow-md hover:brightness-95 active:scale-[.99] transition"
              style={{ backgroundColor: COR }}
            >
              <span className="text-lg leading-none">＋</span>
              Criar sala
            </button>
          </div>

          {/* Título central */}
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <h3 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-100">
                Salas de agendamento
              </h3>
              <div className="mt-2 mx-auto w-24 h-[3px] rounded-full" style={{ backgroundColor: COR }} />
            </div>
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {[
              { titulo: "PS5", img: ImgPS5, desc: "Acesso aos agendamentos para organizar e supervisionar o uso do PS5.", to: "/agendamentos/ps5" },
              { titulo: "Computadores", img: ImgComputadores, desc: "Visualize os agendamentos para acompanhar e controlar o uso dos computadores.", to: "/agendamentos/computadores" },
              { titulo: "Quadra", img: ImgQuadra, desc: "Gerencie agendamentos para uso eficiente da quadra.", to: "/agendamentos/quadra" },
              { titulo: "Impressoras 3D", img: ImgImpressora3D, desc: "Controle os agendamentos do uso produtivo das impressoras 3D.", to: "/agendamentos/auditorio" },
              { titulo: "Auditório", img: ImgAuditorio, desc: "Controle reservas, aprovações e a agenda do auditório.", to: "/agendamentos/auditorio" },
            ].map((c) => (
              <div key={c.titulo} className="w-full md:w-[500px] mx-auto">
                <div className="rounded-md px-6 py-3 text-white font-semibold text-[20px] mb-4 shadow-sm" style={{ backgroundColor: COR }}>
                  {c.titulo}
                </div>

                <div
                  className="
                    bg-white dark:bg-[#1E1E1E]
                    rounded-2xl border border-neutral-200/70 dark:border-neutral-800
                    shadow-[0_8px_22px_rgba(0,0,0,0.08)]
                    p-5 flex flex-col
                    min-h-[380px] md:min-h-[430px]
                  "
                >
                  <img
                    src={c.img}
                    alt={c.titulo}
                    className="w-full h-[160px] md:h-[200px] object-cover rounded-xl"
                  />
                  <div className="mt-5">
                    <div className="rounded-lg px-5 py-4 bg-[#E9ECEF] text-neutral-900 dark:bg-[#3A3A3A] dark:text-white min-h-[88px]">
                      <p className="text-[15px] leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-5 flex justify-center">
                    <Link to={c.to} className="inline-block">
                      <button
                        className="px-8 py-3 text-[18px] font-semibold rounded-md text-white hover:brightness-95 transition"
                        style={{ backgroundColor: COR }}
                      >
                        Editar
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Linha divisória */}
          <div className="mt-12">
            <div className="h-px w-full bg-neutral-300 dark:bg-white/10" />
          </div>
        </div>
      </section>

      {/* Gestão de alunos */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-10">
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h3 className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-neutral-100">
                Gestão de alunos
              </h3>
              <div className="mt-2 mx-auto w-24 h-[3px] rounded-full" style={{ backgroundColor: COR }} />
            </div>
          </div>

          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <AlunoCard
                nome="Gabriela Almeida"
                status="Ativo"
                turma="Estado 1"
                reserva="Pendente"
                onEditarStatus={() => console.log("Editar status: Gabriela Almeida")}
              />
              <AlunoCard
                nome="Arlando Da Silva"
                status="Suspenso"
                turma="Estado 2"
                reserva="Negado"
                onEditarStatus={() => console.log("Editar status: Arlando Da Silva")}
              />
            </div>
          </div>
        </div>
        
      </section>

   
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-8">
          {/* Botão + linha */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[15px] font-semibold text-white shadow-md hover:brightness-95 active:scale-[.99] transition"
              style={{ backgroundColor: COR }}
            >
              <span className="text-lg leading-none">＋</span>
              Adicionar Turma
            </button>
          </div>



          {/* Cards de turma (dados mockados, fáceis de plugar no back) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {[
              {
                titulo: "Mobile",
                inicio: "22/03/2013",
                fim: "22/03/2017",
                diaSemana: "Terça / Quinta",
                tipo: "Técnico",
                nomeTurma: "Nome da turma",
              },
              {
                titulo: "Front- End",
                inicio: "22/03/2023",
                fim: "22/03/2025",
                diaSemana: "Terça",
                tipo: "Faculdade",
                nomeTurma: "Nome da turma",
              },
            ].map((t) => (
              <TurmaCard key={t.titulo} {...t} />
            ))}
          </div>
        </div>

        {/* separador fino (como no print) */}
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="h-px w-full bg-neutral-200 dark:bg-white/10" />
        </div>
      </section>

      {/* Geração de Relatórios */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-6 md:pt-8 pb-24 md:pb-10">
          <h3 className="text-[19px] md:text-[21px] font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span className="inline-block h-5 w-[4px] rounded-full" style={{ backgroundColor: COR }} />
            Geração de <span style={{ color: COR }}>Relatórios</span> das{" "}
            <span style={{ color: COR }}>Salas</span>
          </h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center md:justify-start">
              <img src={PessoaRelatorios} alt="" className="w-[190px] md:w-[230px] h-auto object-contain" />
            </div>

            <div className="md:max-w-[560px]">
              <p className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                Coordenadores podem gerar relatórios diversos sobre reservas de ambientes.
              </p>
              <p className="mt-3 text-[16px] md:text-[17px] text-neutral-900 dark:text-neutral-200 leading-relaxed">
                Esses relatórios facilitam o planejamento, otimizam a alocação de recursos e promovem
                transparência e organização na rotina institucional.
              </p>
              <div className="mt-6 w-full flex justify-center md:justify-start">
                <button
                  type="button"
                  className="px-8 py-3.5 text-[18px] md:text-[19px] font-semibold rounded-md text-white hover:brightness-95 transition"
                  style={{ backgroundColor: COR }}
                >
                  Gerar Relatórios
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onda colada no footer — escondida no mobile */}
      <section className="relative w-full overflow-visible -mt-20 -bottom-5 hidden md:block">
        <div className="pointer-events-none select-none relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] z-0">
          <motion.img
            src={OndaRodape}
            alt=""
            className="block w-full h-auto max-w-none -mb-[8px]"
            initial={{ y: 6 }}
            animate={{ y: [6, -2, 6] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </section>

      <div className="-mt-[5px]">
        <Footer />
      </div>
    </div>
  );
}
