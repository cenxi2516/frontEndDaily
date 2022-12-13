const flatten = (arr, depth = 1) => {
  arr = [...arr];
  let index = 0;

  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);

    if (++index === depth) {
      break;
    }
  }

  return arr;
};
