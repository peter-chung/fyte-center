import { supabase } from "../lib/supabase";
import { resultSummary } from "./events";
import { getFighter } from "./fighters";

// What each fighter did in the fight (one row per fighter in fight_stats).
const fightStatColumns = `
  knockdowns, sig_str_landed, sig_str_attempted, total_str_landed, total_str_attempted,
  td_landed, td_attempted, sub_attempts, reversals, control_time_seconds,
  head_str_landed, head_str_attempted, body_str_landed, body_str_attempted,
  leg_str_landed, leg_str_attempted, distance_str_landed, distance_str_attempted,
  clinch_str_landed, clinch_str_attempted, ground_str_landed, ground_str_attempted
`;

function toFightStats(stat) {
  if (!stat || stat.sig_str_attempted == null) {
    return null; // not fought yet, or ufcstats has no stats for it (older fights)
  }

  const pair = (landed, attempted) => ({
    landed: stat[landed] ?? 0,
    attempted: stat[attempted] ?? 0,
  });

  return {
    knockdowns: stat.knockdowns ?? 0,
    sigStr: pair("sig_str_landed", "sig_str_attempted"),
    totalStr: pair("total_str_landed", "total_str_attempted"),
    td: pair("td_landed", "td_attempted"),
    subAttempts: stat.sub_attempts ?? 0,
    reversals: stat.reversals ?? 0,
    controlSeconds: stat.control_time_seconds ?? 0,
    head: pair("head_str_landed", "head_str_attempted"),
    body: pair("body_str_landed", "body_str_attempted"),
    leg: pair("leg_str_landed", "leg_str_attempted"),
    distance: pair("distance_str_landed", "distance_str_attempted"),
    clinch: pair("clinch_str_landed", "clinch_str_attempted"),
    ground: pair("ground_str_landed", "ground_str_attempted"),
  };
}

const cardSectionTitles = {
  main: "Main Card",
  prelims: "Prelims",
  early_prelims: "Early Prelims",
};

// One fight with both corners' full fighter profiles (career stats and fight
// history) and, once it's been fought, what each did in it; null if there's
// no such fight. The fighters load in parallel once the fight says who they are.
export async function getFight(fightId) {
  const { data, error } = await supabase
    .from("fights")
    .select(
      `fight_id, fight_order, weight_class, card_segment,
       method, method_category, finish_round, finish_time, details,
       events ( event_id, name, event_date, completed ),
       fight_stats ( corner, fighter_id, result, ${fightStatColumns} )`
    )
    .eq("fight_id", fightId)
    .maybeSingle();

  if (error) {
    throw new Error(`Loading fight failed: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const cornerOf = (corner) => data.fight_stats.find((stat) => stat.corner === corner);
  const [red, blue] = await Promise.all(
    [cornerOf(1), cornerOf(2)].map((stat) =>
      stat?.fighter_id ? getFighter(stat.fighter_id) : null
    )
  );

  return {
    fightId: data.fight_id,
    isMainEvent: data.fight_order === 0,
    weightClass: data.weight_class || "",
    cardSection: cardSectionTitles[data.card_segment] || "",
    eventId: data.events?.event_id ?? null,
    eventName: data.events?.name || "Unnamed Event",
    eventDate: data.events?.event_date ?? null,
    completed: Boolean(data.events?.completed),
    resultSummary: resultSummary(data),
    red: red && { ...red, result: cornerOf(1)?.result ?? null },
    blue: blue && { ...blue, result: cornerOf(2)?.result ?? null },
    // Both or neither: a fight's stats come from one ufcstats page.
    stats: {
      red: toFightStats(cornerOf(1)),
      blue: toFightStats(cornerOf(2)),
    },
  };
}
