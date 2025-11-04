// src/pages/PaginaDosProfessores/SalasProfessores.jsx
import React, { useMemo, useState } from "react";
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
import ImgAuditorio from "../../assets/Impressora3D.svg";

const COR = "#AE0000";

/* ----------------- UI helpers ----------------- */
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
        (readOnly ? "cursor-default" : "focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10") +
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
        (disabled ? "cursor-default" : "focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10")
      }
    >
      {children}
    </select>
  );
}

/* ----------------- Cards ----------------- */
function TurmaCard({ turma, isEditing, onStartEdit, onSave }) {
  const [form, setForm] = useState(turma);
  React.useEffect(() => setForm(turma), [turma.id, isEditing]);
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#151515] shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-6 rounded-full" style={{ background: COR }} />
          <h4 className="font-semibold text-[18px] text-[#1E1E1E] dark:text-white">
            {form.titulo || "Módulo"}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              type="button"
              onClick={() => onSave({ ...form })}
              className="px-3 h-9 rounded-md text-sm font-semibold text-white hover:opacity-95 active:scale-[.99]"
              style={{ background: COR }}
            >
              Salvar
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartEdit}
              className="px-3 h-9 rounded-md text-sm font-semibold bg-[#1F1F1F] text-white hover:opacity-95 active:scale-[.99]"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <Lbl>Duração</Lbl>
          <Input value={form.duracao} onChange={(v) => set("duracao", v)} placeholder="Ex: 40h" readOnly={!isEditing} />
        </div>
        <div>
          <Lbl>Datas</Lbl>
          <Input value={form.datas} onChange={(v) => set("datas", v)} placeholder="Ex: 02/09 – 30/09" readOnly={!isEditing} />
        </div>
        <div>
          <Lbl>Período</Lbl>
          <Select value={form.periodo} onChange={(v) => set("periodo", v)} disabled={!isEditing}>
            <option>Manhã</option>
            <option>Tarde</option>
            <option>Noite</option>
            <option>Integral</option>
          </Select>
        </div>
        <div>
          <Lbl>Tipo</Lbl>
          <Select value={form.tipo} onChange={(v) => set("tipo", v)} disabled={!isEditing}>
            <option>Teórica</option>
            <option>Prática</option>
            <option>Híbrida</option>
          </Select>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Input
          value={form.nome}
          onChange={(v) => set("nome", v)}
          placeholder="Nome da Turma"
          readOnly={!isEditing}
          className={isEditing ? "!bg-white !text-gray placeholder:!text-gray-300" : ""}
        />
      </div>
    </div>
  );
}

function CardReservar({ item }) {
  return (
    <article className="mx-auto max-w-[360px] rounded-xl bg-white dark:bg-[#151515] border border-black/10 dark:border-white/10 shadow-sm">
      <div className="p-4">
        <div className="h-[130px] w-full rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <div className="mt-3">
          <span className="inline-block text-[11px] font-semibold bg-[#B10000] text-white px-2 py-[2px] rounded">
            {item.title}
          </span>
          <p className="mt-2 text-[13px] leading-relaxed text-[#1E1E1E] dark:text-gray-200">{item.desc}</p>
        </div>
        <div className="mt-3 flex justify-center">
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
    </article>
  );
}

/* ----------------- Página ----------------- */
export default function SalasProfessores() {
  const [turmas, setTurmas] = useState([]);
  const list = useMemo(() => turmas, [turmas]);
  const [editingId, setEditingId] = useState(null);

  const reservarCards = [
    { id: "ps5", title: "PS5", img: ImgPS5, desc: "Acesso aos agendamentos para organizar e supervisionar o uso do PS5.", to: "/agendamento-ps5" },
    { id: "computadores", title: "Computadores", img: ImgComputadores, desc: "Visualize e controle os agendamentos dos computadores.", to: "/agendamento-computadores" },
    { id: "quadra", title: "Quadra", img: ImgQuadra, desc: "Gerencie os agendamentos para uso eficiente da quadra.", to: "/agendamento-quadra" },
    { id: "impressoras3d", title: "Impressoras 3D", img: ImgImpressora3D, desc: "Controle a fila e a produção nas impressoras 3D.", to: "/agendamento-impressao-3d" },
    { id: "auditorio", title: "Auditório", img: ImgAuditorio, desc: "Ideal para treinamentos, palestras, eventos e reuniões.", to: "/agendamento-auditorio" },
  ];

  return (
    <>
      <Header />

      <main className="bg-white dark:bg-[#1E1E1E] min-h-screen overflow-hidden relative">
        {/* trilha */}
        <nav className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mt-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/HomeProfessor" className="text-[#4F46E5] hover:underline">
                Home dos Professores
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 dark:text-gray-200">Salas</li>
          </ol>
        </nav>

        {/* Onda topo */}
        <motion.img
          src={OndaTopo}
          alt="Onda"
          className="w-full h-auto object-cover select-none pointer-events-none"
          initial={{ y: 12 }}
          animate={{ y: [12, 2, 12] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Avatar */}
        <section className="relative -mt-6 sm:-mt-8">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto bg-white dark:bg-[#121212] ring-1 ring-black/10 dark:ring-white/10 overflow-hidden shadow-sm">
              <img src={AvatarDefault} alt="Avatar" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <p className="mt-2 text-center text-[12px] sm:text-[13px] text-[#1E1E1E] dark:text-white">Flama</p>
          </div>
        </section>

        {/* Faixa vermelha */}
        <section className="mt-4">
          <div className="bg-[#B10000] text-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-6 sm:py-7 text-center">
              <h2 className="text-[15px] sm:text-[17px] md:text-[18px] font-semibold">
                Veja horários e salas disponíveis para se planejar.
              </h2>
              <p className="mt-3 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed opacity-95">
                Consulte a disponibilidade de salas e os horários de aula para criar e editar turmas com mais eficiência.
              </p>
            </div>
          </div>
        </section>

        {/* Ações */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mt-6">
          <div className="flex items-center gap-3">
            <Link
              to="/professores/turmas/nova"
              className="inline-flex items-center gap-2 px-4 h-11 rounded-lg text-white font-semibold shadow-sm active:scale-[.99]"
              style={{ background: COR }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              Adicionar Turma
            </Link>
          </div>
        </section>

        {/* Turmas */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mt-4">
          {list.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {list.map((t) => (
                <TurmaCard
                  key={t.id}
                  turma={t}
                  isEditing={editingId === t.id}
                  onStartEdit={() => setEditingId(t.id)}
                  onSave={(updated) => {
                    const newList = list.map((x) => (x.id === updated.id ? updated : x));
                    setTurmas(newList);
                    setEditingId(null);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/15 bg-white/60 dark:bg-[#141414] py-12 px-6 text-center">
              <h4 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Nenhuma turma por aqui ainda</h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Clique em <span className="font-semibold">“Adicionar Turma”</span> para criar sua primeira turma
              </p>
            </div>
          )}
        </section>

        {/* Reservar */}
        <section className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-8 pb-10">
          <div className="grid place-items-center">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-[#1E1E1E] dark:text-white">Reservar</h3>
              <div className="mt-1 h-[3px] w-20 mx-auto rounded-full" style={{ backgroundColor: COR }} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reservarCards.map((it) => (
              <CardReservar key={it.id} item={it} />
            ))}
          </div>
        </section>

        {/* Onda footer (puxada alguns px para cobrir o antialias) */}
        <section className="relative w-full overflow-visible -mt-20 -bottom-5">
          <div className="pointer-events-none select-none relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] z-0">
            <motion.img
              src={OndasSala}
              alt=""
              className="block w-full h-auto max-w-none -mb-[8px] " 
              initial={{ y: 6 }}
              animate={{ y: [6, -2, 6] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </section>
      </main>

      {/* Footer colado na onda (sem espaço branco) */}
      <div className="-mt-[5px]">
        <Footer />
      </div>
    </>
  );
}
