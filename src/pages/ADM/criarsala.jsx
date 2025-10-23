import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Tipografia
const FONT_BASE = "font-poppins";
const TXT_LABEL = "text-sm font-medium text-gray-700 block w-full text-left";
const TXT_INPUT = "text-[15px] font-normal text-black";
const TXT_TAG = "text-sm font-regular";

const CL_INPUT = `w-full h-12 rounded-md bg-gray-200 border border-gray-200 px-4 ${TXT_INPUT} placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-[#B10404] ${FONT_BASE}`;
const CL_TEXTAREA = `w-full h-[140px] rounded-md bg-gray-200 border border-gray-200 px-4 py-3 ${TXT_INPUT} placeholder-gray-400 shadow-sm outline-none resize-none focus:ring-2 focus:ring-[#B10404] ${FONT_BASE}`;
const CL_TAG = `px-3 py-2 rounded-md border shadow-sm transition-colors duration-150 transform transition-transform duration-200 will-change-transform hover:scale-105 hover:z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B10404]/20 ${TXT_TAG} hover:bg-[#B10404] hover:text-white hover:border-[#B10404]`;
const CL_TAG_OFF = "bg-transparent text-gray-700 border-gray-200";
const CL_TAG_ON = "bg-[#B10404] text-white border-[#B10404]";


const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const toHHMM = (h, m) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

export default function CriarSala() {
  // Estado principal
  const [status, setStatus] = useState("");
  const [aprovacao, setAprovacao] = useState("");
  const [acesso, setAcesso] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [motivo, setMotivo] = useState("");

  const [dias] = useState(["S", "T", "Q", "Q", "S", "S"]);
  const [selecionados, setSelecionados] = useState([]);

  const [inicio, setInicio] = useState({ h: 7, m: 45 });
  const [fim, setFim] = useState({ h: 17, m: 15 });
  const [inicioText, setInicioText] = useState(toHHMM(7, 45));
  const [fimText, setFimText] = useState(toHHMM(17, 15));
  const [isEditingInicio, setIsEditingInicio] = useState(false);
  const [isEditingFim, setIsEditingFim] = useState(false);

  const [capacidade, setCapacidade] = useState("");
  const [imagem, setImagem] = useState(null);

  const desabilitaMotivo = status !== "Indisponível";

  // Derivados
  const inicioStr = useMemo(() => toHHMM(inicio.h, inicio.m), [inicio]);
  const fimStr = useMemo(() => toHHMM(fim.h, fim.m), [fim]);

  // Sincroniza texto dos campos quando não está editando
  useEffect(() => { if (!isEditingInicio) setInicioText(inicioStr); }, [inicioStr, isEditingInicio]);
  useEffect(() => { if (!isEditingFim) setFimText(fimStr); }, [fimStr, isEditingFim]);

  // Funções utilitárias
  function toggleDia(d) {
    setSelecionados((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }
  function incTime(obj, part, step) {
    const next = { ...obj };
    if (part === "h") next.h = (next.h + step + 24) % 24;
    if (part === "m") next.m = (next.m + step + 60) % 60;
    return next;
  }

  // Upload de imagem
  function handleImagemChange(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    }
  }

  // Capacidade: 1..40, limitado
  function handleCapacidade(e) {
    const raw = e.target.value;
    if (raw === "") { setCapacidade(""); return; }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    setCapacidade(clamp(Math.floor(n), 1, 40));
  }

  // Entrada de horário com máscara dinâmica
  function handleTimeTyping(value, setText, setTime) {
    let digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length === 0) { setText(""); return; }
    if (digits.length <= 2) { setText(digits); return; }
    const hh = clamp(Number(digits.slice(0, -2)), 0, 23);
    const mm = clamp(Number(digits.slice(-2)), 0, 59);
    setText(toHHMM(hh, mm));
    setTime({ h: hh, m: mm });
  }
  function handleTimeBlur(text, setText, setTime, fallback) {
    if (!text || text.trim() === "") return;
    const digits = text.replace(/\D/g, "");
    if (digits.length <= 2) {
      const hh = clamp(Number(digits || 0), 0, 23);
      setTime({ h: hh, m: 0 });
      setText(toHHMM(hh, 0));
      return;
    }
    const m = text.match(/^(\d{1,2}):?(\d{2})$/);
    if (m) {
      const hh = clamp(Number(m[1]), 0, 23);
      const mm = clamp(Number(m[2]), 0, 59);
      setTime({ h: hh, m: mm });
      setText(toHHMM(hh, mm));
    } else {
      setText(fallback);
    }
  }

  const formValido = useMemo(() => {
    if (!nome.trim()) return false;
    if (!capacidade || Number(capacidade) <= 0) return false;
    return true;
  }, [nome, capacidade]);

  function criar(e) {
    e.preventDefault();
    if (!formValido) return;
  }

  return (
    <div className="relative min-h-screen bg-[#F5F5F5] font-poppins">
      {/* Topo */}
      <header className="relative z-10 w-full bg-[#B10404]">
        <div className="mx-auto max-w-6xl h-14 md:h-16 flex items-center justify-center px-4">
          <Link to="/admin-dashboard" className="absolute left-4">
            <img src="/src/assets/sairdomodal.svg" alt="Voltar" className="w-8 h-8 md:w-9 md:h-9" />
          </Link>
          <h1 className="text-white text-lg md:text-xl font-medium">Criar Sala</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="relative z-10 mx-auto max-w-6xl px-5 md:px-6 pt-12 pb-6 md:pt-16 md:pb-8">
        <form onSubmit={criar} className="space-y-8">
          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            {/* Coluna esquerda */}
            <div className="space-y-9">
              {/* Upload de imagem */}
              <label className="group relative w-[260px] h-[160px] bg-gray-200 border border-gray-200 rounded-md shadow-sm flex items-center justify-center cursor-pointer transform transition-transform duration-200 hover:scale-105 overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleImagemChange} />
                {imagem ? (
                  <>
                    <img src={imagem} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImagem(null); }}
                      className="absolute inset-0 flex items-center justify-center bg-[#B10404] bg-opacity-0 opacity-0 group-hover:bg-opacity-95 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Remover imagem"
                    >
                      <img src="/src/assets/sairdomodal.svg" alt="Remover" className="w-8 h-8" />
                    </button>
                  </>
                ) : (
                  <span className="text-4xl font-extralight text-gray-800 leading-none">+</span>
                )}
              </label>

              {/* Status */}
              <div className="space-y-2 text-left w-full">
                <p className={TXT_LABEL}>Status:</p>
                <div className="flex flex-wrap gap-3">
                  {["Disponível", "Indisponível"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`${CL_TAG} ${status === s ? CL_TAG_ON : CL_TAG_OFF}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aprovação */}
              <div className="space-y-2 text-left w-full">
                <p className={TXT_LABEL}>Aprovação:</p>
                <div className="flex flex-wrap gap-3">
                  {["Manual", "Automática"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAprovacao(s)}
                      className={`${CL_TAG} ${aprovacao === s ? CL_TAG_ON : CL_TAG_OFF}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acesso */}
              <div className="space-y-2 text-left w-full">
                <p className={TXT_LABEL}>Acesso para:</p>
                <div className="flex flex-wrap gap-3">
                  {["Todos", "Funcionários"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAcesso(s)}
                      className={`${CL_TAG} ${acesso === s ? CL_TAG_ON : CL_TAG_OFF}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna direita */}
            <div className="space-y-9 w-full md:max-w-[420px] md:ml-auto">
              <div className="space-y-2 text-left w-full">
                <label className={TXT_LABEL}>Nome da sala:</label>
                <input className={CL_INPUT} placeholder=" " value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>

              <div className="space-y-2 text-left w-full">
                <label className={TXT_LABEL}>Descrição:</label>
                <textarea className={CL_TEXTAREA} placeholder=" " value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>

              <div className="space-y-2 text-left w-full">
                <label className={TXT_LABEL}>Motivo:</label>
                <input
                  className={`${CL_INPUT} ${desabilitaMotivo ? "opacity-70" : ""} placeholder-[#9D9D9D]`}
                  placeholder="Manutenção"
                  value={motivo}
                  disabled={desabilitaMotivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Divisor */}
          <hr className="border-gray-300" />

          {/* Dias da semana */}
          <div className="flex items-center gap-6">
            <p className={TXT_LABEL} style={{ width: "auto" }}>Data:</p>
            <div className="flex md:gap-3">
              {dias.map((d, i) => (
                <button
                  key={`${d}${i}`}
                  type="button"
                  onClick={() => toggleDia(`${d}${i}`)}
                  className={`
                    w-10 h-12 rounded-md border text-sm
                    ${selecionados.includes(`${d}${i}`)
                      ? "bg-[#B10404] text-white border-[#B10404]"
                      : "bg-gray-200 text-gray-400 border-gray-200"}
                    shadow-sm flex items-center justify-center leading-none
                    hover:bg-[#B10404] hover:text-white hover:border-[#B10404]
                    transform transition-transform duration-200 hover:scale-105
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Horários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-10">
            {/* Início */}
            <div className="space-y-2">
              <p className={TXT_LABEL}>Horário de início:</p>
              <div className="relative bg-gray-200 rounded-md border border-gray-200 p-3 flex items-center gap-3">
                <div className="min-w-[96px] h-9 bg-white text-black rounded-md border border-gray-200 flex items-center justify-center px-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inicioText}
                    onFocus={() => setIsEditingInicio(true)}
                    onChange={(e) => handleTimeTyping(e.target.value, setInicioText, setInicio)}
                    onBlur={() => {
                      setIsEditingInicio(false);
                      handleTimeBlur(inicioText, setInicioText, setInicio, inicioStr);
                    }}
                    className="w-full h-full bg-transparent text-center outline-none text-[15px]"
                    placeholder="HH:MM"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-9 h-9 bg-white text-black rounded-md border border-gray-200 shadow-sm flex items-center justify-center transform transition-transform duration-200 hover:scale-105"
                    onClick={() => {
                      const next = incTime(inicio, "h", +1);
                      setInicio(next);
                      setInicioText(toHHMM(next.h, next.m));
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="w-9 h-9 bg-white text-black rounded-md border border-gray-200 shadow-sm flex items-center justify-center transform transition-transform duration-200 hover:scale-105"
                    onClick={() => {
                      const next = incTime(inicio, "h", -1);
                      setInicio(next);
                      setInicioText(toHHMM(next.h, next.m));
                    }}
                  >
                    −
                  </button>
                </div>
                <div className="absolute right-1 top-1 bottom-1 w-1 bg-[#B10404] rounded" />
              </div>
            </div>

            {/* Término */}
            <div className="space-y-2">
              <p className={TXT_LABEL}>Horário de término:</p>
              <div className="relative bg-gray-200 rounded-md border border-gray-200 p-3 flex items-center gap-3">
                <div className="min-w-[96px] h-9 bg-white text-black rounded-md border border-gray-200 flex items-center justify-center px-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fimText}
                    onFocus={() => setIsEditingFim(true)}
                    onChange={(e) => handleTimeTyping(e.target.value, setFimText, setFim)}
                    onBlur={() => {
                      setIsEditingFim(false);
                      handleTimeBlur(fimText, setFimText, setFim, fimStr);
                    }}
                    className="w-full h-full bg-transparent text-center outline-none text-[15px]"
                    placeholder="HH:MM"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-9 h-9 bg-white text-black rounded-md border border-gray-200 shadow-sm flex items-center justify-center transform transition-transform duration-200 hover:scale-105"
                    onClick={() => {
                      const next = incTime(fim, "h", +1);
                      setFim(next);
                      setFimText(toHHMM(next.h, next.m));
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="w-9 h-9 bg-white text-black rounded-md border border-gray-200 shadow-sm flex items-center justify-center transform transition-transform duration-200 hover:scale-105"
                    onClick={() => {
                      const next = incTime(fim, "h", -1);
                      setFim(next);
                      setFimText(toHHMM(next.h, next.m));
                    }}
                  >
                    −
                  </button>
                </div>
                <div className="absolute right-1 top-1 bottom-1 w-1 bg-[#B10404] rounded" />
              </div>
            </div>
          </div>

          {/* Capacidade */}
          <div className="mt-8">
            <div className="flex items-center gap-4 flex-wrap">
              <p className={`${TXT_LABEL} mr-2 font-medium -mt-3`}>Capacidade de pessoas:</p>
              <input
                type="number"
                min={1}
                max={40}
                className="w-[72px] h-9 rounded-md bg-gray-200 border border-gray-200 px-3 text-[15px] text-black text-center shadow-sm outline-none focus:ring-2 focus:ring-[#B10404]"
                value={capacidade}
                placeholder="1"
                onChange={handleCapacidade}
              />
            </div>
          </div>

          {/* Ações */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!formValido}
              className={`min-w-[140px] rounded-md bg-[#B10404] text-white py-1.5 px-6 text-base shadow-sm hover:opacity-95 disabled:opacity-60`}
            >
              Criar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}