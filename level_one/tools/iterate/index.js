// 检测是否是迭代器创建函数
const isIteratorCreateFunction = (() => {
  const getDataType = (data) =>
    Object.prototype.toString.call(data).slice(8, -1);
  const hasOwnProperty = (obj, key) =>
    Object.prototype.hasOwnProperty.call(obj, key);

  return (func) => {
    if (typeof func !== 'function') return false;

    const iteratorCreateFunc = func;
    if (getDataType(iteratorCreateFunc) !== 'Function') return false;
    const iterator = iteratorCreateFunc();
    if (typeof iterator !== 'object') return false;
    const iteratorNextFunc = iterator.next;
    if (getDataType(iteratorNextFunc) !== 'Function') return false;
    const firstIterateResult = iteratorNextFunc();
    if (
      typeof firstIterateResult !== 'object' ||
      !hasOwnProperty(firstIterateResult, 'done') ||
      !hasOwnProperty(firstIterateResult, 'value')
    )
      return false;

    return true;
  };
})();

// 检测是否是可迭代对象
const isIterable = (() => {
  const DefaultIterableObjectStr = [
    'Array',
    'String',
    'Set',
    'Map',
    'Arguments',
    'NodeList',
    'HTMLCollection',
  ];
  const getDataType = (data) =>
    Object.prototype.toString.call(data).slice(8, -1);

  return (data) => {
    if (data && typeof data === 'object') {
      if (DefaultIterableObjectStr.includes(getDataType(data))) return true;

      const newData = { ...data };
      return isIteratorCreateFunction(newData[Symbol.iterator]);
    }

    // 函数、原始值
    return false;
  };
})();
