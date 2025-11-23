// src/pages/Salas/SalasAlunos.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaTopo from "../../assets/ondaLandinpage.svg";
import OndaRodape from "../../assets/OndaSalasProfessor.svg";
import AvatarDefault from "../../assets/AvatarPadrao.svg";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

import { ingressarTurmaPorCodigo } from "../../service/turma";
import { buscarMeuPerfil, buscarMinhasTurmas } from "../../service/usuario";

const COR = "#AE0000";

export default function SalasAlunos() {
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState("Aluno");

  // estados para "Entrar na turma"
  const [showJoin, setShowJoin] = useState(false);
  const [codigoTurma, setCodigoTurma] = useState("");
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [erroJoin, setErroJoin] = useState("");
  const [sucessoJoin, setSucessoJoin] = useState("");

  // estados das turmas do aluno
  const [turmas, setTurmas] = useState([]);
  const [loadingTurmas, setLoadingTurmas] = useState(false);
  const [erroTurmas, setErroTurmas] = useState("");

  // =================================================================================
  //      CARREGAR AVATAR E NOME PELO BACK (/usuario/meu-perfil)
  // =================================================================================
  useEffect(() => {
    const a = localStorage.getItem("avatar_url");
    setAvatar(a && a !== "null" && a !== "undefined" ? a : null);

    async function carregarPerfil() {
      try {
        const perfil = await buscarMeuPerfil();
        const nome = String(perfil?.nome || perfil?.name || "").trim();
        setDisplayName(nome || "Aluno");
      } catch (e) {
        console.error("[SalasAlunos] Erro ao buscar meu perfil:", e);
        setDisplayName("Aluno");
      }
    }

    carregarPerfil();
  }, []);

  // carrega as turmas do aluno ao abrir a tela
  useEffect(() => {
    carregarTurmas();
  }, []);

  // =====================================================
  //          BUSCAR TURMAS DO ALUNO
  //          (usa /usuario/minhas-turmas)
  // =====================================================
  async function carregarTurmas() {
    try {
      setErroTurmas("");
      setLoadingTurmas(true);

      const resp = await buscarMinhasTurmas();
      const lista = Array.isArray(resp) ? resp : resp?.content || resp?.data || [];

      setTurmas(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("[SalasAlunos] Erro ao buscar turmas do aluno:", err);
      const data = err?.response?.data || err?.data;
      const msg =
        data?.message ||
        err?.message ||
        "Não foi possível carregar suas turmas no momento.";
      setErroTurmas(msg);
    } finally {
      setLoadingTurmas(false);
    }
  }

  const cards = [
    {
      id: "ps5",
      title: "PS5",
      img: ImgPS5,
      desc:
        "Agora você pode aproveitar toda a emoção dos games com o PlayStation 5 na biblioteca.",
      to: "/agendamento-ps5",
    },
    {
      id: "quadra",
      title: "Quadra",
      img: ImgQuadra,
      desc:
        "A quadra é um espaço essencial para a prática de esportes, lazer e atividades físicas.",
      to: "/agendamento-quadra",
    },
    {
      id: "computadores",
      title: "Computadores",
      img: ImgComputadores,
      desc:
        "A biblioteca oferece computadores avançados para otimizar sua produtividade.",
      to: "/agendamento-computadores",
    },
    {
      id: "impressoras3d",
      title: "Impressoras 3D",
      img: ImgImpressora3D,
      desc:
        "As impressoras 3D permitem criar protótipos e peças personalizadas com inovação.",
      to: "/agendamento-impressora",
    },
  ];

  function Card({ data, idx }) {
    return (
      <motion.article
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, delay: 0.04 * idx, ease: "easeOut" }}
        className="
          mx-auto max-w-[380px] w-full
          rounded-2xl bg-white dark:bg-[#151515]
          border border-black/10 dark:border-white/10
          shadow-sm hover:shadow-md transition-shadow
          overflow-hidden
        "
      >
        <div className="p-4">
          <div className="h-[140px] w-full rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-neutral-50 dark:bg-neutral-900">
            <img
              src={data.img}
              alt={data.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <div className="mt-3">
            <span
              className="inline-block text-[11px] font-semibold px-2 py-[2px] rounded text-white"
              style={{ backgroundColor: COR }}
            >
              {data.title}
            </span>
            <p className="mt-2 text-[13px] leading-relaxed text-[#1E1E1E] dark:text-gray-200">
              {data.desc}
            </p>
          </div>

          <div className="mt-3 flex justify-end">
            <Link to={data.to} className="inline-flex">
              <button
                className="px-5 h-9 rounded-xl text-white text-[13px] font-semibold shadow-sm hover:brightness-[.98] active:scale-[.99] transition"
                style={{ backgroundColor: COR }}
              >
                Agendar
              </button>
            </Link>
          </div>
        </div>
      </motion.article>
    );
  }

  // =====================================================
  //          ENTRAR NA TURMA PELO CÓDIGO
  // =====================================================
  async function handleIngressarTurma(e) {
    e.preventDefault();
    setErroJoin("");
    setSucessoJoin("");

    if (!codigoTurma.trim()) {
      setErroJoin("Digite o código da turma.");
      return;
    }

    try {
      setLoadingJoin(true);

      const resp = await ingressarTurmaPorCodigo(codigoTurma);
      const msg =
        resp?.message ||
        resp?.mensagem ||
        "Ingresso na turma realizado com sucesso.";

      setSucessoJoin(msg);
      setCodigoTurma("");

      await carregarTurmas();
    } catch (e) {
      console.error("[SalasAlunos] Erro ao entrar na turma:", e);
      const data = e?.data || e?.response?.data;

      let msg =
        typeof e?.message === "string"
          ? e.message
          : "Não foi possível entrar na turma. Verifique o código.";

      if (typeof data?.message === "string") msg = data.message;
      if (Array.isArray(data?.message)) msg = data.message.join(" ");

      setErroJoin(msg);
    } finally {
      setLoadingJoin(false);
    }
  }

  function TurmaCard({ turma }) {
    const titulo =
      turma.nome ||
      turma.nomeTurma ||
      turma.titulo ||
      `Turma #${turma.id}`;

    const cursoNome =
      turma?.curso?.nome || turma?.cursoNome || turma?.nomeCurso || "";

    const professorNome =
      turma?.professor?.nome ||
      turma?.professorNome ||
      turma?.nomeProfessor ||
      "";

    const codigoAcesso =
      turma.codigoAcesso ||
      turma.codigo ||
      turma.codigoTurma ||
      turma.codigoAcessoAtual ||
      "";

    return (
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#151515] p-4 flex flex-col gap-1 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[#1E1E1E] dark:text-white">
              {titulo}
            </h4>
            {cursoNome && (
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {cursoNome}
              </p>
            )}
          </div>

          {codigoAcesso && (
            <span
              className="text-[11px] font-mono px-2 py-[3px] rounded-full text-white"
              style={{ backgroundColor: COR }}
              title="Código de acesso da turma"
            >
              {codigoAcesso}
            </span>
          )}
        </div>

        {professorNome && (
          <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
            Professor: <span className="font-medium">{professorNome}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="bg-white dark:bg-[#0B0B0B] min-h-screen overflow-hidden relative">
        <nav className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mt-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                to="/HomeAlunos"
                className="text-[#4F46E5] hover:underline"
              >
                Home dos Alunos
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 dark:text-gray-200">Salas</li>
          </ol>
        </nav>

        <motion.img
          src={OndaTopo}
          alt="Onda landingpage"
          className="w-full h-auto object-cover select-none pointer-events-none"
          initial={{ y: 12 }}
          animate={{ y: [12, 2, 12] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          draggable={false}
        />

        {/* Avatar + nome do usuário */}
        <section className="relative -mt-6 sm:-mt-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto bg-white dark:bg-[#121212] ring-1 ring-black/10 dark:ring-white/10 overflow-hidden shadow-sm">
              <img
                src={avatar || AvatarDefault}
                alt="Avatar do usuário"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p
              className="mt-2 text-center text-[12px] sm:text-[13px] text-[#1E1E1E] dark:text:white truncate px-2"
              title={displayName}
            >
              {displayName}
            </p>
          </div>
        </section>

        {/* Faixa vermelha */}
        <section className="mt-4">
          <div className="bg-[#B10000] text-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-6 sm:py-7 text-center">
              <h2 className="text-[15px] sm:text-[17px] md:text-[18px] font-semibold">
                Encontre o espaço perfeito, reserve em minutos!
              </h2>
              <p className="mt-3 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed opacity-95">
                Descubra uma curadoria de locais únicos e versáteis, prontos para
                receber seu próximo encontro.
              </p>
              <p className="mt-1 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed opacity-95">
                Agende com confiança e dê vida aos seus momentos memoráveis.
              </p>
            </div>
          </div>
        </section>

        {/* Entrar na turma */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pt-6">
          <div className="flex items-center justify-start gap-3">
            <button
              type="button"
              onClick={() => setShowJoin((v) => !v)}
              className="inline-flex items-center gap-2 px-4 h-11 rounded-lg text-white font-semibold shadow-sm active:scale-[.99]"
              style={{ backgroundColor: COR }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg:white/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Entrar na turma
            </button>
          </div>

          {showJoin && (
            <div className="mt-4 rounded-2xl border border-black/10 dark:border:white/15 bg:white dark:bg:#141414 p-5 sm:p-6">
              <h3 className="text:[16px] sm:text:[17px] font-semibold text:#1E1E1E dark:text:white">
                Digite o código da turma
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                O código é enviado pelo professor e possui letras e/ou números.
              </p>

              <form
                className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
                onSubmit={handleIngressarTurma}
              >
                <div className="flex-1">
                  <span className="block text-[11px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                    Código da turma
                  </span>
                  <input
                    value={codigoTurma}
                    onChange={(e) => setCodigoTurma(e.target.value)}
                    placeholder="Ex: WEXM5C"
                    className="w-full h-[44px] px-3 rounded-md border border-black/10 dark:border:white/10 bg:white dark:bg:#111 text:#1E1E1E dark:text:white outline-none focus:ring-2 focus:ring:black/10 dark:focus:ring:white/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingJoin}
                  className="px-6 h-11 rounded-lg text:white font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COR }}
                >
                  {loadingJoin ? "Entrando..." : "Confirmar"}
                </button>
              </form>

              {erroJoin && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {erroJoin}
                </p>
              )}
              {sucessoJoin && (
                <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                  {sucessoJoin}
                </p>
              )}
            </div>
          )}
        </section>

        {/* MINHAS TURMAS */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pt-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text:#1E1E1E dark:text:white">
              Minhas turmas
            </h3>
          </div>

          {loadingTurmas ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Carregando turmas...
            </p>
          ) : erroTurmas ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {erroTurmas}
            </p>
          ) : turmas.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Você ainda não está em nenhuma turma.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {turmas.map((t) => (
                <TurmaCard key={t.id || t.codigoAcesso} turma={t} />
              ))}
            </div>
          )}
        </section>

        {/* Agendar */}
        <section className="relative max-w-6xl mx:auto px-5 sm:px-6 md:px-8 pt-6 pb-20 md:pb-24">
          <div className="grid place-items-center">
            <div className="text-center">
              <h3 className="text-sm font-semibold text:#1E1E1E dark:text:white">
                Agendar
              </h3>
              <div
                className="mt-1 h-[3px] w-14 mx-auto rounded-full"
                style={{ backgroundColor: COR }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((c, i) => (
              <Card key={c.id} data={c} idx={i} />
            ))}
          </div>
        </section>
      </main>

      <div className="max-[1030px]:block min-[1031px]:hidden h-24 dark:bg:#0B0B0B" />

      <Footer />
    </>
  );
}
