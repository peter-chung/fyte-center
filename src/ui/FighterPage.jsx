import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Cake,
  ExternalLink,
  Footprints,
  MoveHorizontal,
  Ruler,
  Scale,
} from "lucide-react";

import BackButton from "./BackButton";
import Chip from "./Chip";
import Loader from "./Loader";
import NotFound from "./NotFound";
import ResultBadge from "./ResultBadge";
import { getFighter } from "../data/fighters";
import { careerStatDisplay, statRows } from "../utils/fighterStats";
import { formatEventDate } from "../utils/formatDate";

function HistoryRow({ entry }) {
  const { opponent } = entry;
  const details = [entry.weightClass, entry.resultSummary].filter(Boolean).join(" · ");

  return (
    <li className="flex items-start gap-3 border-b border-neutral-200 py-3 text-left last:border-b-0 dark:border-neutral-700">
      <ResultBadge entry={entry} />
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          vs{" "}
          {opponent.fighterId ? (
            <Link className="hover:underline" to={`/fighters/${opponent.fighterId}`}>
              {opponent.name}
            </Link>
          ) : (
            opponent.name
          )}
        </p>
        {details ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{details}</p>
        ) : null}
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {entry.eventId ? (
            <Link className="hover:underline" to={`/events/${entry.eventId}`}>
              {entry.eventName}
            </Link>
          ) : (
            entry.eventName
          )}
          {entry.eventDate ? ` · ${formatEventDate(entry.eventDate)}` : ""}
        </p>
      </div>
    </li>
  );
}

function FighterPage() {
  const { fighterId } = useParams();
  const [fetched, setFetched] = useState({ id: null, fighter: null, error: null });

  useEffect(() => {
    let cancelled = false;
    getFighter(fighterId)
      .then((fighter) => !cancelled && setFetched({ id: fighterId, fighter, error: null }))
      .catch(
        (err) => !cancelled && setFetched({ id: fighterId, fighter: null, error: err.message })
      );

    return () => {
      cancelled = true;
    };
  }, [fighterId]);

  const isCurrent = fetched.id === fighterId;
  const fighter = isCurrent ? fetched.fighter : undefined;

  useEffect(() => {
    document.title = fighter?.name ? `${fighter.name} | FyteCenter` : "FyteCenter";
  }, [fighter]);

  if (!isCurrent) {
    return <Loader inline />;
  }

  if (fetched.error) {
    return <NotFound message="Couldn't load this fighter" />;
  }

  if (!fighter) {
    return <NotFound message="Fighter not found" />;
  }

  const chips = [
    { icon: Scale, text: fighter.weightClass },
    { icon: Cake, text: fighter.age != null ? `Age ${fighter.age}` : "" },
    { icon: Ruler, text: fighter.height },
    { icon: MoveHorizontal, text: fighter.reach ? `${fighter.reach} reach` : "" },
    { icon: Footprints, text: fighter.stance },
  ].filter((chip) => chip.text);
  const hasStats = statRows.some((row) => fighter.careerStats[row.key] != null);

  return (
    <div className="pt-24 md:ml-60">
      <div className="px-4 pb-8 text-center">
        <BackButton />
        <div className="mx-auto max-w-3xl px-6 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Fighter
          </p>
          <h2 className="pt-2 text-3xl font-semibold sm:text-4xl">{fighter.name}</h2>
          {fighter.nickname ? (
            <p className="pt-1 text-lg italic text-neutral-500 dark:text-neutral-400">
              “{fighter.nickname}”
            </p>
          ) : null}
          {fighter.record ? (
            <p className="pt-3 text-2xl font-semibold">
              {fighter.record}
              {fighter.ufcRecord ? (
                <span className="pl-2 text-base font-normal text-neutral-500 dark:text-neutral-400">
                  ({fighter.ufcRecord} UFC)
                </span>
              ) : null}
            </p>
          ) : null}
          {chips.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {chips.map((chip) => (
                <Chip icon={chip.icon} key={chip.text}>
                  {chip.text}
                </Chip>
              ))}
            </div>
          ) : null}
        </div>

        {hasStats ? (
          <section className="mx-auto max-w-2xl pt-4">
            <h3 className="pb-2 text-lg font-medium">Career Stats</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {statRows.map((row) => {
                const stat = careerStatDisplay(fighter, row);

                return (
                  <div
                    className="rounded-md bg-neutral-100 px-3 py-2 dark:bg-neutral-700"
                    key={row.key}
                    title={stat.reason ?? undefined}
                  >
                    <p
                      className={`text-xl font-semibold ${
                        stat.reason ? "text-neutral-400 dark:text-neutral-400" : ""
                      }`}
                    >
                      {stat.text}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-300">
                      {stat.reason ?? row.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-2xl pt-6">
          <h3 className="pb-2 text-lg font-medium">UFC Fight History</h3>
          {fighter.history.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-300">No UFC fights on record.</p>
          ) : (
            <ul>
              {fighter.history.map((entry) => (
                <HistoryRow entry={entry} key={entry.fightId} />
              ))}
            </ul>
          )}
        </section>

        {fighter.link ? (
          <p className="pt-6 text-sm text-neutral-500 dark:text-neutral-400">
            <a
              className="inline-flex items-center gap-1 hover:underline"
              href={fighter.link}
              rel="noreferrer"
              target="_blank"
            >
              View on UFC Stats
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default FighterPage;
