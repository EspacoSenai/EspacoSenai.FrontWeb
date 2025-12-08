import React from "react";

const COR = "#AE0000";

export default function ReservaCard({ img, titulo, horarioInicio, horarioFim, data }) {
  return (
    <div className="rounded-[12px] bg-white dark:bg-[#151515] border border-black/10 dark:border-white/10 shadow-sm p-4">
      <div className="rounded-[10px] overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <img src={img} alt={titulo} className="w-full h-[160px] object-cover" />
      </div>

      <div className="mt-3 flex justify-center">
        <span
          className="inline-block px-4 py-1 rounded-md text-white text-sm font-semibold"
          style={{ backgroundColor: COR }}
        >
          {titulo}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-[13px] text-[#1E1E1E] dark:text-gray-300">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-[6px] h-[6px] rounded-full"
              style={{ backgroundColor: COR }}
            />
            <span>Horário Início: {horarioInicio}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-[6px] h-[6px] rounded-full"
              style={{ backgroundColor: COR }}
            />
            <span>Horário Fim: {horarioFim}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span
            className="inline-block w-[6px] h-[6px] rounded-full"
            style={{ backgroundColor: COR }}
          />
          <span>Data: {data}</span>
        </div>
      </div>
    </div>
  );
}
