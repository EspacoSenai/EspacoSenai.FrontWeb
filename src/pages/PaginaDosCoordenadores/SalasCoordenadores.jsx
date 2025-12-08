// src/pages/PaginaDosCoordenadores/SalasCoordenadores.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaTopo from "../../assets/ondaLandinpage.svg";
import OndasSala from "../../assets/OndaSalasProfessor.svg";
import AvatarDefault from "../../assets/AvatarPadrao.svg";
import PessoaRelatorios from "../../assets/mulherRelatorios.svg";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

import { buscarMeuPerfil } from "../../service/usuario";
import { buscarTodosAmbientes } from "../../service/ambiente";
import {
  encontrarAmbientePorChave,
  encontrarAmbientePorId,
  normalizarChave,
} from "../../utils/ambientes";

const COR = "#AE0000";

export default function SalasCoordenadores() {
  const [displayName, setDisplayName] = useState("");
  const [ambientes, setAmbientes] = useState([]);

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
          const nomeFinal = String(nomeBack || "").trim();
          setDisplayName(nomeFinal || "Coordenador(a)");
        }
      } catch (err) {
        console.error("[SalasCoordenadores] Erro ao buscar perfil:", err);
        if (alive) setDisplayName("Coordenador(a)");
      }
    })();

    return () => {
      alive = false;
    };
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
        console.error("[SalasCoordenadores] Erro ao buscar ambientes:", err);
        if (alive) setAmbientes([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const gerarSlugAmbiente = (idPreferencial, fallbackNome, preferidoNome) => {
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

  const primeiroNomeRaw = (displayName || "").split(" ")[0] || "";
  const nome = primeiroNomeRaw || "Coordenador(a)";

  // IDs dos ambientes (ajusta conforme o back)
  const ESPACOS = [
    {
      titulo: "PS5",
      ambienteNome: "PS5",
      img: ImgPS5,
      desc: "Acesso aos agendamentos para organizar e supervisionar o uso do PS5.",
      toAgendar: "/agendamento-ps5",
      ambienteId: 2,
    },
    {
      titulo: "Computadores",
      ambienteNome: "Computadores",
      img: ImgComputadores,
      desc: "Visualize os agendamentos para acompanhar e controlar o uso dos computadores.",
      toAgendar: "/agendamento-computadores",
      ambienteId: 3,
    },
    {
      titulo: "Quadra",
      ambienteNome: "Quadra",
      img: ImgQuadra,
      desc: "Gerencie agendamentos para uso eficiente da quadra.",
      toAgendar: "/agendamento-quadra",
      ambienteId: 1,
    },
    {
      titulo: "Impressoras 3D",
      ambienteNome: "Impressoras 3D",
      img: ImgImpressora3D,
      desc: "Controle os agendamentos e uso produtivo das impressoras 3D.",
      toAgendar: "/agendamento-auditorio",
      ambienteId: 4,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />

      {/* TOPO + AVATAR + NOME */}
      <section className="relative w-full overflow-hidden">
        <img
          src={OndaTopo}
          alt=""
          className="pointer-events-none select-none w-full h-auto"
        />

        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 -mt-10 md:-mt-12 flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md">
            <img
              src={AvatarDefault}
              alt={nome}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="mt-2 font-semibold text-neutral-800 dark:text-neutral-100">
            {nome}
          </p>
        </div>

        {/* Faixa vermelha com textos */}
        <div className="mt-6 w-full" style={{ backgroundColor: COR }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-12 text-center text-white">
            <h2 className="text-lg md:text-2xl font-extrabold">
              Acesso aos agendamentos melhora a gestão e otimiza recursos.
            </h2>
            <p className="mt-3 text-sm md:text-base opacity-90">
              Visão estratégica, otimiza recursos e garante uma gestão mais
              eficiente e personalizada.
            </p>
            <p className="text-sm md:text-base opacity-90">
              Organize com clareza, inspire resultados e faça a gestão
              acontecer.
            </p>
          </div>
        </div>
      </section>

      {/* ESPAÇOS */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10 relative">
          {/* Título central */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="text-center">
              <h3 className="text-[20px] md:text-[22px] font-semibold text-neutral-900 dark:text-neutral-100">
                Espaços
              </h3>
              <div
                className="mt-2 mx-auto w-24 h-[3px] rounded-full"
                style={{ backgroundColor: COR }}
              />
            </div>
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {ESPACOS.map((c) => (
              <div key={c.titulo} className="w-full md:w-[500px] mx-auto">
                <div
                  className="rounded-md px-6 py-3 text-white font-semibold text-[18px] md:text-[20px] mb-4 shadow-sm"
                  style={{ backgroundColor: COR }}
                >
                  {c.titulo}
                </div>

                <div
                  className="
                    bg-[#F2F2F2] dark:bg-[#1E1E1E]
                    text-neutral-900 dark:text-neutral-100
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
                    <div className="rounded-lg px-5 py-4 bg-[#E9ECEF] text-neutral-900 dark:bg-[#3A3A3A] dark:text-white">
                      <p className="text-[15px] leading-relaxed">{c.desc}</p>
                    </div>
                  </div>

                  {/* Botões Agendar / Editar */}
                  <div className="mt-auto pt-5 flex flex-col sm:flex-row gap-3 justify-center sm:justify-between">
                    <Link to={c.toAgendar} className="inline-block">
                      <button
                        className="w-full sm:w-auto px-7 md:px-8 py-3 text-[16px] md:text-[18px] font-semibold rounded-md text-white hover:brightness-95 transition"
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
                        className="w-full sm:w-auto px-6 py-3 text-[15px] md:text-[16px] font-semibold rounded-md border border-[#B10404] text-[#B10404] bg-white hover:bg-[#FCECEC] transition"
                      >
                        Editar
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-12">
            <div className="h-px w-full bg-neutral-300 dark:bg-white/10" />
          </div>
        </div>
      </section>

      {/* RELATÓRIOS */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-6 md:pt-8 pb-10 md:pb-12">
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
                alt="Ilustração geração de relatórios"
                className="w-[190px] md:w-[230px] h-auto object-contain"
              />
            </div>

            <div className="md:max-w-[560px]">
              <p className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                Coordenadores podem gerar relatórios diversos sobre reservas de
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

      {/* ONDA + FOOTER */}
      <div className="md:hidden h-24" />

      <section className="relative w-full overflow-visible -mt-20 -bottom-5 hidden md:block">
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

      <div className="-mt-[5px]">
        <Footer />
      </div>
    </div>
  );
}
