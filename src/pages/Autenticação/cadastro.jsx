import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/EspacoSenai.svg";
import logoDark from "../../assets/logodark.svg";
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
    console.log("Cadastro enviado!");
  };

  useEffect(() => {
    if (senha === confirmarSenha && erro) {
      setErro(false);
    }
  }, [senha, confirmarSenha, erro]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden dark:bg-black px-4">
  
      <>

        {/* Logo clara */}
        <img
          src={logo}
          alt="Logo EspaçoSenai"
          className="absolute top-4 sm:top-6 left-4 sm:left-6 w-[105px] sm:w-[140px] md:w-[140px] z-0 block dark:hidden"
        />
        {/* Logo escura */}
        <img
          src={logoDark}
          alt="Logo EspaçoSenai Dark"
          className="absolute top-4 sm:top-6 left-4 sm:left-6 w-[105px] sm:w-[140px] md:w-[140px] z-0 hidden dark:block"
        />
      </>

      <img src={onda} alt="Onda" className="absolute top-24 sm:top-18 md:top-20 lg:top-19 left-1/2 transform -translate-x-1/2 w-full h-auto z-0" />

      {/* Card branco */}
      <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl w-full max-w-[385px] md:max-w-[410px] lg:max-w-[450px] z-10 min-h-[500px] sm:min-h-[450px] md:min-h-[450px] lg:min-h-auto" style={{ padding: '34px 16px' }}>
        <h2 className="font-medium text-center leading-tight text-black text-[18px] sm:text-[20px] md:text-[24px] lg:text-[30px] mb-[16px] sm:mb-[20px]">
          Bem-Vindo(a) ao <br /> <span className="text-[#000] font-medium">EspaçoSenai!</span>
        </h2>

        <form className="flex flex-col gap-4 sm:gap-5 md:gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            className="w-full max-w-[250px] sm:max-w-[350px] p-3 sm:p-2 md:p-3 rounded-md shadow-lg border bg-white placeholder:text-[#898787] text-black focus:outline-none focus:ring-2 focus:ring-red-500 self-center"
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            className="w-full max-w-[250px] sm:max-w-[350px] p-3 sm:p-2 md:p-3 rounded-md shadow-lg border bg-white placeholder:text-[#898787] text-black focus:outline-none focus:ring-2 focus:ring-red-500 self-center"
            required
          />

          {/* Campo Senha */}
          <div className="relative self-center w-full max-w-[250px] sm:max-w-[350px]">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setForcaSenha(getForcaSenha(e.target.value));
              }}
              className={`p-3 sm:p-2 md:p-3 rounded-md shadow-lg w-full pr-10 text-black bg-white placeholder:text-[#898787] focus:outline-none focus:ring-2 focus:ring-red-500 border ${erro ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <span
              className="absolute right-3 top-3 sm:top-2 md:top-3 cursor-pointer"
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
                    className={`text-xs sm:text-sm md:text-base ${
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
                      <div className="absolute z-20 w-64 sm:w-48 md:w-56 bg-black text-white text-xs rounded-md px-2 py-1 bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Para sua segurança, recomendamos uma senha forte.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Campo Confirmar Senha */}
          <div className="relative self-center w-full max-w-[250px] sm:max-w-[350px]">
            <input
              type={showConfirmar ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className={`p-3 sm:p-2 md:p-3 rounded-md shadow-lg w-full pr-10 text-black bg-white placeholder:text-[#898787] focus:outline-none focus:ring-2 focus:ring-red-500 border ${erro ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <span
              className="absolute right-3 top-3 sm:top-2 md:top-3 cursor-pointer"
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

          <div className="text-xs text-black mt-1 self-start font-medium ml-[40px]">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-blue underline">
              Entre aqui
            </Link>
          </div>

          <button
            type="submit"
            className="relative mt-2 bg-[#AE0000] text-white py-3 sm:py-2 md:py-3 rounded-md transition-all duration-200 overflow-hidden hover:scale-105 w-[150px] h-[48px] sm:h-[40px] md:h-[38px] self-center"
          >
            <span className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200" />
            <span className="relative z-10 text-center -top-1">Cadastrar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
