import { Moon, Sun } from "lucide-react";

import { useDarkMode } from "../hooks/useDarkMode";

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const Icon = isDarkMode ? Sun : Moon;

  return (
    <button
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
      onClick={toggleDarkMode}
      type="button"
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

export default DarkModeToggle;
