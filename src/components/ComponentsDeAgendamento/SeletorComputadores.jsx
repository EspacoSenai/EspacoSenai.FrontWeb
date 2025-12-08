import React from "react";

const DEFAULT_ITENS = [1, 2, 3, 4, 5];

function normalizarItem(item, index) {
  if (item && typeof item === "object") {
    const id =
      item.id ?? item.value ?? item.numero ?? item.key ?? index + 1;
    const label =
      item.label ?? item.nome ?? (item.numero != null ? `PC${item.numero}` : id);
    return { id, label, raw: item };
  }

  const value = Number.isFinite(item) ? Number(item) : item;
  return {
    id: value ?? index + 1,
    label: value ?? index + 1,
    raw: { id: value ?? index + 1, label: value ?? index + 1 },
  };
}

export default function SeletorComputadores({
  valor,
  onChange,
  isDisabled,
  opcoes = DEFAULT_ITENS,
}) {
  const itens = Array.isArray(opcoes) && opcoes.length ? opcoes : DEFAULT_ITENS;

  const base =
    "w-[64px] h-10 text-center rounded-md text-sm outline-none focus:ring-0 transition-colors duration-150";

  return (
    <section>
      <h3 className="font-medium mb-3 text-black dark:text-white">Computadores:</h3>

      <div className="inline-block w-fit max-w-full overflow-x-auto bg-[#F3F3F3] dark:bg-[#1a1a1a] rounded-md p-4">
        <div className="inline-grid grid-flow-col auto-cols-max gap-3">
          {itens.map((item, index) => {
            const info = normalizarItem(item, index);
            const disabled = isDisabled ? !!isDisabled(info.id, info.raw) : false;
            const selected = valor === info.id;

            const classe = disabled
              ? "bg-[#E5E5E5] text-gray-400 cursor-not-allowed opacity-60"
              : selected
              ? "bg-[#C61919] text-white"
              : "bg-white dark:bg-[#0f0f0f] text-[#1E1E1E] dark:text-white hover:bg-[#AE0000] hover:text-white";

            return (
              <button
                key={`${info.id}-${info.label}`}
                type="button"
                onClick={() => !disabled && onChange && onChange(info.id, info.raw)}
                className={`${base} ${classe}`}
                disabled={disabled}
                aria-disabled={disabled}
                aria-pressed={selected}
                title={disabled ? "Computador indisponível" : `Selecionar ${info.label}`}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
