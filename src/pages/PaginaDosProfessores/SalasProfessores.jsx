// src/pages/Salas/SalasProfessores.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaTopo from "../../assets/ondaLandinpage.svg";
import OndasSala from "../../assets/OndaSalasProfessor.svg";
import AvatarDefault from "../../assets/AvatarPadrao.svg";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";
import ImgAuditorio from "../../assets/auditorio.svg";

import { buscarMeuPerfil } from "../../service/usuario";
import { buscarTurmas } from "../../service/turma";

const COR = "#AE0000";

function Lbl({ children }) {
  return (
    <span className="block text-[11px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
      {children}
    </span>
  );
}

function Input({ value, onChange, placeholder, readOnly, className = "" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={
        "w-full h-[44px] px-3 rounded-md border border-black/10 dark:border-white/10 " +
        (readOnly
          ? "bg-[#F1F1F1] dark:bg-[#202020] text-[#1E1E1E] dark:text-gray-100"
          : "bg-white dark:bg-[#111] text-[#1E1E1E] dark:text-white") +
        " outline-none " +
        (readOnly
          ? "cursor-default"
          : "focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10") +
        " " +
        className
      }
    />
  );
}

function Select({ value, onChange, disabled, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={
        "w-full h-[44px] px-3 rounded-md border border-black/10 dark:border-white/10 " +
        (disabled
          ? "bg-[#F1F1F1] dark:bg-[#202020] text-[#1E1E1E] dark:text-gray-100"
          : "bg-white dark:bg-[#111] text-[#1E1E1E] dark:text-white") +
        " outline-none " +
        (disabled
          ? "cursor-default"
          : "focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10")
      }
    >
      {children}
    </select>
  );
}

function formatDateBr(iso) {
  if (!iso) return "—";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function TurmaCardAdmin({ turma }) {
  const {
    id,
    titulo,
    duracao,
    dataInicio,
    dataTermino,
    datas,
    tipo,
    nome,
    curso,
    capacidade,
  } = turma || {};

  const codigo =
    turma?.codigoAcesso || turma?.codigo || turma?.codigoTurma || "—";
  const tituloExib = titulo || nome || turma?.nomeTurma || `Turma #${id}`;
  const inicioExib = dataInicio || dataInicio === 0 ? dataInicio : datas || "";
  const terminoExib = dataTermino || turma?.dataTermino || "";
  const cursoNome = curso?.nome || curso || turma?.cursoNome || "";
  const capacidadeExib = capacidade || turma?.capacidade || turma?.capacidadeAlunos;

  return (
    <div className="w-full max-w-[520px] mx-auto rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
      <div
        className="relative rounded-t-lg px-6 py-3 text-white text-center"
        style={{ backgroundColor: COR }}
      >
        <div className="font-semibold text-[18px]">{tituloExib}</div>
        <div className="mt-1 text-[13px] opacity-95">Código: <span className="font-medium">{codigo}</span></div>

        <Link to={`/editar-versala/${id}`} className="absolute right-3 top-3">
          <button
            type="button"
            title="Editar turma"
            className="w-9 h-9 rounded-md bg-black/80 text-white flex items-center justify-center shadow-sm hover:brightness-[.95]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </Link>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Lbl>Duração</Lbl>
          <Input value={duracao || ""} placeholder="Ex: 40 alunos" readOnly={true} />
        </div>

        <div>
          <Lbl>Data de início</Lbl>
          <Input value={inicioExib || ""} placeholder="Ex: 20/11/2025" readOnly={true} />
        </div>

        <div>
          <Lbl>Tipo</Lbl>
          <Input value={tipo || ""} placeholder="Ex: FIC" readOnly={true} className="uppercase" />
        </div>

        <div className="md:col-span-3">
          <Lbl>Curso</Lbl>
          <Input value={cursoNome || ""} placeholder="Nome do curso" readOnly={true} />
        </div>
      </div>

      <div className="text-center text-[14px] bg-neutral-100 px-4 py-3 text-black">
        {capacidadeExib ? `Capacidade: ${capacidadeExib} alunos` : "Capacidade não informada"}
      </div>
    </div>
  );
}
function TurmaCardItem({ id, nome, codigo, curso, modalidade, dataInicio, dataTermino, capacidade, onEditar }) {
  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#0F0F0F] dark:bg-[#121212] p-4 flex flex-col gap-2 shadow-sm">
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-6 rounded-full" style={{ background: COR }} />
            <h4 className="text-sm font-semibold text-white">{nome || "Turma sem nome"}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-[3px] rounded-full text-white bg-red-600">{codigo || "—"}</span>
            <Link to={`/editar-versala/${id}`}>
              <button className="px-3 h-9 rounded-md text-sm font-semibold text-white bg-red-600 hover:brightness-[.95]">
                Editar
              </button>
            </Link>
          </div>
        </div>

      {/* tabela */}
      <div className="border-x border-b rounded-b-lg border-neutral-200 overflow-hidden bg-white">
        {/* cabeçalho */}
        <div className="grid grid-cols-3 text-center text-[14px] font-semibold bg-white text-black">
          <div className="p-3 border-r border-neutral-200">Duração</div>
          <div className="p-3 border-r border-neutral-200">Curso</div>
          <div className="p-3">Modalidade</div>
        </div>

        {/* linha de dados */}
        <div className="grid grid-cols-3 text-[13px] bg-white text-black">
          {/* duração */}
          <div className="border-t border-r border-neutral-200 p-3 text-left">
            <p>Início:</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-black">
              {dataInicio || "—"}
            </span>
            <p className="mt-3">Fim:</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-black">
              {dataTermino || "—"}
            </span>
          
          {codigo && (
            <span
              className="text-[11px] font-mono px-2 py-[3px] rounded-full text-white"
              style={{ backgroundColor: COR }}
              title="Código de acesso da turma"
            >
              {codigo}
            </span>
          )}

          </div>

          <div className="border-t border-r border-neutral-200 p-3 flex items-center justify-center">
            <span className="inline-block px-4 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-center text-black">
              {curso || "—"}
            </span>
          </div>

          {/* modalidade */}
          <div className="border-t border-neutral-200 p-3 flex items-center justify-center">
            <span className="inline-block px-4 py-1 rounded-sm bg-neutral-100 border border-neutral-300 text-black">
              {modalidade || "—"}
            </span>
          </div>
        </div>

        {/* footer capacidade */}
        <div className="text-center text-[14px] bg-neutral-100 px-4 py-3 text-black">
          {capacidade
            ? `Capacidade: ${capacidade} alunos`
            : "Capacidade não informada"}
        </div>
      </div>
    </div>
  </div>
  );
}

function CardReservar({ item }) {
  return (
    <article className="h-full">
      <div className="mx-auto h-full max-w-[360px] rounded-xl bg-white dark:bg-[#151515] border border-black/10 dark:border-white/10 shadow-sm flex flex-col">
        <div className="p-4 flex flex-col h-full">
          <div className="h-[130px] w-full rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3">
            <span className="inline-block text-[11px] font-semibold bg-[#B10000] text-white px-2 py-[2px] rounded">
              {item.title}
            </span>
            <p className="mt-2 text-[13px] leading-relaxed text-[#1E1E1E] dark:text-gray-200">
              {item.desc}
            </p>
          </div>
          <div className="mt-auto pt-3 flex justify-center">
            <Link to={item.to} className="inline-flex">
              <button
                className="px-6 h-8 rounded-md text-white text-[13px] font-semibold shadow-sm hover:brightness-[.98] active:scale-[.99] transition"
                style={{ backgroundColor: COR }}
              >
                Agendar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SalasProfessores() {
  const [turmas, setTurmas] = useState([]);
  const list = useMemo(() => turmas, [turmas]);

  const [displayName, setDisplayName] = useState("Professor(a)");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const perfil = await buscarMeuPerfil();
        const nome = String(perfil?.nome || perfil?.name || "").trim();
        if (alive) {
          setDisplayName(nome || "Professor(a)");
        }
      } catch (e) {
        console.error("[SalasProfessores] erro ao buscar perfil:", e);
        if (alive) {
          setDisplayName("Professor(a)");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const loadTurmas = async () => {
      try {
        const data = await buscarTurmas();
        console.log("[SalasProfessores] turmas do back:", data);

        setTurmas(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("[SalasProfessores] Erro ao buscar turmas:", e);
      }
    };

    loadTurmas();
  }, []);

  const primeiroNome = displayName.split(" ")[0];

  const reservarCards = [
    {
      id: "ps5",
      title: "PS5",
      img: ImgPS5,
      desc: "Acesso aos agendamentos para organizar e supervisionar o uso do PS5.",
      to: "/agendamento-ps5",
    },
    {
      id: "computadores",
      title: "Computadores",
      img: ImgComputadores,
      desc: "Visualize e controle os agendamentos dos computadores.",
      to: "/agendamento-computadores",
    },
    {
      id: "quadra",
      title: "Quadra",
      img: ImgQuadra,
      desc: "Gerencie os agendamentos para uso eficiente da quadra.",
      to: "/agendamento-quadra",
    },
    {
      id: "impressoras3d",
      title: "Impressoras 3D",
      img: ImgImpressora3D,
      desc: "Controle a fila e a produção nas impressoras 3D.",
      to: "/agendamento-impressao-3d",
    },
    {
      id: "auditorio",
      title: "Auditório",
      img: ImgAuditorio,
      desc: "Ideal para treinamentos, palestras, eventos e reuniões.",
      to: "/agendamento-auditorio",
    },
  ];

  return (
    <>
      <Header />

      <main className="bg-white dark:bg-[#0B0B0B] min-h-screen overflow-hidden relative">
        <nav className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mt-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                to="/HomeProfessor"
                className="text-[#4F46E5] hover:underline"
              >
                Home dos Professores
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 dark:text-gray-200">Salas</li>
          </ol>
        </nav>

        <motion.img
          src={OndaTopo}
          alt="Onda"
          className="w-full h-auto object-cover select-none pointer-events-none"
          initial={{ y: 12 }}
          animate={{ y: [12, 2, 12] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        />

        <section className="relative -mt-6 sm:-mt-8">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto bg-white dark:bg-[#121212] ring-1 ring-black/10 dark:ring-white/10 overflow-hidden shadow-sm">
              <img
                src={AvatarDefault}
                alt="Avatar"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-center text-[12px] sm:text-[13px] text-[#1E1E1E] dark:text-white">
              {primeiroNome}
            </p>
          </div>
        </section>

        <section className="mt-4">
          <div className="bg-[#B10000] text-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-6 sm:py-7 text-center">
              <h2 className="text-[15px] sm:text-[17px] md:text-[18px] font-semibold">
                Veja horários e salas disponíveis para se planejar.
              </h2>
              <p className="mt-3 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed opacity-95">
                Consulte a disponibilidade de salas e os horários de aula para
                criar e editar turmas com mais eficiência.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mt-6">
          <div className="flex items-center gap-3">
            <Link
              to="/professores/turmas/nova"
              className="inline-flex items-center gap-2 px-4 h-11 rounded-lg text-white font-semibold shadow-sm active:scale-[.99]"
              style={{ background: COR }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Adicionar Turma
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mt-4">
          {list.length > 0 ? (
            <div className="flex flex-col gap-6 items-center">
              {list.map((t) => (
                <div key={t.id || t.nome} className="w-full max-w-[720px]">
                  <TurmaCardAdmin turma={t} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/15 bg-white/60 dark:bg-[#141414] py-12 px-6 text-center">
              <h4 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">
                Nenhuma turma por aqui ainda
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Clique em{" "}
                <span className="font-semibold">“Adicionar Turma”</span> para
                criar sua primeira turma
              </p>
            </div>
          )}
        </section>

        <section className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-8 pb-10">
          <div className="grid place-items-center">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-[#1E1E1E] dark:text-white">
                Reservar
              </h3>
              <div
                className="mt-1 h-[3px] w-20 mx-auto rounded-full"
                style={{ backgroundColor: COR }}
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
            {reservarCards.map((it) => (
              <CardReservar key={it.id} item={it} />
            ))}
          </div>
        </section>

        <section className="relative w-full overflow-visible -mt-20 -bottom-5">
          <div className="pointer-events-none select-none relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] z-0">
            <motion.img
              src={OndasSala}
              alt=""
              className="block w-full h-auto max-w-none -mb-[8px]"
              initial={{ y: 6 }}
              animate={{ y: [6, -2, 6] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </section>
      </main>

      <div className="-mt-[5px]">
        <Footer />
      </div>
    </>
  );
}
