import { supabase } from "../lib/supabase";

const validCardSections = new Set(["main", "prelims", "early_prelims"]);
export const PAST_EVENTS_PAGE_SIZE = 25;

// Event with its fights, each fight's two corners (result + fighter name).
// PostgREST embeds rows along the foreign keys, so this is one request.
const eventSelect = (fightsJoin) => `
  event_id, name, event_date, completed, link, city, state, country,
  main_card_start, prelims_start, early_prelims_start,
  ${fightsJoin} (
    fight_id, fight_order, weight_class, card_segment,
    method, method_category, finish_round, finish_time, details,
    fight_stats ( corner, fighter_id, result, fighters ( first_name, last_name, link ) )
  )
`;

function toIso(value) {
  return value ? new Date(value).toISOString() : "";
}

// Yesterday (UTC) so a card stays listed through fight night everywhere until
// the nightly sync marks it completed.
function yesterdayUtc() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// event_date is a bare date. Parsing "2026-12-12" as a Date gives UTC
// midnight, which shows as the previous evening in US time zones, so when
// there's no main card start time, show the long date instead (formatDate
// turns it into "Dec 12").
function longDate(eventDate) {
  if (!eventDate) {
    return "";
  }

  return new Date(`${eventDate}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function toFighter(stat) {
  const fighter = stat?.fighters;
  const name = [fighter?.first_name, fighter?.last_name].filter(Boolean).join(" ").trim();

  if (!stat?.fighter_id) {
    return { fighterId: null, name: "TBD", link: "", result: null };
  }

  return {
    fighterId: stat.fighter_id,
    name: name || "TBD",
    link: fighter?.link || `http://ufcstats.com/fighter-details/${stat.fighter_id}`,
    result: stat.result ?? null,
  };
}

// ufcstats writes each judge's score as "<loser> - <winner>" (checked across
// 1,000 decisions; independent of which corner won), so flip it to read
// winner-first: "27 - 30" → "30-27". Draws read the same either way.
function judgeScores(details) {
  return [...details.matchAll(/(\d+)\s*-\s*(\d+)/g)].map(
    ([, first, second]) => `${second}-${first}`
  );
}

// "KO/TKO (Punch to Head At Distance) · R2 4:58",
// "Unanimous Decision (30-27, 30-27, 29-28)"
export function resultSummary(fight) {
  const method = (fight.method || "").trim();

  if (!method) {
    return "";
  }

  if (fight.method_category === "DEC") {
    const kind = method.replace(/^Decision\s*-\s*/i, "");
    const label = kind && kind !== method ? `${kind} Decision` : "Decision";
    const scores = judgeScores(fight.details || "");
    return scores.length ? `${label} (${scores.join(", ")})` : label;
  }

  const detail = (fight.details || "")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  const timing =
    fight.finish_round && fight.finish_time ? `R${fight.finish_round} ${fight.finish_time}` : "";

  return [detail ? `${method} (${detail})` : method, timing].filter(Boolean).join(" · ");
}

function fightOutcome(results) {
  if (results.includes("W")) return "win";
  if (results.includes("D")) return "draw";
  if (results.includes("NC")) return "nc";
  return null; // not fought yet, or no result recorded
}

function toFight(fight) {
  const cornerOf = (corner) => fight.fight_stats.find((stat) => stat.corner === corner);
  const fighter1 = toFighter(cornerOf(1));
  const fighter2 = toFighter(cornerOf(2));

  return {
    fightId: fight.fight_id,
    weightClass: fight.weight_class || "",
    cardSection: validCardSections.has(fight.card_segment) ? fight.card_segment : null,
    fighter1,
    fighter2,
    outcome: fightOutcome([fighter1.result, fighter2.result]),
    resultSummary: resultSummary(fight),
  };
}

function toEvent(row) {
  const mainCardStartIso = toIso(row.main_card_start);

  return {
    eventId: row.event_id,
    title: row.name || "Unnamed Event",
    eventDate: row.event_date,
    completed: row.completed,
    link: row.link || "",
    dateTime: mainCardStartIso || longDate(row.event_date),
    mainCardStartIso,
    prelimsStartIso: toIso(row.prelims_start),
    earlyPrelimsStartIso: toIso(row.early_prelims_start),
    venue: "",
    location: [row.city, row.state, row.country].filter(Boolean).join(", "),
    fights: (row.fights || []).map(toFight),
  };
}

function throwOnError(error, what) {
  if (error) {
    throw new Error(`Loading ${what} failed: ${error.message}`);
  }
}

// Upcoming cards with full fight data (a handful of events). `fights!inner`
// leaves out events with no announced fights.
export async function getUpcomingEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(eventSelect("fights!inner"))
    .eq("completed", false)
    .gte("event_date", yesterdayUtc())
    .order("event_date")
    .order("fight_order", { referencedTable: "fights" });

  throwOnError(error, "upcoming events");
  return data.map(toEvent);
}

// Sidebar list of completed events, newest first. Summaries only; a card's
// fights load with getEvent when it's opened.
export async function getPastEvents(offset = 0, limit = PAST_EVENTS_PAGE_SIZE) {
  const { data, error } = await supabase
    .from("events")
    .select("event_id, name, event_date")
    .eq("completed", true)
    .order("event_date", { ascending: false })
    .order("event_id")
    .range(offset, offset + limit - 1);

  throwOnError(error, "past events");
  return data.map((row) => ({
    eventId: row.event_id,
    title: row.name || "Unnamed Event",
    eventDate: row.event_date,
  }));
}

// One event (upcoming or completed) by id; null if there's no such event.
export async function getEvent(eventId) {
  const { data, error } = await supabase
    .from("events")
    .select(eventSelect("fights"))
    .eq("event_id", eventId)
    .order("fight_order", { referencedTable: "fights" })
    .maybeSingle();

  throwOnError(error, "event");
  return data ? toEvent(data) : null;
}
