function getEventTitleParts(title) {
  if (!title) {
    return {
      label: "MMA Event",
      matchup: "Unnamed Event",
    };
  }

  const [label, matchup] = title.split(":").map((part) => part.trim());

  return {
    label: label || "MMA Event",
    matchup: matchup || label || "Unnamed Event",
  };
}

function Sidebar({ events, handleClick, selectedEvent }) {
  return (
    <div>
      <aside
        id="default-sidebar"
        className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 transition-transform -translate-x-full md:translate-x-0 bg-white border-r border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
        aria-label="Sidebar"
      >
        <div className="sidebar-scrollbar h-full overflow-y-auto bg-white px-3 py-4 dark:bg-neutral-800">
          <ul className="space-y-3">
            {events.map((event, index) => {
              const { label, matchup } = getEventTitleParts(event.title);
              const isSelected = selectedEvent?.link === event.link;

              return (
                <li key={index}>
                  <button
                    type="button"
                    className={`w-full rounded-xl border-l-2 px-3 py-3 text-left transition-colors ${
                      isSelected
                        ? "border-red-600 bg-red-50 text-neutral-900 dark:bg-red-500/10 dark:text-neutral-100"
                        : "border-transparent text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                    onClick={() => handleClick(events[index])}
                  >
                    <span
                      className={`block text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        isSelected
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {label}
                    </span>
                    <span
                      className={`mt-1 block text-sm font-semibold leading-5 ${
                        isSelected
                          ? "text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-800 dark:text-neutral-100"
                      }`}
                    >
                      {matchup}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
