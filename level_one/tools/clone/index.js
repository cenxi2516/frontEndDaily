/**
 * 克隆
 * @param {any} data 克隆数据
 * @param {boolean} deep true表示深度克隆，false表示浅度克隆(默认)
 * @returns 克隆猴数据
 */
function clone(data, deep = false) {
  if (data && typeof data === 'object') {
    // 对象：普通对象、数组
    var newObj = Array.isArray(data) ? [] : {};
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        var value = data[key];
        newObj[key] = deep ? clone(value, deep) : value;
      }
    }
    return newObj;
  } else {
    // null、undefined、string、number、boolean、function
    return data;
  }
}
