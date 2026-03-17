export function formatDate(date) {
  if (!date) {
    return "TBD";
  }

  const parsedDate = new Date(date);

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

export default formatDate;
