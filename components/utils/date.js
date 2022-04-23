export function checkHowManyDaysAgo(first, second) {
  if ((second - first) / (1000 * 60) < 1) {
    return `${Math.round((second - first) / 1000)}s`;
  } else if ((second - first) / (1000 * 60 * 60) < 1) {
    return `${Math.round((second - first) / (1000 * 60))}m`;
  } else if ((second - first) / (1000 * 60 * 60 * 24) < 1) {
    return `${Math.round((second - first) / (1000 * 60 * 60))}h`;
  } else if ((second - first) / (1000 * 60 * 60 * 24 * 31) < 1) {
    return `${Math.round((second - first) / (1000 * 60 * 60 * 24))}d`;
  } else if ((second - first) / (1000 * 60 * 60 * 24 * 31 * 12) < 1) {
    return formatDate(first);
  } else if ((second - first) / (1000 * 60 * 60 * 24 * 31 * 12) > 1) {
    return formatDate(first);
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
}
