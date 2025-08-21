export default function TrocaSemana({ value, onChange }) {
  const base =
    "px-5 py-3 rounded-md text-sm md:text-base select-none transition-colors duration-150 outline-none focus:ring-0 whitespace-nowrap";
  const ativo = "bg-[#AE0000] text-white";
  const inativo = "bg-[#F6F6F6] text-gray-700 hover:bg-[#AE0000] hover:text-white";

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange("essa")}
        className={`${base} ${value === "essa" ? ativo : inativo}`}
      >
        Essa semana
      </button>

      <button
        type="button"
        onClick={() => onChange("proxima")}
        className={`${base} ${value === "proxima" ? ativo : inativo}`}
      >
        Próxima semana
      </button>
    </div>
  );
}
