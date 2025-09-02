import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/EspacoSenai.svg";
import logoDark from "../../assets/logodark.svg";
import onda from "../../assets/ondasLogin.svg";
import olhoAberto from "../../assets/olhoFechado.svg";
import olhoFechado from "../../assets/olhoAberto.svg";
import googleIcon from "../../assets/Google.svg";

export default function Login() {
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();
  // controla o tema apenas a partir da preferência salva (defaut: claro)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // aqui você validaria o login; para agora, redireciona para a landing
    navigate('/landing', { replace: true });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B0B0B]' : 'bg-white'} flex items-center justify-center relative overflow-hidden`}>
      {/* Curva vermelha */}
      <img src={onda} alt="Onda" className="absolute top-5 left-0 w-full h-auto z-0" />

      {/* Logo */}
        <img
          src={isDarkMode ? logoDark : logo}
          alt="Logo EspaçoSenai"
          className="absolute top-6 left-6 w-24 z-10"
        />

      {/* Card de Login */}
      <div className={`${isDarkMode ? 'bg-[#111] text-white' : 'bg-white text-black'} bg-opacity-90 rounded-xl shadow-md px-6 py-10 w-full max-w-sm z-10`}>
        <h2 className="text-2xl font-semibold text-center">
          Bem-Vindo(a)
        </h2>
        <h3 className="text-xl font-medium text-center mb-6">
          novamente!
        </h3>

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
              className={`p-3 rounded-md shadow-sm border border-gray-300 w-full pr-10 ${isDarkMode ? 'bg-[#222] text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-700'} focus:outline-none`}
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
              forgot password?
            </a>
          </div>

          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">ou</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            type="button"
            className={`flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md shadow hover:bg-gray-100 transition ${isDarkMode ? 'bg-[#222]' : 'bg-white'}`}
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className={`${isDarkMode ? 'text-white' : 'text-black'} text-sm`}>Login com Google</span>
          </button>

          <button
            type="submit"
            className="bg-[#AE0000] text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>

  <div className={`text-xs text-center mt-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Não tem uma conta?{" "}
          <a href="/cadastro" className="text-blue-600 underline">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}
