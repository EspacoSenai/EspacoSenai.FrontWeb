import React from "react";
import { COR_VERMELHO, juntarClasses } from "./FuncoesCompartilhada"; 

export default function SeletorImpressoras({
  titulo = "Impressoras 3D:",
  quantidade = 6,
  selecionados = [],
  onChange,
  className = "",
}) {
  const toggle = (n) => {
    if (!onChange) return;
    if (selecionados.includes(n)) {
      onChange(selecionados.filter((x) => x !== n));
    } else {
      onChange([...selecionados, n]);
    }
  };

  return (
    <div className={className}>
      {titulo && (
        <h2 className="text-lg font-medium text-black dark:text-white mb-3">
          {titulo}
        </h2>
      )}

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: quantidade }).map((_, idx) => {
          const n = idx + 1;
          const ativo = selecionados.includes(n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              className={juntarClasses(
                "py-3 px-3 rounded-md text-base font-semibold transition-colors shadow-sm border",
                "focus:outline-none focus:ring-2 focus:ring-red-300",
                ativo
                  ? "text-white border-transparent"
                  : "bg-[#EDEDED] text-[#1E1E1E] hover:bg-[#e5e5e5] border-[#D9D9D9]"
              )}
              style={{ backgroundColor: ativo ? COR_VERMELHO : undefined }}
              aria-pressed={ativo}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
