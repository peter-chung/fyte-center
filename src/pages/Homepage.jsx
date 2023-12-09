import { events } from "../sample-data/events";
import FightCard from "../ui/FightCard";

function Homepage() {
  const { data } = events[0];

  return (
    <>
      <ul className="menu bg-base-200 w-56 rounded-box">
        <li className="menu-title">Events</li>
        {data.map((event, i) => (
          <li key={i}>
            <a>
              {event.title} {i}
            </a>
          </li>
        ))}
      </ul>

      <FightCard fightCard={data[0]} />
    </>
  );
}

export default Homepage;
