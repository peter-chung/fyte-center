import { supabase } from "../lib/supabase";
import { resultSummary } from "./events";

// A fighter's profile plus every fight they're in (past and booked), each with
// its event and both corners, so the opponent can be picked out. One request:
// PostgREST embeds rows along the foreign keys.
const fighterSelect = `
  *,
  fight_stats (
    result,
    fights (
      fight_id, weight_class, method, method_category, finish_round, finish_time, details,
      events ( event_id, name, event_date, completed ),
      fight_stats ( fighter_id, fighters ( first_name, last_name ) )
    )
  )
`;

const fullName = (row) =>
  [row?.first_name, row?.last_name].filter(Boolean).join(" ").trim();

// date_of_birth is a bare date ("1992-10-14"); compare calendar parts so the
// time zone can't shift it by a day.
function ageOn(dateOfBirth, today = new Date()) {
  if (!dateOfBirth) {
    return null;
  }

  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const hadBirthday =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
  return today.getFullYear() - year - (hadBirthday ? 0 : 1);
}

// 75 → 6' 3"
function formatHeight(inches) {
  if (!inches) {
    return "";
  }

  return `${Math.floor(inches / 12)}' ${inches % 12}"`;
}

function formatRecord(wins, losses, draws, noContests) {
  if (wins == null && losses == null) {
    return "";
  }

  const record = [wins ?? 0, losses ?? 0, draws ?? 0].join("-");
  return noContests ? `${record} (${noContests} NC)` : record;
}

function toHistoryEntry(fighterId, stat) {
  const fight = stat.fights;
  const opponentStat = fight.fight_stats.find((other) => other.fighter_id !== fighterId);
  const event = fight.events;

  return {
    fightId: fight.fight_id,
    eventId: event?.event_id ?? null,
    eventName: event?.name || "Unnamed Event",
    eventDate: event?.event_date ?? null,
    completed: Boolean(event?.completed),
    result: stat.result ?? null,
    opponent: opponentStat
      ? { fighterId: opponentStat.fighter_id, name: fullName(opponentStat.fighters) || "TBD" }
      : { fighterId: null, name: "TBD" },
    weightClass: fight.weight_class || "",
    resultSummary: resultSummary(fight),
  };
}

// Newest first; booked fights (later dates) land on top.
function byDateDesc(a, b) {
  return (b.eventDate ?? "").localeCompare(a.eventDate ?? "");
}

function toFighter(row) {
  const history = row.fight_stats
    .filter((stat) => stat.fights)
    .map((stat) => toHistoryEntry(row.fighter_id, stat))
    .sort(byDateDesc);

  return {
    fighterId: row.fighter_id,
    name: fullName(row) || "Unknown Fighter",
    nickname: row.nickname?.trim() || "",
    link: row.link || "",
    hasProfile: row.has_profile,
    // ufcstats doesn't list a division, so use the latest bout's.
    weightClass: history.find((entry) => entry.weightClass)?.weightClass || "",
    height: formatHeight(row.height_inches),
    reach: row.reach_inches ? `${row.reach_inches}"` : "",
    stance: row.stance || "",
    age: ageOn(row.date_of_birth),
    record: formatRecord(
      row.career_wins,
      row.career_losses,
      row.career_draws,
      row.career_no_contests
    ),
    ufcRecord: formatRecord(row.ufc_wins, row.ufc_losses, row.ufc_draws, row.ufc_no_contests),
    careerStats: {
      sigStrLandedPerMin: row.career_sig_str_landed_per_min,
      sigStrAccPct: row.career_sig_str_acc_pct,
      sigStrAbsorbedPerMin: row.career_sig_str_absorbed_per_min,
      sigStrDefPct: row.career_sig_str_def_pct,
      tdAvgPer15: row.career_td_avg_per_15min,
      tdAccPct: row.career_td_acc_pct,
      tdDefPct: row.career_td_def_pct,
      subAvgPer15: row.career_sub_avg_per_15min,
    },
    history,
  };
}

// One fighter by ufcstats id; null if there's no such fighter.
export async function getFighter(fighterId) {
  const { data, error } = await supabase
    .from("fighters")
    .select(fighterSelect)
    .eq("fighter_id", fighterId)
    .maybeSingle();

  if (error) {
    throw new Error(`Loading fighter failed: ${error.message}`);
  }

  return data ? toFighter(data) : null;
}
