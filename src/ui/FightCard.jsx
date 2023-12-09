function FightCard(fightCard) {
  const { dateTime, fights, title } = fightCard.fightCard;
  // console.log(fights[0].fighter1.name);
  return (
    <>
      <h1>{title}</h1>
      <p>{dateTime}</p>

      <ul>
        {fights.map((fight, i) => (
          <li key={i}>
            <span>{fight.fighter1.name}</span> vs{" "}
            <span>{fight.fighter2.name}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default FightCard;
