export function formatTitle(title) {
  const splitTitle = title.split(":");
  const formattedTitle = splitTitle[0];

  return formattedTitle;
}

export default formatTitle;
