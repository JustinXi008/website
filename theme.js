(() => {
  const storageKey = "theme";
  const root = document.documentElement;

  const applyTheme = (theme) => {
    const isLight = theme === "light";
    root.dataset.theme = isLight ? "light" : "dark";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isLight ? "#ffffff" : "#121212");

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const label = `Switch to ${isLight ? "dark" : "light"} mode`;
      button.setAttribute("aria-label", label);
      button.title = label;
      button.hidden = false;
    });
  };

  let savedTheme;
  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch {
    // The toggle still works when browser storage is unavailable.
  }
  applyTheme(savedTheme);

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(root.dataset.theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const theme = root.dataset.theme === "light" ? "dark" : "light";
        applyTheme(theme);
        try {
          localStorage.setItem(storageKey, theme);
        } catch {
          // Keep the selected theme for this page even without persistence.
        }
      });
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) applyTheme(event.newValue);
  });
})();
