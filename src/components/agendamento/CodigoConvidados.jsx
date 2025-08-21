import React, { useEffect, useRef, useState } from "react";
import lixeira from "../../assets/lixeira.svg";

/**
 * Props:
 * - convidados: string[][]
 * - setConvidados: (updater) => void
 * - tamanhoCodigo?: number (default 5)
 * - maxConvidados?: number (default 9)
 * - onAviso?: (tipo, titulo, msg) => void
 */
export default function CodigoConvidados({
  convidados,
  setConvidados,
  tamanhoCodigo = 5,
  maxConvidados = 9,
  onAviso,
}) {
  // seleção p/ lixeira
  const [selecionados, setSelecionados] = useState(new Set());
  const alternarSelecionado = (ind) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(ind)) novo.delete(ind);
      else novo.add(ind);
      return novo;
    });
  };

  // refs dos inputs [convidado][digito]
  const inputsRef = useRef([]);
  useEffect(() => {
    inputsRef.current = convidados.map(
      (codigo, i) => inputsRef.current[i] || Array(tamanhoCodigo).fill(null)
    );
  }, [convidados, tamanhoCodigo]);

  // ===== Funções da "senha" do convidado =====
  function normalizaCodigoChar(v) {
    return String(v).slice(-1).replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  }

  function mudarDigito(iConvidado, iDig, valor) {
    const char = normalizaCodigoChar(valor);
    setConvidados((lista) =>
      lista.map((cod, i) =>
        i === iConvidado ? cod.map((d, j) => (j === iDig ? char : d)) : cod
      )
    );
  }

  function handleChange(iConvidado, iDig, e) {
    const v = e.target.value;

    // Colagem de vários chars
    if (v.length > 1) {
      const chars = v.replace(/[^0-9A-Za-z]/g, "").toUpperCase().split("");
      if (chars.length) {
        setConvidados((lista) =>
          lista.map((cod, i) => {
            if (i !== iConvidado) return cod;
            const novo = [...cod];
            let k = iDig;
            for (const c of chars) {
              if (k >= tamanhoCodigo) break;
              novo[k] = c;
              k++;
            }
            return novo;
          })
        );
        const next = Math.min(iDig + chars.length, tamanhoCodigo - 1);
        inputsRef.current[iConvidado][next]?.focus();
      }
      return;
    }

    // Digitação 1 a 1 + auto-avanço
    mudarDigito(iConvidado, iDig, v);
    if (v && v.trim() !== "" && iDig < tamanhoCodigo - 1) {
      inputsRef.current[iConvidado][iDig + 1]?.focus();
    }
  }

  function handleKeyDown(iConvidado, iDig, e) {
    if (e.key === "Backspace") {
      const valor = convidados[iConvidado][iDig];
      if (!valor && iDig > 0) {
        const prev = iDig - 1;
        inputsRef.current[iConvidado][prev]?.focus();
        setConvidados((lista) =>
          lista.map((cod, i) =>
            i === iConvidado ? cod.map((d, j) => (j === prev ? "" : d)) : cod
          )
        );
      }
    }
    if (e.key === "ArrowLeft" && iDig > 0) inputsRef.current[iConvidado][iDig - 1]?.focus();
    if (e.key === "ArrowRight" && iDig < tamanhoCodigo - 1) inputsRef.current[iConvidado][iDig + 1]?.focus();
  }
  // ===========================================

  function adicionarConvidado() {
    if (convidados.length >= maxConvidados) {
      onAviso?.("warning", "Limite de convidados atingido", `O máximo é de ${maxConvidados} convidados.`);
      return;
    }
    setConvidados((lista) => [...lista, Array(tamanhoCodigo).fill("")]);
  }

  function removerSelecionados() {
    if (selecionados.size === 0) {
      onAviso?.("warning", "Nada selecionado", "Marque pelo menos um convidado para remover.");
      return;
    }
    setConvidados((lista) => lista.filter((_, i) => !selecionados.has(i)));
    setSelecionados(new Set());
  }

  return (
    <section className="mt-6">
      <h3 className="font-medium mb-2 text-black dark:text-white">Código de convidado:</h3>

      <div className="flex flex-col gap-3">
        {convidados.map((codigo, iConvidado) => (
          <div key={iConvidado} className="flex items-center gap-2 flex-wrap">
            {/* Checkbox: seleciona/deseleciona para remoção */}
            <input
              type="checkbox"
              checked={selecionados.has(iConvidado)}
              onChange={() => alternarSelecionado(iConvidado)}
              className="appearance-none w-5 h-5 rounded-md border border-gray-300 bg-white shadow-sm cursor-pointer
                         checked:bg-[#AE0000] checked:border-[#AE0000]
                         focus:outline-none focus:ring-0"
              title="Selecionar para remover"
            />

            {/* Inputs do código com auto-avance/colar */}
            {codigo.map((dig, iDig) => (
              <input
                key={iDig}
                ref={(el) => {
                  if (!inputsRef.current[iConvidado]) inputsRef.current[iConvidado] = [];
                  inputsRef.current[iConvidado][iDig] = el;
                }}
                value={dig}
                onChange={(e) => handleChange(iConvidado, iDig, e)}
                onKeyDown={(e) => handleKeyDown(iConvidado, iDig, e)}
                className="w-12 h-12 border bg-white text-black border-gray-300 rounded-md text-center text-lg outline-none focus:ring-0 focus:border-gray-400"
                maxLength={tamanhoCodigo}
                inputMode="text"
                autoComplete="off"
              />
            ))}

            <span className="ml-1 text-sm text-gray-600 dark:text-white">
              Convidado {iConvidado + 1}
            </span>
          </div>
        ))}

        {/* Ações: adicionar e lixeira */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={adicionarConvidado}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white text-black rounded-md text-base outline-none hover:bg-[#AE0000] hover:text-white transition-colors duration-150 disabled:opacity-40"
            disabled={convidados.length >= maxConvidados}
            title="Adicionar convidado"
          >
            +
          </button>

          {/* Lixeira */}
          <button
            type="button"
            onClick={removerSelecionados}
            aria-label={selecionados.size === 0 ? "Selecione para remover" : "Remover selecionados"}
            title={selecionados.size === 0 ? "Selecione para remover" : "Remover selecionados"}
            className="group w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded-md outline-none
                       transition-colors duration-150 hover:bg-[#AE0000] focus-visible:ring-2 focus-visible:ring-[#AE0000]"
          >
            <img
              src={lixeira}
              alt="Excluir"
              draggable={false}
              className="w-4 h-4 pointer-events-none
                         filter invert brightness-0                      
                         group-hover:invert-0 group-hover:brightness-100"
            />
          </button>
        </div>
      </div>

      <p className="text-[12px] mt-2 text-black dark:text-white">
        <span className="text-[#AE0000] font-semibold">OBS:</span>{" "}
        Você poderá convidar seus amigos para aproveitar a reserva. O máximo é de{" "}
        <span className="text-[#AE0000] font-semibold">nove</span> convidados.
      </p>
    </section>
  );
}
