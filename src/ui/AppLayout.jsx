import { useEffect, useState } from "react";

import EventsMenuSidebar from "./EventsMenuSidebar";
import FightCard from "./FightCard";
import { sampleData } from "../sample-data/sampleData";
import axios from "axios";

function AppLayout() {
  const events = sampleData[0].data;
  const [eventsData, setEventsData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  useEffect(() => {
    axios
      .get("https://mma-events-api.vercel.app/events")
      .then((response) => console.log(response.data));
  }, []);

  return (
    <div className="flex">
      <EventsMenuSidebar
        events={events}
        handleClick={setSelectedEvent}
        selectedEvent={selectedEvent}
      />
      <FightCard event={selectedEvent} />
    </div>
  );
}

export default AppLayout;
