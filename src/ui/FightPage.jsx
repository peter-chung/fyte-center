import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Crown, Scale, Tv } from "lucide-react";

import BackButton from "./BackButton";
import Chip from "./Chip";
import Loader from "./Loader";
import NotFound from "./NotFound";
import ResultBadge from "./ResultBadge";
import { getFight } from "../data/fights";
import { careerStatDisplay, statRows } from "../utils/fighterStats";
import { formatEventDate } from "../utils/formatDate";

const RECENT_FIGHTS = 5;

const cornerStyles = {
  red: { text: "text-red-600 dark:text-red-400", bar: "bg-red-600" },
  blue: { text: "text-blue-600 dark:text-blue-400", bar: "bg-blue-600" },
};

const drawLabels = { D: "Draw", NC: "No Contest" };

// Which corner has the edge on a number: "red", "blue" or null (tie, or a
// side has no value).
function edge(redValue, blueValue, better = "higher") {
  if (redValue == null || blueValue == null || redValue === blueValue) {
    return null;
  }

  const redAhead = better === "higher" ? redValue > blueValue : redValue < blueValue;
  return redAhead ? "red" : "blue";
}

const plain = (text) => ({ text, reason: null });

// Upcoming fight: profile facts, then career stats, with the edge marked.
function headToHeadRows(red, blue) {
  const profileRows = [
    { label: "Record", value: (f) => f.record || "–" },
    { label: "UFC record", value: (f) => f.ufcRecord || "–" },
    { label: "Age", value: (f) => (f.age != null ? String(f.age) : "–") },
    { label: "Height", value: (f) => f.height || "–", number: (f) => f.heightInches },
    { label: "Reach", value: (f) => f.reach || "–", number: (f) => f.reachInches },
    { label: "Stance", value: (f) => f.stance || "–" },
  ].map((row) => ({
    label: row.label,
    red: plain(red ? row.value(red) : "–"),
    blue: plain(blue ? row.value(blue) : "–"),
    edge: row.number && red && blue ? edge(row.number(red), row.number(blue)) : null,
  }));

  const careerRows = statRows.map((row) => {
    const redStat = red ? careerStatDisplay(red, row) : plain("–");
    const blueStat = blue ? careerStatDisplay(blue, row) : plain("–");
    // N/A on either side means there's nothing to compare.
    const comparable = red && blue && !redStat.reason && !blueStat.reason;

    return {
      label: row.label,
      red: redStat,
      blue: blueStat,
      edge: comparable
        ? edge(red.careerStats[row.key], blue.careerStats[row.key], row.better)
        : null,
    };
  });

  return [...profileRows, ...careerRows];
}

const ofAttempts = ({ landed, attempted }) => `${landed} of ${attempted}`;
const accuracy = ({ landed, attempted }) =>
  attempted ? Math.round((landed / attempted) * 100) : null;

function formatClock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// Fought fight: what each corner did, with whoever did more marked.
function fightStatRows(red, blue) {
  const row = (label, format, number) => ({
    label,
    red: plain(format(red)),
    blue: plain(format(blue)),
    edge: edge(number(red), number(blue)),
  });
  const strikes = (label, key) =>
    row(label, (s) => ofAttempts(s[key]), (s) => s[key].landed);

  return [
    row("Knockdowns", (s) => String(s.knockdowns), (s) => s.knockdowns),
    strikes("Sig. strikes", "sigStr"),
    row(
      "Sig. strike accuracy",
      (s) => (accuracy(s.sigStr) == null ? "–" : `${accuracy(s.sigStr)}%`),
      (s) => accuracy(s.sigStr)
    ),
    strikes("Total strikes", "totalStr"),
    strikes("Takedowns", "td"),
    row("Submission attempts", (s) => String(s.subAttempts), (s) => s.subAttempts),
    row("Reversals", (s) => String(s.reversals), (s) => s.reversals),
    row("Control time", (s) => formatClock(s.controlSeconds), (s) => s.controlSeconds),
    { heading: "Significant strikes by target" },
    strikes("Head", "head"),
    strikes("Body", "body"),
    strikes("Leg", "leg"),
    { heading: "Significant strikes by position" },
    strikes("Distance", "distance"),
    strikes("Clinch", "clinch"),
    strikes("Ground", "ground"),
  ];
}

function recentFights(fighter, fightId) {
  return (fighter?.history ?? [])
    .filter((entry) => entry.completed && entry.fightId !== fightId)
    .slice(0, RECENT_FIGHTS);
}

function CornerHeader({ fighter, corner }) {
  const style = cornerStyles[corner];
  const align = corner === "red" ? "text-right items-end" : "text-left items-start";

  return (
    <div className={`flex min-w-0 flex-col ${align}`}>
      <span className={`mb-2 h-1 w-10 rounded-full ${style.bar}`} />
      {fighter ? (
        <Link
          className="text-xl font-semibold leading-tight hover:underline sm:text-2xl"
          to={`/fighters/${fighter.fighterId}`}
        >
          {fighter.name}
        </Link>
      ) : (
        <span className="text-xl font-semibold sm:text-2xl">TBD</span>
      )}
      {fighter?.nickname ? (
        <span className="pt-0.5 text-sm italic text-neutral-500 dark:text-neutral-400">
          “{fighter.nickname}”
        </span>
      ) : null}
      {fighter?.result === "W" ? (
        <span className={`pt-1 text-xs font-semibold uppercase tracking-wider ${style.text}`}>
          Winner
        </span>
      ) : null}
    </div>
  );
}

function RecentForm({ fighter, fightId, align }) {
  const fights = recentFights(fighter, fightId);

  if (fights.length === 0) {
    return <span className="text-sm text-neutral-400">–</span>;
  }

  return (
    <span className={`flex gap-0.5 sm:gap-1 ${align}`}>
      {fights.map((entry) => (
        <ResultBadge entry={entry} key={entry.fightId} size="sm" />
      ))}
    </span>
  );
}

function StatCell({ stat, highlight, side }) {
  const color = highlight ? `font-semibold ${cornerStyles[side].text}` : "";
  const muted = stat.reason ? "text-neutral-400" : "";
  const padding = side === "red" ? "pr-2 text-right" : "pl-2 text-left";

  return (
    <td className={`py-2.5 text-base ${padding} ${color} ${muted}`} title={stat.reason ?? undefined}>
      {stat.text}
    </td>
  );
}

function ComparisonTable({ rows, children }) {
  return (
    <table className="w-full table-fixed text-sm">
      <tbody>
        {rows.map((row) =>
          row.heading ? (
            <tr key={row.heading}>
              <th className="pb-2 pt-6 text-sm font-medium" colSpan={3} scope="colgroup">
                {row.heading}
              </th>
            </tr>
          ) : (
            <tr className="border-t border-neutral-200 dark:border-neutral-700" key={row.label}>
              <StatCell highlight={row.edge === "red"} side="red" stat={row.red} />
              <th
                className="w-28 px-1 py-2.5 text-center text-xs font-normal text-neutral-500 sm:w-48 dark:text-neutral-400"
                scope="row"
              >
                {row.label}
              </th>
              <StatCell highlight={row.edge === "blue"} side="blue" stat={row.blue} />
            </tr>
          )
        )}
        {children}
      </tbody>
    </table>
  );
}

function HeadToHead({ fight }) {
  return (
    <>
      <ComparisonTable rows={headToHeadRows(fight.red, fight.blue)}>
        <tr className="border-t border-neutral-200 dark:border-neutral-700">
          <td className="py-2.5 pr-2">
            <RecentForm align="justify-end" fightId={fight.fightId} fighter={fight.red} />
          </td>
          <th
            className="px-1 py-2.5 text-center text-xs font-normal text-neutral-500 dark:text-neutral-400"
            scope="row"
          >
            Last {RECENT_FIGHTS} (newest first)
          </th>
          <td className="py-2.5 pl-2">
            <RecentForm align="justify-start" fightId={fight.fightId} fighter={fight.blue} />
          </td>
        </tr>
      </ComparisonTable>
      <p className="pt-4 text-xs text-neutral-500 dark:text-neutral-400">
        Highlighted values are the edge on that stat (lower is better for strikes absorbed).
      </p>
    </>
  );
}

function FightStats({ fight }) {
  const { stats } = fight;

  if (!stats.red || !stats.blue) {
    return (
      <p className="pt-2 text-neutral-600 dark:text-neutral-300">
        Detailed stats aren&apos;t available for this fight.
      </p>
    );
  }

  return (
    <>
      <ComparisonTable rows={fightStatRows(stats.red, stats.blue)} />
      <p className="pt-4 text-xs text-neutral-500 dark:text-neutral-400">
        Highlighted values show who did more. Strikes are landed of attempted.
      </p>
    </>
  );
}

function FightPage() {
  const { fightId } = useParams();
  const [fetched, setFetched] = useState({ id: null, fight: null, error: null });

  useEffect(() => {
    let cancelled = false;
    getFight(fightId)
      .then((fight) => !cancelled && setFetched({ id: fightId, fight, error: null }))
      .catch((err) => !cancelled && setFetched({ id: fightId, fight: null, error: err.message }));

    return () => {
      cancelled = true;
    };
  }, [fightId]);

  const isCurrent = fetched.id === fightId;
  const fight = isCurrent ? fetched.fight : undefined;

  useEffect(() => {
    if (!fight) {
      document.title = "FyteCenter";
      return;
    }
    const names = [fight.red?.name ?? "TBD", fight.blue?.name ?? "TBD"].join(" vs. ");
    document.title = `${names} | FyteCenter`;
  }, [fight]);

  if (!isCurrent) {
    return <Loader inline />;
  }

  if (fetched.error) {
    return <NotFound message="Couldn't load this fight" />;
  }

  if (!fight) {
    return <NotFound message="Fight not found" />;
  }

  const { red, blue } = fight;
  const chips = [
    { icon: CalendarDays, text: fight.eventDate ? formatEventDate(fight.eventDate) : "" },
    { icon: Scale, text: fight.weightClass },
    { icon: Crown, text: fight.isMainEvent ? "Main Event" : "" },
    { icon: Tv, text: fight.isMainEvent ? "" : fight.cardSection },
  ].filter((chip) => chip.text);
  const drawLabel = drawLabels[red?.result] ?? drawLabels[blue?.result];
  const outcome = [drawLabel, fight.resultSummary].filter(Boolean).join(" · ");

  return (
    <div className="pt-24 md:ml-60">
      <div className="px-4 pb-8 text-center">
        <BackButton />
        <div className="mx-auto max-w-3xl px-6 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            {fight.completed ? "Fight Stats" : "Head to Head"}
          </p>
          <h2 className="pt-2 text-lg font-medium text-neutral-600 dark:text-neutral-300">
            {fight.eventId ? (
              <Link className="hover:underline" to={`/events/${fight.eventId}`}>
                {fight.eventName}
              </Link>
            ) : (
              fight.eventName
            )}
          </h2>
          {chips.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {chips.map((chip) => (
                <Chip icon={chip.icon} key={chip.text}>
                  {chip.text}
                </Chip>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 pb-4 sm:gap-6">
            <CornerHeader corner="red" fighter={red} />
            <span className="pt-4 text-lg font-bold">vs</span>
            <CornerHeader corner="blue" fighter={blue} />
          </div>

          {fight.completed && outcome ? (
            <p className="pb-4 text-sm text-neutral-600 dark:text-neutral-300">{outcome}</p>
          ) : null}

          {fight.completed ? <FightStats fight={fight} /> : <HeadToHead fight={fight} />}
        </div>
      </div>
    </div>
  );
}

export default FightPage;
