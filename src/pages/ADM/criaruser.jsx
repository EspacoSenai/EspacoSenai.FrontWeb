import React, { useState, useRef } from "react";
import EspacoSenai from "../../assets/EspacoSenai.svg";
import OndaGeral from "../../assets/ondaPrincipal.svg";
import { api } from "../../service/api";

const CLASSES_INPUT =
  "w-full rounded-md border border-[#E5E5E5] bg-white px-3 sm:px-4 py-2 text-[15px] sm:text-[16px] shadow-[0_2px_6px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#B10404] text-black placeholder-gray-400";

const REGEX_EMAIL = /\S+@\S+\.\S+/;


const CARGOS = [
  { value: "admin", label: "Administrador", roleId: 1 },
  { value: "coord", label: "Coordenador", roleId: 2 },
  { value: "prof", label: "Professor", roleId: 3 },
  { value: "aluno", label: "Estudante", roleId: 4 },
];

async function salvarPrivilegiado({ nome, email, senha, cargo }) {
  const cargoObj = CARGOS.find((c) => c.value === cargo);
  const roleId = cargoObj?.roleId;

  if (!roleId) {
    console.error(
      "[salvarPrivilegiado] cargo sem roleId mapeado:",
      cargo,
      CARGOS
    );
    throw new Error("Cargo inválido: roleId não mapeado para esse valor.");
  }

  const body = {
    nome: nome.trim(),
    email: email.trim(),
    senha: senha.trim(),
    status: "ATIVO",
    rolesIds: [roleId],
  };

  const resp = await api.post("/usuario/salvar-privilegiado", body);
  return resp.data;
}

export default function CriarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erros, setErros] = useState({});
  const [cargoFocus, setCargoFocus] = useState(false);

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const cargoRef = useRef(null);

  const formularioValido = () =>
    !!nome.trim() && REGEX_EMAIL.test(email) && !!senha.trim() && !!cargo;

  const aoSubmeter = async (e) => {
    e.preventDefault();
    setSucesso("");
    setErros({});

    const eAll = {};

    if (!nome || !nome.trim()) eAll.nome = "Nome é obrigatório.";
    if (!email || !email.trim()) eAll.email = "Email é obrigatório.";
    else if (!REGEX_EMAIL.test(email))
      eAll.email = "Email inválido. Use formato exemplo@dominio.com";

    if (!senha || !senha.trim())
      eAll.senha = "Senha é obrigatória. Defina uma senha inicial para o usuário.";

    if (!cargo || !cargo.trim()) eAll.cargo = "Cargo é obrigatório.";

    if (Object.keys(eAll).length > 0) {
      setErros(eAll);
      if (eAll.nome) nomeRef.current?.focus();
      else if (eAll.email) emailRef.current?.focus();
      else if (eAll.senha) senhaRef.current?.focus();
      else if (eAll.cargo) cargoRef.current?.focus();
      return;
    }

    setSalvando(true);
    try {
      await salvarPrivilegiado({ nome, email, senha, cargo });

      setSucesso("Usuário criado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setCargo("");
      setErros({});

      setTimeout(() => setSucesso(""), 2500);
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);

      const msgBack =
        err?.response?.data?.message ||
        err?.response?.data?.mensagem ||
        err?.message ||
        "";

      setSucesso("");
      setErros((prev) => ({
        ...prev,
        geral:
          msgBack ||
          "Não foi possível criar o usuário. Verifique sua conexão ou suas permissões.",
      }));
    } finally {
      setSalvando(false);
    }
  };

  function aoPressionarEnterNoNome(ev) {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    if (nome && nome.trim()) {
      setErros((prev) => {
        const n = { ...prev };
        delete n.nome;
        return n;
      });
      emailRef.current?.focus();
    } else {
      nomeRef.current?.focus();
    }
  }

  function aoPressionarEnterNoEmail(ev) {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    if (email && email.trim() && REGEX_EMAIL.test(email)) {
      setErros((prev) => {
        const n = { ...prev };
        delete n.email;
        return n;
      });
      senhaRef.current?.focus();
    } else {
      setErros((prev) => ({
        ...prev,
        email: "Email inválido. Use formato exemplo@dominio.com",
      }));
      emailRef.current?.focus();
    }
  }

  function aoPressionarEnterNaSenha(ev) {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    if (senha && senha.trim()) {
      setErros((prev) => {
        const n = { ...prev };
        delete n.senha;
        return n;
      });
      cargoRef.current?.focus();
    } else {
      senhaRef.current?.focus();
    }
  }

  function aoPressionarEnterNoCargo(ev) {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    if (cargo && cargo.trim()) {
      if (formularioValido()) aoSubmeter(ev);
    } else {
      cargoRef.current?.focus();
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F2F2F2] overflow-hidden">
      {/* Logo */}
      <header className="w-full relative">
        <div className="absolute left-4 sm:left-6 top-4 sm:top-5 z-30">
          <img
            src={EspacoSenai}
            alt="Espaço SENAI"
            className="h-[60px] sm:h-[75px] md:h-[80px] select-none"
          />
        </div>
        <div className="h-20" aria-hidden />
      </header>

      {/* Onda */}
      <div className="absolute right-0 bottom-0 w-full max-w-none sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] select-none pointer-events-none">
        <img
          src={OndaGeral}
          alt=""
          className="w-full h-auto opacity-90 sm:opacity-100"
          draggable="false"
        />
      </div>

      {/* Card central */}
      <main className="relative z-10 w-full">
        <div className="mx-auto flex items-center justify-center px-3 sm:px-6 min-h-[calc(100vh-120px)]">
          <div
            className="bg-white/90 border border-black/10 rounded-[16px] sm:rounded-[20px] shadow-[0_2px_6px_rgba(0,0,0,0.35)] transform -translate-y-0 sm:-translate-y-6 w-[92%] sm:w-[400px] md:w-[400px]"
            style={{ height: "auto", minHeight: "460px", maxHeight: "90vh" }}
          >
            <div className="px-5 sm:px-10 py-4 sm:py-8">
              <h1 className="text-center text-[22px] sm:text-[26px] font-medium text-black mt-2 sm:mt-4">
                Criar Usuário
              </h1>

              <form
                onSubmit={aoSubmeter}
                className="mt-6 sm:mt-10 space-y-3 sm:space-y-4"
              >
                {/* Nome */}
                <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px]">
                  <input
                    ref={nomeRef}
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      setErros((p) => {
                        const n = { ...p };
                        delete n.nome;
                        return n;
                      });
                    }}
                    onKeyDown={aoPressionarEnterNoNome}
                    className={CLASSES_INPUT}
                  />
                  {erros.nome && (
                    <p className="mt-2 text-sm text-red-600">{erros.nome}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px]">
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErros((p) => {
                        const n = { ...p };
                        delete n.email;
                        return n;
                      });
                    }}
                    onKeyDown={aoPressionarEnterNoEmail}
                    className={CLASSES_INPUT}
                  />
                  {erros.email && (
                    <p className="mt-1 text-sm text-red-600">{erros.email}</p>
                  )}
                </div>

                {/* Senha */}
                <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px]">
                  <input
                    ref={senhaRef}
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setErros((p) => {
                        const n = { ...p };
                        delete n.senha;
                        return n;
                      });
                    }}
                    onKeyDown={aoPressionarEnterNaSenha}
                    className={CLASSES_INPUT}
                  />
                  {erros.senha && (
                    <p className="mt-1 text-sm text-red-600">{erros.senha}</p>
                  )}
                </div>

                {/* Cargo */}
                <div className="mx-auto relative w-full max-w-[280px] sm:max-w-[320px]">
                  <select
                    ref={cargoRef}
                    value={cargo}
                    onChange={(e) => {
                      setCargo(e.target.value);
                      setErros((p) => {
                        const n = { ...p };
                        delete n.cargo;
                        return n;
                      });
                    }}
                    onKeyDown={aoPressionarEnterNoCargo}
                    onFocus={() => setCargoFocus(true)}
                    onBlur={() => setCargoFocus(false)}
                    className={`${CLASSES_INPUT} appearance-none pr-10 ${
                      cargoFocus
                        ? "shadow-lg border-[#B10404] ring-2 ring-[#B10404]/10"
                        : ""
                    } ${erros.cargo ? "border-red-600 ring-2 ring-red-100" : ""}`}
                  >
                    <option value="" disabled>
                      Cargo
                    </option>
                    {CARGOS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 sm:right-3 flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 10l5 5 5-5"
                        stroke="#8A8A8A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {erros.cargo && (
                    <p className="mt-2 text-sm text-red-600">{erros.cargo}</p>
                  )}
                </div>

                {/* Botão */}
                <div className="pt-6 sm:pt-8 flex justify-center">
                  <button
                    type="submit"
                    disabled={!formularioValido() || salvando}
                    className="w-[120px] sm:w-[140px] h-[34px] sm:h-[36px] rounded-md bg-[#B10404] text-white text-sm sm:text-base hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {salvando ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="4"
                          ></circle>
                          <path
                            d="M22 12a10 10 0 0 0-10-10"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                        Criando...
                      </>
                    ) : (
                      "Criar"
                    )}
                  </button>
                </div>

                {sucesso && (
                  <p className="mt-3 text-center text-sm text-green-600">
                    {sucesso}
                  </p>
                )}
                {erros.geral && (
                  <p className="mt-3 text-center text-sm text-red-600">
                    {erros.geral}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
