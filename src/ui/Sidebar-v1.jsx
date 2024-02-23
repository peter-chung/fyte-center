import formatDate from "../utils/formatDate";

function Sidebar({ events, handleClick, selectedEvent }) {
  return (
    <aside
      id="logo-sidebar"
      // md:translate-x-0 add this classname to hide at md breakpoint
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 shadow-lg transition-transform -translate-x-full bg-white border-r border-neutral-200 translate-x-0 dark:bg-neutral-800 dark:border-neutral-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-neutral-800">
        <ul className="space-y-2 font-medium">
          {events.map((event, index) => (
            <li key={index}>
              <a
                className={`flex items-center p-2 cursor-pointer rounded-lg hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 group ${
                  selectedEvent.link === event.link
                    ? "bg-red-600 text-neutral-100"
                    : ""
                }`}
                onClick={() => handleClick(events[index])}
              >
                <span className="pl-2">
                  {formatDate(event.dateTime)} - {event.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
