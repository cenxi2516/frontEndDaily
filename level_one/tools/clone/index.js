/**
 * 基础克隆
 * @param {any} data 克隆数据
 * @param {boolean} deep true表示深度克隆，false表示浅度克隆(默认)
 * @returns 克隆猴数据
 */
function baseClone(data, deep = false) {
  if (data && typeof data === 'object') {
    if ([Date, RegExp].includes(data.constructor))
      return new data.constructor(data);

    // 对象：普通对象、数组
    var newObj = Array.isArray(data) ? [] : {};

    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        var value = data[key];

        newObj[key] =
          deep && value && typeof value === 'object'
            ? clone(value, deep)
            : value;
      }
    }

    return newObj;
  }

  // null、undefined、string、number、boolean、function
  return data;
}

/**
 * 复杂递归：解决JSON.stringify深拷贝如下问题：
 * 1. 当拷贝对象属性的值为函数、null、undefined时，在序列化字符串中不存在此键值对。
 * 2. 当拷贝对象属性的值为NaN、Infinity、-Infinity时，在序列化字符串中键对应的值为null。
 * 3. 当拷贝对象为Date对象时，转化为日期时间格式的字符串。
 * 4. 当拷贝对象为RegExp对象时，转化为空对象格式的字符串。
 * 5. 当拷贝对象中存在循环引用时，会导致内存泄露以及栈溢出。
 * 6. 不能拷贝对象中不可枚举属性、符号属性。
 * 7. 不能拷贝对象属性的描述符。
 * 8. 不能拷贝对象原型链。
 */
const deepClone = (() => {
  const copyObject = (data, hash) => {
    const newObj = Array.isArray(data) ? [] : {};
    const originPrototype = Object.getPrototypeOf(data);
    const allDescriptors = Object.getOwnPropertyDescriptors(data);

    Object.defineProperties(newObj, allDescriptors);
    Object.setPrototypeOf(newObj, originPrototype);

    hash.set(data, newObj);

    return newObj;
  };

  return (data, hash = new WeakMap()) => {
    if (data && typeof data === 'object') {
      if ([Date, RegExp].includes(data.constructor))
        return new data.constructor(data);
      if (hash.has(data)) return hash.get(data);

      const newObj = copyObject(data, hash);
      const allKeys = Reflect.ownKeys(data);

      for (const key of allKeys) {
        const value = data[key];
        newObj[key] =
          value && typeof value === 'object' ? deepClone(value, hash) : value;
      }

      return newObj;
    }

    return data;
  };
})();