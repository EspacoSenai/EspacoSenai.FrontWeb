import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

export const COR = "#AE0000";

export const items = [
  {
    title: "PS5",
    img: ImgPS5,
    desc:
      "Agora você pode aproveitar toda a emoção dos games com o PlayStation 5 na biblioteca!",
    link: "/salas-alunos",
  },
  {
    title: "Quadra",
    img: ImgQuadra,
    desc:
      "A quadra é um espaço essencial para a prática de esportes, lazer e atividades físicas.",
    link: "/salas-alunos",
  },
  {
    title: "Computadores",
    img: ImgComputadores,
    desc:
      "Espaço equipado com computadores para estudos, pesquisas e projetos em grupo.",
    link: "/salas-alunos",
  },
  {
    title: "Impressão 3D",
    img: ImgImpressora3D,
    desc:
      "Área com impressoras 3D para prototipagem e atividades de inovação e tecnologia.",
    link: "/salas-alunos",
  },
];

export const pages = [
  [items[0], items[1]],
  [items[2], items[3]],
];
export const pagesCount = pages.length;

export const lembretesData = [
  {
    id: 1,
    titulo: "Impressoras 3D",
    imagem: ImgComputadores,
    periodo: "Tarde",
    horario: "14:06",
    data: "12/01",
  },
  {
    id: 2,
    titulo: "Quadra",
    imagem: ImgQuadra,
    periodo: "Tarde",
    horario: "14:06",
    data: "12/01",
  },
  {
    id: 3,
    titulo: "PS5",
    imagem: ImgPS5,
    periodo: "Manhã",
    horario: "09:15",
    data: "14/01",
  },
  {
    id: 4,
    titulo: "Computadores",
    imagem: ImgComputadores,
    periodo: "Manhã",
    horario: "09:15",
    data: "14/01",
  },
];

/** Decide para qual rota de SALAS deve ir de acordo com o perfil logado */
function getSalasPathForCurrentProfile(defaultLink = "/salas-alunos") {
  try {
    const profile = localStorage.getItem("selected_profile") || "ALUNO";

    switch (profile) {
      case "ADMIN":
        return "/salas-administradores";
      case "COORDENADOR":
        return "/salas-coordenadores";
      case "PROFESSOR":
        return "/salas-professores";
      case "ALUNO":
      default:
        return defaultLink || "/salas-alunos";
    }
  } catch {
    return defaultLink || "/salas-alunos";
  }
}

export function ArrowBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Próximo"
      className="absolute z-40 right-[-4px] md:right-[-2px] top-[46%] md:top-[44%] h-10 md:h-11 w-10 md:w-11 grid place-items-center rounded-full bg-transparent border-0 hover:scale-[1.06] active:scale-95 focus:outline-none select-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg
        viewBox="0 0 20 37"
        className="w-5 h-5 text-[#1E1E1E] dark:text-white"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1.75 35.375L18.625 18.5L1.75 1.625"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function Card({ title, img, desc, link }) {
  // aqui ele ajusta o link conforme o perfil logado
  const finalLink = getSalasPathForCurrentProfile(link);

  return (
    <Link
      to={finalLink}
      className="block rounded-[12px] bg-white dark:bg-[#1B1B1B] shadow-md ring-1 ring-black/5 p-3 sm:p-4 md:p-5 group"
    >
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-5 items-center">
        <div className="md:col-span-4">
          <img
            src={img}
            alt={title}
            className="w-full h-[160px] sm:h-[190px] md:h-[180px] object-cover rounded-[10px]"
          />
        </div>

        <div className="md:col-span-6 relative">
          <span className="inline-block bg-[#720505] text-white text-sm font-semibold px-4 py-1 rounded-[10px]">
            {title}
          </span>

          <div className="mt-3 sm:mt-4 rounded-[10px] bg-[#EFEFEF] dark:bg-[#111] ring-1 ring-black/5 p-3 sm:p-4">
            <p className="text-sm sm:text-base text-[#1E1E1E] dark:text-gray-200 leading-relaxed">
              {desc}
            </p>
          </div>

          <div className="mt-3 sm:mt-4 flex justify-end">
            <span className="inline-flex items-center gap-2 bg-white dark:bg-[#0f0f0f] text-[#1E1E1E] dark:text-white border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-sm font-semibold group-hover:translate-x-[2px] transition">
              Ver espaços
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 5l6 5-6 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Dot() {
  return (
    <span
      className="inline-block w-[8px] h-[8px] rounded-full mr-2"
      style={{ backgroundColor: COR }}
    />
  );
}

export function Kebab({ onClick, ariaControls, ariaExpanded }) {
  return (
    <button
      type="button"
      aria-label="Mais opções"
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-12 w-12 grid place-items-center rounded-xl bg-transparent text-neutral-700 hover:bg-black/5 transition outline-none"
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="6" r="2" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="18" r="2" fill="currentColor" />
      </svg>
    </button>
  );
}

// cartão de lembrete
export function LembreteCard({ item }) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const handleEditar = () => {
    setOpen(false);
    alert(`Editar reserva: ${item.titulo}`);
  };

  const handleCancelar = () => {
    setOpen(false);
    const ok = window.confirm(`Cancelar reserva de ${item.titulo}?`);
    if (ok) {
      console.log("cancelado", item.id);
    }
  };

  return (
    <div className="relative rounded-xl bg-white dark:bg-[#1B1B1B] shadow-sm ring-1 ring-black/5 px-3 py-3 md:px-4 md:py-4">
      {/* botão de 3 pontinhos */}
      <div className="absolute bottom-3 right-3 -m-2 p-2 z-[70]" ref={popRef}>
        <Kebab
          onClick={() => setOpen((v) => !v)}
          ariaControls={`menu-${item.id}`}
          ariaExpanded={open}
        />

        {open && (
          <div
            id={`menu-${item.id}`}
            role="menu"
            className="absolute bottom-12 right-0 w-56 overflow-hidden select-none z-[9999]
                       bg-white text-slate-900 rounded-xl border border-black/10 shadow-2xl"
          >
            {/* Editar reserva */}
            <button
              type="button"
              role="menuitem"
              onClick={handleEditar}
              className="w-full flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-black/5 transition text-slate-900"
              style={{ background: "transparent" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z"
                  stroke={COR}
                  strokeWidth="1.6"
                />
                <path
                  d="M14.06 5.19l3.75 3.75"
                  stroke={COR}
                  strokeWidth="1.6"
                />
              </svg>
              <span className="font-medium text-slate-900">Editar reserva</span>
            </button>

            <div className="h-px bg-black/10" />

            {/* Cancelar reserva */}
            <button
              type="button"
              role="menuitem"
              onClick={handleCancelar}
              className="w-full flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-black/5 transition text-red-700"
              style={{ background: "transparent" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke={COR}
                  strokeWidth="1.8"
                />
                <path
                  d="M9.5 9.5l5 5M14.5 9.5l-5 5"
                  stroke={COR}
                  strokeWidth="1.8"
                />
              </svg>
              <span className="font-semibold">Cancelar reserva</span>
            </button>
          </div>
        )}
      </div>

      {/* conteúdo do card */}
      <div className="grid grid-cols-12 gap-3 md:gap-4">
        <div className="col-span-12 sm:col-span-5 md:col-span-4">
          <img
            src={item.imagem}
            alt={item.titulo}
            className="w-full h-[180px] md:h-[150px] object-cover rounded-xl"
          />
        </div>

        <div className="relative col-span-12 sm:col-span-7 md:col-span-8 pr-16 pt-12">
          <span className="absolute top-0 right-[-12px] md:right-[-16px] h-10 md:h-11 px-5 md:px-6 bg-[#720505] text-white text-[15px] md:text-[16px] font-semibold leading-[2.5rem] md:leading-[2.75rem] rounded-l-xl whitespace-nowrap shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
            {item.titulo}
          </span>

          <div className="space-y-2.5 text-[16px]">
            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Período:</span>
              <span className="opacity-90">{item.periodo}</span>
            </div>

            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Horário:</span>
              <span className="opacity-90">{item.horario}</span>
            </div>

            <div className="flex items-center text-[#1E1E1E] dark:text-gray-200">
              <Dot />
              <span className="mr-1 font-semibold">Data:</span>
              <span className="opacity-90">{item.data}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
