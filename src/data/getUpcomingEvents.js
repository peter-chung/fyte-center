import { supabase } from "../lib/supabase";

const validCardSections = new Set(["main", "prelims", "early_prelims"]);

// One request: events with their fights, each fight's two corners and fighter
// names (PostgREST embeds rows along the foreign keys). `fights!inner` leaves
// out events with no announced fights.
const UPCOMING_EVENTS_SELECT = `
  event_id, name, event_date, link, city, state, country,
  main_card_start, prelims_start, early_prelims_start,
  fights!inner (
    fight_id, fight_order, weight_class, card_segment,
    fight_stats ( corner, fighter_id, fighters ( first_name, last_name, link ) )
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
    return { name: "TBD", link: "" };
  }

  return {
    name: name || "TBD",
    link: fighter?.link || `http://ufcstats.com/fighter-details/${stat.fighter_id}`,
  };
}

function toFight(fight) {
  const cornerOf = (corner) => fight.fight_stats.find((stat) => stat.corner === corner);

  return {
    fightId: fight.fight_id,
    weightClass: fight.weight_class,
    cardSection: validCardSections.has(fight.card_segment) ? fight.card_segment : null,
    fighter1: toFighter(cornerOf(1)),
    fighter2: toFighter(cornerOf(2)),
  };
}

function toEvent(row) {
  const mainCardStartIso = toIso(row.main_card_start);

  return {
    eventId: row.event_id,
    title: row.name || "Unnamed Event",
    link: row.link || "",
    dateTime: mainCardStartIso || longDate(row.event_date),
    mainCardStartIso,
    prelimsStartIso: toIso(row.prelims_start),
    earlyPrelimsStartIso: toIso(row.early_prelims_start),
    venue: "",
    location: [row.city, row.state, row.country].filter(Boolean).join(", "),
    fights: row.fights.map(toFight),
  };
}

export async function getUpcomingEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(UPCOMING_EVENTS_SELECT)
    .eq("completed", false)
    .gte("event_date", yesterdayUtc())
    .order("event_date")
    .order("fight_order", { referencedTable: "fights" });

  if (error) {
    throw new Error(`Loading events failed: ${error.message}`);
  }

  return data.map(toEvent);
}

export default getUpcomingEvents;
