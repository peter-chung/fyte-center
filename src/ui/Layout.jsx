import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import FightCard from "./FightCard";
import normalizeMmaEvents from "../utils/normalizeMmaEvents";

function Layout() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://mma-events-api.vercel.app/events");
      const data = await response.json();
      const normalizedEvents = normalizeMmaEvents(data);

      setEvents(normalizedEvents);
      setSelectedEvent(normalizedEvents[0] ?? null);
    } catch (err) {
      console.log(err.message);
      setEvents([]);
      setSelectedEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    initFlowbite();
  }, [isLoading]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen text-neutral-800 dark:text-white bg-white dark:bg-neutral-800">
      <Navbar />
      <Sidebar
        events={events}
        handleClick={setSelectedEvent}
        selectedEvent={selectedEvent}
      />
      <FightCard event={selectedEvent} />
    </div>
  );
}

export default Layout;
