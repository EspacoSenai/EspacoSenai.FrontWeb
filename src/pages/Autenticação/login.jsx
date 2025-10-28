import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/EspacoSenai.svg";
import logoDark from "../../assets/logodark.svg";
import onda from "../../assets/ondasLogin.svg";
import olhoAberto from "../../assets/olhoFechado.svg";
import olhoFechado from "../../assets/olhoAberto.svg";

export default function Login() {
  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center relative overflow-hidden dark:bg-black px-4">
      {/* imagem da Onda */}
      <img src={onda} alt="Onda" className="absolute top-0 sm:top-5 left-0 w-full h-auto z-0" />

      <>
        {/* Logo clara */}
        <img
          src={logo}
          alt="Logo EspaçoSenai"
          className="absolute top-4 sm:top-6 left-4 sm:left-6 w-24 sm:w-28 md:w-32 z-10 block dark:hidden"
        />

        {/* Logo escura */}
        <img
          src={logoDark}
          alt="Logo EspaçoSenai Dark"
          className="absolute top-4 sm:top-6 left-4 sm:left-6 w-24 sm:w-28 md:w-32 z-10 hidden dark:block"
        />
      </>

      {/* Card de Login */}
      <div className="bg-white bg-opacity-90 rounded-xl shadow-md px-4 sm:px-6 py-8 sm:py-10 w-full max-w-sm z-10">
        <h2 className="text-xl sm:text-3xl font-medium text-center text-black mb-2">
          Bem-Vindo(a)
        </h2>
        <h3 className="text-lg sm:text-2xl font-medium text-center text-black mb-6">
          novamente!
        </h3>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md shadow-sm border border-gray-300 text-black bg-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Senha"
              className="p-3 rounded-md shadow-sm border border-gray-300 w-full pr-10 text-black bg-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowSenha(!showSenha)}
            >
              <img
                src={showSenha ? olhoAberto : olhoFechado}
                alt="Exibir senha"
                className="w-5 h-5"
              />
            </span>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-right text-sm">
              <Link to="/esqueci-senha" className="text-red-700 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="relative bg-[#AE0000] text-white py-3 rounded-md transition-all duration-200 font-medium overflow-hidden hover:scale-105 mt-8"
          >
            <span className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200" />
            <span className="relative z-10">Login</span>
          </button>
        </form>

        <div className="text-xs sm:text-sm text-center text-black dark:text-white mt-6">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-black-600 underline hover:no-underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
