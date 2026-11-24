import { useEffect, useState } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { initFlowbite } from "flowbite";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import { getPastEvents, getUpcomingEvents, PAST_EVENTS_PAGE_SIZE } from "../data/events";

function Layout() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [hasMorePast, setHasMorePast] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { pathname } = useLocation();
  const selectedEventId = useMatch("/events/:eventId")?.params.eventId ?? null;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents(0)]);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setHasMorePast(past.length === PAST_EVENTS_PAGE_SIZE);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    initFlowbite();
  }, [isLoading]);

  // On mobile the sidebar is a Flowbite drawer; close it after picking an
  // event so the card isn't left hidden behind it. (No-op on desktop.)
  useEffect(() => {
    window.FlowbiteInstances?.getInstance("Drawer", "default-sidebar")?.hide();
  }, [pathname]);

  const loadMorePast = async () => {
    try {
      setIsLoadingMore(true);
      const more = await getPastEvents(pastEvents.length);
      setPastEvents((current) => {
        const seen = new Set(current.map((event) => event.eventId));
        return [...current, ...more.filter((event) => !seen.has(event.eventId))];
      });
      setHasMorePast(more.length === PAST_EVENTS_PAGE_SIZE);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // An /events/:id link opens on the Results tab unless it's an upcoming card.
  const isUpcomingEvent = upcomingEvents.some((event) => event.eventId === selectedEventId);
  const activeTab =
    pathname === "/results" || (selectedEventId && !isUpcomingEvent) ? "results" : "upcoming";
  const highlightedEventId =
    selectedEventId ??
    (pathname === "/results" ? pastEvents[0]?.eventId : null) ??
    (pathname === "/" ? upcomingEvents[0]?.eventId : null);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen text-neutral-800 dark:text-white bg-white dark:bg-neutral-800">
      <Navbar />
      <Sidebar
        activeTab={activeTab}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        selectedEventId={highlightedEventId}
        hasMorePast={hasMorePast}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMorePast}
      />
      <Outlet context={{ upcomingEvents, pastEvents }} />
    </div>
  );
}

export default Layout;
