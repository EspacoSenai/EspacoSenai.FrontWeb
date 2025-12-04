import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { buscarPorId, atualizarUsuario, alterarStatus } from "../../service/usuario";

import setaLeft from "../../assets/setaleft.svg";
import avatarImg from "../../assets/avatar.svg";
import iconeEditar from "../../assets/editarperfil.svg";
import lapis from "../../assets/lápis.svg";

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Pode receber dados via state da navegação
  const usuarioInicial = location.state?.usuario || null;
  const tipoUsuario = location.state?.tipo || "USUARIO";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaOriginal, setSenhaOriginal] = useState(""); // Senha hash do backend
  const [status, setStatus] = useState("ATIVO");
  const [statusOriginal, setStatusOriginal] = useState("ATIVO"); // Para comparar se mudou
  const [rolesIds, setRolesIds] = useState([]);

  // Roles disponíveis (exceto ADMIN que não pode ser atribuído)
  const rolesDisponiveis = [
    { id: 2, nome: "COORDENADOR", label: "Coordenador" },
    { id: 3, nome: "PROFESSOR", label: "Professor" },
    { id: 4, nome: "ESTUDANTE", label: "Estudante" },
  ];

  // Carrega dados do usuário
  useEffect(() => {
    async function carregarUsuario() {
      setLoading(true);
      try {
        if (usuarioInicial) {
          // Usa dados passados via navegação
          setNome(usuarioInicial.nome || "");
          setEmail(usuarioInicial.email || "");
          setSenhaOriginal(usuarioInicial.senha || ""); // Guarda senha hash
          const statusInicial = usuarioInicial.status || "ATIVO";
          setStatus(statusInicial);
          setStatusOriginal(statusInicial);
          // Extrair IDs das roles
          const roles = usuarioInicial.roles || [];
          const ids = roles.map(r => {
            if (typeof r === 'number') return r;
            if (r.id) return r.id;
            // Se for um objeto com roleNome, mapear para ID
            const roleMap = { ADMIN: 1, COORDENADOR: 2, PROFESSOR: 3, ESTUDANTE: 4 };
            return roleMap[r.roleNome] || roleMap[r] || r;
          }).filter(id => id && id !== 1); // Remove ADMIN (id=1)
          setRolesIds(ids);
        } else if (id) {
          // Busca do backend
          const usuario = await buscarPorId(id);
          setNome(usuario.nome || "");
          setEmail(usuario.email || "");
          setSenhaOriginal(usuario.senha || ""); // Guarda senha hash
          const statusInicial = usuario.status || "ATIVO";
          setStatus(statusInicial);
          setStatusOriginal(statusInicial);
          // Extrair IDs das roles
          const roles = usuario.roles || [];
          const ids = roles.map(r => {
            if (typeof r === 'number') return r;
            if (r.id) return r.id;
            const roleMap = { ADMIN: 1, COORDENADOR: 2, PROFESSOR: 3, ESTUDANTE: 4 };
            return roleMap[r.roleNome] || roleMap[r] || r;
          }).filter(id => id && id !== 1); // Remove ADMIN (id=1)
          setRolesIds(ids);
        }
      } catch (err) {
        console.error("[EditarUsuario] Erro ao carregar usuário:", err);
        alert("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    }
    carregarUsuario();
  }, [id, usuarioInicial]);

  async function salvarUsuario(e) {
    e?.preventDefault?.();
    if (!nome.trim() || !email.trim()) {
      alert("Nome e email são obrigatórios");
      return;
    }

    if (rolesIds.length === 0) {
      alert("Selecione pelo menos um perfil para o usuário");
      return;
    }

    // Se digitou nova senha, validar tamanho (8-15 caracteres)
    if (senha.trim() && (senha.trim().length < 8 || senha.trim().length > 15)) {
      alert("A nova senha deve ter entre 8 e 15 caracteres");
      return;
    }

    setSaving(true);
    try {
      // Atualiza dados básicos (nome, email, senha, roles)
      // Se não digitou nova senha, envia a senha original (hash) do backend
      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim() || senhaOriginal, // Usa nova senha ou mantém a original
        rolesIds: rolesIds,
      };

      await atualizarUsuario(id, payload);

      // Se o status mudou, chamar endpoint específico de alterar status
      const statusAtualNormalizado = String(status || "").toUpperCase();
      const statusOriginalNormalizado = String(statusOriginal || "").toUpperCase();
      
      if (statusAtualNormalizado !== statusOriginalNormalizado) {
        // Mapear status para ID: ATIVO = 1, BLOQUEADO = 3
        const statusMap = {
          "ATIVO": 1,
          "BLOQUEADO": 3,
          "MATRICULA_EXPIRADA": 5
        };
        const idStatus = statusMap[statusAtualNormalizado] || 1;
        await alterarStatus(id, idStatus);
      }

      alert("Usuário atualizado com sucesso!");
      navigate(-1);
    } catch (err) {
      console.error("[EditarUsuario] Erro ao salvar:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível salvar as alterações.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  // Função para toggle de role
  const toggleRole = (roleId) => {
    setRolesIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const getTitulo = () => {
    switch (tipoUsuario) {
      case "PROFESSOR":
        return "Editar Professor";
      case "COORDENADOR":
        return "Editar Coordenador";
      case "ALUNO":
        return "Editar Aluno";
      default:
        return "Editar Usuário";
    }
  };

  const getCor = () => {
    return "#b91c1c"; // red-700 padrão
  };

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
          {getTitulo()}
        </h1>

        <img
          src={iconeEditar}
          alt="Editar"
          className="absolute right-8 top-3 w-9 h-7"
        />
      </div>

      {/* Faixa colorida no topo */}
      <div 
        className="w-full h-20" 
        style={{ backgroundColor: getCor() }}
      />

      <main className="max-w-xl mx-auto px-6 py-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-12 -mt-20">
          <img
            src={avatarImg}
            alt="Avatar"
            className="w-28 h-28 object-cover mb-3 rounded-full shadow"
          />
          <span 
            className="text-white px-4 py-1 text-sm mt-1 shadow-md rounded-lg"
            style={{ backgroundColor: getCor() }}
          >
            {tipoUsuario}
          </span>
        </div>

        {/* Formulário */}
        <form
          className="flex flex-col gap-8 items-start w-full"
          onSubmit={salvarUsuario}
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
              placeholder="Deixe em branco para manter a senha atual"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              className="rounded-lg p-3 w-full text-black bg-[#EEEEEE]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se preenchido, deve ter entre 8 e 15 caracteres
            </p>
          </div>

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

          {/* Campo de Perfis/Roles */}
          <div className="w-full">
            <label className="text-sm font-medium mb-2 block text-black text-left">
              Perfis do usuário:
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Um usuário pode ter múltiplos perfis (ex: Professor e Coordenador)
            </p>
            <div className="flex flex-wrap gap-3">
              {rolesDisponiveis.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                    rolesIds.includes(role.id)
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                  }`}
                >
                  {role.label}
                  {rolesIds.includes(role.id) && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>
            {rolesIds.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                Selecione pelo menos um perfil
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || loading || !nome.trim() || !email.trim() || rolesIds.length === 0 || (senha.trim() && (senha.trim().length < 8 || senha.trim().length > 15))}
            className="text-white px-5 py-2 rounded-md ml-auto mt-4 disabled:opacity-60 transition-colors"
            style={{ backgroundColor: getCor() }}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </main>
    </div>
  );
}
