import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, LoaderCircle, Search, User, X } from "lucide-react";

import { MIN_QUERY_LENGTH, search } from "../data/search";
import { formatEventDate } from "../utils/formatDate";

const DEBOUNCE_MS = 200;
const emptyResults = { fighters: [], events: [] };

// One flat list of options (fighters, then events) so arrow keys can move
// through both groups.
function toOptions(results) {
  return [
    ...results.fighters.map((fighter) => ({
      key: `f-${fighter.fighterId}`,
      group: "Fighters",
      to: `/fighters/${fighter.fighterId}`,
      Icon: User,
      title: fighter.name,
      subtitle: [fighter.nickname && `“${fighter.nickname}”`, fighter.record]
        .filter(Boolean)
        .join(" · "),
    })),
    ...results.events.map((event) => ({
      key: `e-${event.eventId}`,
      group: "Events",
      to: `/events/${event.eventId}`,
      Icon: CalendarDays,
      title: event.title,
      subtitle: [formatEventDate(event.eventDate), event.completed ? "" : "Upcoming"]
        .filter(Boolean)
        .join(" · "),
    })),
  ];
}

// Navbar search for fighters and events. On small screens it starts as an
// icon button and opens over the navbar.
function SearchBox() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const listId = useId();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ query: "", ...emptyResults, error: null });
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmed = query.trim();
  const isSearchable = trimmed.length >= MIN_QUERY_LENGTH;
  const isLoading = isSearchable && results.query !== trimmed;
  const options = isSearchable && !isLoading ? toOptions(results) : [];

  // Debounced search; a slower, older response never replaces a newer one.
  useEffect(() => {
    if (!isSearchable) {
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      search(trimmed)
        .then((found) => !cancelled && setResults({ query: trimmed, ...found, error: null }))
        .catch(
          (err) =>
            !cancelled && setResults({ query: trimmed, ...emptyResults, error: err.message })
        );
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, isSearchable]);

  // Close after navigating anywhere (a result, the sidebar, back button).
  useEffect(() => {
    setIsOpen(false);
    setIsMobileOpen(false);
    setQuery("");
  }, [pathname]);

  // Close when clicking outside.
  useEffect(() => {
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Focus straight away when the input is on screen (desktop), so keys typed
  // right after "/" land in it; on mobile it appears once the overlay opens.
  const openAndFocus = () => {
    inputRef.current?.focus();
    setIsMobileOpen(true);
  };

  useEffect(() => {
    if (isMobileOpen) {
      inputRef.current?.focus();
    }
  }, [isMobileOpen]);

  // "/" focuses search from anywhere, unless already typing in a field.
  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = document.activeElement?.tagName;
      if (event.key !== "/" || tag === "INPUT" || tag === "TEXTAREA") {
        return;
      }
      event.preventDefault();
      openAndFocus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const choose = (option) => {
    if (option) {
      navigate(option.to);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" && options.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp" && options.length) {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? options.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(options[activeIndex] ?? options[0]);
    } else if (event.key === "Escape") {
      if (query) {
        setQuery("");
      } else {
        setIsOpen(false);
        setIsMobileOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  const showDropdown = isOpen && isSearchable;
  const activeOption = options[activeIndex];

  return (
    <div className="flex flex-1 justify-end sm:justify-center" ref={containerRef}>
      <button
        aria-label="Search"
        className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 sm:hidden dark:text-neutral-300 dark:hover:bg-neutral-700"
        onClick={openAndFocus}
        type="button"
      >
        <Search aria-hidden="true" className="h-5 w-5" />
      </button>

      <div
        className={`${
          isMobileOpen ? "absolute inset-x-0 top-0 flex h-full items-center px-3" : "hidden"
        } z-10 bg-white sm:static sm:flex sm:w-full sm:max-w-md sm:px-0 dark:bg-neutral-800`}
      >
        <div className="relative w-full">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          />
          <input
            aria-activedescendant={activeOption ? `${listId}-${activeOption.key}` : undefined}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={showDropdown}
            aria-label="Search fighters and events"
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-9 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search fighters and events"
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="text"
            value={query}
          />
          {query || isMobileOpen ? (
            <button
              aria-label={query ? "Clear search" : "Close search"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              onClick={() => {
                if (query) {
                  setQuery("");
                  inputRef.current?.focus();
                } else {
                  setIsMobileOpen(false);
                }
              }}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}

          {showDropdown ? (
            <div className="absolute left-0 right-0 top-12 max-h-[70vh] overflow-y-auto rounded-lg bg-white py-1 text-left shadow-lg ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
              {isLoading ? (
                <p className="flex items-center gap-2 px-3 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Searching…
                </p>
              ) : results.error ? (
                <p className="px-3 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                  Search isn&apos;t working right now.
                </p>
              ) : options.length === 0 ? (
                <p className="px-3 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                  No fighters or events match “{trimmed}”.
                </p>
              ) : (
                <ul id={listId} role="listbox">
                  {options.map((option, index) => (
                    <li key={option.key} role="presentation">
                      {index === 0 || options[index - 1].group !== option.group ? (
                        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                          {option.group}
                        </p>
                      ) : null}
                      <button
                        aria-selected={index === activeIndex}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                          index === activeIndex
                            ? "bg-red-50 dark:bg-red-500/10"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        }`}
                        id={`${listId}-${option.key}`}
                        onClick={() => choose(option)}
                        onMouseEnter={() => setActiveIndex(index)}
                        role="option"
                        tabIndex={-1}
                        type="button"
                      >
                        <option.Icon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-neutral-400"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-neutral-800 dark:text-white">
                            {option.title}
                          </span>
                          {option.subtitle ? (
                            <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                              {option.subtitle}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
