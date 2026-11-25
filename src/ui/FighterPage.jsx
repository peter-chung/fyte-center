import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import Loader from "./Loader";
import NotFound from "./NotFound";
import { getFighter } from "../data/fighters";
import { formatEventDate } from "../utils/formatDate";

const chipClasses =
  "rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700";

const resultStyles = {
  W: { label: "W", classes: "bg-green-600 text-white" },
  L: { label: "L", classes: "bg-red-600 text-white" },
  D: { label: "D", classes: "bg-neutral-500 text-white" },
  NC: { label: "NC", classes: "bg-neutral-500 text-white" },
};

const statRows = [
  { key: "sigStrLandedPerMin", label: "Sig. strikes landed / min" },
  { key: "sigStrAccPct", label: "Striking accuracy", pct: true },
  { key: "sigStrAbsorbedPerMin", label: "Sig. strikes absorbed / min" },
  { key: "sigStrDefPct", label: "Striking defense", pct: true },
  { key: "tdAvgPer15", label: "Takedowns / 15 min" },
  { key: "tdAccPct", label: "Takedown accuracy", pct: true },
  { key: "tdDefPct", label: "Takedown defense", pct: true },
  { key: "subAvgPer15", label: "Submission attempts / 15 min" },
];

function formatStat(value, pct) {
  if (value == null) {
    return "–";
  }

  return pct ? `${Math.round(value)}%` : value.toFixed(2);
}

function ResultBadge({ entry }) {
  const style = resultStyles[entry.result];

  if (!style) {
    return (
      <span className="inline-flex h-7 w-12 shrink-0 items-center justify-center rounded-md px-2 text-xs font-semibold ring-1 ring-neutral-300 dark:ring-neutral-600">
        {entry.completed ? "–" : "Next"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex h-7 w-12 shrink-0 items-center justify-center rounded-md px-2 text-xs font-semibold ${style.classes}`}
    >
      {style.label}
    </span>
  );
}

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

// Goes back to whatever card or fighter was open before. Hidden when the page
// was opened directly (a shared link): there's nothing in the app to go back
// to, and the sidebar is right there. React Router gives the first page of a
// visit the key "default".
function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.key === "default") {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 text-left">
      <button
        className="text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
        onClick={() => navigate(-1)}
        type="button"
      >
        ← Back
      </button>
    </div>
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
    fighter.weightClass,
    fighter.age != null ? `Age ${fighter.age}` : "",
    fighter.height,
    fighter.reach ? `${fighter.reach} reach` : "",
    fighter.stance,
  ].filter(Boolean);
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
                <span className={chipClasses} key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {hasStats ? (
          <section className="mx-auto max-w-2xl pt-4">
            <h3 className="pb-2 text-lg font-medium">Career Stats</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {statRows.map((row) => (
                <div
                  className="rounded-md bg-neutral-100 px-3 py-2 dark:bg-neutral-700"
                  key={row.key}
                >
                  <p className="text-xl font-semibold">
                    {formatStat(fighter.careerStats[row.key], row.pct)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-300">{row.label}</p>
                </div>
              ))}
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
            <a className="hover:underline" href={fighter.link} rel="noreferrer" target="_blank">
              View on UFC Stats
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default FighterPage;
