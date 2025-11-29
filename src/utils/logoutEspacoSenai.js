export function logoutEspacoSenai() {
  try {
    localStorage.removeItem("espacoSenai:token");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("espns.session");
    localStorage.removeItem("roles");
    localStorage.removeItem("selected_profile");

  } catch (e) {
    console.error("Erro ao limpar credenciais do EspaçoSenai:", e);
  }
}
