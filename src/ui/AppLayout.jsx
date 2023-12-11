import { useState } from "react";

import Container from "./Container";
import EventsMenu from "./EventsMenu";
import FightCard from "./FightCard";
import { sampleData } from "../sample-data/sampleData";

function AppLayout() {
  const events = sampleData[0].data;
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  return (
    // <Container>
    <div className="flex">
      <EventsMenu events={events} handleClick={setSelectedEvent} />
      <FightCard event={selectedEvent} />
    </div>
    // </Container>
  );
}

export default AppLayout;
