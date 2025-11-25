// src/pages/Autenticação/cadastro.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import logo from "../../assets/EspacoSenai.svg";
import onda from "../../assets/ondaCadastro.svg";
import olhoAberto from "../../assets/olhoFechado.svg";
import olhoFechado from "../../assets/olhoAberto.svg";

import { signUpUsuario } from "../../service/authService";
import ModalCodigoVerificacao from "./ModalCodigoVerificacao";

const getForcaSenha = (senha) => {
  if (!senha) return "";
  const temLetra = /[a-zA-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[^a-zA-Z0-9]/.test(senha);

  if (senha.length < 6) return "fraca";
  if (senha.length >= 6 && temLetra && temNumero && !temEspecial) return "media";
  if (senha.length >= 8 && temLetra && temNumero && temEspecial) return "forte";
  return "fraca";
};

export default function Cadastro() {
  const navigate = useNavigate();

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const confRef = useRef(null);

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [forcaSenha, setForcaSenha] = useState("");

  const [loading, setLoading] = useState(false);

  const [tokenCadastro, setTokenCadastro] = useState("");
  const [openOtp, setOpenOtp] = useState(false);

  const focusIfPossible = (ref) => {
    if (ref?.current) {
      ref.current.focus({ preventScroll: true });
      setTimeout(() => {
        try {
          const el = ref.current;
          const len = el.value?.length ?? 0;
          el.setSelectionRange?.(len, len);
        } catch {}
      }, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(false);
    setMensagemErro("");
    setMensagemSucesso("");

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro(true);
      setMensagemErro("Preencha todos os campos obrigatórios.");
      return focusIfPossible(!nome ? nomeRef : !email ? emailRef : !senha ? senhaRef : confRef);
    }

    if (senha !== confirmarSenha) {
      setErro(true);
      setMensagemErro("As senhas não coincidem.");
      return focusIfPossible(confRef);
    }

    if (senha.length < 8 || senha.length > 15) {
      setErro(true);
      setMensagemErro("A senha deve ter entre 8 e 15 caracteres.");
      return focusIfPossible(senhaRef);
    }

    setLoading(true);

    try {
      const resp = await signUpUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      const token = resp?.token ?? null;
      const msg =
        resp?.message ||
        "Se elegível, um código foi enviado para seu e-mail para confirmar o cadastro.";

      if (token) {
        setTokenCadastro(token);
        setMensagemSucesso(msg);
        setOpenOtp(true);
      } else {
        setErro(true);
        setMensagemErro(
          "Cadastro iniciado, mas não recebemos o token de verificação. Tente novamente."
        );
      }
    } catch (error) {
      setErro(true);
      setMensagemErro(
        error?.message || "Não foi possível realizar o cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (senha === confirmarSenha && erro && !mensagemErro) setErro(false);
  }, [senha, confirmarSenha, erro, mensagemErro]);

  const baseInputCls =
    "p-2 rounded-md shadow-sm border bg-white placeholder-black text-black focus:outline-none caret-black text-[16px]";
  const borderState = erro ? "border-red-500" : "border-gray-300";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* onda de fundo */}
      <div className="absolute top-10 left-0 w-full h-auto z-0 wave-container">
        <img
          src={onda}
          alt="Onda"
          className="w-full h-full object-cover wave-fill wave-animate"
        />
      </div>

      {/* logo: direita em telas pequenas, esquerda a partir do md */}
      <img
        src={logo}
        alt="Logo EspaçoSenai"
        className="absolute top-6 right-6 md:left-6 md:right-auto w-24 z-10"
      />

      {/* card */}
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg px-6 py-8 w-full max-w-sm z-10">
        <h2 className="text-xl font-semibold text-center mb-5 leading-tight text-black">
          Bem-Vindo(a) ao <br />
          <span className="text-[#000]">EspaçoSenai!</span>
        </h2>

        {mensagemErro && (
          <p className="text-red-600 text-sm mb-2">{mensagemErro}</p>
        )}
        {mensagemSucesso && (
          <p className="text-green-600 text-sm mb-2">{mensagemSucesso}</p>
        )}

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input
            ref={nomeRef}
            type="text"
            inputMode="text"
            autoComplete="name"
            placeholder="Nome"
            className={`${baseInputCls} ${borderState}`}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={!!tokenCadastro}
            spellCheck={false}
          />

          <input
            ref={emailRef}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            className={`${baseInputCls} ${borderState}`}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value.trimStart())}
            disabled={!!tokenCadastro}
            spellCheck={false}
          />

          <div className="relative">
            <input
              ref={senhaRef}
              type={showSenha ? "text" : "password"}
              inputMode="text"
              autoComplete="new-password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => {
                const v = e.target.value;
                setSenha(v);
                setForcaSenha(getForcaSenha(v));
              }}
              className={`${baseInputCls} w-full pr-10 ${borderState}`}
              required
              disabled={!!tokenCadastro}
              onFocus={() => focusIfPossible(senhaRef)}
            />

            <span
              className="absolute right-3 top-3 grid place-items-center h-5 w-5 cursor-pointer select-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowSenha((s) => !s);
                focusIfPossible(senhaRef);
              }}
              role="button"
              aria-label="Mostrar/ocultar senha"
            >
              <img
                src={showSenha ? olhoAberto : olhoFechado}
                alt=""
                className="w-5 h-5 pointer-events-none"
              />
            </span>

            {senha && !tokenCadastro && (
              <div className="mt-2">
                <div className="h-2 w-full rounded-full bg-gray-300 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      forcaSenha === "fraca"
                        ? "w-1/3 bg-red-500"
                        : forcaSenha === "media"
                        ? "w-2/3 bg-yellow-400"
                        : "w-full bg-green-500"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-xs ${
                      forcaSenha === "fraca"
                        ? "text-red-600"
                        : forcaSenha === "media"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    Força da senha:{" "}
                    {forcaSenha === "fraca"
                      ? "Fraca"
                      : forcaSenha === "media"
                      ? "Média"
                      : "Forte"}
                  </p>

                  {forcaSenha === "fraca" && (
                    <div className="relative group cursor-pointer ml-2">
                      <span className="text-red-500 text-sm font-bold">!</span>
                      <div className="absolute z-20 w-48 bg-black text-white text-xs rounded-md px-2 py-1 bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Para sua segurança, recomendamos uma senha forte.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!tokenCadastro && (
            <div className="relative">
              <input
                ref={confRef}
                type={showConfirmar ? "text" : "password"}
                inputMode="text"
                autoComplete="new-password"
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={`${baseInputCls} w-full pr-10 ${borderState}`}
                required
                onFocus={() => focusIfPossible(confRef)}
              />

              <span
                className="absolute right-3 top-3 grid place-items-center h-5 w-5 cursor-pointer select-none"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowConfirmar((s) => !s);
                  focusIfPossible(confRef);
                }}
                role="button"
                aria-label="Mostrar/ocultar confirmação de senha"
              >
                <img
                  src={showConfirmar ? olhoAberto : olhoFechado}
                  alt=""
                  className="w-5 h-5 pointer-events-none"
                />
              </span>

              {erro && mensagemErro && (
                <p className="text-red-600 text-sm mt-1">{mensagemErro}</p>
              )}
            </div>
          )}

          <div className="text-sm text-black mt-1">
            Já tem uma conta?{" "}
            <Link to="/selecaoDePerfil" className="text-blue-600 underline">
              Entre aqui
            </Link>
          </div>

          <button
            type="submit"
            className="mt-2 bg-[#AE0000] text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Entrar"}
          </button>
        </form>
      </div>

      <ModalCodigoVerificacao
        isOpen={openOtp}
        token={tokenCadastro}
        length={6}
        onClose={() => setOpenOtp(false)}
        onSuccess={() => {
          setOpenOtp(false);
          navigate("/login");
        }}
      />
    </div>
  );
}
