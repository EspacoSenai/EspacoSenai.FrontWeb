const SESSION_KEYS = [
  "espacoSenai:token",
  "token",
  "access_token",
  "accessToken",
  "espns.session",
  "roles",
  "selected_profile",
  "espns.user",
  "espns.perfil",
  "espns.regiao",
];

export function logoutEspacoSenai() {
  try {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error("Erro ao limpar credenciais do EspaçoSenai:", e);
  }
}
