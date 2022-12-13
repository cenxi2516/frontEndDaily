const flatten = (arr) =>
  arr.reduce(
    (result, currItem) =>
      result.concat(Array.isArray(currItem) ? flatten(currItem) : currItem),
    []
  );
