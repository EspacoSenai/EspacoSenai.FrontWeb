import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import logo from "../../assets/EspacoSenai.svg";
import onda from "../../assets/ondasLogin.svg";
import olhoAberto from "../../assets/olhoFechado.svg";
import olhoFechado from "../../assets/olhoAberto.svg";

import { signIn, userHasRole, routeForProfile } from "../../service/authService";

export default function Login() {
  const [showSenha, setShowSenha] = useState(false);
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const sel = localStorage.getItem("selected_profile");
    if (!sel) navigate("/selecionar-perfil", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    const selected = localStorage.getItem("selected_profile");
    if (!selected) {
      navigate("/selecionar-perfil", { replace: true });
      return;
    }

    const payload = {
      identificador: identificador.trim(),
      senha: senha,
    };
    console.log("[DEBUG] /auth/signin payload:", payload);

    setLoading(true);
    try {
      const { roles } = await signIn(payload);

      if (!userHasRole(selected, roles)) {
        setErro(
          "Seu usuário não possui permissão para o perfil selecionado. Escolha outro perfil ou fale com o administrador."
        );
        return;
      }

      navigate(routeForProfile(selected), { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível entrar. Verifique seus dados.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Onda */}
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

      {/* Card */}
      <div className="bg-white text-black bg-opacity-90 rounded-xl shadow-md px-6 py-10 w-full max-w-sm z-10">
        <h2 className="text-2xl font-semibold text-center">Bem-Vindo(a)</h2>
        <h3 className="text-xl font-medium text-center mb-6">novamente!</h3>

        {erro && (
          <div className="mb-3 text-sm text-red-600 text-center">{erro}</div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      
          <input
            type="text"
            placeholder="Email"
            className="p-3 rounded-md shadow-sm border border-gray-300 text-black bg-white placeholder-gray-700 focus:outline-none"
            required
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            autoComplete="username"
          />

          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Senha"
              className="p-3 rounded-md shadow-sm border border-gray-300 w-full pr-10 bg-white text-black placeholder-gray-700 focus:outline-none"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
            <span
              className="absolute right-3 top-4 cursor-pointer"
              onClick={() => setShowSenha((s) => !s)}
            >
              <img
                src={showSenha ? olhoAberto : olhoFechado}
                alt="Exibir senha"
                className="w-5 h-5"
              />
            </span>
          </div>

          <div className="text-right text-sm">
            <Link
              to="/esqueci-senha"
              className="text-red-600 text-xs hover:underline"
            >
              Esqueceu a Senha?
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">ou</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            type="submit"
            className="bg-[#AE0000] text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>

        <div className="text-xs text-center mt-4 text-black">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-blue-600 underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
