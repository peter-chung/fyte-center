export function formatDate(date) {
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
    November: "Nov",
    December: "Dec",
  };
  // removes 2 or more spaces from string
  const removeSpaces = date.replace(/\s{2,}/g, " ").trim();
  const convertedDate = removeSpaces.split(",").at(1).trim().split(" ");
  const formattedMonth = abbreviations[convertedDate[0]];
  const formattedDay = convertedDate[1];

  return formattedMonth + " " + formattedDay;
}

export default formatDate;
