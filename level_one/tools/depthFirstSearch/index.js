/**
 * 深度优先算法
 */
const depthFirstSearch = (() => {
  const isObject = (v) => v && typeof v === 'object';
  const isFunction = (v) => typeof v === 'function';

  return (data, fn) => {
    if (isObject(data)) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (isObject(value)) {
            depthFirstSearch(value, fn);
            data[key] = isFunction(fn) ? fn.call(data, key, value) : value;
          } else {
            data[key] = isFunction(fn) ? fn.call(data, key, value) : value;
          }
        }
      }

      return data;
    }

    return data;
  };
})();
