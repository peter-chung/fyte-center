function FightCard({ event }) {
  const { dateTime, fights, link, title } = event;

  const mainCardFights = fights.filter((fight) => fight.isMainCard);
  const prelimCardFights = fights.filter((fight) => !fight.isMainCard);

  return (
    <div className="bg-base-100 py-4 mx-auto">
      <div className="text-center">
        <h2 className="justify-center text-4xl font-semibold">
          <a href={link}>{title}</a>
        </h2>
        <p className="text-xl font-medium pt-2">{dateTime}</p>

        <ul className="pt-4">
          <li className="text-lg font-medium pb-2">Main Card</li>

          {mainCardFights.length === 0 ? (
            <li>No fights found... 😢</li>
          ) : (
            mainCardFights.map((fight, i) => (
              <li className="pb-2" key={i}>
                <a
                  className="btn no-animation w-48 md:w-60 text-slate-100 bg-red-600 hover:bg-red-400"
                  href={fight.fighter1.link}
                >
                  {fight.fighter1.name}
                </a>
                <span className="font-bold"> vs </span>
                <a
                  className="btn no-animation w-48 md:w-60 text-slate-100 bg-blue-600 hover:bg-blue-400"
                  href={fight.fighter2.link}
                >
                  {fight.fighter2.name}
                </a>
              </li>
            ))
          )}
        </ul>

        <ul className="pt-4">
          <li className="text-lg font-medium pb-2">Preliminary Card</li>
          {prelimCardFights.length === 0 ? (
            <li>No fights found... 😢</li>
          ) : (
            prelimCardFights.map((fight, i) => (
              <li className="pb-2" key={i}>
                <a
                  className="btn no-animation w-48 md:w-60 text-slate-100 bg-red-600 hover:bg-red-400"
                  href={fight.fighter1.link}
                >
                  {fight.fighter1.name}
                </a>
                <span className="font-bold"> vs </span>
                <a
                  className="btn no-animation w-48 md:w-60 text-slate-100 bg-blue-600 hover:bg-blue-400"
                  href={fight.fighter2.link}
                >
                  {fight.fighter2.name}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default FightCard;
