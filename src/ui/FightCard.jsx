import formatDate from "../utils/formatDate";

const fightCardSections = [
  { key: "main", title: "Main Card", timeKey: "mainCardStartIso" },
  { key: "prelims", title: "Preliminary Card", timeKey: "prelimsStartIso" },
  { key: "early_prelims", title: "Early Prelims", timeKey: "earlyPrelimsStartIso" },
];

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

  const renderFightList = (fights) =>
    fights.map((fight) => {
      const key =
        [fight.fighter1.link, fight.fighter2.link].filter(Boolean).join("|") ||
        `${fight.fighter1.name}-${fight.fighter2.name}`;

      return (
        <li
          className="mx-auto flex max-w-2xl items-center justify-center gap-2 pb-2"
          key={key}
        >
          <a
            className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-md bg-red-600 px-3 text-md font-medium text-neutral-100 hover:bg-red-400"
            href={fight.fighter1.link || undefined}
            rel="noreferrer"
            target="_blank"
          >
            <span className="truncate">{fight.fighter1.name}</span>
          </a>
          <span className="w-10 shrink-0 text-center font-bold">vs</span>
          <a
            className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-md bg-blue-600 px-3 text-md font-medium text-neutral-100 hover:bg-blue-400"
            href={fight.fighter2.link || undefined}
            rel="noreferrer"
            target="_blank"
          >
            <span className="truncate">{fight.fighter2.name}</span>
          </a>
        </li>
      );
    });
  const renderSectionTimes = (sections, className = "pt-4") =>
    sections.length > 0 ? (
      <div className={`${className} text-sm text-neutral-600 dark:text-neutral-300`}>
        {sections.map((section) => (
          <p key={section.key}>
            {section.title}: {formatStartTime(section.startIso)}
          </p>
        ))}
      </div>
    ) : null;
  const renderSectionTimeHeaders = (
    sections,
    className = "",
    { showPlacementNote = false } = {}
  ) =>
    sections.map((section) => (
      <div className={className} key={section.key}>
        <p className="pb-1 text-lg font-medium">
          {section.title}{" "}
          <span className="text-base font-normal text-neutral-500 dark:text-neutral-300">
            ({formatStartTime(section.startIso)})
          </span>
        </p>
        {showPlacementNote ? (
          <p className="pb-2 text-sm text-neutral-500 dark:text-neutral-400">
            Fights for this section have not been assigned yet. 😢
          </p>
        ) : null}
      </div>
    ));

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
    earlyPrelimsStartIso,
  } = event;

  const fightsBySection = {
    main: fights.filter((fight) => fight.cardSection === "main"),
    prelims: fights.filter((fight) => fight.cardSection === "prelims"),
    early_prelims: fights.filter((fight) => fight.cardSection === "early_prelims"),
    unknown: fights.filter((fight) => fight.cardSection == null),
  };
  const hasExplicitSections = fightCardSections.some(
    (section) => fightsBySection[section.key].length > 0
  );
  const showUnknownAsFullCard =
    fightsBySection.unknown.length > 0 && !hasExplicitSections;
  const sectionTimes = {
    mainCardStartIso,
    prelimsStartIso,
    earlyPrelimsStartIso,
  };
  const publishedSectionTimes = fightCardSections
    .map((section) => ({
      key: section.key,
      title: section.title,
      startIso: section.timeKey ? sectionTimes[section.timeKey] : "",
    }))
    .filter((section) => Boolean(section.startIso));
  const hasNoFights = fights.length === 0;

  return (
    <div className="pt-24 md:ml-60">
      <div className="px-4 pb-8 text-center">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Upcoming Event
          </p>
          <h2 className="pt-2 text-3xl font-semibold sm:text-4xl">
            <a href={link || undefined} rel="noreferrer" target="_blank">
              {title}
            </a>
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <span className="rounded-full bg-neutral-100 px-3 py-1 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
              {formatDate(dateTime)}
            </span>
            {venue && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
                {venue}
              </span>
            )}
            {location && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
                {location}
              </span>
            )}
          </div>
        </div>

        {hasNoFights ? (
          <div className="pt-4">
            <p className="text-neutral-600 dark:text-neutral-300">
              Matchups have not been announced yet. 😢
            </p>
            {publishedSectionTimes.length > 0 ? (
              renderSectionTimes(publishedSectionTimes)
            ) : (
              <p className="pt-4 text-sm text-neutral-500 dark:text-neutral-400">
                Start times are still to be determined.
              </p>
            )}
          </div>
        ) : showUnknownAsFullCard ? (
          <div className="pt-4">
            {renderSectionTimeHeaders(publishedSectionTimes, "", {
              showPlacementNote: true,
            })}
            {publishedSectionTimes.length === 0 ? (
              <p className="pb-2 text-lg font-medium">Fight Card</p>
            ) : null}
            <p className="pb-1 text-lg font-medium">Unassigned Fights</p>
            <p className="pb-2 text-sm text-neutral-500 dark:text-neutral-400">
              These bouts have not been placed on a card section yet.
            </p>
            <ul>
              {renderFightList(fightsBySection.unknown)}
            </ul>
          </div>
        ) : (
          <>
            {fightCardSections.map((section, index) => {
              const startIso = section.timeKey ? sectionTimes[section.timeKey] : "";
              const sectionFights = fightsBySection[section.key];

              if (sectionFights.length > 0) {
                return (
                  <ul className={index === 0 ? "pt-4" : ""} key={section.key}>
                    <li className="pb-2 text-lg font-medium">
                      {section.title}{" "}
                      {startIso ? (
                        <span className="text-base font-normal text-neutral-500 dark:text-neutral-300">
                          ({formatStartTime(startIso)})
                        </span>
                      ) : null}
                    </li>
                    {renderFightList(sectionFights)}
                  </ul>
                );
              }

              if (fightsBySection.unknown.length > 0 && startIso) {
                return renderSectionTimeHeaders([{ ...section, startIso }], "", {
                  showPlacementNote: true,
                });
              }

              return null;
            })}

            {fightsBySection.unknown.length > 0 ? (
              <div>
                <p className="pb-1 text-lg font-medium">Unassigned Fights</p>
                <p className="pb-2 text-sm text-neutral-500 dark:text-neutral-400">
                  These bouts have not been placed on a card section yet.
                </p>
                <ul>
                  {renderFightList(fightsBySection.unknown)}
                </ul>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default FightCard;
