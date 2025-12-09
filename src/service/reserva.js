// src/service/reserva.js
import { api } from "./api";

/* ===========================
   HELPERS DE FORMATAÇÃO
=========================== */

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

  // trava 20:59 igual você fez
  if (H > 20 || (H === 20 && M > 59) || H >= 21) {
    return "20:59";
  }

  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
};

/* ===========================
   SALVAR RESERVA
=========================== */

export async function salvarReservaFormatoBack(p) {
  const catalogoIdRaw = p.catalogoId ?? p.idCatalogo;
  const catalogoId = catalogoIdRaw != null ? Number(catalogoIdRaw) : null;

  if (!catalogoId) {
    throw new Error("Catálogo (catalogoId) obrigatório.");
  }

  const inicioHHMM = p.horaInicioHHMM;
  if (!inicioHHMM) {
    throw new Error("horaInicioHHMM obrigatório.");
  }

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

  const { data } = await api.post("/reserva/salvar", payload);
  return data;
}

/* ===========================
   BUSCAS GERAIS
=========================== */

export async function buscarReservasAprovadas() {
  const { data } = await api.get("/reserva/buscar");
  // /reserva/buscar já retorna uma lista de ReservaReferenciaDTO
  return data ?? [];
}

/* ===========================
   MINHAS RESERVAS (PARA LEMBRETES)
   GET /reserva/minhas-reservas
=========================== */

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

  console.log("[buscarMinhasReservas] chamando:", url);

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error(
        "[buscarMinhasReservas] Falha:",
        resp.status,
        text || "<sem corpo>"
      );
      return [];
    }

    const json = await resp.json().catch(() => null);
    console.log("[buscarMinhasReservas] resposta bruta:", json);

    if (!json) return [];

    // /minhas-reservas retorna diretamente a lista
    if (Array.isArray(json)) return json;

    // fallback pra caso algum dia envolva wrapper
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.conteudo)) return json.conteudo;

    return [];
  } catch (e) {
    console.error("[buscarMinhasReservas] Erro:", e);
    return [];
  }
}

/* ===========================
   CANCELAR / APROVAR / PENDENTES
=========================== */

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
      `Falha ao cancelar reserva (${resp.status})${text ? " - " + text : ""
      }`
    );
  }

  try {
    return await resp.json();
  } catch {
    return null;
  }
}

// Exclui definitivamente a reserva no backend
export async function deletarReserva(id) {
  const token = localStorage.getItem("access_token") || "";
  const url = buildUrl(`/reserva/deletar/${id}`);

  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Backend pode responder 204 No Content; trata como sucesso
  if (!resp.ok && resp.status !== 204) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `Falha ao deletar reserva (${resp.status})${text ? " - " + text : ""}`
    );
  }

  return null;
}

/**
 * Busca reservas com status PENDENTE usando o endpoint do back:
 * GET /reserva/buscar-por-status/{status}
 */
export async function buscarReservasPendentes() {
  const token = localStorage.getItem("access_token") || "";
  const STATUS_PENDENTE = "PENDENTE";

  const url = buildUrl(`/reserva/buscar-por-status/${STATUS_PENDENTE}`);

  console.log("[buscarReservasPendentes] URL chamada:", url);

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!resp.ok) {
    // 404 significa que não há reservas pendentes - retorna array vazio
    if (resp.status === 404) {
      console.log("[buscarReservasPendentes] Nenhuma reserva pendente (404)");
      return [];
    }

    const text = await resp.text().catch(() => "");
    console.error(
      "[buscarReservasPendentes] Falha:",
      resp.status,
      text || "<sem corpo>"
    );
    throw new Error(
      `Falha ao buscar reservas pendentes (${resp.status})${text ? " - " + text : ""
      }`
    );
  }

  try {
    const json = await resp.json();
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.conteudo)) return json.conteudo;
    return [];
  } catch (e) {
    console.error("[buscarReservasPendentes] Erro ao parsear JSON:", e);
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
      `Falha ao aprovar reserva (${resp.status})${text ? " - " + text : ""
      }`
    );
  }

  try {
    return await resp.json();
  } catch {
    return null;
  }
}
