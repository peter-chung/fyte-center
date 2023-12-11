import formatDate from "../utils/formatDate";

// console.log(formatDate("Saturday, December 09,  7:00 PM ET"));

function EventsMenu({ events, handleClick }) {
  return (
    // <div className="fixed top-22 left-0 h-screen w-52 flex flex-col text-slate-900 shadow-lg">
    //   <ul className="menu bg-base-100 w-52 rounded-box text-center">
    //     <li className="menu-title text-lg font-medium">Events</li>
    //     {events.map((event, index) => (
    //       <li className="pb-1" key={index}>
    //         <a
    //           className="font-medium border pl-6"
    //           onClick={() => handleClick(events[index])}
    //         >
    //           {event.title}
    //         </a>
    //       </li>
    //     ))}
    //   </ul>
    // </div>

    <ul className="menu bg-base-100 w-auto rounded-box text-center">
      <li className="menu-title text-lg font-medium">Events</li>
      {events.map((event, index) => (
        <li className="pb-1" key={index}>
          <a
            className="font-medium border border-slate-200 hover:bg-slate-200 pl-6"
            onClick={() => handleClick(events[index])}
          >
            {formatDate(event.dateTime)} - {event.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default EventsMenu;
