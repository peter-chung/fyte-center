import { Link } from "react-router-dom";

// A fighter's name button on a card: links to their FyteCenter page, or is
// plain text for an unannounced (TBD) opponent.
function FighterLink({ fighter, className, children }) {
  if (!fighter.fighterId) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link className={className} to={`/fighters/${fighter.fighterId}`}>
      {children}
    </Link>
  );
}

export default FighterLink;
