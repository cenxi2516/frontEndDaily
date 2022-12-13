// 判断是否是类数组
const isLikeArray = (() => {
  const DefaultLikeArrayObjectStr = [
    'String',
    'Arguments',
    'NodeList',
    'HTMLCollection',
  ];
  const getDataType = (data) =>
    Object.prototype.toString.call(data).slice(8, -1);
  const hasOwnProperty = (obj, key) =>
    Object.prototype.hasOwnProperty.call(obj, key);

  return (data) => {
    if (data && typeof data === 'object') {
      if (DefaultLikeArrayObjectStr.includes(getDataType(data))) return true;
      if (Array.isArray(data)) return false;

      if (!hasOwnProperty(data, 'length')) return false;
      const lengthValue = Number.parseInt(Number(data.length));
      if (Number.isNaN(lengthValue)) return false;
      if (lengthValue >= 2 ** 32) return false;

      return true;
    }

    // 函数、原始值
    return false;
  };
})();
