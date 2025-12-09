import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import setaLeft from "../../assets/setaleft.svg";
import setawhiteleft from "../../assets/setawhiteleft.svg";
import lixeira from "../../assets/lixeira.svg";
import lixeiraDark from "../../assets/lixeira-dark.svg";
import sinoSN from "../../assets/sinoSN.svg";
import sinoDark from "../../assets/sinodark.svg";
import lembrete from "../../assets/lembrete.svg";
import sinoVazio from "../../assets/sem notificações 1.svg";
import sinoVazioDark from "../../assets/semnotificacoesdark.svg";

import { useAuth } from "../../context/AuthContext";
import { removeEmojis } from "../../utils/text";

import {
  buscarMinhasNotificacoes,
  deletarNotificacao,
  marcarNotificacaoComoLida,
} from "../../service/api.js";

function formatarData(dataCriacao) {
  if (!dataCriacao) return null;
  const d = new Date(dataCriacao);
  if (Number.isNaN(d.getTime())) return null;

  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Notificacoes() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const deslocamentosRef = useRef({});
  const inicioXRef = useRef(0);
  const arrastandoIdRef = useRef(null);
  const ponteiroAbaixadoRef = useRef(false);
  const deslocamentoMinimoDragRef = useRef(5);
  const foiDragRef = useRef({}); 

  /* ==================== OBSERVAR TEMA ==================== */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* ==================== CARREGAR DA API ==================== */
  useEffect(() => {
    let cancelado = false;
    let intervaloId = null;

    async function carregar(primeiraVez = false) {
      try {
        if (primeiraVez) {
          setCarregando(true);
        }
        setErro(null);

        const data = await buscarMinhasNotificacoes();

        if (cancelado) return;

        const mapeadas = (data || []).map((n) => ({
          id: n.id,
          title: removeEmojis(n.titulo || n.title || "Notificação"),
          body: removeEmojis(n.mensagem || n.body || ""),
          lida: n.lida ?? false,
          tipo: n.tipo || "INFO",
          dataCriacao: n.dataCriacao || null,
        }));

        setNotificacoes(mapeadas);
      } catch (error) {
        if (cancelado) return;

        const status = error?.status;

        if (status === 401 || status === 403) {
          signOut?.();
          return;
        }

        if (status === 404) {
          setNotificacoes([]);
          setErro(null);
        } else {
          console.error("Erro ao carregar notificações", error);
          if (primeiraVez) {
            setErro("Não foi possível carregar suas notificações.");
          }
        }
      } finally {
        if (!cancelado && primeiraVez) {
          setCarregando(false);
        }
      }
    }

    // Carrega imediatamente na primeira vez
    carregar(true);

    // Configura polling a cada 10 segundos para atualização automática
    intervaloId = setInterval(() => {
      if (!cancelado) {
        carregar(false);
      }
    }, 10000);

    return () => {
      cancelado = true;
      if (intervaloId) {
        clearInterval(intervaloId);
      }
    };
  }, [signOut]);

  /* ==================== AÇÕES ==================== */

  const removerNotificacaoLocalEBack = async (id) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));

    const copia = { ...deslocamentosRef.current };
    delete copia[id];
    deslocamentosRef.current = copia;

    try {
      await deletarNotificacao(id);
    } catch (error) {
      const status = error?.status;

      if (status === 401 || status === 403) {
        signOut?.();
        return;
      }

      try {
        const data = await buscarMinhasNotificacoes();
        const mapeadas = (data || []).map((n) => ({
          id: n.id,
          title: n.titulo || n.title || "Notificação",
          body: n.mensagem || n.body || "",
          lida: n.lida ?? false,
          tipo: n.tipo || "INFO",
          dataCriacao: n.dataCriacao || null,
        }));
        setNotificacoes(mapeadas);
      } catch (e2) {
        console.error("Erro ao recarregar notificações após delete", e2);
      }
    }
  };

  const marcarComoLidaLocal = async (id) => {
    // Atualiza localmente de forma otimista
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
    
    try {
      // Envia para o backend para persistir no banco de dados
      await marcarNotificacaoComoLida(id);
    } catch (error) {
      const status = error?.status;
      if (status === 401 || status === 403) {
        signOut?.();
      } else {
        console.error("Erro ao marcar como lida", error);
        // Reverte o estado local em caso de erro
        setNotificacoes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, lida: false } : n))
        );
      }
    }
  };

  /* ==================== SWIPE ==================== */

  const setarDeslocamento = (id, x) => {
    deslocamentosRef.current = { ...deslocamentosRef.current, [id]: x };
    setNotificacoes((prev) => [...prev]);  
  };

  const aoPressionarPonteiro = (e, id) => {
    ponteiroAbaixadoRef.current = true;
    arrastandoIdRef.current = id;
    inicioXRef.current = e.clientX;
    foiDragRef.current[id] = false;  
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const aoMoverPonteiro = (e) => {
    if (!ponteiroAbaixadoRef.current) return;
    const id = arrastandoIdRef.current;
    if (id == null) return;
    const dx = e.clientX - inicioXRef.current;
     
    if (Math.abs(dx) > deslocamentoMinimoDragRef.current) {
      foiDragRef.current[id] = true;  
      const translateX = Math.min(0, dx);  
      setarDeslocamento(id, translateX);
    }
  };

  const aoSoltarPonteiro = () => {
    if (!ponteiroAbaixadoRef.current) return;
    ponteiroAbaixadoRef.current = false;
    const id = arrastandoIdRef.current;
    arrastandoIdRef.current = null;
    const translateX = deslocamentosRef.current[id] || 0;

    if (translateX < -100) {
      removerNotificacaoLocalEBack(id);
      return;
    }

    setarDeslocamento(id, 0);
  };

   
  const aoClicarNotificacao = (id, lida) => {
     
    if (lida || foiDragRef.current[id]) return;
    
    
    marcarComoLidaLocal(id);
  };

  /* ==================== RENDER ==================== */

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f10] text-[#111] dark:text-white font-sans">
      {/* Topbar */}
      <header className="w-full bg-white dark:bg-[#0f0f10] border-b border-gray-200 dark:border-gray-700 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1 z-10
                     rounded-md bg-white dark:bg-[#18181b] border border-gray-300 dark:border-gray-700 shadow-sm
                     hover:bg-gray-50 dark:hover:bg-[#222] focus:outline-none focus:ring-2 focus:ring-[#AE0000]"
          aria-label="voltar"
        >
          <img
            src={isDark ? setawhiteleft : setaLeft}
            alt="voltar"
            className="w-6 h-6"
          />
        </button>
        <div className="max-w-5xl mx-auto flex items-center py-4 px-4 sm:px-6">
          <div className="mx-auto flex items-center gap-2">
            <img src={isDark ? sinoDark : sinoSN} alt="ícone" className="w-6 h-6" />
            <h1 className="text-lg font-semibold underline decoration-[#7c0c15] underline-offset-4">
              Suas notificações
            </h1>
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="w-full mt-0">
        <div className="bg-[#7c0c15] dark:bg-[#8a0303] text-white p-6 text-center w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold">
              {carregando
                ? "Carregando notificações..."
                : notificacoes.length > 0
                ? "Você tem novas notificações!"
                : "Nenhuma nova notificação no momento"}
            </h2>
            <p className="text-sm mt-2">
              Confira as atualizações mais recentes para ficar sempre
              atualizado.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <main className="w-full mt-6 px-4 sm:px-6 pb-12">
        {erro && (
          <div className="max-w-3xl mx-auto mb-4">
            <div className="p-4 rounded-md border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-sm">
              {erro}
            </div>
          </div>
        )}

        {carregando ? (
           
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-20 bg-gray-100 dark:bg-[#1f1f22] rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : notificacoes.length === 0 ? (
          // ===== ESTADO VAZIO =====
          <div className="flex-1 w-full flex items-center justify-center p-5 pb-10">
            <div className="w-full max-w-[720px] mx-auto flex flex-col items-center">
              <div className="flex items-center justify-center mt-10 mb-9 w-full">
                <img
                  src={isDark ? sinoVazioDark : sinoVazio}
                  alt="Sem notificações"
                  className="block mx-auto bg-transparent"
                  style={{ width: "min(50vw, 320px)", height: "auto" }}
                />
              </div>

              <div className="text-center w-full px-4">
                <h2
                  className="font-semibold text-[#222] dark:text-white mb-6"
                  style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)" }}
                >
                  Tudo tranquilo por aqui!
                </h2>
                <div
                  className="font-medium text-[#222] dark:text-gray-200 mb-3"
                  style={{ fontSize: "1rem" }}
                >
                  Parece que você não tem nenhuma notificação no momento.
                </div>
                <div
                  className="font-normal text-[#222] dark:text-gray-300 whitespace-normal break-words leading-relaxed"
                  style={{ fontSize: "clamp(0.95rem, 2vw, 1rem)" }}
                >
                  Avisaremos por aqui assim que houver novidades ou novos
                  agendamentos!
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ===== LISTA NORMAL =====
          <ul className="space-y-4 max-w-3xl mx-auto">
            {notificacoes.map((n) => {
              const tx = deslocamentosRef.current[n.id] || 0;
              const lida = n.lida;
              const textoData = formatarData(n.dataCriacao);

              return (
                <li
                  key={n.id}
                  className={`w-full rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                    !lida
                      ? "bg-[#FFF8F8] dark:bg-[#2a1b1b] border border-[#E35151]/70 hover:shadow-md cursor-pointer"
                      : "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-default"
                  }`}
                  onClick={() => aoClicarNotificacao(n.id, lida)}
                >
                  <div
                    style={{ transform: `translateX(${tx}px)` }}
                    onPointerDown={(e) => aoPressionarPonteiro(e, n.id)}
                    onPointerMove={aoMoverPonteiro}
                    onPointerUp={aoSoltarPonteiro}
                    onPointerCancel={aoSoltarPonteiro}
                    className="w-full flex items-start gap-4 p-5 transition-transform duration-150"
                  >
                    {/* ícone */}
                    <div className="flex-shrink-0 text-[#AE0000] mt-1">
                      <img
                        src={lembrete}
                        alt="lembrete"
                        className="w-6 h-6"
                      />
                    </div>

                    {/* texto principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3
                          className={`font-semibold text-[#111] dark:text-white text-left truncate ${
                            lida ? "opacity-80" : ""
                          }`}
                        >
                          {removeEmojis(n.title)}
                        </h3>

                        <div className="flex items-center gap-2 text-xs">
                          {!lida && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E35151]/10 text-[#E35151] px-2 py-0.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E35151]" />
                              Nova
                            </span>
                          )}
                          {textoData && (
                            <span className="text-gray-500 dark:text-gray-400">
                              {textoData}
                            </span>
                          )}
                        </div>
                      </div>

                      <p
                        className={`text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-left ${
                          lida ? "opacity-75" : ""
                        }`}
                      >
                        {removeEmojis(n.body)}
                      </p>
                    </div>

                    {/* ações */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                      {!lida && (
                        <button
                          onClick={() => marcarComoLidaLocal(n.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-full border border-gray-300 bg-white dark:bg-[#18181b] text-[#111] dark:text-white
                                     hover:bg-gray-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-[#7c0c15]/30"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Marcar como lida
                        </button>
                      )}

                        <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removerNotificacaoLocalEBack(n.id);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-white dark:bg-[#18181b] border border-red-300 dark:border-red-700 shadow-sm text-[#111] dark:text-white
                                   hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                        aria-label="Remover notificação"
                        title="Remover notificação"
                        >
                        <img
                          src={isDark ? lixeiraDark : lixeira}
                          alt="remover"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
