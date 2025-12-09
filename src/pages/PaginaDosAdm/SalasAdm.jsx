import React, { useState, useEffect } from "react";
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
import ImgAuditorio from "../../assets/auditorio.svg";

import { buscarMeuPerfil } from "../../service/usuario";
import GestaoAlunos from "./GestaoAlunos";
import GestaoTurmas from "./GestaoTurmas";
import { buscarTodosAmbientes } from "../../service/ambiente";
import {
  encontrarAmbientePorChave,
  encontrarAmbientePorId,
  normalizarChave,
} from "../../utils/ambientes";

const COR = "#AE0000";

export default function SalasAdm() {
  const [displayName, setDisplayName] = useState("Administrador");
  const [ambientes, setAmbientes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const usuario = await buscarMeuPerfil();
        setDisplayName(usuario?.nome || "Administrador");
      } catch {
        setDisplayName("Administrador");
      }
    })();
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ambientes = await buscarTodosAmbientes();
        if (!alive) return;
        const lista = Array.isArray(ambientes) ? ambientes : [];
        setAmbientes(lista);
      } catch (err) {
        console.error("[SalasAdm] Erro ao buscar ambientes:", err);
        if (alive) setAmbientes([]);
      }
    })();

    // Recarrega quando voltar o foco ou a visibilidade após editar/gestão
    const onFocus = async () => {
      try {
        const ambientes = await buscarTodosAmbientes();
        const lista = Array.isArray(ambientes) ? ambientes : [];
        setAmbientes(lista);
      } catch (err) {
        console.error("[SalasAdm] Erro ao recarregar ambientes:", err);
      }
    };

    const onVisibility = async () => {
      if (document.visibilityState === "visible") {
        await onFocus();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const obterSlugAmbiente = (idPreferencial, fallbackNome, preferidoNome) => {
    const prefer = preferidoNome || "";
    if (prefer) {
      const viaPrefer = encontrarAmbientePorChave(ambientes, prefer);
      if (viaPrefer?.nome) {
        return encodeURIComponent(viaPrefer.nome.trim());
      }
    }

    const viaId = encontrarAmbientePorId(ambientes, idPreferencial);
    if (viaId?.nome) {
      return encodeURIComponent(viaId.nome.trim());
    }

    const chave = normalizarChave(fallbackNome || "");
    if (chave) {
      const viaAlias = encontrarAmbientePorChave(ambientes, chave);
      if (viaAlias?.nome) {
        return encodeURIComponent(viaAlias.nome.trim());
      }
    }

    return encodeURIComponent(fallbackNome || "");
  };

  const nome = (displayName || "Administrador").split(" ")[0];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />

      {/* ===== topo ===== */}
      <section className="relative w-full overflow-hidden">
        <img src={OndaTopo} alt="" className="w-full h-auto" />
        <div className="max-w-6xl mx-auto -mt-10 md:-mt-12 flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center">
            <img src={AvatarDefault} alt={nome} className="w-full h-full object-contain" />
          </div>
          <p className="mt-2 font-semibold text-neutral-800 dark:text-neutral-100">
            {nome}
          </p>
        </div>

        {/* faixa vermelha */}
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

      {/* ===== Salas de agendamento ===== */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10 relative">
          {/* Botão criar sala */}
          <div className="md:hidden mb-4">
            <Link
              to="/criar-sala"
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold text-white shadow-md hover:brightness-95 active:scale-[.99] transition"
              style={{ backgroundColor: COR }}
            >
              Criar sala
            </Link>
          </div>

          <div className="hidden md:block absolute left-[max(1.25rem,calc(50%-36rem+1.25rem))] top-6">
            <Link
              to="/criar-sala"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold text-white shadow-md hover:brightness-95 active:scale-[.99] transition"
              style={{ backgroundColor: COR }}
            >
              Criar sala
            </Link>
          </div>

          {/* título */}
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <h3 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-100">
                Salas de agendamento
              </h3>
              <div
                className="mt-2 mx-auto w-24 h-[3px] rounded-full"
                style={{ backgroundColor: COR }}
              />
            </div>
          </div>

          {/* grid de salas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {[
              {
                titulo: "PS5",
                ambienteNome: "PS5",
                img: ImgPS5,
                desc: "Acesso aos agendamentos para organizar e supervisionar o uso do PS5.",
                to: "/agendamentos/ps5",
                ambienteId: 2,
              },
              {
                titulo: "Computadores",
                ambienteNome: "Computadores",
                img: ImgComputadores,
                desc: "Visualize os agendamentos para acompanhar e controlar o uso dos computadores.",
                to: "/agendamentos/computadores",
                ambienteId: 3,
              },
              {
                titulo: "Quadra",
                ambienteNome: "Quadra",
                img: ImgQuadra,
                desc: "Gerencie agendamentos para uso eficiente da quadra.",
                to: "/agendamentos/quadra",
                ambienteId: 1,
              },
              {
                titulo: "Impressoras 3D",
                ambienteNome: "Impressoras 3D",
                img: ImgImpressora3D,
                desc: "Controle os agendamentos do uso produtivo das impressoras 3D.",
                to: "/agendamentos/impressoras",
                ambienteId: 4,
              },
              {
                titulo: "Auditório",
                ambienteNome: "Auditório",
                img: ImgAuditorio,
                desc: "Controle reservas, aprovações e a agenda do auditório.",
                to: "/agendamentos/auditorio",
                ambienteId: 5,
              },
            ].map((c) => (
              <div key={c.titulo} className="w-full md:w-[500px] mx-auto">
                <div
                  className="rounded-md px-6 py-3 text-white font-semibold text-[20px] mb-4 shadow-sm"
                  style={{ backgroundColor: COR }}
                >
                  {c.titulo}
                </div>

                <div
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-neutral-200/70 dark:border-neutral-800 shadow-[0_8px_22px_rgba(0,0,0,0.08)] p-5 flex flex-col min-h-[380px] md:min-h-[430px]"
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
                  <div className="mt-auto pt-5 flex flex-row gap-3 justify-center items-center">
                    <Link to={c.to} className="inline-block">
                      <button
                        className="px-6 py-3 text-[16px] font-semibold rounded-md text-white hover:brightness-95 transition"
                        style={{ backgroundColor: COR }}
                      >
                        Agendar
                      </button>
                    </Link>

                    {/* EDITAR AMBIENTE E CATÁLOGO */}
                    <Link
                      to={`/editar-sala/${encodeURIComponent(c.ambienteNome || c.titulo)}`}
                      className="inline-block"
                    >
                      <button
                        className="px-5 py-3 text-[15px] font-semibold rounded-md border border-[#B10404] text-[#B10404] bg-white hover:bg-[#FCECEC] transition"
                      >
                        Editar
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* linha divisória */}
          <div className="mt-12">
            <div className="h-px w-full bg-neutral-300 dark:bg-white/10" />
          </div>
        </div>
      </section>

      {/* ===== Gestão de Alunos ===== */}
      <GestaoAlunos cor={COR} />

      {/* ===== Gestão de Turmas ===== */}
      <GestaoTurmas cor={COR} />

      {/* ===== Relatórios ===== */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-6 md:pt-8 pb-24 md:pb-10">
          <h3 className="text-[19px] md:text-[21px] font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span
              className="inline-block h-5 w-[4px] rounded-full"
              style={{ backgroundColor: COR }}
            />
            Geração de <span style={{ color: COR }}>Relatórios</span> das{" "}
            <span style={{ color: COR }}>Salas</span>
          </h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center md:justify-start">
              <img
                src={PessoaRelatorios}
                alt=""
                className="w-[190px] md:w-[230px] h-auto object-contain"
              />
            </div>

            <div className="md:max-w-[560px]">
              <p className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                Administradores podem gerar relatórios diversos sobre reservas de
                ambientes.
              </p>
              <p className="mt-3 text-[16px] md:text-[17px] text-neutral-900 dark:text-neutral-200 leading-relaxed">
                Esses relatórios facilitam o planejamento, otimizam a alocação
                de recursos e promovem transparência e organização na rotina
                institucional.
              </p>
              <div className="mt-6 w-full flex justify-center md:justify-start">
                <Link
                  to="/relatorio-adm"
                  type="button"
                  className="px-8 py-3.5 text-[18px] md:text-[19px] font-semibold rounded-md text-white hover:brightness-95 transition"
                  style={{ backgroundColor: COR }}
                >
                  Gerar Relatórios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== onda de rodapé ===== */}
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
