import React, { useState } from "react";
import logo from "../assets/EspacoSenai.svg"; 
import onda from "../assets/ondaCadastro.svg"; 
import olhoAberto from "../assets/olhoFechado.svg";
import olhoFechado from "../assets/olhoAberto.svg";

export default function Cadastro() {
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro(true);
      return;
    }

    setErro(false);
    console.log("Cadastro enviado!");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden dark:bg-black">
    
    {/* Onda de fundo */}
      <img src={onda} alt="Onda" className="absolute top-10 left-0 w-full h-auto z-0" />

    <>
    {/* Logo clara (padrão) */}
     <img
        src={logo}
        alt="Logo EspaçoSenai"
        className="absolute top-6 left-6 w-24 z-10 block dark:hidden"
     />

    {/* Logo escura (modo dark) */}
     <img
        src="src/assets/LogoDark.svg"
        alt="Logo EspaçoSenai Dark"
        className="absolute top-6 left-6 w-24 z-10 hidden dark:block"
     />
    </>

      {/* Card de erro */}
      {erro && (
        <div className=" text-white absolute top-4 right-4 bg-black border border-red-400 text-black px-4 py-2 rounded-md shadow z-50 flex items-center justify-between gap-2">
          <span>As senhas não coincidem!</span>
          <button onClick={() => setErro(false)} className="font-bold bg-white text-black text-xl leading-none">
            ×
          </button>
        </div>
      )}

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
            className="p-2 rounded-md shadow-sm border  bg-white placeholder-black text-black focus:outline-none"
            required
          />
          <input
            type="tel"
            placeholder="Telefone"
            className="p-2 rounded-md shadow-sm border  bg-white placeholder-black text-black focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="p-2 rounded-md shadow-sm border  w-full pr-10 text-black bg-white placeholder-black focus:outline-none"
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
          </div>

          <div className="relative">
            <input
              type={showConfirmar ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="p-2 rounded-md shadow-sm border border-gray-300 w-full pr-10 text-black bg-white placeholder-black focus:outline-none"
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
