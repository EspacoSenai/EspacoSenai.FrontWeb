export const ROLES = {
  ADMIN: "ADMIN",
  COORDENADOR: "COORDENADOR",
  PROFESSOR: "PROFESSOR",
  ALUNO: "ALUNO",
};

export const ROLE_STORAGE_KEY = "login_role_choice";

// helpers
export function setSelectedRole(role) {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {}
}

export function getSelectedRole() {
  try {
    return localStorage.getItem(ROLE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export const HOME_BY_ROLE = {
  [ROLES.ADMIN]: "/HomeAdm",
  [ROLES.COORDENADOR]: "/HomeCoordenador",
  [ROLES.PROFESSOR]: "/HomeProfessor",
  [ROLES.ALUNO]: "/HomeAlunos",
};
