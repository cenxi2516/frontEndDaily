// 检测对象中是否存在循环引用
const isExistCircleRef = (() => {
  // 记录每次比较数据
  const compareData = { value: null };
  const isObject = (v) => v && typeof v === 'object';
  const isOwnProperty = (obj, k) =>
    Object.prototype.hasOwnProperty.call(obj, k);
  // 递归遍历对象，返回值布尔值
  const forEachObject = (data, hash, fn) => {
    for (const key in data) {
      if (isOwnProperty(data, key)) {
        const value = data[key];
        if (!isObject(value) || hash.has(value)) {
          continue;
        }
        hash.set(value, value);
        if (fn?.(value, hash)) {
          return true;
        }
      }
    }

    return false;
  };
  // 对象 与 对象中所有数据检索是否存在相同数据
  const searchObject = (data, hash = new WeakMap()) => {
    const fn = (value, hash) =>
      value === compareData.value || forEachObject(value, hash, fn);
    return forEachObject(data, hash, fn);
  };

  return (data, hash = new WeakMap()) => {
    // 若是原始值或function，则不存在循环引用
    if (!isObject(data)) return false;

    compareData.value = data;

    return searchObject(data) || forEachObject(data, hash, isExistCircleRef);
  };
})();
