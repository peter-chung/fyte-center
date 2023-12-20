import formatDate from "../utils/formatDate";
import "flowbite";
import "flowbite-react";

function Sidebar({ events, handleClick, selectedEvent }) {
  return (
    <aside
      id="logo-sidebar"
      // md:translate-x-0 add this classname to hide at md breakpoint
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-neutral-200 translate-x-0 dark:bg-neutral-800 dark:border-neutral-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-neutral-800">
        <ul className="space-y-2 font-medium">
          {events.map((event, index) => (
            <li key={index}>
              <a
                className={`flex items-center p-2 cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 group ${
                  selectedEvent.link === event.link
                    ? "bg-neutral-100 dark:bg-neutral-700"
                    : ""
                }`}
                onClick={() => handleClick(events[index])}
              >
                {formatDate(event.dateTime)} - {event.title}
              </a>
            </li>
          ))}
          {/* <li>
            <a
              href="#"
              className="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
            >
              <svg
                className="w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="ms-3">Dashboard</span>
            </a>
          </li> */}
          {/* <li>
            <a
              href="#"
              className="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
            </a>
          </li> */}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
