import React, { useEffect, useState, useMemo } from "react";
import { buscarCatalogosPorAmbiente } from "../../service/catalogo";
import { api } from "../../service/api";

export default function SeletorCatalogo({ ambienteId, diaSemana, onSelect, selectedCatalogo, mode = "cards" }) {
  const [catalogos, setCatalogos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ambienteId) return;

    const fetchCatalogos = async () => {
      setLoading(true);
      try {
        // Primeiro tenta o endpoint específico por ambiente
        let data = await buscarCatalogosPorAmbiente(ambienteId);

        // Se não veio resultado, faz fallback para buscar todos e filtrar localmente
        if (!Array.isArray(data) || data.length === 0) {
          try {
            const resp = await api.get("/catalogo/buscar");
            const all = Array.isArray(resp?.data) ? resp.data : resp;
            data = Array.isArray(all)
              ? all.filter((item) => {
                  const ambienteIdItem =
                    item?.ambiente?.id ?? item?.ambienteId ?? item?.idAmbiente ?? null;
                  return ambienteIdItem === ambienteId;
                })
              : [];
          } catch (err) {
            console.warn("Fallback: erro ao buscar todos os catálogos:", err);
            data = [];
          }
        }

        setCatalogos(data);
      } catch (error) {
        console.error("Erro ao buscar catálogos:", error);
        setCatalogos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogos();
  }, [ambienteId]);

  const handleChange = (e) => {
    const id = e.target.value;
    const catalogo = catalogos.find((c) => c.id == id);
    onSelect(catalogo ? normalizeForOutput(catalogo) : null);
  };

  const handleSelectCard = (catalogo) => {
    if (!catalogo) {
      onSelect(null);
      return;
    }
    // Toggle selection
    if (String(selectedCatalogo?.id) === String(catalogo.id)) {
      onSelect(null);
    } else {
      onSelect(normalizeForOutput(catalogo));
    }
  };

  const normalizeForOutput = (c) => {
    if (!c) return null;
    const diaSemana = String(c?.dia || c?.diaSemana || c?.dia_semana || "").trim().toUpperCase();
    const horaInicio = (c.horaInicio || c.horaInicioHHMM || c.hora_inicio || "").toString().slice(0,5);
    const horaFim = (c.horaFim || c.horaFimHHMM || c.hora_fim || "").toString().slice(0,5);
    const disponibilidade = (c.status || c.disponibilidade || (c.isDisponivel === true ? "DISPONIVEL" : "INDISPONIVEL") || "").toString().toUpperCase();
    // Verifica INDISP primeiro para evitar colisão com substring 'DISPON' em 'INDISPONIVEL'
    const isDisponivel = disponibilidade.includes("INDISP") ? false : disponibilidade.includes("DISPON");
    return {
      id: c.id,
      diaSemana,
      horaInicio,
      horaFim,
      disponibilidade,
      isDisponivel,
      descricao: c.descricao || c.obs || c.observacao || "",
    };
  };

  const normalizeDia = (c) => String(c?.dia || c?.diaSemana || c?.dia_semana || "").trim().toUpperCase();

  const filteredCatalogos = useMemo(() => {
    const list = Array.isArray(catalogos) ? catalogos.slice() : [];
    // normalize and filter by diaSemana when provided
    if (diaSemana) {
      const wanted = String(diaSemana || "").trim().toUpperCase();
      const filtered = list.filter((c) => normalizeDia(c) === wanted);
      // sort by horaInicio
      filtered.sort((a, b) => {
        const ai = (a.horaInicio || a.horaInicioHHMM || a.hora_inicio || "").slice(0,5);
        const bi = (b.horaInicio || b.horaInicioHHMM || b.hora_inicio || "").slice(0,5);
        return ai.localeCompare(bi);
      });
      return filtered;
    }
    // if no diaSemana, return all sorted
    list.sort((a, b) => {
      const ai = (a.horaInicio || a.horaInicioHHMM || a.hora_inicio || "").slice(0,5);
      const bi = (b.horaInicio || b.horaInicioHHMM || b.hora_inicio || "").slice(0,5);
      return ai.localeCompare(bi);
    });
    return list;
  }, [catalogos, diaSemana]);

  const cardsContent = (() => {
    if (!ambienteId) return <div className="col-span-full text-sm text-gray-500 dark:text-gray-400">Selecione o ambiente primeiro</div>;
    if (loading) return (
      <div className="col-span-full flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <svg className="w-4 h-4 animate-spin text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        Carregando catálogos...
      </div>
    );
    if (catalogos.length === 0) return <div className="col-span-full text-sm text-red-600 dark:text-red-400">Nenhum catálogo encontrado para este dia.</div>;

    return filteredCatalogos.map((catalogo) => {
      const norm = normalizeForOutput(catalogo);
      const id = norm.id;
      const dia = norm.diaSemana || "";
      const horaInicio = (norm.horaInicio || "").slice(0,5);
      const horaFim = (norm.horaFim || "").slice(0,5);
      const status = (norm.disponibilidade || "").toString().toUpperCase();
      const isSelected = String(selectedCatalogo?.id) === String(id);
      const borderColor = isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 dark:border-gray-700";
      const isAvail = !!norm.isDisponivel;
      // cheque INDISP antes de DISPON para diferenciar corretamente
      const statusColor = status.includes("INDISP")
        ? "bg-red-600"
        : status.includes("DISPON")
        ? "bg-emerald-500"
        : status.includes("MANUT")
        ? "bg-yellow-500"
        : "bg-gray-400";
      const nameColor = isAvail ? "text-gray-800 dark:text-gray-100" : "text-red-600 dark:text-red-400";
      const disabledClass = !isAvail ? "opacity-60 cursor-not-allowed" : "hover:shadow-sm";
      return (
        <button
          key={id}
          type="button"
          onClick={() => isAvail && handleSelectCard(catalogo)}
          disabled={!isAvail}
          className={`text-left p-3 rounded-md border ${borderColor} ${disabledClass} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300`}
        >
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${nameColor}`}>{dia}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{horaInicio} - {horaFim}</div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-600 dark:text-gray-300">{norm.descricao || ""}</div>
            <span className={`${statusColor} text-white text-xs px-2 py-0.5 rounded-full`}>{status || "N/A"}</span>
          </div>
        </button>
      );
    });
  })();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="catalogo-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Selecione o Catálogo
        </label>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Carregando...
            </span>
          ) : (
            <span>{filteredCatalogos.length} catálogo{filteredCatalogos.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      <div className="relative">
        {mode === "dropdown" ? (
          <>
            <select
              id="catalogo-select"
              value={selectedCatalogo?.id || ""}
              onChange={handleChange}
              disabled={!ambienteId || loading}
              className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">{!ambienteId ? "Selecione o ambiente primeiro" : loading ? "Carregando..." : "Selecione um catálogo"}</option>
              {filteredCatalogos.map((catalogo) => {
                  const norm = normalizeForOutput(catalogo);
                  const dia = norm.diaSemana || "";
                  const horaInicio = (norm.horaInicio || "").slice(0,5);
                  const horaFim = (norm.horaFim || "").slice(0,5);
                  const status = (norm.disponibilidade || "").toString();
                  const label = `${dia} - ${horaInicio} às ${horaFim}${status ? ` (${status})` : ""}`;
                  return (
                    <option key={catalogo.id} value={catalogo.id} disabled={!norm.isDisponivel}>
                      {label}
                    </option>
                  );
                })}
            </select>

            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </span>
          </>
        ) : (
          // Cards mode: visual selectable tiles
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cardsContent}
          </div>
        )}
      </div>

      {/* Informação resumida do catálogo selecionado */}
      {selectedCatalogo ? (
        <div className="mt-2 flex items-start gap-3">
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
            <div className="font-medium">{(selectedCatalogo.dia || selectedCatalogo.diaSemana || "").toString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{(selectedCatalogo.horaInicio || selectedCatalogo.horaInicioHHMM || "").toString().slice(0,5)} às {(selectedCatalogo.horaFim || selectedCatalogo.horaFimHHMM || "").toString().slice(0,5)}</div>
          </div>
          <div className="shrink-0">
            {(() => {
              const status = (selectedCatalogo.status || selectedCatalogo.disponibilidade || "").toString().toUpperCase();
              const color = selectedCatalogo.isDisponivel ? "bg-emerald-500" : "bg-red-600";
              return (
                <span className={`${color} text-white text-xs px-2 py-1 rounded-full`}>{status || (selectedCatalogo.isDisponivel ? "DISPONÍVEL" : "INDISPONÍVEL")}</span>
              );
            })()}
          </div>
        </div>
      ) : (
        ambienteId && !loading && filteredCatalogos.length === 0 ? (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">Nenhum catálogo encontrado para este dia.</div>
        ) : null
      )}
    </div>
  );
}