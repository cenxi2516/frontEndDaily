const unique = (arr) => {
  const map = new Map();

  arr.forEach((currItem) => map.set(currItem, currItem));

  return [...map.values()];
};
