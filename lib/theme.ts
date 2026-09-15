export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "wau-theme";

/** Runs before first paint to set <html class="dark"> and avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;
