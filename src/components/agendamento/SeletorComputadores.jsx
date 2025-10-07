import React from "react";

export default function SeletorComputadores({ valor, onChange, isDisabled }) {
  const itens = [1, 2, 3, 4, 5];

  const base =
    "w-[64px] h-10 text-center rounded-md text-sm outline-none focus:ring-0 transition-colors duration-150";

  return (
    <section>
      <h3 className="font-medium mb-3 text-black dark:text-white">Computadores:</h3>

      {/* encolhe ao conteúdo (não ocupa a tela toda) */}
      <div className="inline-block w-fit max-w-full overflow-x-auto bg-[#F3F3F3] dark:bg-[#1a1a1a] rounded-md p-4">
        <div className="inline-grid grid-flow-col auto-cols-max gap-3">
          {itens.map((n) => {
            const disabled = isDisabled ? !!isDisabled(n) : false;
            const selected = valor === n;

            const classe = disabled
              ? "bg-[#E5E5E5] text-gray-400 cursor-not-allowed opacity-60"
              : selected
              ? "bg-[#C61919] text-white"
              : "bg-white dark:bg-[#0f0f0f] text-[#1E1E1E] dark:text-white hover:bg-[#AE0000] hover:text-white";

            return (
              <button
                key={n}
                type="button"
                onClick={() => !disabled && onChange(n)}
                className={`${base} ${classe}`}
                disabled={disabled}
                aria-disabled={disabled}
                aria-pressed={selected}
                title={disabled ? "Computador indisponível" : `Selecionar computador ${n}`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
