import { supabase } from "../lib/supabase";

export const MIN_QUERY_LENGTH = 2;
const FIGHTER_LIMIT = 6;
const EVENT_LIMIT = 4;

// Words from the query, reduced to letters, digits, apostrophes, hyphens and
// periods. Anything else (commas, parentheses, quotes, % and *) would break
// PostgREST's filter syntax or act as a wildcard.
function searchTerms(query) {
  return query
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}'.\- ]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
}

// Every word has to match some name field, so "jon jones" finds Jon Jones
// (first "jon", last "jones") and "bones" finds him by nickname. Each `.or()`
// is ANDed with the others.
function searchFighters(terms) {
  let request = supabase
    .from("fighters")
    .select("fighter_id, first_name, last_name, nickname, career_wins, career_losses, career_draws");

  for (const term of terms) {
    request = request.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,nickname.ilike.%${term}%`
    );
  }

  // Most UFC wins first, so the well-known fighter tops a common last name.
  return request
    .order("ufc_wins", { ascending: false, nullsFirst: false })
    .order("last_name")
    .limit(FIGHTER_LIMIT);
}

function searchEvents(terms) {
  let request = supabase.from("events").select("event_id, name, event_date, completed");

  for (const term of terms) {
    request = request.ilike("name", `%${term}%`);
  }

  return request.order("event_date", { ascending: false }).limit(EVENT_LIMIT);
}

function toFighterResult(row) {
  const name = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  const record =
    row.career_wins == null
      ? ""
      : [row.career_wins, row.career_losses ?? 0, row.career_draws ?? 0].join("-");

  return {
    fighterId: row.fighter_id,
    name: name || "Unknown Fighter",
    nickname: row.nickname?.trim() || "",
    record,
  };
}

function toEventResult(row) {
  return {
    eventId: row.event_id,
    title: row.name || "Unnamed Event",
    eventDate: row.event_date,
    completed: row.completed,
  };
}

// Fighters and events matching every word of the query.
export async function search(query) {
  const terms = searchTerms(query);

  if (terms.join("").length < MIN_QUERY_LENGTH) {
    return { fighters: [], events: [] };
  }

  const [fighters, events] = await Promise.all([searchFighters(terms), searchEvents(terms)]);

  for (const { error } of [fighters, events]) {
    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  return {
    fighters: fighters.data.map(toFighterResult),
    events: events.data.map(toEventResult),
  };
}
