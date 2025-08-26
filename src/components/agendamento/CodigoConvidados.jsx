import React, { useEffect, useRef, useState } from "react";

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
      <h3 className="font-medium mb-2 text-black dark:text-white text-base sm:text-lg">
        Código de convidado:
      </h3>

      <div className="flex flex-col gap-3 sm:gap-4">
        {convidados.map((codigo, iConvidado) => (
          <div key={iConvidado} className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Checkbox custom responsivo (quadrado vermelho quando marcado) */}
            <label
              className="relative inline-flex items-center cursor-pointer select-none"
              title="Selecionar para remover"
            >
              <input
                type="checkbox"
                checked={selecionados.has(iConvidado)}
                onChange={() => alternarSelecionado(iConvidado)}
                className="sr-only peer"
                aria-label={`Selecionar convidado ${iConvidado + 1} para remover`}
              />
              <span
                className="w-6 h-6 md:w-5 md:h-5 rounded-full border border-white bg-[#EEEEEE] shadow-sm
                           peer-checked:bg-[#AE0000]
                           peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#AE0000]"
                aria-hidden="true"
              />
            </label>

            {/* Inputs do código com auto-avance/colar (responsivo) */}
            <div className="flex items-center gap-2 sm:gap-3">
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
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border bg-white text-black border-gray-300 rounded-md
                             text-base sm:text-lg text-center outline-none focus:ring-0 focus:border-gray-400"
                  maxLength={tamanhoCodigo}
                  inputMode="text"
                  autoComplete="off"
                  aria-label={`Dígito ${iDig + 1} do convidado ${iConvidado + 1}`}
                />
              ))}
            </div>

            <span className="ml-1 text-sm sm:text-[15px] text-gray-600 dark:text-white">
              Convidado {iConvidado + 1}
            </span>
          </div>
        ))}

        {/* Ações: adicionar e lixeira (tamanhos maiores no mobile) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={adicionarConvidado}
            className="w-10 h-10 sm:w-9 sm:h-9 md:w-8 md:h-8 flex items-center justify-center
                       border border-gray-300 bg-white text-black rounded-md text-lg md:text-base
                       outline-none hover:bg-[#AE0000] hover:text-white transition-colors duration-150 disabled:opacity-40"
            disabled={convidados.length >= maxConvidados}
            title="Adicionar convidado"
            aria-label="Adicionar convidado"
          >
            +
          </button>

          <button
            type="button"
            onClick={removerSelecionados}
            aria-label={selecionados.size === 0 ? "Selecione para remover" : "Remover selecionados"}
            title={selecionados.size === 0 ? "Selecione para remover" : "Remover selecionados"}
            className="group w-10 h-10 sm:w-9 sm:h-9 md:w-8 md:h-8 flex items-center justify-center
                       border border-gray-300 bg-white rounded-md outline-none
                       transition-colors duration-150 hover:bg-[#AE0000] focus-visible:ring-2 focus-visible:ring-[#AE0000]"
          >
          
            <span className="text-black group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-4 md:h-4" aria-hidden="true">
                <path d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9Zm-2 3h10v13H7V6Zm2 2v9h2V8H9Zm4 0v9h2V8h-2Z"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-[13px] mt-2 text-black dark:text-white leading-relaxed">
        <span className="text-[#AE0000] font-semibold">OBS:</span>{" "}
        Você poderá convidar seus amigos para aproveitar a reserva. O máximo é de{" "}
        <span className="text-[#AE0000] font-semibold">nove</span> convidados.
      </p>
    </section>
  );
}
