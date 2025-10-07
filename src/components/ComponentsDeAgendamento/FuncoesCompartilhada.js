export const COR_VERMELHO = "#AE0000";
export const TAMANHO_CODIGO = 5;
export const MAX_CONVIDADOS = 9;


export const HORARIOS_INICIO_QUADRA = [
  "11:50",
  "13:30",
  "14:30",
  "15:30",
  "16:00",
  "16:50",
];
export const HORARIOS_TERMINO_QUADRA = [
  "14:50",
  "13:00",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export const HORARIOS_INICIO_COMPUTADOR = [
  "08:50",
  "09:30",
  "10:00",
  "11:30",
  "14:00",
  "14:45",
];

export const HORARIO_TERMINO_COMPUTADOR_FIXO = "21:00";

export const HORARIOS_TERMINO_COMPUTADOR = [HORARIO_TERMINO_COMPUTADOR_FIXO];


export const HORARIOS_INICIO_PS5 = [
  "14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45",
  "14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35",
  "15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25",
  "16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15",
  "17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05",
  "18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55",
  "19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45",
  "19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35",
  "20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25",
  "21:30","21:35","21:40","21:45","21:50","21:55","22:00"
];


export const HORARIOS_TERMINO_PS5 = [
  "14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50",
  "14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40",
  "15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30",
  "16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20",
  "17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10",
  "18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00",
  "19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50",
  "19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40",
  "20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30",
  "21:35","21:40","21:45","21:50","21:55","22:00"
];


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

  const diasSemana = ["S", "T", "Q", "Q", "S", "S"];

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

export function montarPayload({
  recurso,
  semanaSelecionada,
  dia,
  inicio,
  termino,
  codigos = [],
  extra = {},
}) {
  return {
    local: recurso,
    semana: semanaSelecionada === "essa" ? "Essa semana" : "Próxima semana",
    data: dia?.toISOString?.() ?? dia,
    inicio,
    termino,
    codigosConvidados: codigos,
    qtdeConvidados: codigos.length,
    ...extra,
  };
}
