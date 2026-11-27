import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Goes back to whatever card or fighter was open before. Hidden when the page
// was opened directly (a shared link): there's nothing in the app to go back
// to, and the sidebar is right there. React Router gives the first page of a
// visit the key "default".
function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.key === "default") {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 text-left">
      <button
        className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
        onClick={() => navigate(-1)}
        type="button"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back
      </button>
    </div>
  );
}

export default BackButton;
