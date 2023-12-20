import { useDarkMode } from "../context/DarkModeContext";

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? (
        <span className="swap-on fill-current text-2xl">☀</span>
      ) : (
        // moon icon
        <span className="swap-on fill-current text-2xl">🌑</span>
      )}
    </button>
  );
}

export default DarkModeToggle;
