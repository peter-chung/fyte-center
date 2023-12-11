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
  const convertedDate = date.split(",").at(1).trim().split(" ");
  const formattedMonth = abbreviations[convertedDate[0]];
  const formattedDay = convertedDate[1];

  return formattedMonth + " " + formattedDay;
}

export default formatDate;
