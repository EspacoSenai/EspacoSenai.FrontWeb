const removeDiacritics = (valor) =>
  String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const normalizarTexto = (valor) => removeDiacritics(valor);

export const normalizarChave = (valor) => normalizarTexto(valor).replace(/\s+/g, "");

const ALIAS_BASE = {
  computadores: [
    "computadores",
    "laboratorio computadores",
    "laboratorio de informatica",
    "laboratorio pc",
    "pc",
    "pc1",
    "pc2",
    "pc3",
    "pc4",
    "pc5",
    "computador",
  ],
  quadra: ["quadra", "quadra externa", "quadra esportiva"],
  ps5: ["ps5", "playstation", "playstation 5", "console ps5"],
  impressoras3d: [
    "impressora",
    "impressoras",
    "impressora 3d",
    "impressoras 3d",
    "impressora3d1",
    "impressora3d2",
    "impressora3d3",
  ],
  auditorio: ["auditorio", "auditorium"],
};

export const ALIAS_AMBIENTES = Object.fromEntries(
  Object.entries(ALIAS_BASE).map(([chave, lista]) => [
    normalizarChave(chave),
    Array.from(new Set(lista.map((item) => normalizarChave(item)))),
  ])
);

const camposComparacao = (amb) => [
  amb?.nome,
  amb?.nomeAmbiente,
  amb?.apelido,
  amb?.descricao,
  amb?.descricaoCurta,
  amb?.tipo,
  amb?.tipoAmbiente,
];

export function encontrarAmbientePorChave(lista, chaveNormalizada) {
  if (!Array.isArray(lista) || !chaveNormalizada) return null;
  const chave = normalizarChave(chaveNormalizada);

  const direto = lista.find((amb) =>
    camposComparacao(amb).some((campo) => normalizarChave(campo) === chave)
  );
  if (direto) return direto;

  const aliasLista = ALIAS_AMBIENTES[chave];
  if (aliasLista?.length) {
    const viaAlias = lista.find((amb) =>
      camposComparacao(amb).some((campo) => {
        const campoNorm = normalizarChave(campo);
        return aliasLista.some(
          (alias) => campoNorm.includes(alias) || alias.includes(campoNorm)
        );
      })
    );
    if (viaAlias) return viaAlias;
  }

  return (
    lista.find((amb) =>
      camposComparacao(amb).some((campo) =>
        normalizarChave(campo || "").includes(chave)
      )
    ) || null
  );
}

export function encontrarAmbientePorId(lista, id) {
  if (!Array.isArray(lista) || id == null) return null;
  const alvo = Number(id);
  if (!Number.isFinite(alvo)) return null;
  return lista.find((amb) => Number(amb?.id) === alvo) || null;
}

export function ehAmbienteComputador(nome) {
  const chave = normalizarChave(nome);
  if (!chave) return false;

  const apelidosComputador = ALIAS_AMBIENTES?.computadores || [];
  if (apelidosComputador.includes(chave)) return true;

  return (
    chave.startsWith("pc") ||
    chave.includes("computador") ||
    chave.includes("laboratoriopc") ||
    chave.includes("laboratoriocomputadores")
  );
}

export function filtrarAmbientesComputador(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.filter((amb) =>
    ehAmbienteComputador(
      amb?.nome || amb?.nomeAmbiente || amb?.apelido || amb?.descricao
    )
  );
}
