export default function GradeHorarios({ titulo, opcoes, selecionado, onSelect }) {
  const estilo =
    "min-w-[96px] text-center px-4 py-3 rounded-md text-sm md:text-base outline-none focus:ring-0 transition-colors duration-150";

  return (
    <section>
      <h3 className="font-medium mb-3 text-black dark:text-white">{titulo}</h3>
      <div className="bg-[#F3F3F3] rounded-md p-4">
        <div className="grid grid-cols-3 gap-3">
          {opcoes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t)}
              className={`${estilo} ${
                selecionado === t
                  ? "bg-[#C61919] text-white"
                  : "bg-white text-[#1E1E1E] hover:bg-[#AE0000] hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
