import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AvatarDefault from "../../assets/AvatarPadrao.svg";
import { api } from "../../service/api";

const COR_PADRAO = "#AE0000";



function mapStatusReserva(notificacao) {
  if (!notificacao) return "Sem reservas registradas";

  const tipo = String(notificacao.notificacaoTipo || "").toUpperCase();
  const titulo = notificacao.titulo || "";
  const mensagem = notificacao.mensagem || "";

  if (tipo.includes("APROVADA")) return "Aprovada";
  if (tipo.includes("NEGADA") || tipo.includes("RECUSADA")) return "Recusada";
  if (tipo.includes("PENDENTE")) return "Pendente";
  if (tipo.includes("TERMINOU") || tipo.includes("CONCLUI")) return "Concluída";

  return titulo || mensagem || "Sem informações da última reserva";
}

function extrairStatusReservaDoAluno(aluno) {
  const lista = Array.isArray(aluno?.notificacoes) ? aluno.notificacoes : [];
  if (!lista.length) return "Sem reservas registradas";

  const ordenadas = [...lista].sort((a, b) => {
    const da = new Date(a.dataHoraCriacao || 0).getTime();
    const db = new Date(b.dataHoraCriacao || 0).getTime();
    return db - da;
  });

  const ultima = ordenadas[0];
  return mapStatusReserva(ultima);
}


function AlunoCard({ aluno, cor = COR_PADRAO, onEditarStatus }) {
  const { nome, email, status, statusReserva } = aluno;
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
      {/* botão de menu (3 pontinhos) */}
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
        style={{ backgroundColor: cor }}
        aria-label="Opções"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="leading-none text-sm">•••</span>
      </button>

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
              onEditarStatus?.(aluno);
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M14.06 5.19l3.75 3.75"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            Editar status
          </button>
        </div>
      )}

      {/* avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
        <img
          src={AvatarDefault}
          alt={nome || email}
          className="w-full h-full object-contain"
        />
      </div>

      {/* nome */}
      <p className="mt-3 text-center text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
        {nome || email}
      </p>

      {/* status da conta */}
      <div className="mt-5 text-[12px] text-neutral-800 dark:text-neutral-300">
        <span>
          Status da conta:{" "}
          <strong className="font-medium">{status || "ATIVO"}</strong>
        </span>
      </div>

      {/* status de reserva */}
      <div className="mt-4">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-3">
          <p className="text-[12px] text-neutral-800 dark:text-neutral-200">
            <span className="font-medium">Status de Reserva:</span>{" "}
            {statusReserva}
          </p>
        </div>
      </div>
    </div>
  );
}



export default function GestaoAlunos({ cor = COR_PADRAO }) {
  const navigate = useNavigate();

  const [estudantes, setEstudantes] = useState([]);
  const [loadingEst, setLoadingEst] = useState(false);
  const [erroEst, setErroEst] = useState("");

  const [modalAluno, setModalAluno] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingEst(true);
        setErroEst("");
        const resp = await api.get("/usuario/buscar-estudantes");
        const data = resp?.data ?? resp;
        if (!alive) return;
        const arr = Array.isArray(data) ? data : [];
        const enriquecidos = arr.map((a) => ({
          ...a,
          statusReserva: extrairStatusReservaDoAluno(a),
        }));
        setEstudantes(enriquecidos);
      } catch (err) {
        console.error("[GestaoAlunos] Erro ao buscar estudantes:", err);
        if (!alive) return;
        setErroEst(
          "Não foi possível carregar os estudantes. Tente novamente mais tarde."
        );
        setEstudantes([]);
      } finally {
        if (alive) setLoadingEst(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

function handleEditarAluno(aluno) {
  setModalAluno(null);
  navigate(`/editarAluno/${aluno.id}`, { state: { aluno } });
}


  function fecharModal() {
    setModalAluno(null);
  }

  function irParaEdicao() {
    if (!modalAluno) return;

    const id =
      modalAluno.id ??
      modalAluno.usuarioId ??
      modalAluno.userId ??
      modalAluno.sub;

  
    if (id != null) {
      navigate(`/editarAluno/${id}`);
    } else {
     
      navigate("/editarAluno");
    }
  }

  return (
    <>
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-10">
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h3 className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-neutral-100">
                Gestão de alunos
              </h3>
              <div
                className="mt-2 mx-auto w-24 h-[3px] rounded-full"
                style={{ backgroundColor: cor }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 md:p-5">
            {loadingEst ? (
              <div className="py-10 text-center text-sm text-neutral-600 dark:text-neutral-300">
                Carregando estudantes...
              </div>
            ) : erroEst ? (
              <div className="py-10 text-center text-sm text-red-600">
                {erroEst}
              </div>
            ) : estudantes.length === 0 ? (
              <div className="py-10 text-center text-sm text-neutral-600 dark:text-neutral-300">
                Nenhum estudante encontrado.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {estudantes.map((aluno) => (
                  <AlunoCard
                    key={aluno.id}
                    aluno={aluno}
                    cor={cor}
                    onEditarStatus={handleEditarAluno}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* modal com botão Ir para edição */}
      {modalAluno && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={fecharModal}
          />
          <div className="relative z-50 w-[90%] max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-700 px-6 py-6">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
              Editar aluno
            </h4>
            <p className="text-sm text-neutral-800 dark:text-neutral-200 mb-4">
              Você está prestes a editar as informações deste aluno.
            </p>
            <p className="text-sm mb-4">
              <strong>Aluno:</strong> {modalAluno.nome || modalAluno.email}
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={fecharModal}
                className="px-4 py-2 text-sm rounded-md border border-neutral-300 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 transition"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={irParaEdicao}
                className="px-5 py-2 text-sm rounded-md text-white font-semibold hover:brightness-95 transition"
                style={{ backgroundColor: cor }}
              >
                Ir para edição
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
