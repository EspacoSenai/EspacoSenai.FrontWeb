import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GradeHorarios({
  titulo,
  opcoes = [],
  selecionado,
  onSelect = () => {},
  isDisabled,
  comFiltro = false,
  filtro = "",
  onFiltroChange = () => {},
}) {
  const base =
    "min-w-[96px] h-12 text-center px-4 rounded-lg text-sm md:text-base transition-colors duration-150";

  const opcoesFiltradas = comFiltro
    ? opcoes.filter((t) =>
        t.replace(":", "").startsWith(filtro.replace(":", ""))
      )
    : opcoes;

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-medium text-black dark:text-white">{titulo}</h3>

        {comFiltro && (
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={filtro}
            onChange={(e) => {
              
              const onlyNums = e.target.value.replace(/\D/g, "");
              onFiltroChange(onlyNums);
            }}
            placeholder="HR/MN"
            className="w-28 h-9 px-3 text-sm border rounded-lg 
                       bg-[#F3F3F3] dark:bg-[#1a1a1a] 
                       text-black dark:text-white -mt-1"
          />
        )}
      </div>

      {/* Caixa de horários */}
      <div className="bg-[#F3F3F3] dark:bg-[#1a1a1a] rounded-md p-4">
        {opcoesFiltradas.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400 text-sm">
            {opcoes.length === 0 
              ? "Selecione um horário de início primeiro"
              : "Nenhum horário encontrado"}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto pr-1">
            <AnimatePresence>
              {opcoesFiltradas.map((t) => {
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
                  <motion.button
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
