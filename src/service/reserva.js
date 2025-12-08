// src/service/reserva.js
import { api } from "./api";

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
  if (H > 20 || (H === 20 && M > 59) || H >= 21) return "20:59";
  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
};

export async function salvarReservaFormatoBack(p) {
  const catalogoIdRaw = p.catalogoId ?? p.idCatalogo;
  const catalogoId = catalogoIdRaw != null ? Number(catalogoIdRaw) : null;
  if (!catalogoId) throw new Error("Catálogo (catalogoId) obrigatório.");
  const inicioHHMM = p.horaInicioHHMM;
  if (!inicioHHMM) throw new Error("horaInicioHHMM obrigatório.");
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
  const { data } = await api.post("/reserva/salvar", payload);
  return data;
}

export async function buscarReservasAprovadas() {
  try {
    const { data } = await api.get("/reserva/buscar");
    const lista = Array.isArray(data) ? data : [];
    return lista.filter((r) => {
      const st = String(r.statusReserva || "").toUpperCase();
      return st.includes("APROV") || st.includes("CONF");
    });
  } catch (e) {
    console.error("[buscarReservasAprovadas] Erro:", e);
    return [];
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (api?.defaults?.baseURL ?? "https://espacosenai.azurewebsites.net");

const buildUrl = (path) => {
  const base = String(API_BASE_URL || "").replace(/\/$/, "");
  return `${base}${path}`;
};

export async function buscarMinhasReservas() {
  const token = localStorage.getItem("access_token") || "";
  const url = buildUrl("/reserva/minhas-reservas");
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!resp.ok) return [];
    const json = await resp.json().catch(() => null);
    if (!json) return [];
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.conteudo)) return json.conteudo;
    return [];
  } catch (e) {
    console.error("[buscarMinhasReservas] Erro:", e);
    return [];
  }
}

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
      `Falha ao cancelar reserva (${resp.status})${
        text ? " - " + text : ""
      }`
    );
  }
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

export async function buscarReservasPendentes() {
  try {
    const { data } = await api.get("/reserva/buscar");
    const lista = Array.isArray(data) ? data : [];
    return lista.filter((r) => {
      const st = String(r.statusReserva || "").toUpperCase();
      return st.includes("PEND");
    });
  } catch (e) {
    console.error("[buscarReservasPendentes] Erro:", e);
    return [];
  }
}

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
      `Falha ao aprovar reserva (${resp.status})${
        text ? " - " + text : ""
      }`
    );
  }
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

// ✅ Nova função: busca todas as reservas, independente do status
export async function buscarTodasReservas() {
  try {
    const { data } = await api.get("/reserva/buscar");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("[buscarTodasReservas] Erro:", e);
    return [];
  }
}
