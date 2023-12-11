import { sampleData } from "../sample-data/sampleData";

function EventsMenu() {
  const { createdAt, data: mmaEvents } = sampleData.at(0);
  console.log(mmaEvents);
  return (
    <ul className="menu bg-base-200 w-56 rounded-box float-left">
      <li className="menu-title">Events</li>
      {mmaEvents.map((mmaEvent, i) => (
        <li key={i}>
          <a className="active">{mmaEvent.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default EventsMenu;
