export function noDuplicateObjects(arr, key) {
  const uniqueIds = new Set();

  const unique = arr.filter((element) => {
    const isDuplicate = uniqueIds.has(element.data[key]);

    uniqueIds.add(element.data[key]);

    if (!isDuplicate) {
      return true;
    }
  });

  return unique;
}
