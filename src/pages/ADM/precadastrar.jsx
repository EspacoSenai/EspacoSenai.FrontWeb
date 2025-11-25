import React, { useState, useRef } from "react";
import EspacoSenai from "../../assets/EspacoSenai.svg";
import OndaGeral from "../../assets/ondaPrecadastro.svg";
import { criarPreCadastro } from "../../service/preCadastroService"; 

// Expressão para validar email
const REGEX_EMAIL = /\S+@\S+\.\S+/;
const CLASSES_INPUT =
  "w-full max-w-[340px] mx-auto rounded-md border border-[#E5E5E5] bg-white px-4 py-2 text-[16px] shadow-[0_2px_6px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#B10404] text-black placeholder-gray-400";

export default function PreCadastrarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erros, setErros] = useState({});

  const nomeRef = useRef(null);
  const emailRef = useRef(null);

  // Valida todos os campos do formulário
  function validarTudo() {
    const e = {};
    if (!nome || !nome.trim()) e.nome = "Nome é obrigatório.";
    if (!email || !email.trim()) {
      e.email = "Email é obrigatório.";
    } else {
      if (!REGEX_EMAIL.test(email)) e.email = "Email inválido.";
    }
    return e;
  }

  // Indica se o formulário está válido
  function formularioValido() {
    return Object.keys(validarTudo()).length === 0;
  }

  // Atualiza o campo e limpa o erro daquele campo
  function aoMudarCampo(campo, valor) {
    if (campo === "nome") setNome(valor);
    if (campo === "email") setEmail(valor);
    setErros((prev) => {
      const next = { ...prev };
      delete next[campo];
      return next;
    });
    setSucesso("");
  }

  // Submete o formulário (AGORA CONECTADO AO BACK)
  async function aoSubmeter(e) {
    e?.preventDefault();
    setSucesso("");
    const eAll = validarTudo();
    if (Object.keys(eAll).length > 0) {
      setErros(eAll);
      // foca no primeiro campo com erro
      if (eAll.nome) nomeRef.current?.focus();
      else if (eAll.email) emailRef.current?.focus();
      return;
    }

    setSalvando(true);
    try {
      await criarPreCadastro({ nome, email }); // <<< CHAMADA REAL
      setSucesso("Estudante pré-cadastrado com sucesso.");
      setNome("");
      setEmail("");
      setErros({});
      setTimeout(() => setSucesso(""), 3000);
    } catch (err) {
      // mensagens úteis
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

  // Ao pressionar Enter no campo Nome: valida e foca o próximo campo
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

  // Ao pressionar Enter no campo Email: tenta submeter o formulário
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

  return (
    <div className="relative min-h-screen w-full bg-[#F2F2F2]">
      {/* Topo com logo */}
      <header className="w-full relative">
        {/* logo posicionada */}
        <div className="absolute left-2 top-5 z-30">
          <img
            src={EspacoSenai}
            alt="Espaço SENAI"
            className="h-16 md:h-20 select-none"
          />
        </div>
        {/* espaço para evitar sobreposição em mobile */}
        <div className="h-20 md:h-24" aria-hidden />
      </header>

      {/* Onda de fundo */}
      <div className="absolute inset-x-0 top-20 md:top-20 pointer-events-none select-none">
        <img
          src={OndaGeral}
          alt=""
          className="w-full h-auto opacity-100"
          draggable="false"
        />
      </div>

      {/* Card central */}
      <main className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full sm:w-[390px] h-[420px] bg-white/90 rounded-[20px] shadow-[0_2px_6px_rgba(0,0,0,0.35)] border border-black/10 overflow-hidden">
            <div className="px-8 py-8 md:px-10 md:py-10">
              <h1 className="text-center text-[22px] md:text-[24px] font-semibold text-black leading-tight mt-3">
                <span className="block">Pré-Cadastrar</span>
                <span className="block">Usuário</span>
              </h1>

              <form onSubmit={aoSubmeter} className="mt-10 space-y-5" noValidate>
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
                    <p id="erro-nome" className="mt-2 text-sm text-red-600 text-center">
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
                    <p id="erro-email" className="mt-2 text-sm text-red-600 text-center">
                      {erros.email}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={!formularioValido() || salvando}
                    className={`min-w-[140px] rounded-md bg-[#B10404] text-white py-1 px-6 text-base hover:opacity-95 mt-[40px] disabled:opacity-60 flex items-center justify-center gap-2`}
                    aria-disabled={!formularioValido() || salvando}
                  >
                    {salvando ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.6)" strokeWidth="4"></circle>
                          <path d="M22 12a10 10 0 0 0-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      "Salvar"
                    )}
                  </button>

                  {sucesso && (
                    <p role="status" aria-live="polite" className="mt-3 text-sm text-green-600">
                      {sucesso}
                    </p>
                  )}

                  {erros.form && (
                    <p role="alert" className="mt-3 text-sm text-red-600">
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
