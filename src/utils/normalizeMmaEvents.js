function normalizeFight(fight = {}) {
  return {
    isMainCard: Boolean(fight.isMainCard),
    fighter1: {
      name: fight.fighter1?.name ?? "TBD",
      link: fight.fighter1?.link ?? "",
    },
    fighter2: {
      name: fight.fighter2?.name ?? "TBD",
      link: fight.fighter2?.link ?? "",
    },
  };
}

function formatLocation({ city = "", state = "", country = "" } = {}) {
  return [city, state, country].filter(Boolean).join(", ");
}

function normalizeEvent(event = {}) {
  const city = event.city ?? "";
  const state = event.state ?? "";
  const country = event.country ?? "";

  return {
    title: event.title ?? "Unnamed Event",
    link: event.link ?? "",
    dateTime: event.mainCardStartIso ?? event.dateTime ?? "",
    mainCardStartIso: event.mainCardStartIso ?? "",
    prelimsStartIso: event.prelimsStartIso ?? "",
    venue: event.venue ?? "",
    city,
    state,
    country,
    location: formatLocation({ city, state, country }) || (event.location ?? ""),
    fights: Array.isArray(event.fights) ? event.fights.map(normalizeFight) : [],
  };
}

export function normalizeMmaEvents(payload) {
  const events = Array.isArray(payload?.[0]?.data)
    ? payload[0].data
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

  return events.map(normalizeEvent);
}

export default normalizeMmaEvents;
