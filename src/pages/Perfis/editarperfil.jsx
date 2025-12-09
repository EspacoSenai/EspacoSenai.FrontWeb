import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";
import { buscarMeuPerfil } from "../../service/usuario";

import setaLeft from "../../assets/setaleft.svg";
import setawhiteleft from "../../assets/setawhiteleft.svg";
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
  const isDark = document.documentElement.classList.contains('dark');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [id, setId] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState(""); // NOVO CAMPO
  const [status, setStatus] = useState("ATIVO");
  const [rolesIds, setRolesIds] = useState([0]);

  const loadMe = useCallback(async () => {
    setLoading(true);
    try {
      // 1) tenta pelo service padrão do projeto
      const me = await buscarMeuPerfil();

      const nomeBack =
        me?.nome ||
        me?.nomeCompleto ||
        me?.nomeUsuario ||
        me?.tag ||
        "";
      const emailBack = me?.email || "";

      setId(me?.id ?? me?.usuarioId ?? null);
      setStatus(me?.status || "ATIVO");

      if (Array.isArray(me?.rolesIds) && me.rolesIds.length > 0) {
        setRolesIds(me.rolesIds);
      } else if (Array.isArray(me?.roles) && me.roles.length > 0) {
        // caso venha algo tipo [{id: 0}, {id:1}]
        setRolesIds(me.roles.map((r) => r.id ?? r));
      } else {
        setRolesIds([0]);
      }

      setNome(String(nomeBack).trim());
      setEmail(String(emailBack).trim());
    } catch {
      // 2) fallback: lê do token (caso o back não esteja respondendo)
      const token = localStorage.getItem("access_token") || "";
      const claims = parseJwtLocal(token);

      setId(
        claims?.id ??
          claims?.userId ??
          claims?.usuarioId ??
          claims?.sub ??
          null
      );
      setStatus(claims?.status || "ATIVO");

      if (Array.isArray(claims?.rolesIds) && claims.rolesIds.length > 0) {
        setRolesIds(claims.rolesIds);
      } else if (Array.isArray(claims?.roles) && claims.roles.length > 0) {
        setRolesIds(claims.roles.map((r) => r.id ?? r));
      } else {
        setRolesIds([0]);
      }

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

    if (!id) {
      alert("Não foi possível identificar o usuário logado para atualizar.");
      return;
    }

    setSaving(true);
    try {
      // monta exatamente o body esperado pelo back
      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim(), // pode ser vazio se o usuário não quiser trocar
        status: status || "ATIVO",
        rolesIds:
          Array.isArray(rolesIds) && rolesIds.length > 0 ? rolesIds : [0],
      };

      await api.put(`/usuario/atualizar/${id}`, payload);

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
        err?.response?.data?.message ||
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
          <img src={isDark ? setawhiteleft : setaLeft} alt="Voltar" className="w-9 h-8" />
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
        <form
          className="flex flex-col gap-8 items-start w-full"
          onSubmit={salvarPerfil}
        >
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

          {/* Senha opcional pra mandar pro back */}
          <div className="w-full">
            <label
              htmlFor="senha"
              className="text-sm font-medium mb-1 block text-black text-left"
            >
              Nova senha (opcional):
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite uma nova senha ou deixe em branco"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              className="rounded-lg p-3 w-full text-black bg-[#EEEEEE]"
            />
          </div>

          {/* Status (ATIVO / BLOQUEADO) - se não quiser expor, dá pra deixar hidden depois */}
          <div className="w-full">
            <label
              htmlFor="status"
              className="text-sm font-medium mb-1 block text-black text-left"
            >
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
              className="rounded-lg p-3 w-full text-black bg-[#EEEEEE]"
            >
              <option value="ATIVO">Ativo</option>
              <option value="BLOQUEADO">Bloqueado</option>
            </select>
          </div>

          {/* Botão pra fluxo de redefinir senha antigo, se ainda quiser manter */}
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
