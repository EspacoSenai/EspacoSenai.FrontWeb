import React, { forwardRef } from "react";

const iconsByType = {
  success: { bg: "bg-green-100", color: "text-green-600", svg: null },
  error: {
    bg: "bg-red-100",
    color: "text-red-600",
    svg: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  },
  warning: {
    bg: "bg-yellow-100",
    color: "text-yellow-600",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
};

const ModalDeAgendamento = forwardRef(function ModalDeAgendamento(
  { open, onClose, type = "success", title, message, sucessoIcon, primaryColor },
  ref
) {
  if (!open) return null;
  const ic = iconsByType[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-xl bg-white dark:bg-[#111] shadow-2xl p-8 text-center">
        <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${ic.bg}`}>
          {type === "success" ? (
            <img src={sucessoIcon} alt="Sucesso" className="h-9 w-9" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-9 w-9 ${ic.color}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {ic.svg}
            </svg>
          )}
        </div>

        <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
        {message && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>}

        <button
          ref={ref}
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center rounded-md px-6 py-3 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Ok, entendi
        </button>
      </div>
    </div>
  );
});

export default ModalDeAgendamento;
