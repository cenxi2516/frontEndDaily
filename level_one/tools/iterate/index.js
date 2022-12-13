// 检测是否是迭代器创建函数
const isIteratorCreateFunction = (() => {
  const getDataType = (data) =>
    Object.prototype.toString.call(data).slice(8, -1);
  const hasOwnProperty = (obj, key) =>
    Object.prototype.hasOwnProperty.call(obj, key);

  /**
   * 检测是否是某个对象的迭代器创建函数
   * @param  {Object} thisArg 某个对象
   * @param  {Function} func  某个函数
   * @return {boolean}        true表示是，false表示否
   */
  return (thisArg, func) => {
    if (typeof func !== 'function') return false;

    const iteratorCreateFunc = func.bind(thisArg);
    if (getDataType(iteratorCreateFunc) !== 'Function') return false;
    const iterator = iteratorCreateFunc();
    if (typeof iterator !== 'object') return false;
    const iteratorNextFunc = iterator.next;
    if (getDataType(iteratorNextFunc) !== 'Function') return false;
    const firstIterateResult = iteratorNextFunc.call(iterator);
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

  /**
   * [description]
   * @param  {any} data 要检测数据
   * @return {boolean}  true表示是，false表示否
   */
  return (data) => {
    if (data && typeof data === 'object') {
      if (DefaultIterableObjectStr.includes(getDataType(data))) return true;

      return isIteratorCreateFunction(data, data[Symbol.iterator]);
    }

    // 函数、原始值
    return false;
  };
})();
