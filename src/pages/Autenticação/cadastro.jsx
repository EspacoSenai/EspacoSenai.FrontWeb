import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/EspacoSenai.svg";
import onda from "../../assets/ondaCadastro.svg";
import olhoAberto from "../../assets/olhoFechado.svg";
import olhoFechado from "../../assets/olhoAberto.svg";

// Função para verificar força da senha
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
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState(false);
  const [forcaSenha, setForcaSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro(true);
      return;
    }

    setErro(false);
  // Simula cadastro bem-sucedido e navega para a landing
  console.log("Cadastro enviado!");
  navigate('/landing', { replace: true });
  };

  useEffect(() => {
    if (senha === confirmarSenha && erro) {
      setErro(false);
    }
  }, [senha, confirmarSenha]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden dark:bg-black">
      {/* Onda de fundo */}
      <div className="absolute top-10 left-0 w-full h-auto z-0 wave-container">
        <img src={onda} alt="Onda" className="w-full h-full object-cover wave-fill wave-animate" />
      </div>

      <>
        {/* Logo clara */}
        <img
          src={logo}
          alt="Logo EspaçoSenai"
          className="absolute top-6 left-6 w-24 z-10 block dark:hidden"
        />
        {/* Logo escura */}
        <img
          src="src/assets/logodark.svg"
          alt="Logo EspaçoSenai Dark"
          className="absolute top-6 left-6 w-24 z-10 hidden dark:block"
        />
      </>

      {/* Card branco */}
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg px-6 py-8 w-full max-w-sm z-10">
        <h2 className="text-xl font-semibold text-center mb-5 leading-tight text-black">
          Bem-Vindo(a) ao <br /> <span className="text-[#000]">EspaçoSenai!</span>
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            className="p-2 rounded-md shadow-sm border bg-white placeholder-black text-black focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded-md shadow-sm border bg-white placeholder-black text-black focus:outline-none"
            required
          />

          <input
            type="tel"
            placeholder="Telefone"
            maxLength={11}
            onChange={(e) => {
            const somenteNumeros = e.target.value.replace(/\D/g, "");
            e.target.value = somenteNumeros;
            }}
            className="p-2 rounded-md shadow-sm border bg-white placeholder-black text-black focus:outline-none"
            required
            />

          {/* Campo Senha */}
          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setForcaSenha(getForcaSenha(e.target.value));
              }}
              className={`p-2 rounded-md shadow-sm w-full pr-10 text-black bg-white placeholder-black focus:outline-none border ${erro ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowSenha(!showSenha)}
            >
              <img
                src={showSenha ? olhoAberto : olhoFechado}
                alt="Exibir senha"
                className="w-5 h-5"
              />
            </span>

            {/* Barra de força da senha */}
            {senha && (
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
                  ></div>
                </div>

                {/* Texto + Tooltip */}
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

          {/* Campo Confirmar Senha */}
          <div className="relative">
            <input
              type={showConfirmar ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className={`p-2 rounded-md shadow-sm w-full pr-10 text-black bg-white placeholder-black focus:outline-none border ${erro ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmar(!showConfirmar)}
            >
              <img
                src={showConfirmar ? olhoAberto : olhoFechado}
                alt="Exibir confirmar"
                className="w-5 h-5"
              />
            </span>
            {erro && (
              <p className="text-red-600 text-sm mt-1">
                As senhas não coincidem.
              </p>
            )}
          </div>

          <div className="text-sm text-black mt-1">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue underline">
              Entre aqui
            </a>
          </div>

          <button
            type="submit"
            className="mt-2 bg-[#AE0000] text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
