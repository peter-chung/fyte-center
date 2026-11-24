export function formatDate(date) {
  if (!date) {
    return "TBD";
  }

  // Only ISO timestamps carry a real start time. A long date like
  // "Saturday, December 12, 2026" would also parse, but as local midnight,
  // showing "Dec 12, 12:00 AM", so it goes through the text branch below.
  const parsedDate = /^\d{4}-\d{2}-\d{2}T/.test(date) ? new Date(date) : new Date(NaN);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }

  const abbreviations = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "April",
    May: "May",
    June: "June",
    July: "July",
    August: "Aug",
    September: "Sept",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };
  // removes 2 or more spaces from string
  const removeSpaces = date.replace(/\s{2,}/g, " ").trim();
  const convertedDate = removeSpaces.split(",").at(1)?.trim().split(" ");

  if (!convertedDate || convertedDate.length < 2) {
    return removeSpaces;
  }

  const formattedMonth = abbreviations[convertedDate[0]];
  const formattedDay = convertedDate[1];

  return (formattedMonth ?? convertedDate[0]) + " " + formattedDay;
}

// "2026-11-21" (a bare event date) → "Nov 21, 2026". Read at noon UTC so the
// day never shifts with the viewer's time zone.
export function formatEventDate(eventDate) {
  if (!eventDate) {
    return "TBD";
  }

  return new Date(`${eventDate}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default formatDate;
