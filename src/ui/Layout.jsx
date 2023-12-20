import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import FightCard from "./FightCard";

function Layout() {
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
