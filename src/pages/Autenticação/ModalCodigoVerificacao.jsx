// src/pages/Autenticação/ModalCodigoVerificacao.jsx
import React, { useEffect, useRef, useState } from "react";
import { confirmarConta } from "../../service/authService";
import SetaLeft from "../../assets/setaleft.svg";

const COR = "#AE0000";

export default function ModalCodigoVerificacao({
  isOpen,
  onClose,
  token,
  length = 6,           // <-- 6 por padrão
  onSuccess,
}) {
  const [values, setValues] = useState(Array(length).fill(""));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setValues(Array(length).fill(""));
      setErro("");
      setLoading(false);
      setTimeout(() => inputsRef.current?.[0]?.focus(), 50);
    }
  }, [isOpen, length]);

  if (!isOpen) return null;

  const handleChange = (i, val) => {
    // aceita letras e números; normaliza para maiúsculo e pega só 1 char
    const v = (val || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    const next = [...values];
    next[i] = v;
    setValues(next);
    setErro("");
    if (v && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (values[i]) {
        const next = [...values];
        next[i] = "";
        setValues(next);
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        const next = [...values];
        next[i - 1] = "";
        setValues(next);
      }
    }
    if (e.key === "ArrowLeft" && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const clip = (e.clipboardData.getData("text") || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    if (!clip) return;
    const chars = clip.slice(0, length).split("");
    const next = Array(length).fill("");
    for (let i = 0; i < chars.length; i++) next[i] = chars[i];
    setValues(next);
    const last = Math.min(chars.length, length) - 1;
    inputsRef.current[last >= 0 ? last : 0]?.focus();
  };

  const code = values.join(""); // já está uppercase

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== length) {
      setErro(`Digite os ${length} caracteres.`);
      return;
    }
    if (!token) {
      setErro("Token de cadastro não encontrado.");
      return;
    }
    setLoading(true);
    setErro("");
    try {
      await confirmarConta(token, code); // agora chama GET /auth/confirmar-conta/{token}/{codigo}
      onSuccess?.();
    } catch (err) {
      setErro(err?.message || "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => !loading && onClose?.()} />
      <div className="relative z-[101] w-full max-w-lg mx-4 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,.18)] p-6 md:p-8">
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => !loading && onClose?.()}
          className="bg-white focus:outline-none"
        >
          <img src={SetaLeft} alt="Voltar" className="block" style={{ width: 25, height: 35 }} />
        </button>

        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-neutral-900">Verificação</h2>
        <p className="text-sm text-center text-neutral-600 mt-2">
          Digite o código de acesso enviado ao seu e-mail.
          <br />Ele é temporário e garante sua segurança.
        </p>

        {erro && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="flex items-center justify-center gap-3 md:gap-4" onPaste={handlePaste}>
            {values.map((v, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={v}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                inputMode="text"
                maxLength={1}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-semibold rounded-2xl border bg-white text-neutral-900 focus:outline-none focus:ring-2 transition"
                style={{ borderColor: "#E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}
                onFocus={(e) => (e.target.style.borderColor = COR)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl text-white font-semibold shadow transition disabled:opacity-60"
            style={{ backgroundColor: COR, boxShadow: "0 10px 24px rgba(174,0,0,.28)" }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
