import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <div
      className="
    bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] 
    shadow-sm px-4
    "
    >
      <nav className="navbar w-full">
        <label htmlFor="my-drawer-2" className="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
        <div className="flex flex-1 md:gap-1 lg:gap-2">
          <a className="btn btn-ghost text-xl font-slate-50">FyteCenter 🥊</a>
        </div>
        <div className="flex-none">
          {/* <ThemeToggle /> */}
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
