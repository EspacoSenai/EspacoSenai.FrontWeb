// src/pages/Perfil/EditarPerfil.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

import setaLeft from "../../assets/setaleft.svg";
import avatarImg from "../../assets/avatar.svg";
import iconeEditar from "../../assets/editarperfil.svg";
import lapis from "../../assets/lápis.svg";

/* ===== helpers para fallback via token ===== */
function b64urlDecode(str) {
  try {
    const pad = "=".repeat((4 - (str.length % 4)) % 4);
    const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
    return atob(b64);
  } catch {
    return "";
  }
}
function parseJwtLocal(token) {
  try {
    const [, payload] = String(token || "").split(".");
    return JSON.parse(b64urlDecode(payload) || "{}");
  } catch {
    return {};
  }
}

export default function EditarPerfil() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const loadMe = useCallback(async () => {
    setLoading(true);
    try {
      // tenta pelo back (GET /auth/me)
      const me = await api.get("/auth/me");
      const data = me?.data || me;
      setNome(String(data?.nome || "").trim());
      setEmail(String(data?.email || "").trim());
    } catch {
      // fallback: lê do token (seu TokenService já inclui nome/email)
      const token = localStorage.getItem("access_token") || "";
      const claims = parseJwtLocal(token);
      setNome(String(claims?.nome || "").trim());
      setEmail(String(claims?.email || "").trim());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  async function salvarPerfil(e) {
    e?.preventDefault?.();
    if (!nome.trim() || !email.trim()) return;

    setSaving(true);
    try {
      // Atualiza apenas nome e email
      await api.postRaw("/usuario/atualizar", {
        nome: nome.trim(),
        email: email.trim(),
        _method: "PUT",
      });

      // Sincroniza nome exibido no app (Header/Home)
      try {
        localStorage.setItem("display_name", nome.trim());
        localStorage.setItem("aluno_nome_cache", nome.trim());
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "access_token",
            newValue: localStorage.getItem("access_token") || "",
          })
        );
      } catch {}

      alert("Usuário atualizado com sucesso!");
      navigate(-1);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      const msg =
        err?.data?.message ||
        err?.message ||
        "Não foi possível salvar as alterações.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="relative flex items-center justify-center px-3 py-3 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-0 bg-white rounded-md border border-gray-300 shadow-sm p-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#AE0000]"
          aria-label="Voltar"
        >
          <img src={setaLeft} alt="Voltar" className="w-9 h-8" />
        </button>

        <h1 className="text-lg font-medium w-full text-center pointer-events-none text-black">
          Editar Perfil
        </h1>

        <img
          src={iconeEditar}
          alt="Editar perfil"
          className="absolute right-8 top-3 w-9 h-7"
        />
      </div>

      {/* Faixa vermelha no topo */}
      <div className="w-full h-20 bg-[#7a0d0d]" />

      <main className="max-w-xl mx-auto px-6 py-8">
        {/* Avatar (visual) */}
        <div className="flex flex-col items-center mb-12 -mt-20">
          <img
            src={avatarImg}
            alt="Avatar"
            className="w-28 h-28 object-cover mb-3 rounded-full shadow"
          />
          <button
            type="button"
            onClick={() => navigate("/avatares")}
            style={{ borderRadius: "10px" }}
            className="bg-[#b91c1c] text-white px-4 py-1 text-sm mt-1 shadow-md w-22 text-center"
          >
            Mudar Avatar
          </button>
        </div>

        {/* Formulário */}
        <form className="flex flex-col gap-8 items-start w-full" onSubmit={salvarPerfil}>
          <div className="w-full">
            <label
              htmlFor="nome"
              className="text-sm font-medium mb-1 block text-black text-left"
            >
              Nome:
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome do usuário"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
              className="rounded-lg p-3 w-full text-black bg-[#EEEEEE]"
            />
          </div>

          <div className="w-full relative">
            <label
              htmlFor="email"
              className="text-sm font-medium mb-1 block text-black text-left"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="rounded-lg p-3 w-full text-black bg-[#EEEEEE]"
            />
            <img
              src={lapis}
              alt="Editar email"
              className="w-5 h-5 absolute right-3 top-12 -translate-y-1/2 pointer-events-none"
            />
          </div>

          {/* Link para a tela própria de alteração de senha */}
          <div className="w-full">
            <label
              htmlFor="senha-alterar"
              className="text-sm font-medium mb-1 block text-black text-left"
            >
              Esqueceu sua senha?
            </label>
            <button
              id="senha-alterar"
              type="button"
              onClick={() => navigate("/redefinir-senha")}
              className="text-black font-normal text-sm px-7 py-2 rounded-md bg-[#EEEEEE] mt-1 block"
            >
              Redefinir senha
            </button>
          </div>

          <button
            type="submit"
            disabled={saving || loading || !nome.trim() || !email.trim()}
            className="bg-[#b91c1c] text-white px-5 py-1 rounded-md ml-auto mt-4 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar Perfil"}
          </button>
        </form>
      </main>
    </div>
  );
}
