import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COR } from "./FuncoesHome";

import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

function ReservaCard({ img, titulo, periodo, horario, data }) {
  return (
    <div className="rounded-[12px] bg-white dark:bg-[#151515] border border-black/10 dark:border-white/10 shadow-sm p-4">
      <div className="rounded-[10px] overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <img src={img} alt={titulo} className="w-full h-[160px] object-cover" />
      </div>
      <div className="mt-3 flex justify-center">
        <span className="inline-block px-4 py-1 rounded-md text-white text-sm font-semibold" style={{ backgroundColor: COR }}>
          {titulo}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-[13px] text-[#1E1E1E] dark:text-gray-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-[6px] h-[6px] rounded-full" style={{ backgroundColor: COR }} />
          <span>Período: {periodo}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-[6px] h-[6px] rounded-full" style={{ backgroundColor: COR }} />
          <span>Horário: {horario}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-[13px] text-[#1E1E1E] dark:text-gray-300">
        <span className="inline-block w-[6px] h-[6px] rounded-full" style={{ backgroundColor: COR }} />
        <span>Data: {data}</span>
      </div>
    </div>
  );
}

const BASE = [
  { id: 1, img: ImgImpressora3D, titulo: "Impressoras 3D", periodo: "Tarde", horario: "14:05", data: "12/01" },
  { id: 2, img: ImgComputadores,  titulo: "Computadores",   periodo: "Manhã", horario: "09:30", data: "12/01" },
];
const RESERVAS = [
  ...BASE,
  ...BASE.map((x) => ({ ...x, id: x.id + 2 })),
  ...BASE.map((x) => ({ ...x, id: x.id + 4 })),
];

export default function ReservasConfirmadas() {
  const scRef = useRef(null);
  const trackRef = useRef(null);

  const [thumb, setThumb] = useState({ leftPct: 0, widthPct: 20 });
  const [drag, setDrag] = useState(false);

  // ===== Thumb sync por rAF =====
  const ticking = useRef(false);
  const syncThumb = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const sc = scRef.current;
      const track = trackRef.current;
      if (sc && track) {
        const total = sc.scrollWidth;
        const vis = sc.clientWidth;
        const maxScroll = Math.max(1, total - vis);
        const widthPct = Math.max(10, Math.min(50, (vis / total) * 100 || 100));
        const ratio = sc.scrollLeft / maxScroll;
        const leftPct = ratio * (100 - widthPct);
        setThumb({ leftPct, widthPct });
      }
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    syncThumb();
    const onResize = () => syncThumb();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncThumb]);

  const onScroll = useCallback(() => syncThumb(), [syncThumb]);

  // ===== Easing (clique e momentum) =====
  const bezier = (p1x, p1y, p2x, p2y) => {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleY = (t) => ((ay * t + by) * t + cy) * t;
    const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    const solveT = (x) => {
      let t = x;
      for (let i = 0; i < 5; i++) {
        const dx = sampleX(t) - x;
        const d = sampleDX(t);
        if (Math.abs(dx) < 1e-4 || d === 0) break;
        t -= dx / d;
      }
      return t;
    };
    return (x) => sampleY(solveT(x));
  };
  const ease = useRef(bezier(0.22, 0.61, 0.36, 1)).current;

  const smoothScrollTo = (targetLeft, dur = 900) => {
    const sc = scRef.current;
    if (!sc) return;
    const start = sc.scrollLeft;
    const dist = targetLeft - start;

    let t0;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / dur);
      sc.scrollLeft = start + dist * ease(p);
      syncThumb();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ===== Momentum (inércia ao soltar) =====
  const lastPos = useRef({ x: 0, t: 0 });
  const velocity = useRef(0);

  const updateVelocity = (clientX) => {
    const now = performance.now();
    const dx = clientX - lastPos.current.x;
    const dt = Math.max(1, now - lastPos.current.t); // ms
    velocity.current = dx / dt; // px/ms (positivo → direita)
    lastPos.current = { x: clientX, t: now };
  };

  const projectWithFriction = () => {
    const sc = scRef.current;
    if (!sc) return;

    // transforma velocidade do dedo em velocidade de scroll (inverso)
    let v = -velocity.current * 1000; // px/s
    const friction = 4000;            // desaceleração px/s² (maior = freia mais rápido)
    const dt = 1 / 60;

    // limites
    const min = 0;
    const max = sc.scrollWidth - sc.clientWidth;

    let pos = sc.scrollLeft;

    const loop = () => {
      // update pos com inércia
      pos += v * dt;

      // atrito
      if (v > 0) {
        v = Math.max(0, v - friction * dt);
      } else if (v < 0) {
        v = Math.min(0, v + friction * dt);
      }

      // clamp + “quique” leve nos extremos
      if (pos < min) {
        pos = min;
        v = 0;
      } else if (pos > max) {
        pos = max;
        v = 0;
      }

      sc.scrollLeft = pos;
      syncThumb();

      if (Math.abs(v) > 5) {
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  };

  // ===== Helpers =====
  const calcScrollFromX = useCallback((clientX) => {
    const sc = scRef.current;
    const track = trackRef.current;
    if (!sc || !track) return { left: sc?.scrollLeft || 0 };

    const rect = track.getBoundingClientRect();
    const thumbPx = (thumb.widthPct / 100) * rect.width;
    const usable = rect.width - thumbPx;

    const x = Math.max(0, Math.min(usable, clientX - rect.left - thumbPx / 2));
    const ratio = usable > 0 ? x / usable : 0;

    const total = sc.scrollWidth;
    const vis = sc.clientWidth;
    const maxScroll = Math.max(1, total - vis);

    return { left: ratio * maxScroll };
  }, [thumb.widthPct]);

  const setScrollFromClientX = useCallback((clientX, { smooth = false } = {}) => {
    const sc = scRef.current;
    if (!sc) return;
    const { left } = calcScrollFromX(clientX);
    if (smooth) smoothScrollTo(left, 900);
    else {
      sc.scrollLeft = left;
      syncThumb();
    }
  }, [calcScrollFromX, syncThumb]);

  // ===== Mouse/touch (com velocity tracking) =====
  const onTrackMouseDown = useCallback((e) => {
    e.preventDefault();
    setDrag(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    lastPos.current = { x: e.clientX, t: performance.now() };
    velocity.current = 0;
    setScrollFromClientX(e.clientX);
  }, [setScrollFromClientX]);

  const onMouseMoveWin = useCallback((e) => {
    if (!drag) return;
    updateVelocity(e.clientX);
    setScrollFromClientX(e.clientX);
  }, [drag, setScrollFromClientX]);

  const endDrag = useCallback(() => {
    setDrag(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    projectWithFriction(); // inércia
  }, []);

  useEffect(() => {
    if (!drag) return;
    window.addEventListener("mousemove", onMouseMoveWin);
    window.addEventListener("mouseup", endDrag);
    return () => {
      window.removeEventListener("mousemove", onMouseMoveWin);
      window.removeEventListener("mouseup", endDrag);
    };
  }, [drag, onMouseMoveWin, endDrag]);

  const onTrackTouchStart = useCallback((e) => {
    setDrag(true);
    document.body.style.userSelect = "none";
    const t = e.touches?.[0];
    if (!t) return;
    lastPos.current = { x: t.clientX, t: performance.now() };
    velocity.current = 0;
    setScrollFromClientX(t.clientX);
  }, [setScrollFromClientX]);

  const onTouchMoveWin = useCallback((e) => {
    if (!drag) return;
    e.preventDefault();
    const t = e.touches?.[0];
    if (!t) return;
    updateVelocity(t.clientX);
    setScrollFromClientX(t.clientX);
  }, [drag, setScrollFromClientX]);

  const endDragTouch = useCallback(() => {
    setDrag(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    projectWithFriction();
  }, []);

  useEffect(() => {
    if (!drag) return;
    window.addEventListener("touchmove", onTouchMoveWin, { passive: false });
    window.addEventListener("touchend", endDragTouch);
    window.addEventListener("touchcancel", endDragTouch);
    return () => {
      window.removeEventListener("touchmove", onTouchMoveWin);
      window.removeEventListener("touchend", endDragTouch);
      window.removeEventListener("touchcancel", endDragTouch);
    };
  }, [drag, onTouchMoveWin, endDragTouch]);

  const onTrackClick = useCallback((e) => {
    if (drag) return;
    setScrollFromClientX(e.clientX, { smooth: true });
  }, [drag, setScrollFromClientX]);

  return (
    <section className="w-full select-none">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-6">
        <h3 className="text-center text-[20px] sm:text-[22px] font-semibold text-[#1E1E1E] dark:text-white">
          Reservas Confirmadas
        </h3>
        <div className="mx-auto mt-2 h-[3px] w-32 rounded-full" style={{ backgroundColor: COR }} />

        <div
          ref={scRef}
          onScroll={onScroll}
          className="mt-6 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2
                     [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {RESERVAS.map((r) => (
            <div key={r.id} className="snap-start shrink-0 min-w-[360px] sm:min-w-[420px]">
              <ReservaCard {...r} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <div
            ref={trackRef}
            className={`relative w-[420px] max-w-[75vw] h-[6px] rounded-full cursor-grab ${drag ? "cursor-grabbing" : ""}`}
            style={{ backgroundColor: "rgba(0,0,0,0.12)" }}
            onMouseDown={onTrackMouseDown}
            onTouchStart={onTrackTouchStart}
            onClick={onTrackClick}
            aria-label="Navegação das reservas confirmadas"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(thumb.leftPct)}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[10px] rounded-full"
              style={{
                left: `${thumb.leftPct}%`,
                width: `${thumb.widthPct}%`,
                backgroundColor: COR,
                boxShadow: "0 1px 2px rgba(0,0,0,.15)",
                transition: drag
                  ? "none"
                  : "left .7s cubic-bezier(0.22,0.61,0.36,1), width .7s cubic-bezier(0.22,0.61,0.36,1)",
                willChange: "left, width",
              }}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-[14px] sm:text-[15px] text-[#1E1E1E] dark:text-gray-300">
          Acompanhe o status das reservas em tempo real e mantenha a agenda atualizada.
        </p>

        <div className="mt-6 flex justify-center">
          <Link to="/reservas-pendentes">
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
