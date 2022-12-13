const unique = (arr) =>
  arr.reduce((result, currItem) => {
    if (!result.includes(currItem)) {
      result.push(currItem);
    }

    return result;
  }, []);
