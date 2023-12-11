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
        <div className="flex flex-1 md:gap-1 lg:gap-2">
          <a className="btn btn-ghost text-xl">FyteCenter 🥊</a>
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
