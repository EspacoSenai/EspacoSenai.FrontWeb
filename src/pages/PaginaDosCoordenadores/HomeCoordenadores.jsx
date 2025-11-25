import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaPrincipal from "../../assets/OndasHome.svg";
import OndaRodape from "../../assets/ondaPrincipal.svg";
import Pessoa from "../../assets/HomeCoordenador.svg";

import {
  COR,
  pages,
  pagesCount,
  ArrowBtn,
  Card,
} from "../../components/ComponentsHome/FuncoesHome";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

import { buscarMeuPerfil } from "../../service/usuario";
import {
  buscarReservasAprovadas,
  cancelarReserva,
} from "../../service/reserva";

const Dot = () => (
  <span
    className="inline-block w-[8px] h-[8px] rounded-full mr-2"
    style={{ backgroundColor: COR }}
  />
);

const Kebab = ({ onClick, ariaControls, ariaExpanded }) => (
  <button
    type="button"
    aria-label="Mais opções"
    aria-controls={ariaControls}
    aria-expanded={ariaExpanded}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className="h-12 w-12 grid place-items-center rounded-xl bg-transparent text-neutral-700 hover:bg-black/5 transition outline-none focus:outline-none"
    style={{
      WebkitTapHighlightColor: "transparent",
      touchAction: "manipulation",
      outline: "none",
      border: "none",
    }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
    </svg>
  </button>
);

function formatHoraCurta(h) {
  if (!h) return "";
  const str = String(h);
  if (str.length >= 5) return str.slice(0, 5);
  return str;
}

function inferirPeriodo(horaInicioHHMM) {
  if (!horaInicioHHMM) return "Manhã";
  const [h] = horaInicioHHMM.split(":").map((n) => parseInt(n || 0, 10));
  if (h >= 6 && h < 12) return "Manhã";
  if (h >= 12 && h < 18) return "Tarde";
  return "Noite";
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

function mapReservaParaLembrete(r) {
  const horaInicio =
    r.horaInicio || r.horaInicioReserva || r.inicio || r.horarioInicio;
  const horaFim = r.horaFim || r.horaFimReserva || r.fim || r.horarioFim;

  const horaIniTxt = formatHoraCurta(horaInicio);
  const horaFimTxt = formatHoraCurta(horaFim);
  const horario =
    horaIniTxt && horaFimTxt
      ? `${horaIniTxt} - ${horaFimTxt}`
      : horaIniTxt || horaFimTxt || "";

  const dataRaw =
    r.data || r.dataReserva || r.dataAgendada || r.dataInicio || r.dia;
  const dataTexto = formatDataBR(dataRaw);

  const ambienteNome =
    r.ambienteNome ||
    r.ambiente ||
    r.local ||
    r.espaco ||
    r.nomeEspaco ||
    r.nomeAmbiente ||
    "";

  const periodo = r.periodo || inferirPeriodo(horaIniTxt);

  return {
    id: r.id,
    periodo,
    horario,
    data: dataTexto,
    ambienteNome,
    imagem: escolherImagem(ambienteNome),
  };
}

function LembreteCard({ item, onCancelado }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const popRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const handleCancelar = async () => {
    setOpen(false);
    const ok = window.confirm(
      `Cancelar a reserva do dia ${item.data} (${item.periodo})?`
    );
    if (!ok) return;

    try {
      setLoading(true);
      await cancelarReserva(item.id, "Cancelada pelo coordenador na Home.");
      if (onCancelado) onCancelado();
    } catch (err) {
      console.error("[HomeCoordenador] Erro ao cancelar reserva:", err);
      alert(
        "Não foi possível cancelar a reserva. Tente novamente ou verifique sua conexão."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-xl bg-white dark:bg-[#1B1B1B] shadow-sm ring-1 ring-black/5 px-3 py-3 md:px-4 md:py-4">
      <div className="absolute bottom-3 right-3 -m-2 p-2 z-[70]" ref={popRef}>
        <Kebab
          onClick={() => setOpen((v) => !v)}
          ariaControls={`menu-${item.id}`}
          ariaExpanded={open}
        />
        {open && (
          <div
            id={`menu-${item.id}`}
            role="menu"
            className="absolute bottom-12 right-0 w-56 overflow-hidden select-none z-[9999]"
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              border: "1px solid rgba(0,0,0,0.10)",
            }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleCancelar}
              disabled={loading}
              onFocus={(e) => e.currentTarget.blur()}
              className="w-full flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-black/5 transition disabled:opacity-60"
              style={{
                background: "transparent",
                color: "#b91c1c",
                outline: "none",
                boxShadow: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke={COR} strokeWidth="1.8" />
                <path
                  d="M9.5 9.5l5 5M14.5 9.5l-5 5"
                  stroke={COR}
                  strokeWidth="1.8"
                />
              </svg>
              <span className="font-semibold">
                {loading ? "Cancelando..." : "Cancelar reserva"}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-3 md:gap-4">
        <div className="col-span-12 sm:col-span-5 md:col-span-4">
          <img
            src={item.imagem}
            alt={item.ambienteNome || "Espaço reservado"}
            className="w-full h-[180px] md:h-[150px] object-cover rounded-xl"
          />
        </div>

        <div className="relative col-span-12 sm:col-span-7 md:col-span-8 pr-16 pt-12">
          <span className="absolute top-0 right-[-12px] md:right-[-16px] h-10 md:h-11 px-5 md:px-6 bg-[#720505] text-white text-[15px] md:text-[16px] font-semibold leading-[2.5rem] md:leading-[2.75rem] rounded-l-xl rounded-r-none whitespace-nowrap shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
            Reserva
          </span>
          <div className="space-y-2.5 text-[16px]">
            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Período:</span>
              <span className="opacity-90">{item.periodo}</span>
            </div>
            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Horário:</span>
              <span className="opacity-90">{item.horario}</span>
            </div>
            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Data:</span>
              <span className="opacity-90">{item.data}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeCoordenador() {
  const [page, setPage] = useState(0);
  const [lembretesPage, setLembretesPage] = useState(0);
  const [lembretes, setLembretes] = useState([]);

  const [displayName, setDisplayName] = useState("");
  const primeiroNomeRaw = (displayName || "").split(" ")[0] || "";
  const nome = primeiroNomeRaw || "Coordenador(a)";
  const isLongName = nome.length > 18;

  const mobileTitleClass = isLongName
    ? "text-[22px] leading-snug"
    : "text-[26px] leading-tight";

  const desktopFirstLineClass = isLongName
    ? "text-[30px] lg:text-[34px]"
    : "text-[36px] lg:text-[40px]";

  const desktopSecondLineClass = isLongName
    ? "text-[30px] lg:text-[36px]"
    : "text-[40px] lg:text-[46px]";

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
        if (alive)
          setDisplayName(nomeBack.toString().trim() || "Coordenador(a)");
      } catch (err) {
        console.error("[HomeCoordenador] Erro ao buscar perfil:", err);
        if (alive) setDisplayName("Coordenador(a)");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const carregarReservas = useCallback(async () => {
    try {
      const data = await buscarReservasAprovadas();
      const arr = Array.isArray(data) ? data : [];
      const mapped = arr.map(mapReservaParaLembrete);
      setLembretes(mapped);
      setLembretesPage(0);
    } catch (err) {
      console.error("[HomeCoordenador] Erro ao buscar reservas aprovadas:", err);
      setLembretes([]);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  const alertas = [
    {
      id: 1,
      espaco: "PS5 estará indisponível",
      data: "31/09",
      motivo: "Manutenção",
    },
    {
      id: 2,
      espaco: "PS5 estará indisponível",
      data: "31/09",
      motivo: "Manutenção",
    },
    {
      id: 3,
      espaco: "PS5 estará indisponível",
      data: "31/09",
      motivo: "Manutenção",
    },
    {
      id: 4,
      espaco: "PS5 estará indisponível",
      data: "31/09",
      motivo: "Manutenção",
    },
  ];

  const nextPage = useCallback(() => setPage((p) => (p + 1) % pagesCount), []);
  const prevPage = useCallback(
    () => setPage((p) => (p - 1 + pagesCount) % pagesCount),
    []
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPage, prevPage]);

  const lembretesPages = useMemo(() => {
    if (!lembretes.length) return [];
    const list = [...lembretes];
    const res = [];
    for (let i = 0; i < list.length; i += 4) {
      res.push(list.slice(i, i + 4));
    }
    return res;
  }, [lembretes]);

  const lembretesPagesCount = lembretesPages.length;

  const nextLembretesPage = () => {
    if (!lembretesPagesCount) return;
    setLembretesPage((p) => (p + 1) % lembretesPagesCount);
  };

  return (
    <>
      <Header />

      <main className="bg-white dark:bg-[#0B0B0B]  w-full">
        <section className="relative w-full -mt-px">
          <div className="lg:hidden relative w-full h-[440px] bg-[#A00000] dark:bg-black text-white flex items-center pt-12">
            <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
              <img
                src={Pessoa}
                alt=""
                className="h-[170px] w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.15)]"
              />
              <h1
                className={`font-extrabold text-center text-balance ${mobileTitleClass}`}
              >
                Bem-vindo(a) {nome},
              </h1>
              <p className="text-sm opacity-95 text-center">
                Este é o Painel do Coordenador!
              </p>
              <Link to="/salas-coordenadores" className="mt-2">
                <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                  Começar agora
                </button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex w-full h-[560px] lg:h-[600px] items-center">
            <div className="relative w-1/2 h-full flex items-end justify-center pb-12 md:translate-x-8 md:-translate-y-16 shrink-0 min-w-[360px]">
              <img src={Pessoa} alt="" className="h-[65%] w-auto" />
            </div>

            <div className="relative w-1/2 h-full overflow-hidden lg:-right-7">
              <img
                src={OndaPrincipal}
                alt=""
                className="absolute inset-0 w-full h-full object-contain object-right-top z-0 pointer-events-none select-none"
              />
              <div className="absolute inset-0 flex flex-col items-end justify-center text-white text-right pr-12 lg:pr-24 z-10 pb-24">
                <div className="w-full max-w-[520px] ml-auto">
                  <h1 className="font-extrabold text-balance leading-tight">
                    <span className={`${desktopFirstLineClass} block`}>
                      Bem-vindo(a)
                    </span>
                    <span className={`${desktopSecondLineClass} block`}>
                      {nome},
                    </span>
                  </h1>
                  <p className="text-lg mt-3">
                    Este é o Painel do Coordenador!
                  </p>
                  <div className="w-full mt-12 lg:mt-20 flex justify-end">
                    <Link to="/salas-coordenadores">
                      <button className="bg-white text-gray-900 font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition">
                        Começar agora
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

        <section className="w-full" id="atalhos">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block h-5 w-[6px] rounded-full bg-[#AE0000]" />
              <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#1E1E1E] dark:text-white">
                Espaços em <span className="text-[#AE0000]">Destaque</span>
              </h2>
            </div>

            <div className="relative rounded-[14px] bg-[#E5E5E5] dark:bg-[#2A2A2A] p-3 sm:p-4 md:p-5 shadow-[inset_0_1px_0_rgba(0,0,0,0.05)]">
              <div className="absolute right-0 top-0 bottom-0 w-3 rounded-r-[14px] bg-[#E5E5E5] dark:bg-[#2A2A2A] z-10 pointer-events-none" />
              <ArrowBtn onClick={nextPage} />

              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  <div className="w-full shrink-0">
                    <div className="space-y-4 md:space-y-5">
                      <Card {...pages[0][0]} />
                      <div className="h-px bg-gray-300 rounded-full mx-1" />
                      <Card {...pages[0][1]} />
                    </div>
                  </div>
                  <div className="w-full shrink-0">
                    <div className="space-y-4 md:space-y-5">
                      <Card {...pages[1][0]} />
                      <div className="h-px bg-gray-300 rounded-full mx-1" />
                      <Card {...pages[1][1]} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: pagesCount }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition ${
                      page === i
                        ? "bg-[#AE0000]"
                        : "bg-gray-400/70 dark:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

        <section className="w-full">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-2 pb-10 md:pb-14">
            <h3 className="text-center text-[20px] sm:text-[22px] font-semibold text-[#1E1E1E] dark:text-white underline decoration-[#AE0000] underline-offset-[6px]">
              Lembretes
            </h3>

            {lembretes.length === 0 ? (
              <div className="mt-6 text-center text-gray-500 dark:text-gray-400 py-8">
                Você ainda não tem lembretes de agendamento.
              </div>
            ) : (
              <div className="relative mt-6">
                {lembretesPagesCount > 1 && (
                  <ArrowBtn onClick={nextLembretesPage} />
                )}

                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                    style={{
                      transform: `translateX(-${lembretesPage * 100}%)`,
                    }}
                  >
                    {lembretesPages.map((grupo, idx) => (
                      <div key={idx} className="w-full shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {grupo.map((it) => (
                            <LembreteCard
                              key={it.id}
                              item={it}
                              onCancelado={carregarReservas}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {lembretesPagesCount > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {Array.from({ length: lembretesPagesCount }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full transition ${
                          lembretesPage === i
                            ? "bg-[#AE0000]"
                            : "bg-gray-400/70 dark:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <span
                className="h-[6px] w-24 rounded-full"
                style={{ backgroundColor: COR }}
              />
            </div>

            <div className="mt-8 max-w-3xl mx-auto text-center">
              <p className="text-[14px] sm:text-[15px] text-[#1E1E1E] dark:text-gray-200">
                Acompanhe o status das reservas em tempo real e mantenha a
                agenda atualizada.
              </p>

              <div className="mt-5">
                <Link
                  to="/reserva-pendente"
                  className="inline-flex items-center justify-center rounded-md bg-[#AE0000] text-white px-6 py-3 text-[15px] font-semibold shadow-sm hover:brightness-95 active:scale-[.99] transition"
                >
                  Reservas Pendentes
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-gray-300 mx-8 mt-0 mb-3" />

        <section className="w-full">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-32">
            <h3 className="text-center text-[20px] sm:text-[22px] font-semibold text-[#1E1E1E] dark:text-white">
              Alertas
            </h3>
            <div
              className="mx-auto mt-2 mb-6 h-[3px] w-20 rounded-full"
              style={{ backgroundColor: COR }}
            />
            <div className="rounded-xl bg-[#EFEFEF] dark:bg-[#1f1f1f] p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {alertas.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-lg bg-white dark:bg-[#151515] border border-black/10 dark:border-white/10 shadow-sm p-5"
                  >
                    <ul className="space-y-2 text-[14px]">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#AE0000]" />
                        <span>
                          <strong>Espaço:</strong> {a.espaco}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#AE0000]" />
                        <span>
                          <strong>Data:</strong> {a.data}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#AE0000]" />
                        <span>
                          <strong>Motivo:</strong> {a.motivo}
                        </span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full overflow-visible">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-6">
            <div className="h-px w-full" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-[460px] md:pb-[520px]" />

          <div className="pointer-events-none select-none absolute inset-x-0 bottom-0 h-[140px] md:h-[180px]">
            <motion.img
              src={OndaRodape}
              alt=""
              className="absolute bottom-0 right-0 w-[120%] md:w-[110%] max-w-none"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
