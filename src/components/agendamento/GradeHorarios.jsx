export default function GradeHorarios({
  titulo,
  opcoes = [],
  selecionado,
  onSelect = () => {},
  isDisabled,
}) {
  const base =
    "min-w-[96px] h-12 text-center px-4 rounded-md text-sm md:text-base transition-colors duration-150";

  return (
    <section>
      <h3 className="font-medium mb-3 text-black dark:text-white">{titulo}</h3>
      <div className="bg-[#F3F3F3] dark:bg-[#1a1a1a] rounded-md p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto pr-1">
          {opcoes.map((t) => {
            const disabled = isDisabled ? !!isDisabled(t) : false;
            const isSelected = selecionado === t;

            const classe = disabled
              ? "bg-[#E5E5E5] text-gray-400 cursor-not-allowed opacity-60"
              : isSelected
              ? "bg-[#C61919] text-white"
              : "bg-white dark:bg-[#0f0f0f] text-[#1E1E1E] dark:text-white hover:bg-[#AE0000] hover:text-white";

            const onKeyDown = (e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(t);
              }
            };

            return (
              <button
                key={t}
                type="button"
                onClick={() => !disabled && onSelect(t)}
                onKeyDown={onKeyDown}
                className={`${base} ${classe}`}
                disabled={disabled}
                aria-disabled={disabled}
                aria-pressed={isSelected}
                data-selected={isSelected ? "true" : "false"}
                title={disabled ? "Horário indisponível" : "Selecionar horário"}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
