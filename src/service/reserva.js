// src/service/reserva.js
import { api } from "./api";

/* ===== Helpers de data/hora ===== */

const toLocalYMD = (dateLike) => {
  const d = new Date(dateLike);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const toHHMMSS = (hhmm) => {
  const [h, m] = String(hhmm || "")
    .split(":")
    .map((n) => parseInt(n || 0, 10));
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
};

const addMinutesHHMM = (hhmm, minutes) => {
  const [h, m] = String(hhmm || "")
    .split(":")
    .map((n) => parseInt(n || 0, 10));

  const base = new Date(2000, 0, 1, h, m || 0, 0, 0);
  base.setMinutes(base.getMinutes() + minutes);

  const H = base.getHours();
  const M = base.getMinutes();

  // trava em 20:59 para não estourar regra do back
  if (H > 20 || (H === 20 && M > 59) || H >= 21) {
    return "20:59";
  }

  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
};

/* ===== Salvar reserva (usado no agendamento) ===== */

export async function salvarReservaFormatoBack(p) {
  // catálogo: pode vir como catalogoId ou idCatalogo
  const catalogoIdRaw = p.catalogoId ?? p.idCatalogo;
  const catalogoId = catalogoIdRaw != null ? Number(catalogoIdRaw) : null;

  if (!catalogoId) {
    throw new Error("Catálogo (catalogoId) obrigatório.");
  }

  // hora de início em HH:mm (ex: "13:30")
  const inicioHHMM = p.horaInicioHHMM;
  if (!inicioHHMM) {
    throw new Error("horaInicioHHMM obrigatório.");
  }

  // se não vier horaFim, soma 30 minutos em cima do início
  const fimHHMM =
    p.horaFimHHMM && p.horaFimHHMM.trim()
      ? p.horaFimHHMM
      : addMinutesHHMM(inicioHHMM, 30);

  const payload = {
    catalogoId,
    data: toLocalYMD(p.dataJS),
    horaInicio: toHHMMSS(inicioHHMM),
    horaFim: toHHMMSS(fimHHMM),
    msgUsuario: p.msgUsuario ?? "",
    msgInterna: p.msgInterna ?? "",
  };

  console.log("[salvarReservaFormatoBack] payload enviado:", payload);

  // no seu api, o .post já retorna data direto
  const data = await api.post("/reserva/salvar", payload);
  return data;
}

/* ===== Reservas aprovadas (Home Coordenador) ===== */

export async function buscarReservasAprovadas() {
  // Se o endpoint do back for outro (ex: /reserva/buscar-aprovadas),
  // é só trocar aqui:
  const data = await api.get("/reserva/buscar");
  return data ?? [];
}

/* ===== config base para chamadas com fetch (cancelar/aprovar/pendentes) ===== */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (api?.defaults?.baseURL ?? "https://espacosenai.azurewebsites.net");

const buildUrl = (path) => {
  const base = String(API_BASE_URL || "").replace(/\/$/, "");
  return `${base}${path}`;
};

/* ===== Cancelar reserva ===== */

export async function cancelarReserva(id, motivo = "") {
  const token = localStorage.getItem("access_token") || "";
  const url = buildUrl(`/reserva/cancelar/${id}`);

  const resp = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      motivo: motivo || "Cancelada pelo coordenador na Home.",
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `Falha ao cancelar reserva (${resp.status})${text ? " - " + text : ""}`
    );
  }

  try {
    return await resp.json();
  } catch {
    return null;
  }
}

/* ===== Reservas pendentes (tela Reservas Pendentes) ===== */

export async function buscarReservasPendentes() {
  const token = localStorage.getItem("access_token") || "";
  const url = buildUrl("/reserva/pendentes");

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `Falha ao buscar reservas pendentes (${resp.status})${
        text ? " - " + text : ""
      }`
    );
  }

  try {
    const json = await resp.json();
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.conteudo)) return json.conteudo;
    return [];
  } catch {
    return [];
  }
}

/* ===== Aprovar reserva ===== */

export async function aprovarReserva(id) {
  const token = localStorage.getItem("access_token") || "";
  const url = buildUrl(`/reserva/aprovar/${id}`);

  const resp = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `Falha ao aprovar reserva (${resp.status})${text ? " - " + text : ""}`
    );
  }

  try {
    return await resp.json();
  } catch {
    return null;
  }
}
