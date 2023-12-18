import { useEffect, useState } from "react";

import EventsMenuSidebar from "./EventsMenuSidebar";
import FightCard from "./FightCard";
import Loader from "./Loader";

function AppLayout() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://mma-events-api.vercel.app/events");
      const data = await response.json();
      setEvents(data[0].data);
      setSelectedEvent(data[0].data[0]);
    } catch (err) {
      console.log(err.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="flex">
      {/* <EventsMenuSidebar
        events={events}
        handleClick={setSelectedEvent}
        selectedEvent={selectedEvent}
      /> */}
      <FightCard event={selectedEvent} />
    </div>
  );
}

export default AppLayout;
