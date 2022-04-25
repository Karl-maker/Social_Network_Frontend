export function MetersAndKilometers(value) {
  if (value / 1000 < 1) {
    return `${value} meters`;
  } else {
    return `${Math.round(value / 1000)} kilometers`;
  }
}
