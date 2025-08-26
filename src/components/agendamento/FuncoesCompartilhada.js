export const COR_VERMELHO = "#AE0000";
export const TAMANHO_CODIGO = 5;
export const MAX_CONVIDADOS = 9;


export const HORARIOS_INICIO_QUADRA = ["11:50", "13:30", "14:30", "15:30", "16:00", "16:50"];
export const HORARIOS_TERMINO_QUADRA = ["14:50", "13:00", "16:00", "16:30", "17:00", "17:30"];


export function juntarClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}


export function pegarSegundaFeira(dataAtual = new Date()) {
  const data = new Date(dataAtual);
  const diaSemana = data.getDay();
  const diferenca = (diaSemana === 0 ? -6 : 1) - diaSemana;
  data.setDate(data.getDate() + diferenca);
  data.setHours(0, 0, 0, 0);
  return data;
}

export function montarDiasSemana(semanaAdiante = 0) {
  const segunda = pegarSegundaFeira();
  segunda.setDate(segunda.getDate() + semanaAdiante * 7);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasSemana = ["S", "T", "Q", "Q", "S", "S"]; // seg..sáb
  return [...Array(6)].map((_, i) => {
    const d = new Date(segunda);
    d.setDate(segunda.getDate() + i);
    const desabilitado = semanaAdiante === 0 ? d < hoje : false;
    return {
      diaSemana: diasSemana[i],
      numeroDia: String(d.getDate()).padStart(2, "0"),
      dataCompleta: d,
      desabilitado,
    };
  });
}


export function paraMinutos(hhmm) {
  const [h, m] = String(hhmm || "").split(":").map(Number);
  return h * 60 + m;
}

export function validaIntervalo(inicio, termino) {
  if (!inicio || !termino) return false;
  return paraMinutos(termino) > paraMinutos(inicio);
}

export function normalizaCodigoChar(v) {
  return String(v).slice(-1).replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}


export function montarPayload({ recurso, semanaSelecionada, dia, inicio, termino, codigos }) {
  return {
    local: recurso,
    semana: semanaSelecionada === "essa" ? "Essa semana" : "Próxima semana",
    data: dia.toISOString(),
    inicio,
    termino,
    codigosConvidados: codigos,
    qtdeConvidados: codigos.length,
  };
}
