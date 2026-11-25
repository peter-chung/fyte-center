import { Link } from "react-router-dom";

import { formatEventDate } from "../utils/formatDate";

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

const tabs = [
  { key: "upcoming", label: "Upcoming", to: "/" },
  { key: "results", label: "Results", to: "/results" },
];

function Sidebar({
  activeTab,
  upcomingEvents,
  pastEvents,
  selectedEventId,
  hasMorePast,
  isLoadingMore,
  onLoadMore,
}) {
  const showingResults = activeTab === "results";
  const events = showingResults ? pastEvents : upcomingEvents;

  return (
    <div>
      <aside
        id="default-sidebar"
        className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 transition-transform -translate-x-full md:translate-x-0 bg-white border-r border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col bg-white dark:bg-neutral-800">
          <div className="shrink-0 px-3 pt-4 pb-2">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-700">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  to={tab.to}
                  className={`rounded-lg px-3 py-1.5 text-center text-sm font-semibold transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-red-600 shadow-sm dark:bg-neutral-800 dark:text-red-400"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-scrollbar flex-1 overflow-y-auto px-3 pb-4 pt-2">
            {events.length === 0 ? (
              <p className="px-3 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                {showingResults ? "No results yet." : "No upcoming events."}
              </p>
            ) : null}

            <ul className="space-y-3">
              {events.map((event) => {
                const { label, matchup } = getEventTitleParts(event.title);
                const isSelected = selectedEventId === event.eventId;

                return (
                  <li key={event.eventId}>
                    <Link
                      to={`/events/${event.eventId}`}
                      className={`block w-full rounded-xl border-l-2 px-3 py-3 text-left transition-colors ${
                        isSelected
                          ? "border-red-600 bg-red-50 text-neutral-900 dark:bg-red-500/10 dark:text-neutral-100"
                          : "border-transparent text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      }`}
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
                      <span className="mt-1 block text-sm font-semibold leading-5">{matchup}</span>
                      {showingResults ? (
                        <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">
                          {formatEventDate(event.eventDate)}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {showingResults && hasMorePast ? (
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="mt-4 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                {isLoadingMore ? "Loading…" : "Load more"}
              </button>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
