import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Link } from "react-router-dom";

import ReservaCard from "./ReservaCard";
import { buscarReservasAprovadas } from "../../service/reserva";

import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

const COR = "#AE0000";

export default function ReservasConfirmadas() {
  const [reservas, setReservas] = useState([]);

  const scRef = useRef(null);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const [thumb, setThumb] = useState({ leftPct: 0, widthPct: 100 });

  /* ================== BUSCA DO BACK ================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservasData = await buscarReservasAprovadas();
        setReservas(reservasData || []);
      } catch (error) {
        console.error("Erro ao buscar as reservas:", error);
        setReservas([]);
      }
    };

    fetchData();
  }, []);

  /* ================== SYNC DA BARRA ================== */
  const syncThumb = useCallback(() => {
    const sc = scRef.current;
    const track = trackRef.current;
    if (!sc || !track) return;

    const total = sc.scrollWidth;
    const vis = sc.clientWidth;

    if (total <= 0 || vis >= total) {
      // nada pra rolar → barra inteira
      setThumb({ leftPct: 0, widthPct: 100 });
      return;
    }

    const maxScroll = total - vis;
    const widthPct = Math.max(10, Math.min(100, (vis / total) * 100));
    const ratio = sc.scrollLeft / maxScroll;
    const leftPct = ratio * (100 - widthPct);

    setThumb({ leftPct, widthPct });
  }, []);

  useEffect(() => {
    syncThumb();
  }, [syncThumb, reservas.length]);

  useEffect(() => {
    const onResize = () => syncThumb();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncThumb]);

  const onScroll = () => {
    syncThumb();
  };

  /* ============== CÁLCULO PRA CLIQUE / DRAG NA BARRA ============== */
  const calcScrollFromClientX = useCallback(
    (clientX) => {
      const sc = scRef.current;
      const track = trackRef.current;
      if (!sc || !track) return { left: 0 };

      const rect = track.getBoundingClientRect();
      const thumbPx = (thumb.widthPct / 100) * rect.width;
      const usable = rect.width - thumbPx;

      let x = clientX - rect.left - thumbPx / 2;
      x = Math.max(0, Math.min(usable, x));

      const ratio = usable > 0 ? x / usable : 0;

      const total = sc.scrollWidth;
      const vis = sc.clientWidth;
      const maxScroll = Math.max(0, total - vis);

      return { left: ratio * maxScroll };
    },
    [thumb.widthPct]
  );

  const setScrollFromClientX = useCallback(
    (clientX) => {
      const sc = scRef.current;
      if (!sc) return;
      const { left } = calcScrollFromClientX(clientX);
      sc.scrollLeft = left;
      syncThumb();
    },
    [calcScrollFromClientX, syncThumb]
  );

  /* ================== EVENTOS DE DRAG (MOUSE) ================== */
  const onTrackMouseDown = (e) => {
    dragging.current = true;
    document.body.style.userSelect = "none";
    setScrollFromClientX(e.clientX);
  };

  const onMouseMoveWin = useCallback(
    (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      setScrollFromClientX(e.clientX);
    },
    [setScrollFromClientX]
  );

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoveWin);
    window.addEventListener("mouseup", endDrag);
    return () => {
      window.removeEventListener("mousemove", onMouseMoveWin);
      window.removeEventListener("mouseup", endDrag);
    };
  }, [onMouseMoveWin, endDrag]);

  /* ================== EVENTOS TOUCH (MOBILE) ================== */
  const onTrackTouchStart = (e) => {
    dragging.current = true;
    const t = e.touches?.[0];
    if (!t) return;
    setScrollFromClientX(t.clientX);
  };

  const onTouchMoveWin = useCallback(
    (e) => {
      if (!dragging.current) return;
      const t = e.touches?.[0];
      if (!t) return;
      setScrollFromClientX(t.clientX);
    },
    [setScrollFromClientX]
  );

  const endDragTouch = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("touchmove", onTouchMoveWin, { passive: false });
    window.addEventListener("touchend", endDragTouch);
    window.addEventListener("touchcancel", endDragTouch);

    return () => {
      window.removeEventListener("touchmove", onTouchMoveWin);
      window.removeEventListener("touchend", endDragTouch);
      window.removeEventListener("touchcancel", endDragTouch);
    };
  }, [onTouchMoveWin, endDragTouch]);

  return (
    <section className="w-full select-none">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* Título */}
        <h3 className="text-center text-[24px] font-semibold text-[#1E1E1E] dark:text-white mb-1">
          Reservas Confirmadas
        </h3>
        <div
          className="mx-auto mt-2 h-[3px] w-32 rounded-full"
          style={{ backgroundColor: COR }}
        />

        {/* CARDS (ROLAGEM HORIZONTAL) */}
        <div
          ref={scRef}
          onScroll={onScroll}
          className="mt-8 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2
                     [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reservas.length > 0 ? (
            reservas.map((r) => (
              <div
                key={r.id}
                className="snap-start shrink-0 min-w-[360px] sm:min-w-[420px]"
              >
                <ReservaCard
                  img={
                    r.catalogoNome?.toLowerCase().includes("impressora")
                      ? ImgImpressora3D
                      : ImgComputadores
                  }
                  titulo={r.catalogoNome || "Reserva"}
                  horarioInicio={r.horaInicio || "Indisponível"}
                  horarioFim={r.horaFim || "Indisponível"}
                  data={r.data || ""}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full">
              Nenhuma reserva confirmada encontrada.
            </div>
          )}
        </div>

        {/* BARRA VERMELHA DE NAVEGAÇÃO (EMBAIXO DAS SALAS) */}
        {reservas.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div
              ref={trackRef}
              className="relative w-[260px] h-[6px] rounded-full bg-[#E5E5E5] cursor-pointer"
              onMouseDown={onTrackMouseDown}
              onTouchStart={onTrackTouchStart}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 h-[6px] rounded-full shadow-sm"
                style={{
                  left: `${thumb.leftPct}%`,
                  width: `${thumb.widthPct}%`,
                  backgroundColor: COR,
                  cursor: "grab",
                  transition: dragging.current
                    ? "none"
                    : "left .25s ease-out, width .25s ease-out",
                }}
              />
            </div>
          </div>
        )}

        {/* FRASE ENTRE AS SALAS E O BOTÃO */}
        <p className="mt-6 text-center text-[14px] sm:text-[15px] text-[#1E1E1E] dark:text-gray-300">
          Acompanhe o status das reservas em tempo real e mantenha a agenda
          atualizada.
        </p>

        {/* BOTÃO */}
        <div className="mt-6 flex justify-center">
          <Link to="/reserva-pendente">
            <button
              className="px-6 py-3 rounded-md text-white font-semibold shadow-sm hover:brightness-95 active:scale-[.99] transition"
              style={{ backgroundColor: COR }}
            >
              Reservas Pendentes
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
