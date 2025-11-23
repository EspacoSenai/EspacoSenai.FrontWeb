// src/pages/Auth/EsqueciSenha.jsx (ajusta o caminho se for outro)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/EspacoSenai.svg";
import ondaLateralImg from "../../assets/onda lateral.svg";
import ondaMenorImg from "../../assets/onde menor.svg";
import { api } from "../../service/api";

export function EsqueciSenha({ buttonWidth = 180, buttonHeight = 36 } = {}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const emailTrim = email.trim();

    if (!emailTrim) {
      setErro("Informe o email para enviar o código.");
      return;
    }

    setCarregando(true);
    try {
      // chama o endpoint do back: POST /auth/redefinir-senha
      const resp = await api.post("/auth/redefinir-senha", {
        identificador: emailTrim,
      });

      const data = resp?.data ?? resp;
      console.log("[EsqueciSenha] resposta redefinir-senha:", data);

      const token = data?.token;
      if (token) {
        // guarda o token para usar na próxima tela (código / nova senha)
        localStorage.setItem("tokenRedefinirSenha", token);
      }

      setSucesso(
        data?.message || "Código para redefinição enviado para seu email."
      );

      // dá um tempinho e vai para a tela de código
      setTimeout(() => {
        navigate("/codigodere", { state: { email: emailTrim } });
      }, 1200);
    } catch (err) {
      console.error("[EsqueciSenha] erro ao enviar código:", err);

      const msgBack =
        err?.response?.data?.message ||
        err?.response?.data?.erro ||
        err?.message;

      setErro(
        msgBack ||
          "Não foi possível enviar o código. Verifique o email e tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative bg-white overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Onda lateral */}
      <div className="absolute top-0 right-0 h-full w-1/2 md:w-1/3 z-0 overflow-hidden">
        <img
          src={ondaLateralImg}
          alt="Onda decorativa lateral"
          className="h-full w-full object-cover object-left transform scale-150 md:scale-100"
        />
      </div>

      {/* Onda menor fixa */}
      <img
        src={ondaMenorImg}
        alt="Onda decorativa menor"
        className="fixed left-0 bottom-0 z-0 select-none pointer-events-none"
        style={{
          width: "min(40vw, 600px)",
          minWidth: "200px",
          maxWidth: "100vw",
          height: "auto",
          opacity: 0.9,
        }}
      />

      {/* Onda decorativa inferior esquerda */}
      <div className="absolute left-0 bottom-0 w-1/2 h-1/3 z-0 overflow-hidden">
        <img
          src={ondaMenorImg}
          alt="Onda decorativa menor"
          className="h-full w-full object-cover object-left transform scale-150 md:scale-100"
        />
      </div>

      {/* Logo no canto superior esquerdo */}
      <div className="absolute top-4 left-4 z-10">
        <img
          src={logoImg}
          alt="EspaçoSenai Logo"
          className="h-12 sm:h-16 w-auto object-contain drop-shadow"
        />
      </div>

      {/* Container principal */}
      <div className="w-full max-w-[90%] sm:max-w-md px-4 sm:px-6 py-4 sm:py-8 z-10 flex flex-col items-center justify-center">
        {/* Card branco */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
            padding: "2rem 1.5rem",
            width: "100%",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontWeight: 600,
              fontSize: 30,
              color: "#111",
              marginBottom: 18,
            }}
          >
            Esqueceu a senha?
          </h1>

          <p
            style={{
              color: "#000",
              fontSize: 14,
              fontWeight: 400,
              marginBottom: 50,
              marginTop: 0,
              width: "100%",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Vamos enviar um código de verificação por
            <br />
            email para você criar uma nova senha.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div
              style={{
                width: 290,
                borderRadius: 10,
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                alignItems: "center",
                margin: "0 auto",
                marginTop: -10,
              }}
            >
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontWeight: 500,
                  color: "#111",
                  fontSize: 17,
                  marginBottom: 3,
                  marginLeft: 0,
                  marginTop: 0,
                  width: 307,
                  textAlign: "left",
                }}
              >
                Email:
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                style={{
                  width: 300,
                  height: 40,
                  padding: "10px 12px",
                  background: "#f3f4f6",
                  color: "#9D9D9D",
                  borderRadius: 5,
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  fontWeight: 400,
                  fontFamily: "Poppins, sans-serif",
                  marginBottom: 0,
                  marginLeft: -10,
                  display: "block",
                  paddingLeft: 10,
                }}
                required
              />
            </div>

            {/* Mensagens de erro/sucesso */}
            {erro && (
              <p className="mt-2 text-center text-sm text-red-600">{erro}</p>
            )}
            {sucesso && (
              <p className="mt-2 text-center text-sm text-green-600">
                {sucesso}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando || !email.trim()}
              className="bg-[#B10404] text-white px-[10px] rounded-md transform transition-transform duration-200 hover:scale-105 disabled:opacity-60"
              style={{
                height: "36px",
                width: "190px",
                padding: "6px 10px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                margin: "0 auto",
                willChange: "transform",
              }}
            >
              {carregando ? "Enviando..." : "Enviar código"}
            </button>
          </form>

          <div
            style={{
              marginTop: 10,
              textAlign: "center",
              fontSize: 14,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <span style={{ color: "#111" }}>Voltar ao </span>
            <Link
              to="/login"
              style={{
                color: "#2563eb",
                textDecoration: "underline",
                fontWeight: 540,
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EsqueciSenha;
