import { Link } from "react-router-dom";

// The "vs" between two fighters on a card. Links to the fight page: the
// head-to-head before the fight, its stats after.
function VsLink({ fight, completed = false }) {
  if (!fight.fightId) {
    return <span className="w-10 shrink-0 text-center font-bold">vs</span>;
  }

  const label = completed ? "Fight stats" : "Head to head";

  return (
    <Link
      aria-label={`${label}: ${fight.fighter1.name} vs ${fight.fighter2.name}`}
      className="w-10 shrink-0 rounded-md py-2 text-center font-bold hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-700 dark:hover:text-red-400"
      title={label}
      to={`/fights/${fight.fightId}`}
    >
      vs
    </Link>
  );
}

export default VsLink;
