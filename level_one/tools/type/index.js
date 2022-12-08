/**
 * 检测数据的类型
 * @param {any} data 要检测类型的数据
 * @returns {string} 数据类型
 */
function getDataType(data) {
  var dataType = typeof data;

  if (dataType === 'object') {
    // null、对象
    return Object.prototype.toString.call(data).slice(8, -1);
  }

  // undefined、function、string、number、boolean、symbol、bigint
  return dataType;
}
