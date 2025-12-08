import React, { useState } from "react";
import Avatar9 from "../../assets/avatar9.svg";

export default function GestaoDeAluno() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [turma, setTurma] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});
  const statusList = ["Ativo", "Inativo", "Suspenso", "Desligado"];

  function validateAll() {
    const e = {};
    if (!nome || !nome.trim()) e.nome = "Nome é obrigatório.";
    if (!email || !email.trim()) {
      e.email = "Email é obrigatório.";
    } else {
      const re = /\S+@\S+\.\S+/;
      if (!re.test(email)) e.email = "Email inválido.";
    }
    if (!turma || !turma.trim()) e.turma = "Turma é obrigatória.";
    if (!status) e.status = "Status é obrigatório.";
    return e;
  }

  function isFormValid() {
    const e = validateAll();
    return Object.keys(e).length === 0;
  }

  function handleFieldChange(field, value) {
    if (field === "nome") setNome(value);
    if (field === "email") setEmail(value);
    if (field === "turma") setTurma(value);
    if (field === "status") setStatus(value);

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }

  function handleBlur(field) {
    const e = {};
    if (field === "nome" && (!nome || !nome.trim())) e.nome = "Nome é obrigatório.";
    if (field === "email") {
      if (!email || !email.trim()) e.email = "Email é obrigatório.";
      else {
        const re = /\S+@\S+\.\S+/;
        if (!re.test(email)) e.email = "Email inválido.";
      }
    }
    if (field === "turma" && (!turma || !turma.trim())) e.turma = "Turma é obrigatória.";
    setErrors((prev) => ({ ...prev, ...e }));
  }

  async function handleSave(e) {
    e.preventDefault();
    const eAll = validateAll();
    if (Object.keys(eAll).length > 0) {
      setErrors(eAll);
      return;
    }

    setSaving(true);
    try {
      // TODO: integrar com API  
      await new Promise((r) => setTimeout(r, 600));
      alert("Dados salvos com sucesso!");
    } catch {
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0B0B] text-[#000] dark:text-[#E5E5E5]">
      {/* Barra vermelha */}
      <header className="w-full bg-[#B10404]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="py-4 text-white text-xl lg:text-2xl font-semibold text-center">
            Editar Gestão de Alunos
          </h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-10">  
            
          {/* Avatar + nome */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={Avatar9} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <p className="mt-4 text-lg font-medium">Aluno(a)</p>
          </div>

          {/* Form principal */}
          <form
            onSubmit={handleSave}
            className="mt-10 w-full sm:max-w-[672px] mx-auto grid grid-cols-1 gap-6 sm:gap-9"
            noValidate
          >
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium mb-2 text-left">Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(ev) => handleFieldChange("nome", ev.target.value)}
                onBlur={() => handleBlur("nome")}
                placeholder="aluno(a)"
                className={`w-full rounded-md border px-4 py-3 text-[16px] md:text-sm outline-none focus:ring-2 focus:ring-[#B10404] ${
                  errors.nome
                    ? "border-red-400 bg-white"
                    : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#111]"
                }`}
              />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-left">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(ev) => handleFieldChange("email", ev.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="aluno8@aluno.senai.br"
                className={`w-full rounded-md border px-4 py-3 text-[16px] md:text-sm outline-none focus:ring-2 focus:ring-[#B10404] ${
                  errors.email
                    ? "border-red-400 bg-white"
                    : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#111]"
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Turma */}
            <div>
              <label className="block text-sm font-medium mb-2 text-left">Turma:</label>
              <input
                type="text"
                value={turma}
                onChange={(ev) => handleFieldChange("turma", ev.target.value)}
                onBlur={() => handleBlur("turma")}
                placeholder="Estado 1"
                className={`w-full rounded-md border px-4 py-3 text-[16px] md:text-sm outline-none focus:ring-2 focus:ring-[#B10404] ${
                  errors.turma
                    ? "border-red-400 bg-white"
                    : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#111]"
                }`}
              />
              {errors.turma && <p className="mt-1 text-sm text-red-600">{errors.turma}</p>}
            </div>

            {/* Status */}
            <div className="mt-2">
              <p className="text-sm font-medium mb-3 text-left">Status:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-9 w-full max-w-full sm:max-w-[450px] mx-auto justify-center">
                {statusList.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleFieldChange("status", s)}
                    className={`w-full py-3 rounded-md border text-sm font-medium transition-colors ${
                      status === s
                        ? "bg-[#B10404] text-white border-[#B10404]"
                        : "bg-gray-100 dark:bg-[#111] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* button salvar */}
            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid() || saving}
                className={`min-w-[150px] bg-[#B10404] text-white rounded-lg py-2 px-6 text-base hover:opacity-95 disabled:opacity-60 transform translate-x-[42px] sm:translate-x-[110px] ${
                  !isFormValid() ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}