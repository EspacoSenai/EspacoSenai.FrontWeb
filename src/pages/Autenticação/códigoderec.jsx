// src/pages/Auth/CodigoDeRec.jsx (ajusta o caminho se for outro)
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/EspacoSenai.svg";
import ondaLateralImg from "../../assets/onda lateral.svg";
import ondaMenorImg from "../../assets/onde menor.svg";
import { api } from "../../service/api";

export default function CodigoDeRec() {
  // 6 refs para os 6 dígitos
  const inputsRef = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const navigate = useNavigate();

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleInput = (e, idx) => {
    let value = e.target.value.toUpperCase();
    // só A-Z e 0-9
    value = value.replace(/[^A-Z0-9]/g, "");
    e.target.value = value;

    if (value.length === 1 && idx < 5) {
      inputsRef[idx + 1].current?.focus();
    } else if (value.length === 0 && idx > 0) {
      inputsRef[idx - 1].current?.focus();
    }
  };

  const lerCodigo = () =>
    inputsRef.map((ref) => (ref.current?.value || "").trim()).join("");

  const handleVerificarCodigo = async () => {
    setErro("");
    setSucesso("");

    const codigo = lerCodigo();

    if (codigo.length !== 6) {
      setErro("Digite os 6 caracteres do código enviado por email.");
      return;
    }

    const token = localStorage.getItem("tokenRedefinirSenha");
    if (!token) {
      setErro(
        "Sessão expirada. Volte para 'Esqueci a senha' e solicite um novo código."
      );
      return;
    }

    setCarregando(true);
    try {
      const resp = await api.get(
        `/auth/redefinir-senha/validar-codigo/${encodeURIComponent(
          token
        )}/${encodeURIComponent(codigo)}`
      );

      const data = resp?.data ?? resp;
      console.log("[CodigoDeRec] resposta validar-codigo:", data);

      setSucesso(data?.message || "Código validado com sucesso!");

      // dá um tempinho e vai para a tela de nova senha
      setTimeout(() => {
        navigate("/novasenha");
      }, 1000);
    } catch (err) {
      console.error("[CodigoDeRec] erro ao validar código:", err);
      const msgBack =
        err?.response?.data?.message ||
        err?.response?.data?.erro ||
        err?.message;

      setErro(
        msgBack ||
          "Não foi possível validar o código. Verifique os dígitos e tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // enter no último campo também dispara a verificação
  const handleKeyDown = (e, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (idx === 5) {
        handleVerificarCodigo();
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#f7f7f7",
        position: "relative",
        fontFamily: "Poppins, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <div className="absolute top-4 left-4 z-10">
        <img
          src={logoImg}
          alt="EspaçoSenai Logo"
          className="h-14 sm:h-20 w-auto object-contain drop-shadow"
        />
      </div>

      {/* Onda lateral */}
      <div className="absolute top-0 right-0 h-full w-1/4 sm:w-1/3 md:w-1/3 z-0 overflow-hidden">
        <img
          src={ondaLateralImg}
          alt="Onda decorativa lateral"
          className="h-full w-full object-cover object-left transform scale-125 sm:scale-150 md:scale-100"
        />
      </div>

      {/* Onda menor */}
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

      {/* Card central */}
      <div
        className="w-full max-w-[500px] min-w-[280px] mx-auto p-4 sm:p-6 md:p-[38px_38px_28px_38px] rounded-lg md:rounded-[14px] min-h-[230px] md:min-h-[250px]"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.12)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h2
          className="text-lg md:text-[22px] font-medium mb-7 md:mb-[28px] text-gray-800"
          style={{ fontFamily: "Montserrat, Poppins, sans-serif" }}
        >
          Insira seu código de verificação
        </h2>

        <div className="flex justify-center gap-2 md:gap-[10px] mb-4 md:mb-[16px]">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <input
              key={idx}
              ref={inputsRef[idx]}
              type="text"
              maxLength={1}
              onInput={(e) => handleInput(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-9 h-10 sm:w-10 sm:h-10 md:w-[44px] md:h-[44px]"
              style={{
                fontSize: 24,
                textAlign: "center",
                border: "2px solid #b91c1c",
                borderRadius: 8,
                background: "#fff",
                color: "#111",
                outline: "none",
                fontFamily: "Poppins, Montserrat, sans-serif",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                transition: "border 0.2s",
              }}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* mensagens */}
        {erro && (
          <p className="text-xs md:text-sm text-red-600 mb-2">{erro}</p>
        )}
        {sucesso && (
          <p className="text-xs md:text-sm text-green-600 mb-2">{sucesso}</p>
        )}

        {/* Botão para validar e ir para Nova Senha */}
        <button
          type="button"
          onClick={handleVerificarCodigo}
          disabled={carregando}
          className="mt-3 md:mt-4 inline-flex items-center justify-center rounded-md bg-[#B10404] text-white px-5 py-2 text-sm shadow-sm hover:opacity-95 hover:scale-[1.02] transition-transform disabled:opacity-60"
        >
          {carregando ? "Verificando..." : "Verificar código"}
        </button>

        <div className="text-xs md:text-[13px] text-gray-600 mt-8 md:mt-[30px]">
          <span style={{ fontWeight: 600 }}>Não recebeu o código?</span>{" "}
          <span
            style={{
              color: "#1976d2",
              textDecoration: "underline",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={() => navigate("/esquecisenha")}
          >
            Reenvie
          </span>
        </div>
      </div>
    </div>
  );
}
