// Global dark mode utility for Tailwind (darkMode: 'class')
// Applies the 'dark' class on <html> based on persisted preference

const STORAGE_KEY = "theme"; // values: 'dark' | 'light'

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme) {
  const root = document.documentElement; // <html>
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  applyTheme(next);
}

export function toggleTheme() {
  const current = getStoredTheme();
  setTheme(current === "dark" ? "light" : "dark");
}

export function applyThemeFromStorage() {
  const current = getStoredTheme();
  applyTheme(current);
}
