export default function SeletorDia({ dias, selectedIndex, onSelect }) {
  return (
    <div
      className="
        flex gap-2 
        overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        md:overflow-visible
      "
    >
      {dias.map((d, idx) => {
        const base =
          "flex flex-col items-center justify-center w-12 h-12 rounded-md text-xs outline-none focus:ring-0 transition-colors duration-150 shrink-0";
        const classe = d.desabilitado
          ? "bg-[#E5E5E5] text-gray-400 cursor-not-allowed opacity-70"
          : selectedIndex === idx
          ? "bg-[#AE0000] text-white"
          : "bg-[#F6F6F6] text-gray-700 hover:bg-[#AE0000] hover:text-white";

        return (
          <button
            key={idx}
            type="button"
            onClick={() => !d.desabilitado && onSelect(idx)}
            className={`${base} ${classe}`}
            disabled={d.desabilitado}
            title={d.desabilitado ? "Dia indisponível" : "Selecionar data"}
          >
            <span className="text-[11px]">{d.diaSemana}</span>
            <span className="text-sm font-medium">{d.numeroDia}</span>
          </button>
        );
      })}
    </div>
  );
}
