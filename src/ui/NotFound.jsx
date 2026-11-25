import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

function NotFound({ message = "Page not found" }) {
  return (
    <div className="pt-24 md:ml-60">
      <div className="px-4 text-center">
        <SearchX aria-hidden="true" className="mx-auto mb-3 h-10 w-10 text-neutral-400" />
        <h2 className="text-3xl font-semibold">{message}</h2>
        <Link className="mt-4 inline-block text-red-600 hover:underline dark:text-red-400" to="/">
          Back to upcoming events
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
