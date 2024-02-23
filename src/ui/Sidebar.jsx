import formatDate from "../utils/formatDate";

function Sidebar({ events, handleClick, selectedEvent }) {
  return (
    <div>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-white border-r border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-neutral-800">
          <ul className="space-y-2 font-medium pt-16">
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
    </div>
  );
}

export default Sidebar;
