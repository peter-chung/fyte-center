// Career stats shown on fighter pages and head-to-heads. `better` says which
// way is the advantage when comparing two fighters.
export const statRows = [
  { key: "sigStrLandedPerMin", label: "Sig. strikes landed / min", better: "higher" },
  { key: "sigStrAccPct", label: "Striking accuracy", pct: true, better: "higher" },
  { key: "sigStrAbsorbedPerMin", label: "Sig. strikes absorbed / min", better: "lower" },
  { key: "sigStrDefPct", label: "Striking defense", pct: true, better: "higher" },
  { key: "tdAvgPer15", label: "Takedowns / 15 min", better: "higher" },
  { key: "tdAccPct", label: "Takedown accuracy", pct: true, better: "higher" },
  { key: "tdDefPct", label: "Takedown defense", pct: true, better: "higher" },
  { key: "subAvgPer15", label: "Submission attempts / 15 min", better: "higher" },
];

export function formatStat(value, pct) {
  if (value == null) {
    return "–";
  }

  return pct ? `${Math.round(value)}%` : value.toFixed(2);
}

// Display text for one career stat of a fighter, and why it's N/A if it is.
export function careerStatDisplay(fighter, row) {
  const reason = fighter.notApplicable?.[row.key];

  if (reason) {
    return { text: "N/A", reason };
  }

  return { text: formatStat(fighter.careerStats[row.key], row.pct), reason: null };
}
