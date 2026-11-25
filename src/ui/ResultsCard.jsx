import { CalendarDays, Check, MapPin } from "lucide-react";

import Chip from "./Chip";
import FighterLink from "./FighterLink";
import { formatEventDate } from "../utils/formatDate";

const cardSections = [
  { key: "main", title: "Main Card" },
  { key: "prelims", title: "Prelims" },
  { key: "early_prelims", title: "Early Prelims" },
];

const outcomeLabels = { draw: "Draw", nc: "No Contest" };

// Recent events keep the ESPN card sections they had while upcoming; older
// ones never had any, so they show as a single list in bout order.
function groupFights(fights) {
  if (!fights.some((fight) => fight.cardSection)) {
    return [{ key: "card", title: "Fight Card", fights }];
  }

  return [
    ...cardSections.map((section) => ({
      ...section,
      fights: fights.filter((fight) => fight.cardSection === section.key),
    })),
    { key: "other", title: "Other Bouts", fights: fights.filter((fight) => !fight.cardSection) },
  ].filter((group) => group.fights.length > 0);
}

function FighterButton({ fighter, colorClasses, isLoser }) {
  const isWinner = fighter.result === "W";

  return (
    <FighterLink
      className={`inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-md font-medium text-neutral-100 ${colorClasses} ${
        isLoser ? "opacity-40" : ""
      }`}
      fighter={fighter}
    >
      <span className="truncate">{fighter.name}</span>
      {isWinner ? (
        <Check aria-label="winner" className="h-4 w-4 shrink-0" strokeWidth={3} />
      ) : null}
    </FighterLink>
  );
}

function FightResult({ fight }) {
  const { fighter1, fighter2, outcome } = fight;
  const hasWinner = outcome === "win";
  const summary = [fight.weightClass, outcomeLabels[outcome], fight.resultSummary]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="mx-auto max-w-2xl pb-4">
      <div className="flex items-center justify-center gap-2">
        <FighterButton
          fighter={fighter1}
          colorClasses="bg-red-600 hover:bg-red-400"
          isLoser={hasWinner && fighter1.result !== "W"}
        />
        <span className="w-10 shrink-0 text-center font-bold">vs</span>
        <FighterButton
          fighter={fighter2}
          colorClasses="bg-blue-600 hover:bg-blue-400"
          isLoser={hasWinner && fighter2.result !== "W"}
        />
      </div>
      {summary ? (
        <p className="pt-1 text-sm text-neutral-500 dark:text-neutral-400">{summary}</p>
      ) : null}
    </li>
  );
}

function ResultsCard({ event }) {
  const { title, link, eventDate, location, fights } = event;
  const groups = groupFights(fights);

  return (
    <div className="pt-24 md:ml-60">
      <div className="px-4 pb-8 text-center">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Results
          </p>
          <h2 className="pt-2 text-3xl font-semibold sm:text-4xl">
            <a href={link || undefined} rel="noreferrer" target="_blank">
              {title}
            </a>
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <Chip icon={CalendarDays}>{formatEventDate(eventDate)}</Chip>
            {location ? <Chip icon={MapPin}>{location}</Chip> : null}
          </div>
        </div>

        {groups.length === 0 ? (
          <p className="pt-4 text-neutral-600 dark:text-neutral-300">
            No results are available for this event.
          </p>
        ) : (
          groups.map((group, index) => (
            <section className={index === 0 ? "pt-4" : "pt-2"} key={group.key}>
              <h3 className="pb-2 text-lg font-medium">{group.title}</h3>
              <ul>
                {group.fights.map((fight) => (
                  <FightResult fight={fight} key={fight.fightId} />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

export default ResultsCard;
