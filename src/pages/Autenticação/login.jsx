import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/EspacoSenai.svg";
import onda from "../../assets/ondasLogin.svg";
import olhoAberto from "../../assets/olhoFechado.svg";
import olhoFechado from "../../assets/olhoAberto.svg";
import googleIcon from "../../assets/Google.svg";

export default function Login() {
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/landing", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
    
      <div className="absolute top-5 left-0 w-full h-auto z-0 wave-container">
        <img
          src={onda}
          alt="Onda"
          className="w-full h-full object-cover wave-fill wave-animate"
        />
      </div>

      {/* Logo */}
      <img
        src={logo}
        alt="Logo EspaçoSenai"
        className="absolute top-6 left-6 w-24 z-10"
      />

      {/* Card de Login */}
      <div className="bg-white text-black bg-opacity-90 rounded-xl shadow-md px-6 py-10 w-full max-w-sm z-10">
        <h2 className="text-2xl font-semibold text-center">Bem-Vindo(a)</h2>
        <h3 className="text-xl font-medium text-center mb-6">novamente!</h3>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md shadow-sm border border-gray-300 text-black bg-white placeholder-gray-700 focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Senha"
              className="p-3 rounded-md shadow-sm border border-gray-300 w-full pr-10 bg-white text-black placeholder-gray-700 focus:outline-none"
              required
            />
            <span
              className="absolute right-3 top-4 cursor-pointer"
              onClick={() => setShowSenha(!showSenha)}
            >
              <img
                src={showSenha ? olhoAberto : olhoFechado}
                alt="Exibir senha"
                className="w-5 h-5"
              />
            </span>
          </div>

          <div className="text-right text-sm">
            <a href="#" className="text-red-600 text-xs hover:underline">
              Esqueceu a Senha?
            </a>
          </div>

          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">ou</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            type="submit"
            className="bg-[#AE0000] text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-xs text-center mt-4 text-black">
          Não tem uma conta?{" "}
          <a href="/cadastro" className="text-blue-600 underline">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}
