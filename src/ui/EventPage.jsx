import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import FightCard from "./FightCard";
import ResultsCard from "./ResultsCard";
import Loader from "./Loader";
import NotFound from "./NotFound";
import { getEvent } from "../data/events";

// Shows one event: an upcoming card (FightCard) or a past one (ResultsCard).
// Without an :eventId it shows the default for the tab: the next upcoming
// card on "/", the latest results on "/results".
function EventPage({ defaultTab }) {
  const { eventId } = useParams();
  const { upcomingEvents, pastEvents } = useOutletContext();

  const targetId =
    eventId ??
    (defaultTab === "results" ? pastEvents[0]?.eventId : upcomingEvents[0]?.eventId) ??
    null;
  // Upcoming cards are already loaded in full for the sidebar.
  const preloaded = upcomingEvents.find((event) => event.eventId === targetId) ?? null;

  const [fetched, setFetched] = useState({ id: null, event: null, error: null });

  useEffect(() => {
    if (!targetId || preloaded) {
      return undefined;
    }

    let cancelled = false;
    getEvent(targetId)
      .then((event) => !cancelled && setFetched({ id: targetId, event, error: null }))
      .catch(
        (err) => !cancelled && setFetched({ id: targetId, event: null, error: err.message })
      );

    return () => {
      cancelled = true;
    };
  }, [targetId, preloaded]);

  const event = preloaded ?? (fetched.id === targetId ? fetched.event : undefined);

  useEffect(() => {
    document.title = event?.title ? `${event.title} | FyteCenter` : "FyteCenter";
  }, [event]);

  if (!targetId) {
    return <FightCard event={null} />;
  }

  if (event === undefined) {
    return <Loader inline />;
  }

  if (fetched.id === targetId && fetched.error) {
    return <NotFound message="Couldn't load this event" />;
  }

  if (!event) {
    return <NotFound message="Event not found" />;
  }

  return event.completed ? <ResultsCard event={event} /> : <FightCard event={event} />;
}

export default EventPage;
