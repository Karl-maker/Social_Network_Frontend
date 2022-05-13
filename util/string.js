export function containsSpecialChars(str) {
  const specialChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/;
  return specialChars.test(str);
}
