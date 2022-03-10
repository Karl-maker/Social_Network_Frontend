export function checkHowManyDaysAgo(first, second) {
  if ((second - first) / (1000 * 60) < 1) {
    if (Math.round((second - first) / 1000) === 1) return `1 second ago`;

    return `${Math.round((second - first) / 1000)} seconds ago`;
  } else if ((second - first) / (1000 * 60 * 60) < 1) {
    if (Math.round((second - first) / (1000 * 60)) === 1) return `1 minute ago`;

    return `${Math.round((second - first) / (1000 * 60))} minutes ago`;
  } else if ((second - first) / (1000 * 60 * 60 * 24) < 1) {
    if (Math.round((second - first) / (1000 * 60 * 60)) === 1)
      return `1 hour ago`;

    return `${Math.round((second - first) / (1000 * 60 * 60))} hours ago`;
  } else if ((second - first) / (1000 * 60 * 60 * 24 * 31) < 1) {
    if (Math.round((second - first) / (1000 * 60 * 60 * 24)) === 1)
      return `1 day ago`;

    return `${Math.round((second - first) / (1000 * 60 * 60 * 24))} days ago`;
  } else if ((second - first) / (1000 * 60 * 60 * 24 * 31 * 12) < 1) {
    if (Math.round((second - first) / (1000 * 60 * 60 * 24 * 31)) === 1)
      return `1 month ago`;

    return `${Math.round(
      (second - first) / (1000 * 60 * 60 * 24 * 31)
    )} months ago`;
  } else if ((second - first) / (1000 * 60 * 60 * 24 * 31 * 12) > 1) {
    if (Math.round((second - first) / (1000 * 60 * 60 * 24 * 31 * 12)) === 1)
      return `1 year ago`;

    return `${Math.round(
      (second - first) / (1000 * 60 * 60 * 24 * 31 * 12)
    )} years ago`;
  }
}
