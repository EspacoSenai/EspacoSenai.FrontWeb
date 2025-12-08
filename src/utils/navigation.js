/**
 * Utilitários de navegação baseados no perfil do usuário
 */

/**
 * Retorna a página de salas correspondente ao perfil do usuário
 * @returns {string} Caminho da página de salas
 */
export function getSalasPageByProfile() {
  try {
    const profile = (localStorage.getItem("selected_profile") || "").toUpperCase();
    const roles = (localStorage.getItem("roles") || "").toUpperCase();
    
    // Verifica primeiro por selected_profile
    if (profile === "ADMIN" || profile === "ADMINISTRADOR") {
      return "/salas-administradores";
    }
    if (profile === "COORDENADOR") {
      return "/salas-coordenadores";
    }
    if (profile === "PROFESSOR") {
      return "/salas-professores";
    }
    if (profile === "ALUNO" || profile === "ESTUDANTE") {
      return "/salas-alunos";
    }

    // Fallback: verifica por roles
    if (roles.includes("ADMIN") || roles.includes("ADMINISTRADOR")) {
      return "/salas-administradores";
    }
    if (roles.includes("COORDENADOR")) {
      return "/salas-coordenadores";
    }
    if (roles.includes("PROFESSOR")) {
      return "/salas-professores";
    }
    
    // Default: página de salas de alunos
    return "/salas-alunos";
  } catch (error) {
    console.error("[navigation] Erro ao determinar página de salas:", error);
    return "/salas-alunos";
  }
}

/**
 * Retorna a página home correspondente ao perfil do usuário
 * @returns {string} Caminho da página home
 */
export function getHomePageByProfile() {
  try {
    const profile = (localStorage.getItem("selected_profile") || "").toUpperCase();
    const roles = (localStorage.getItem("roles") || "").toUpperCase();
    
    if (profile === "ADMIN" || profile === "ADMINISTRADOR") {
      return "/HomeAdm";
    }
    if (profile === "COORDENADOR") {
      return "/HomeCoordenador";
    }
    if (profile === "PROFESSOR") {
      return "/HomeProfessor";
    }
    if (profile === "ALUNO" || profile === "ESTUDANTE") {
      return "/HomeAlunos";
    }

    if (roles.includes("ADMIN") || roles.includes("ADMINISTRADOR")) {
      return "/HomeAdm";
    }
    if (roles.includes("COORDENADOR")) {
      return "/HomeCoordenador";
    }
    if (roles.includes("PROFESSOR")) {
      return "/HomeProfessor";
    }
    
    return "/HomeAlunos";
  } catch (error) {
    console.error("[navigation] Erro ao determinar página home:", error);
    return "/HomeAlunos";
  }
}
