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
  const [status, setStatus] = useState("ATIVO");
  const [statusOriginal, setStatusOriginal] = useState("ATIVO"); // Para comparar se mudou
  const [rolesIds, setRolesIds] = useState([]);

  // Roles disponíveis baseado no tipo de usuário
  const rolesDisponiveis = (() => {
    // Se for ALUNO/ESTUDANTE, só pode ser Estudante
    if (tipoUsuario === "ALUNO" || tipoUsuario === "ESTUDANTE") {
      return [{ id: 4, nome: "ESTUDANTE", label: "Estudante" }];
    }
    // Se for PROFESSOR ou COORDENADOR, pode ser Professor ou Coordenador
    // (eles podem ter ambos perfis para ingressar em turmas)
    if (tipoUsuario === "PROFESSOR" || tipoUsuario === "COORDENADOR") {
      return [
        { id: 2, nome: "COORDENADOR", label: "Coordenador" },
        { id: 3, nome: "PROFESSOR", label: "Professor" },
      ];
    }
    // Caso genérico (não deve acontecer, mas mantém todas exceto ADMIN)
    return [
      { id: 2, nome: "COORDENADOR", label: "Coordenador" },
      { id: 3, nome: "PROFESSOR", label: "Professor" },
      { id: 4, nome: "ESTUDANTE", label: "Estudante" },
    ];
  })();

  // Carrega dados do usuário
  useEffect(() => {
    async function carregarUsuario() {
      setLoading(true);
      try {
        if (usuarioInicial) {
          // Usa dados passados via navegação
          setNome(usuarioInicial.nome || "");
          setEmail(usuarioInicial.email || "");
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

    setSaving(true);
    try {
      // Atualiza dados básicos (nome, email, senha, roles)
      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        rolesIds: rolesIds,
      };

      // Adiciona senha ao payload apenas se foi preenchida
      if (senha.trim()) {
        payload.senha = senha.trim();
      }

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
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0f0f10] flex flex-col">
      {/* HEADER */}
      <header className="w-full border-b border-[#960000] bg-[#AE0000] dark:bg-[#8a0303] text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/80 bg-transparent text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Voltar
          </button>
          <h1 className="text-lg md:text-xl font-semibold">{getTitulo()}</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 flex justify-center items-start md:items-center px-4 py-8">{loading ? (
          <div className="text-center text-sm text-gray-700 dark:text-gray-300">Carregando...</div>
        ) : (
          <div className="w-full max-w-xl">
            <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 px-6 py-6 md:px-8 md:py-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Informações do {tipoUsuario === "PROFESSOR" ? "professor" : tipoUsuario === "COORDENADOR" ? "coordenador" : "usuário"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Atualize os dados cadastrais e o perfil do usuário.
              </p>

              <form onSubmit={salvarUsuario} className="space-y-5">
                {/* NOME */}
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                    placeholder="Nome completo"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                    placeholder="email@exemplo.com"
                  />
                </div>

                {/* SENHA */}
                <div>
                  <label
                    htmlFor="senha"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Senha
                  </label>
                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                    placeholder="Nova senha (opcional)"
                  />
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    Se deixar em branco, a senha atual será mantida.
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-[#EEEEEE] dark:bg-[#222] px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#AE0000] focus:border-[#AE0000]"
                  >
                    <option value="ATIVO">ATIVO</option>
                    <option value="BLOQUEADO">BLOQUEADO</option>
                  </select>
                </div>

                {/* PERFIS DO USUÁRIO */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Perfil do usuário
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {rolesDisponiveis.length > 1 
                      ? "Um usuário pode ter múltiplos perfis (ex: Professor e Coordenador)"
                      : "Perfil do usuário"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {rolesDisponiveis.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.id)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          rolesIds.includes(role.id)
                            ? "bg-[#AE0000] text-white"
                            : "bg-gray-200 dark:bg-[#222] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-[#AE0000]"
                        }`}
                      >
                        {role.label}
                        {rolesIds.includes(role.id) && (
                          <span className="ml-2">OK</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {rolesIds.length === 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      Selecione pelo menos um perfil
                    </p>
                  )}
                </div>

                {/* BOTÕES */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-[#222] text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-[#2a2a2e] transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || loading || !nome.trim() || !email.trim() || rolesIds.length === 0}
                    className="px-5 py-2 text-sm rounded-md font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95 transition"
                    style={{ backgroundColor: getCor() }}
                  >
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
