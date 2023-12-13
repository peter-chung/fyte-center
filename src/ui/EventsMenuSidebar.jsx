import formatDate from "../utils/formatDate";

function EventsMenuSidebar({ events, handleClick, selectedEvent }) {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu pt-20 lg:pt-1 w-64 min-h-full bg-base-100 text-base-content">
            {/* <li className="menu-title text-lg font-medium text-center">
              Events
            </li> */}
            {/* Sidebar content here */}
            {events.map((event, index) => (
              <li className="pb-1" key={index}>
                <a
                  className={`shadow-md font-medium border pl-6 hover:pl-10 ${
                    selectedEvent.link === event.link ? "active" : ""
                  }`}
                  onClick={() => handleClick(events[index])}
                >
                  {formatDate(event.dateTime)} - {event.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EventsMenuSidebar;
