export default function TrocaSemana({ value, onChange }) {
  const base =
    "px-5 py-3 rounded-md text-sm md:text-base select-none transition-colors duration-150 outline-none " +
    "focus-visible:ring-2 focus-visible:ring-[#AE0000] whitespace-nowrap text-center";
  const ativo = "bg-[#AE0000] text-white";
  const inativo = "bg-[#F6F6F6] dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-200 hover:bg-[#AE0000] hover:text-white";

  // setas do teclado (↑/← = essa, ↓/→ = próxima)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") onChange("essa");
    if (e.key === "ArrowRight" || e.key === "ArrowDown") onChange("proxima");
  };

  return (
    <div
      className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full"
      role="group"
      aria-label="Troca de semana"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onClick={() => onChange("essa")}
        aria-pressed={value === "essa"}
        className={`${base} ${value === "essa" ? ativo : inativo} w-full sm:w-auto`}
      >
        Essa semana
      </button>

      <button
        type="button"
        onClick={() => onChange("proxima")}
        aria-pressed={value === "proxima"}
        className={`${base} ${value === "proxima" ? ativo : inativo} w-full sm:w-auto`}
      >
        Próxima semana
      </button>
    </div>
  );
}
