import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import DarkModeToggle from "./DarkModeToggle";
import SearchBox from "./SearchBox";

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full shadow-md bg-white border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              data-drawer-target="default-sidebar"
              data-drawer-toggle="default-sidebar"
              aria-controls="default-sidebar"
              type="button"
              className="inline-flex items-center pr-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 "
            >
              <span className="sr-only">Open sidebar</span>
              <Menu aria-hidden="true" className="h-6 w-6" />
            </button>

            <Link className="flex shrink-0 ms-2" to="/">
              <span className="h-8 me-3 text-2xl">🥊</span>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                FyteCenter
              </span>
            </Link>
          </div>
          <SearchBox />
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
