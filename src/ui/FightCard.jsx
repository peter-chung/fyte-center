import formatDate from "../utils/formatDate";

function FightCard({ event }) {
  const formatStartTime = (date) => {
    if (!date) {
      return "TBD";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "TBD";
    }

    return parsedDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  if (!event) {
    return (
      <div className="pt-24 md:ml-60">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">No events available</h2>
        </div>
      </div>
    );
  }

  const {
    fights = [],
    link,
    title,
    dateTime,
    venue,
    location,
    mainCardStartIso,
    prelimsStartIso,
  } = event;

  const mainCardFights = fights.filter((fight) => fight.isMainCard);
  const prelimCardFights = fights.filter((fight) => !fight.isMainCard);

  return (
    <div className="pt-24 md:ml-60">
      <div className="px-4 pb-8 text-center">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Upcoming Event
          </p>
          <h2 className="pt-2 text-3xl font-semibold sm:text-4xl">
            <a href={link || undefined}>{title}</a>
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
              {formatDate(dateTime)}
            </span>
            {venue && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                {venue}
              </span>
            )}
            {location && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                {location}
              </span>
            )}
          </div>
        </div>

        <ul className="pt-4">
          <li className="pb-2 text-lg font-medium">
            Main Card{" "}
            <span className="text-base font-normal text-neutral-500 dark:text-neutral-300">
              ({formatStartTime(mainCardStartIso)})
            </span>
          </li>
          {mainCardFights.length === 0 ? (
            <li>No fights found... 😢</li>
          ) : (
            mainCardFights.map((fight, i) => (
              <li
                className="mx-auto flex max-w-2xl items-center justify-center gap-2 pb-2"
                key={i}
              >
                <a
                  className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-md bg-red-600 px-3 text-md font-medium text-neutral-100 hover:bg-red-400"
                  href={fight.fighter1.link || undefined}
                >
                  <span className="truncate">{fight.fighter1.name}</span>
                </a>
                <span className="w-10 shrink-0 text-center font-bold">vs</span>
                <a
                  className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-md bg-blue-600 px-3 text-md font-medium text-neutral-100 hover:bg-blue-400"
                  href={fight.fighter2.link || undefined}
                >
                  <span className="truncate">{fight.fighter2.name}</span>
                </a>
              </li>
            ))
          )}
        </ul>

        <ul>
          <li className="pb-2 text-lg font-medium">
            Preliminary Card{" "}
            <span className="text-base font-normal text-neutral-500 dark:text-neutral-300">
              ({formatStartTime(prelimsStartIso)})
            </span>
          </li>
          {prelimCardFights.length === 0 ? (
            <li>No fights found... 😢</li>
          ) : (
            prelimCardFights.map((fight, i) => (
              <li
                className="mx-auto flex max-w-2xl items-center justify-center gap-2 pb-2"
                key={i}
              >
                <a
                  className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-md bg-red-600 px-3 text-md font-medium text-neutral-100 hover:bg-red-400"
                  href={fight.fighter1.link || undefined}
                >
                  <span className="truncate">{fight.fighter1.name}</span>
                </a>
                <span className="w-10 shrink-0 text-center font-bold">vs</span>
                <a
                  className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-md bg-blue-600 px-3 text-md font-medium text-neutral-100 hover:bg-blue-400"
                  href={fight.fighter2.link || undefined}
                >
                  <span className="truncate">{fight.fighter2.name}</span>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default FightCard;
