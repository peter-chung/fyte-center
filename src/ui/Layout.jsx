import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import FightCard from "./FightCard";
import getUpcomingEvents from "../data/getUpcomingEvents";

function Layout() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getEvents = async () => {
    try {
      setIsLoading(true);
      const upcomingEvents = await getUpcomingEvents();

      setEvents(upcomingEvents);
      setSelectedEvent(upcomingEvents[0] ?? null);
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
