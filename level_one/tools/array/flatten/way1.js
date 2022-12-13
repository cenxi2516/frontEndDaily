const flatten = (arr) => {
  const newArr = [];

  for (const currItem of arr) {
    if (Array.isArray(currItem)) {
      newArr.push(...flatten(currItem));
    } else {
      newArr.push(currItem);
    }
  }

  return newArr;
};
