export function formatTitle(title) {
  if (!title) {
    return "Unnamed Event";
  }

  const splitTitle = title.split(":");
  const formattedTitle = splitTitle[0];

  return formattedTitle;
}

export default formatTitle;
