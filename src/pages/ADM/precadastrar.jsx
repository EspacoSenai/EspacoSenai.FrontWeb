import React, { useState, useRef } from "react";
import EspacoSenai from "../../assets/EspacoSenai.svg";
import OndaGeral from "../../assets/ondaPrecadastro.svg";
import {
  criarPreCadastro,
  enviarPlanilha,
} from "../../service/preCadastroService";

const REGEX_EMAIL = /\S+@\S+\.\S+/;
const CLASSES_INPUT =
  "w-full max-w-[340px] mx-auto rounded-md border border-[#E5E5E5] bg-white px-4 py-2 text-[16px] shadow-[0_2px_6px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#B10404] text-black placeholder-gray-400";

export default function PreCadastrarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [arquivoPlanilha, setArquivoPlanilha] = useState(null);

  const [salvando, setSalvando] = useState(false);
  const [salvandoPlanilha, setSalvandoPlanilha] = useState(false);

  const [sucesso, setSucesso] = useState("");
  const [erros, setErros] = useState({});

  const nomeRef = useRef(null);
  const emailRef = useRef(null);

  function validarTudo() {
    const e = {};
    if (!nome || !nome.trim()) e.nome = "Nome é obrigatório.";
    if (!email || !email.trim()) {
      e.email = "Email é obrigatório.";
    } else if (!REGEX_EMAIL.test(email)) {
      e.email = "Email inválido.";
    }
    return e;
  }

  function formularioValido() {
    return Object.keys(validarTudo()).length === 0;
  }

  function aoMudarCampo(campo, valor) {
    if (campo === "nome") setNome(valor);
    if (campo === "email") setEmail(valor);
    setErros((prev) => {
      const next = { ...prev };
      delete next[campo];
      delete next.form;
      return next;
    });
    setSucesso("");
  }

  async function aoSubmeter(e) {
    e?.preventDefault();
    setSucesso("");
    const eAll = validarTudo();
    if (Object.keys(eAll).length > 0) {
      setErros(eAll);
      if (eAll.nome) nomeRef.current?.focus();
      else if (eAll.email) emailRef.current?.focus();
      return;
    }

    setSalvando(true);
    try {
      await criarPreCadastro({ nome, email });
      setSucesso("Estudante pré-cadastrado com sucesso.");
      setNome("");
      setEmail("");
      setErros({});
      setTimeout(() => setSucesso(""), 3000);
    } catch (err) {
      const status = err?.response?.status;
      const msgApi =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      let mensagem = msgApi || "Erro ao salvar. Tente novamente.";
      if (status === 401) mensagem = "Não autenticado. Faça login novamente.";
      if (status === 403) mensagem = "Sem permissão para pré-cadastrar.";

      setErros({ form: mensagem });
    } finally {
      setSalvando(false);
    }
  }

  async function aoEnviarPlanilha(e) {
    e?.preventDefault();
    setSucesso("");

    if (!arquivoPlanilha) {
      setErros((prev) => ({
        ...prev,
        planilha: "Selecione um arquivo de planilha.",
      }));
      return;
    }

    setSalvandoPlanilha(true);
    try {
      await enviarPlanilha(arquivoPlanilha);
      setSucesso("Planilha enviada e estudantes pré-cadastrados com sucesso.");
      setArquivoPlanilha(null);
      setErros((prev) => {
        const next = { ...prev };
        delete next.planilha;
        delete next.form;
        return next;
      });
      const inputFile = document.getElementById("input-planilha-estudantes");
      if (inputFile) inputFile.value = "";
      setTimeout(() => setSucesso(""), 3000);
    } catch (err) {
      const status = err?.response?.status;
      const msgApi =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      let mensagem = msgApi || "Erro ao enviar planilha. Tente novamente.";
      if (status === 401)
        mensagem = "Não autenticado. Faça login novamente.";
      if (status === 403) mensagem = "Sem permissão para enviar planilha.";

      setErros((prev) => ({ ...prev, form: mensagem }));
    } finally {
      setSalvandoPlanilha(false);
    }
  }

  function aoPressionarEnterNome(ev) {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    const err = {};
    if (!nome || !nome.trim()) err.nome = "Nome é obrigatório.";
    setErros((prev) => ({ ...prev, ...err }));
    if (!err.nome) {
      emailRef.current?.focus();
    } else {
      nomeRef.current?.focus();
    }
  }

  function aoPressionarEnterEmail(ev) {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    const eAll = validarTudo();
    if (Object.keys(eAll).length === 0) {
      aoSubmeter(ev);
    } else {
      setErros(eAll);
      if (eAll.nome) nomeRef.current?.focus();
      else if (eAll.email) emailRef.current?.focus();
    }
  }

  function aoSelecionarArquivo(ev) {
    const file = ev.target.files?.[0] || null;
    setArquivoPlanilha(file);
    setErros((prev) => {
      const next = { ...prev };
      delete next.planilha;
      delete next.form;
      return next;
    });
    setSucesso("");
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F2F2F2]">
      <header className="w-full relative">
        <div className="absolute left-2 top-5 z-30">
          <img
            src={EspacoSenai}
            alt="Espaço SENAI"
            className="h-16 md:h-20 select-none"
          />
        </div>
        <div className="h-20 md:h-24" aria-hidden />
      </header>

      <div className="absolute inset-x-0 top-20 md:top-20 pointer-events-none select-none">
        <img
          src={OndaGeral}
          alt=""
          className="w-full h-auto opacity-100"
          draggable="false"
        />
      </div>

      <main className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full sm:w-[390px] h-auto bg-white/90 rounded-[20px] shadow-[0_2px_6px_rgba(0,0,0,0.35)] border border-black/10 overflow-hidden">
            <div className="px-8 py-8 md:px-10 md:py-10">
              <h1 className="text-center text-[22px] md:text-[24px] font-semibold text-black leading-tight mt-3">
                <span className="block">Pré-Cadastrar</span>
                <span className="block">Usuário</span>
              </h1>

              <form
                onSubmit={aoSubmeter}
                className="mt-10 space-y-5"
                noValidate
              >
                <div>
                  <input
                    ref={nomeRef}
                    type="text"
                    value={nome}
                    onChange={(e) => aoMudarCampo("nome", e.target.value)}
                    onKeyDown={aoPressionarEnterNome}
                    placeholder="Nome"
                    className={CLASSES_INPUT}
                    aria-invalid={!!erros.nome}
                    aria-describedby={erros.nome ? "erro-nome" : undefined}
                  />
                  {erros.nome && (
                    <p
                      id="erro-nome"
                      className="mt-2 text-sm text-red-600 text-center"
                    >
                      {erros.nome}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => aoMudarCampo("email", e.target.value)}
                    onKeyDown={aoPressionarEnterEmail}
                    placeholder="Email"
                    className={CLASSES_INPUT}
                    aria-invalid={!!erros.email}
                    aria-describedby={erros.email ? "erro-email" : undefined}
                  />
                  {erros.email && (
                    <p
                      id="erro-email"
                      className="mt-2 text-sm text-red-600 text-center"
                    >
                      {erros.email}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    disabled={!formularioValido() || salvando}
                    className="min-w-[140px] rounded-md bg-[#B10404] text-white py-1 px-6 text-base hover:opacity-95 mt-[10px] disabled:opacity-60 flex items-center justify-center gap-2"
                    aria-disabled={!formularioValido() || salvando}
                  >
                    {salvando ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="4"
                          ></circle>
                          <path
                            d="M22 12a10 10 0 0 0-10-10"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      "Salvar"
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="h-px bg-gray-300 flex-1" />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    ou enviar planilha
                  </span>
                  <div className="h-px bg-gray-300 flex-1" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <input
                    id="input-planilha-estudantes"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={aoSelecionarArquivo}
                    className="w-full max-w-[340px] text-sm text-gray-800 bg-white border border-gray-300 rounded-md
                               file:mr-3 file:rounded-md file:border-none file:bg-[#B10404] file:text-white
                               file:px-3 file:py-1 file:cursor-pointer cursor-pointer"
                  />

                  <p className="text-[11px] text-gray-700 text-center break-all mt-1">
                    {arquivoPlanilha
                      ? `Arquivo selecionado: ${arquivoPlanilha.name}`
                      : "Nenhum arquivo selecionado"}
                  </p>

                  <p className="text-[11px] text-gray-500 text-center">
                    Envie uma planilha (.xlsx, .xls ou .csv) com os estudantes
                    para pré-cadastro em lote.
                  </p>

                  {erros.planilha && (
                    <p className="mt-1 text-sm text-red-600 text-center">
                      {erros.planilha}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={aoEnviarPlanilha}
                    disabled={salvandoPlanilha}
                    className="min-w-[160px] rounded-md bg-[#B10404] text-white py-1 px-6 text-base hover:opacity-95 mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
                    aria-disabled={salvandoPlanilha}
                  >
                    {salvandoPlanilha ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="4"
                          ></circle>
                          <path
                            d="M22 12a10 10 0 0 0-10-10"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar planilha"
                    )}
                  </button>
                </div>

                <div className="flex flex-col items-center mt-2">
                  {sucesso && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-3 text-sm text-green-600 text-center"
                    >
                      {sucesso}
                    </p>
                  )}

                  {erros.form && (
                    <p
                      role="alert"
                      className="mt-3 text-sm text-red-600 text-center"
                    >
                      {erros.form}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
